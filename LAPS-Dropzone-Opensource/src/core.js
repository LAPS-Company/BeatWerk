'use strict';

const path = require('node:path');

function uniquePaths(paths, platform = process.platform) {
  const seen = new Set();
  const result = [];
  for (const input of Array.isArray(paths) ? paths : []) {
    if (typeof input !== 'string' || !input.trim()) continue;
    const normalized = path.resolve(input.trim());
    const key = platform === 'win32' ? normalized.toLowerCase() : normalized;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}

function formatBytes(bytes, locale = 'en-US') {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n < 0) return '—';
  if (n < 1000) return `${Math.round(n)} B`;
  const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
  let value = n / 1000;
  let index = 0;
  while (value >= 1000 && index < units.length - 1) {
    value /= 1000;
    index += 1;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: value < 10 ? 1 : 0 }).format(value)} ${units[index]}`;
}

function makeNonClashingPath(destination, fileName, exists) {
  const parsed = path.parse(fileName);
  let candidate = path.join(destination, fileName);
  let number = 2;
  while (exists(candidate)) {
    candidate = path.join(destination, `${parsed.name} (${number})${parsed.ext}`);
    number += 1;
    if (number > 100000) throw new Error('Too many files with the same name.');
  }
  return candidate;
}

function basenameSafe(filePath) {
  const raw = String(filePath || '').replace(/\\/g, '/').replace(/\/+$/, '');
  return path.posix.basename(raw) || String(filePath || 'Unknown file');
}

module.exports = { uniquePaths, formatBytes, makeNonClashingPath, basenameSafe };
