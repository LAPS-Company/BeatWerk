'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { uniquePaths, formatBytes, makeNonClashingPath, basenameSafe } = require('../src/core');

test('uniquePaths removes duplicates without changing order', () => {
  const a = path.resolve('one.txt');
  const b = path.resolve('two.txt');
  assert.deepEqual(uniquePaths([a, b, a]), [a, b]);
});

test('uniquePaths uses case-insensitive duplicates for Windows paths', () => {
  assert.equal(uniquePaths(['C:\\Work\\File.txt', 'c:\\work\\file.TXT'], 'win32').length, 1);
});

test('uniquePaths ignores invalid values', () => {
  assert.deepEqual(uniquePaths([null, '', '   ', 5]), []);
});

test('formatBytes handles empty and common values', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(999), '999 B');
  assert.match(formatBytes(1500), /KB$/);
});

test('makeNonClashingPath creates numbered names without overwriting', () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'laps-dropzone-test-'));
  try {
    fs.writeFileSync(path.join(folder, 'photo.png'), 'one');
    fs.writeFileSync(path.join(folder, 'photo (2).png'), 'two');
    const result = makeNonClashingPath(folder, 'photo.png', (candidate) => fs.existsSync(candidate));
    assert.equal(result, path.join(folder, 'photo (3).png'));
    assert.equal(fs.readFileSync(path.join(folder, 'photo.png'), 'utf8'), 'one');
  } finally {
    fs.rmSync(folder, { recursive: true, force: true });
  }
});

test('makeNonClashingPath preserves files without extensions', () => {
  const result = makeNonClashingPath('/tmp', 'README', (candidate) => candidate.endsWith('README'));
  assert.equal(result, path.join('/tmp', 'README (2)'));
});

test('basenameSafe extracts names from normalized paths', () => {
  assert.equal(basenameSafe('/home/test/report.pdf'), 'report.pdf');
  assert.equal(basenameSafe('C:\\Users\\Test\\report.pdf'), 'report.pdf');
});
