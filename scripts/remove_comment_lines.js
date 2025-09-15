#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

const EXCLUDE_DIRS = new Set([
  'node_modules', '.git', '.next', 'dist', 'build', 'out', '.turbo', '.vercel', '.vscode',
  'coverage', '.cache', '.pnpm-store', '.yarn', '.expo', '.idea',
  'backend/.venv', 'venv', '.venv', 'env', '.env', 'prisma/migrations', 'prisma/dev.db'
]);

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.scss', '.sass', '.css', '.md', '.sql', '.toml', '.yml', '.yaml', '.env', '.mjs', '.mts', '.cts', '.prisma', '.tsx', '.ts', '.graphql'
]);

function shouldSkipDir(dirPath) {
  const parts = dirPath.split(path.sep);
  return parts.some((p) => EXCLUDE_DIRS.has(p));
}

function isBinaryFile(filePath) {
  const binaryExts = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.avif',
    '.woff', '.woff2', '.ttf', '.eot', '.otf', '.pdf', '.db'
  ];
  const ext = path.extname(filePath).toLowerCase();
  return binaryExts.includes(ext);
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (TEXT_EXTENSIONS.has(ext)) return true;
  return !isBinaryFile(filePath);
}

function processFile(filePath) {
  if (!isTextFile(filePath)) return;
  const ext = path.extname(filePath).toLowerCase();
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split(/\r?\n/);

  let inBlock = false; // false | 'std' | 'jsx'
  const blockStart = '/*';
  const blockEnd = '*/';
  const jsxBlockStart = '{/*';
  const jsxBlockEnd = '*/}';

  function isFullLineComment(line) {
    const trimmed = line.trim();
    if (trimmed.length === 0) return false; // keep empty lines

    if (ext === '.json') return false;

    const supportsDoubleSlash = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.scss', '.sass']
      .includes(ext);

    if (supportsDoubleSlash && trimmed.startsWith('//')) return true;
    if (ext === '.md') {
      return false;
    }

    if (ext === '.sql' && (trimmed.startsWith('--') || trimmed.startsWith('//'))) return true;

    if (['.env', '.yml', '.yaml', '.toml'].includes(ext) && trimmed.startsWith('#')) return true;

    if (trimmed.startsWith(blockStart) && trimmed.endsWith(blockEnd)) return true;
    if ((ext === '.tsx' || ext === '.jsx') && trimmed.startsWith(jsxBlockStart) && trimmed.endsWith(jsxBlockEnd)) return true;

    return false;
  }

  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (ext !== '.json' && ext !== '.md') {
      if (!inBlock) {
        if (trimmed.startsWith(blockStart) && !trimmed.includes(blockEnd)) {
          if (trimmed === blockStart || trimmed.startsWith('/*') && !/\S.*\*\//.test(trimmed)) {
            inBlock = 'std';
            continue;
          }
        }
        if ((ext === '.tsx' || ext === '.jsx') && trimmed.startsWith(jsxBlockStart) && !trimmed.includes(jsxBlockEnd)) {
          if (trimmed === jsxBlockStart || trimmed.startsWith('{/*') && !/\S.*\*\/\}/.test(trimmed)) {
            inBlock = 'jsx';
            continue;
          }
        }
      } else {
        if (inBlock === 'std') {
          if (trimmed.includes(blockEnd)) {
            inBlock = false;
          }
          continue;
        }
        if (inBlock === 'jsx') {
          if (trimmed.includes(jsxBlockEnd)) {
            inBlock = false;
          }
          continue;
        }
      }
      if (isFullLineComment(line)) continue;
    }

    result.push(line);
  }

  const updated = result.join('\n');
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

function walk(dir) {
  if (shouldSkipDir(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      walk(fullPath);
    } else if (entry.isFile()) {
      if (shouldSkipDir(path.dirname(fullPath))) continue;
      if (isBinaryFile(fullPath)) continue;
      processFile(fullPath);
    }
  }
}

function main() {
  const rootArg = process.argv[2] ? path.resolve(process.argv[2]) : ROOT;
  walk(rootArg);
}

main();


