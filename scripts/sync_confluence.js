#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const TurndownService = require('turndown');

// Variables de entorno necesarias:
// CONFLUENCE_BASE_URL (ej: https://your-domain.atlassian.net/wiki)
// CONFLUENCE_PAGE_ID (id numérico de la página raíz a sincronizar)
// CONFLUENCE_USER (email de la cuenta)
// CONFLUENCE_API_TOKEN (API token de Atlassian)
// OUTPUT_DIR (opcional) - directorio de salida relativo, default: docs/
// RECURSIVE (opcional) - 'true' para bajar recursivamente, default: true

const baseUrl = process.env.CONFLUENCE_BASE_URL;
const rootPageId = process.env.CONFLUENCE_PAGE_ID;
const user = process.env.CONFLUENCE_USER;
const token = process.env.CONFLUENCE_API_TOKEN;
const outputDir = process.env.OUTPUT_DIR || 'docs';
const recursive = (process.env.RECURSIVE ?? 'true') === 'true';

if (!baseUrl || !rootPageId || !user || !token) {
  console.error('Faltan variables de entorno. Asegúrate de definir CONFLUENCE_BASE_URL, CONFLUENCE_PAGE_ID, CONFLUENCE_USER y CONFLUENCE_API_TOKEN.');
  process.exit(1);
}

const auth = Buffer.from(`${user}:${token}`).toString('base64');
const turndownService = new TurndownService({ headingStyle: 'atx' });

function safeName(title) {
  return title
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 200);
}

async function fetchJson(url) {
  const res = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
  });
  return res.data;
}

async function fetchChildren(pageId) {
  const children = [];
  let start = 0;
  const limit = 50;
  while (true) {
    const url = `${baseUrl.replace(/\/$/, '')}/rest/api/content/${pageId}/child/page?start=${start}&limit=${limit}`;
    const data = await fetchJson(url);
    if (data && data.results) {
      children.push(...data.results);
      if (data.size < limit) break;
      start += data.size;
    } else break;
  }
  return children;
}

async function fetchAndSave(pageId, ancestors = []) {
  const url = `${baseUrl.replace(/\/$/, '')}/rest/api/content/${pageId}?expand=body.storage,version,ancestors`;
  const data = await fetchJson(url);
  const title = data.title || `page-${pageId}`;
  const html = data.body?.storage?.value || '';

  const markdown = turndownService.turndown(html);

  // Build path using ancestor titles + current title to preserve structure
  const pathParts = [...ancestors.map(a => safeName(a.title)), safeName(title)].filter(Boolean);
  const fileDir = path.join(outputDir, ...pathParts.slice(0, -1));
  const fileName = `${pathParts[pathParts.length - 1] || ('page-' + pageId)}.md`;
  const outPath = path.join(fileDir, fileName);

  fs.mkdirSync(fileDir, { recursive: true });
  const content = `# ${title}\n\n` + markdown;
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Página sincronizada: ${outPath}`);

  if (recursive) {
    const children = await fetchChildren(pageId);
    for (const child of children) {
      await fetchAndSave(child.id, [...ancestors, { id: pageId, title }]);
    }
  }
}

async function main() {
  try {
    await fetchAndSave(rootPageId, []);
    console.log('Sincronización completa.');
  } catch (err) {
    console.error('Error durante sincronización:', err.response?.status, err.response?.data || err.message);
    process.exit(1);
  }
}

main();
