require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const baseUrl = process.env.CONFLUENCE_BASE_URL;
const user = process.env.CONFLUENCE_USER;
const token = process.env.CONFLUENCE_API_TOKEN;
const spaceKey = process.env.CONFLUENCE_SPACE_KEY;
const parentPageId = process.env.CONFLUENCE_PAGE_ID;
const docsDir = process.env.DOCS_DIR || 'docs';

if (!baseUrl || !user || !token || !spaceKey || !parentPageId) {
  throw new Error('Faltan variables: CONFLUENCE_BASE_URL, CONFLUENCE_USER, CONFLUENCE_API_TOKEN, CONFLUENCE_SPACE_KEY, CONFLUENCE_PAGE_ID');
}

const auth = Buffer.from(`${user}:${token}`).toString('base64');

function toConfluenceStorage(markdown) {
  const lines = markdown.split(/\r?\n/);
  let html = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('# ')) {
      html += `<h1>${line.replace(/^#\s*/, '')}</h1>\n`;
      continue;
    }

    if (line.startsWith('## ')) {
      html += `<h2>${line.replace(/^##\s*/, '')}</h2>\n`;
      continue;
    }

    if (line.startsWith('- ')) {
      html += `<ul><li>${line.replace(/^- /, '')}</li></ul>\n`;
      continue;
    }

    if (line.startsWith('|')) {
      html += `<p>${line}</p>\n`;
      continue;
    }

    html += `<p>${line}</p>\n`;
  }

  return html;
}

function firstHeading(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function normalizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectMarkdownFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results.sort();
}

async function getPageByTitle(title, parentId = null) {
  const res = await axios.get(`${baseUrl.replace(/\/$/, '')}/rest/api/content?spaceKey=${encodeURIComponent(spaceKey)}&type=page&limit=200&expand=ancestors,version`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json'
    }
  });

  const results = res.data.results || [];
  const normalizedTitle = normalizeTitle(title);

  const matched = results.filter((page) => normalizeTitle(page.title) === normalizedTitle);
  if (!matched.length) return null;
  if (!parentId) return matched[0];

  return matched.find((page) => (page.ancestors || []).some((a) => String(a.id) === String(parentId))) || matched[0];
}

async function createOrUpdatePage(title, markdown, parentId) {
  const page = await getPageByTitle(title, parentId);
  const body = {
    type: 'page',
    title,
    space: { key: spaceKey },
    body: {
      storage: {
        value: toConfluenceStorage(markdown),
        representation: 'storage'
      }
    }
  };

  if (parentId) {
    body.ancestors = [{ id: parentId }];
  }

  try {
    if (!page) {
      const res = await axios.post(`${baseUrl.replace(/\/$/, '')}/rest/api/content`, body, {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log(`Created: ${title}`);
      return res.data;
    }

    const res = await axios.put(`${baseUrl.replace(/\/$/, '')}/rest/api/content/${page.id}`, {
      ...body,
      version: { number: Number(page.version.number) + 1 }
    }, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log(`Updated: ${title}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 400 && /already exists|same TITLE/i.test(error.response?.data?.message || '')) {
      console.warn(`Skipping duplicate title: ${title}`);
      return null;
    }
    throw error;
  }
}

(async () => {
  const root = path.resolve(docsDir);
  const files = collectMarkdownFiles(root);

  console.log(`Procesando ${files.length} archivos desde ${root}`);

  for (const file of files) {
    const markdown = fs.readFileSync(file, 'utf8');
    const relative = path.relative(root, file);
    const parts = relative.split(path.sep).filter(Boolean);

    let currentParentId = parentPageId;

    for (let i = 0; i < parts.length; i++) {
      const raw = parts[i];
      const isLast = i === parts.length - 1;
      let title = raw.replace(/\.md$/i, '').replace(/[-_]+/g, ' ').trim();

      if (isLast) {
        title = firstHeading(markdown, title);
      } else {
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }

      await createOrUpdatePage(title, markdown, currentParentId);

      const createdPage = await getPageByTitle(title, currentParentId);
      if (createdPage) {
        currentParentId = createdPage.id;
      }
    }
  }

  console.log('Sincronización completada.');
})().catch((error) => {
  console.error('Error:', error.response?.data || error.message);
  process.exit(1);
});
