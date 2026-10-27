'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { collectFilesFromPaths, inspectInputPaths } = require('../src/folder-scan');

async function withTempFolder(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'laps-dropzone-scan-'));
  try { return await fn(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}

test('collectFilesFromPaths expands a dropped folder recursively', async () => {
  await withTempFolder(async (root) => {
    fs.mkdirSync(path.join(root, 'nested'));
    fs.writeFileSync(path.join(root, 'one.txt'), 'one');
    fs.writeFileSync(path.join(root, 'nested', 'two.txt'), 'two');
    const result = await collectFilesFromPaths([root]);
    assert.equal(result.directoriesScanned, 1);
    assert.equal(result.paths.length, 2);
    assert.ok(result.paths.includes(path.join(root, 'one.txt')));
    assert.ok(result.paths.includes(path.join(root, 'nested', 'two.txt')));
    assert.equal(result.truncated, false);
  });
});

test('collectFilesFromPaths supports mixed file and folder drops without duplicates', async () => {
  await withTempFolder(async (root) => {
    const file = path.join(root, 'one.txt');
    fs.writeFileSync(file, 'one');
    const result = await collectFilesFromPaths([file, root, file]);
    assert.deepEqual(result.paths, [file]);
  });
});

test('collectFilesFromPaths stops at the configured file limit', async () => {
  await withTempFolder(async (root) => {
    fs.writeFileSync(path.join(root, 'one.txt'), 'one');
    fs.writeFileSync(path.join(root, 'two.txt'), 'two');
    const result = await collectFilesFromPaths([root], 1);
    assert.equal(result.paths.length, 1);
    assert.equal(result.truncated, true);
  });
});

test('collectFilesFromPaths ignores symbolic links when supported', async (t) => {
  await withTempFolder(async (root) => {
    const target = path.join(root, 'real.txt');
    fs.writeFileSync(target, 'data');
    const link = path.join(root, 'linked.txt');
    try { fs.symlinkSync(target, link); } catch (err) { t.skip(`Symlink not available: ${err.message}`); return; }
    const result = await collectFilesFromPaths([root]);
    assert.deepEqual(result.paths, [target]);
  });
});


test('inspectInputPaths preserves a folder as one collection root and scans its files', async () => {
  await withTempFolder(async (root) => {
    const nested = path.join(root, 'nested');
    fs.mkdirSync(nested);
    const first = path.join(root, 'one.txt');
    const second = path.join(nested, 'two.txt');
    fs.writeFileSync(first, 'one');
    fs.writeFileSync(second, 'two');

    const result = await inspectInputPaths([root]);
    assert.equal(result.folders.length, 1);
    assert.equal(result.folders[0].path, root);
    assert.equal(result.folders[0].name, path.basename(root));
    assert.equal(result.paths.length, 2);
    assert.ok(result.paths.includes(first));
    assert.ok(result.paths.includes(second));
  });
});

test('inspectInputPaths collapses nested dropped folders into the parent folder entry', async () => {
  await withTempFolder(async (root) => {
    const nested = path.join(root, 'nested');
    fs.mkdirSync(nested);
    const file = path.join(nested, 'inside.txt');
    fs.writeFileSync(file, 'inside');
    const result = await inspectInputPaths([nested, root]);
    assert.deepEqual(result.folders.map((folder) => folder.path), [root]);
    assert.deepEqual(result.paths, [file]);
  });
});

test('inspectInputPaths still returns an empty folder as a selectable folder entry', async () => {
  await withTempFolder(async (root) => {
    const empty = path.join(root, 'empty');
    fs.mkdirSync(empty);
    const result = await inspectInputPaths([empty]);
    assert.equal(result.folders.length, 1);
    assert.equal(result.folders[0].path, empty);
    assert.deepEqual(result.paths, []);
  });
});
