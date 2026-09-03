#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const MODE = (process.env.SYNC_MODE || 'upload').toLowerCase();
const baseUrl = process.env.CONFLUENCE_BASE_URL;
const user = process.env.CONFLUENCE_USER;
const token = process.env.CONFLUENCE_API_TOKEN;
const spaceKey = process.env.CONFLUENCE_SPACE_KEY;
const parentPageId = process.env.CONFLUENCE_PAGE_ID || process.env.PARENT_PAGE_ID;
const docsDir = process.env.DOCS_DIR || 'docs';

if (!baseUrl || !user || !token || !spaceKey) {
  console.error('Faltan variables de entorno: CONFLUENCE_BASE_URL, CONFLUENCE_USER, CONFLUENCE_API_TOKEN y CONFLUENCE_SPACE_KEY.');
  process.exit(1);
}

const auth = Buffer.from(`${user}:${token}`).toString('base64');

function toTitleCase(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function firstHeadingTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function toConfluenceStorage(markdown) {
  const lines = markdown.split(/\r?\n/);
  let html = '';
  let inList = false;
  let inTable = false;

  const flushList = () => {
    if (inList) {
      html += '</ul>\n';
      inList = false;
    }
  };

  const flushTable = () => {
    if (inTable) {
      html += '</tbody></table>\n';
      inTable = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushList();
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      flushList();
      flushTable();
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, '');
      html += `<h${level}>${text}</h${level}>\n`;
      continue;
    }

    if (/^-\s+/.test(line)) {
      if (!inList) {
        flushTable();
        html += '<ul>\n';
        inList = true;
      }
      html += `<li>${line.replace(/^-\s+/, '')}</li>\n`;
      continue;
    }

    if (/^\|.*\|$/.test(line)) {
      flushList();
      if (!inTable) {
        html += '<table><tbody>\n';
        inTable = true;
      }
      const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
      html += `<tr>${cells.map((cell) => `<td>${cell}</td>`).join('')}</tr>\n`;
      continue;
    }

    flushList();
    html += `<p>${line}</p>\n`;
  }

  flushList();
  flushTable();
  return html;
}

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

async function fetchJson(url) {
  const res = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });
  return res.data;
}

async function getPageByTitle(title, parentId = null) {
  const params = new URLSearchParams({
    spaceKey,
    title,
    type: 'page',
    expand: 'ancestors,version',
  });

  const url = `${baseUrl.replace(/\/$/, '')}/rest/api/content?${params.toString()}`;
  const data = await fetchJson(url);
  const results = data.results || [];

  if (!results.length) return null;

  if (!parentId) return results[0];

  return results.find((page) => (page.ancestors || []).some((ancestor) => String(ancestor.id) === String(parentId))) || null;
}

async function createOrUpdatePage(title, content, parentId = null) {
  const page = await getPageByTitle(title, parentId);
  const body = { type: 'page', title, space: { key: spaceKey }, body: { storage: { value: toConfluenceStorage(content), representation: 'storage' } } };

  if (parentId) {
    body.ancestors = [{ id: parentId }];
  }

  if (!page) {
    const res = await axios.post(`${baseUrl.replace(/\/$/, '')}/rest/api/content`, body, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log(`Created page: ${title}`);
    return res.data;
  }

  const res = await axios.put(`${baseUrl.replace(/\/$/, '')}/rest/api/content/${page.id}`, {
    ...body,
    version: { number: Number(page.version.number) + 1 },
  }, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  console.log(`Updated page: ${title}`);
  return res.data;
}

function pageTitleFromFile(filePath, relativeDir, fileName) {
  const markdown = fs.readFileSync(filePath, 'utf8');
  const fromHeading = firstHeadingTitle(markdown, null);
  if (fromHeading) return fromHeading;

  const base = fileName.replace(/\.[^.]+$/, '');
  const dirName = relativeDir && relativeDir.split(path.sep).at(-1);
  return dirName ? `${toTitleCase(dirName)} - ${toTitleCase(base)}` : toTitleCase(base);
}

function collectMarkdownFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const itemPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(itemPath));
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      results.push(itemPath);
    }
  }
  return results;
}

async function syncUploadFiles() {
  const rootDir = path.resolve(docsDir);
  if (!fs.existsSync(rootDir)) {
    throw new Error(`No existe la carpeta de documentos: ${rootDir}`);
  }

  const files = collectMarkdownFiles(rootDir);
  if (!files.length) {
    console.warn(`No se encontraron archivos .md dentro de ${rootDir}`);
    return;
  }

  const pageByPath = new Map();
  const pageOrder = [];

  for (const file of files) {
    const relative = path.relative(rootDir, file);
    const segments = relative.split(path.sep).filter(Boolean);

    const docPath = [];
    let accumulatedParentId = parentPageId || null;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isFile = i === segments.length - 1 && segment.toLowerCase().endsWith('.md');
      const rawName = isFile ? segment.replace(/\.md$/i, '') : segment;

      let title = rawName
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (isFile) {
        const content = fs.readFileSync(file, 'utf8');
        title = firstHeadingTitle(content, title);
      } else {
        title = toTitleCase(title);
      }

      if (!title) continue;

      docPath.push(title);
      const key = docPath.join(' > ');
      if (!pageByPath.has(key)) {
        pageByPath.set(key, { title, parentId: accumulatedParentId });
        pageOrder.push(key);
      }
      if (!isFile) {
        accumulatedParentId = pageByPath.get(key)?.pageId || accumulatedParentId;
      } else {
        accumulatedParentId = pageByPath.get(key)?.pageId || accumulatedParentId;
      }
    }
  }

  const created = new Map();

  for (const key of pageOrder) {
    const { title, parentId } = pageByPath.get(key);
    const targetParentId = parentId || null;
    let content = '';

    const fileMatch = files.find((file) => {
      const relative = path.relative(rootDir, file).split(path.sep);
      const titleList = relative.filter(Boolean).map((segment) => segment.replace(/\.md$/i, '').replace(/[-_]+/g, ' ').trim());
      return titleList.at(-1) === title.replace(/^#\s*/, '') || titleList.join(' > ') === key;
    });

    if (fileMatch && title.match(/^#/) === null) {
      content = fs.readFileSync(fileMatch, 'utf8');
    }

    const page = await createOrUpdatePage(title, content || `# ${title}`, targetParentId);
    pageByPath.set(key, { ...pageByPath.get(key), pageId: page.id });
    created.set(key, page.id);
  }

  for (const file of files) {
    const relative = path.relative(rootDir, file);
    const segments = relative.split(path.sep).filter(Boolean);
    const fileName = segments.at(-1);
    const fileTitle = firstHeadingTitle(fs.readFileSync(file, 'utf8'), fileName.replace(/\.md$/i, '').replace(/[-_]+/g, ' '));

    let parentId = parentPageId || null;
    const parentTitles = [];
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i].replace(/\.md$/i, '').replace(/[-_]+/g, ' ').trim();
      parentTitles.push(toTitleCase(segment));
    }

    const actualFilePath = segments.slice(0, -1);
    const fileKey = actualFilePath.length ? actualFilePath.map((s) => toTitleCase(s.replace(/\.md$/i, '').replace(/[-_]+/g, ' '))).concat(fileTitle).join(' > ') : fileTitle;

    let resolvedParentId = parentId;
    for (const parentTitle of parentTitles) {
      const resolved = await getPageByTitle(parentTitle, resolvedParentId || null);
      if (resolved) {
        resolvedParentId = resolved.id;
      }
    }

    await createOrUpdatePage(fileTitle, fs.readFileSync(file, 'utf8'), resolvedParentId || parentId || null);
  }

  console.log(`Sincronización terminada. ${files.length} archivos procesados.`);
}

async function main() {
  try {
    if (MODE === 'upload') {
      await syncUploadFiles();
      return;
    }

    console.log('Este script está configurado para subir archivos de la carpeta docs a Confluence.');
    console.log('Usa SYNC_MODE=upload y define CONFLUENCE_* en .env');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
