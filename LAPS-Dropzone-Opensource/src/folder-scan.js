'use strict';

const fsp = require('node:fs/promises');
const path = require('node:path');

function pathKey(value, platform = process.platform) {
  const resolved = path.resolve(value);
  return platform === 'win32' ? resolved.toLowerCase() : resolved;
}

/**
 * Expand dropped paths into regular file paths. Directories are scanned recursively,
 * symlinks are skipped to avoid loops and unintentionally traversing external targets.
 */
async function collectFilesFromPaths(inputPaths, limit = 25000) {
  if (!Array.isArray(inputPaths)) throw new TypeError('Expected an array of paths.');
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('The scan limit must be a positive integer.');

  const paths = [];
  const seenFiles = new Set();
  const seenDirectories = new Set();
  let truncated = false;
  let directoriesScanned = 0;
  let unreadableDirectories = 0;
  let missingPaths = 0;

  function addFile(filePath) {
    const absolutePath = path.resolve(filePath);
    const key = pathKey(absolutePath);
    if (seenFiles.has(key)) return true;
    if (paths.length >= limit) {
      truncated = true;
      return false;
    }
    seenFiles.add(key);
    paths.push(absolutePath);
    return true;
  }

  async function walkDirectory(directoryPath) {
    const absolutePath = path.resolve(directoryPath);
    const directoryKey = pathKey(absolutePath);
    if (seenDirectories.has(directoryKey)) return;
    seenDirectories.add(directoryKey);

    let entries;
    try {
      entries = await fsp.readdir(absolutePath, { withFileTypes: true });
    } catch {
      unreadableDirectories += 1;
      return;
    }

    for (const entry of entries) {
      if (truncated) return;
      const fullPath = path.join(absolutePath, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        await walkDirectory(fullPath);
      } else if (entry.isFile()) {
        addFile(fullPath);
      }
    }
  }

  for (const inputPath of inputPaths) {
    if (truncated) break;
    if (typeof inputPath !== 'string' || !inputPath.trim()) continue;
    const absolutePath = path.resolve(inputPath.trim());
    let stat;
    try {
      stat = await fsp.lstat(absolutePath);
    } catch {
      missingPaths += 1;
      continue;
    }

    // Explicitly dropped symlinks are ignored just like symlinks found during scanning.
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) {
      directoriesScanned += 1;
      await walkDirectory(absolutePath);
    } else if (stat.isFile()) {
      addFile(absolutePath);
    }
  }

  return { paths, truncated, directoriesScanned, unreadableDirectories, missingPaths };
}


function isSameOrInside(parentPath, childPath) {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

/**
 * Inspect dropped or selected paths while preserving folders as top-level collection items.
 * Files inside those folders are returned separately for selection and transfers, but the UI
 * can display them as children rather than as thousands of unrelated root entries.
 */
async function inspectInputPaths(inputPaths, limit = 25000) {
  if (!Array.isArray(inputPaths)) throw new TypeError('Expected an array of paths.');
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('The scan limit must be a positive integer.');

  const directFiles = [];
  const candidateFolders = [];
  let missingPaths = 0;
  let unreadableDirectories = 0;
  const seenInputs = new Set();

  for (const input of inputPaths) {
    if (typeof input !== 'string' || !input.trim()) continue;
    const absolutePath = path.resolve(input.trim());
    const key = pathKey(absolutePath);
    if (seenInputs.has(key)) continue;
    seenInputs.add(key);

    let stat;
    try {
      stat = await fsp.lstat(absolutePath);
    } catch {
      missingPaths += 1;
      continue;
    }
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) candidateFolders.push(absolutePath);
    else if (stat.isFile()) directFiles.push(absolutePath);
  }

  // If both a parent folder and one of its subfolders are dropped, represent only the parent.
  const folders = candidateFolders
    .filter((candidate) => !candidateFolders.some((other) => pathKey(other) !== pathKey(candidate) && isSameOrInside(other, candidate)))
    .map((folderPath) => ({
      path: folderPath,
      name: path.basename(folderPath) || folderPath,
      directory: path.dirname(folderPath),
      exists: true
    }));

  const scan = await collectFilesFromPaths([...folders.map((folder) => folder.path), ...directFiles], limit);
  return {
    ...scan,
    folders,
    missingPaths: missingPaths + scan.missingPaths,
    unreadableDirectories: unreadableDirectories + scan.unreadableDirectories
  };
}

module.exports = { collectFilesFromPaths, inspectInputPaths, isSameOrInside };
