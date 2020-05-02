/* eslint-disable no-console */
const fs = require("fs");
const { resolve } = require("path");

/**
 * Gets extension used in for given entry.
 *
 * @param {string} dir - project directory
 * @param {string} entry - project file entry name
 * @returns {string|null} extension if exist
 */
function getFileExtension(dir, entry) {
  const files = fs.readdirSync(dir);

  const fullEntryName = files.find((file) => {
    return file.includes(entry);
  });

  /**
   * If not found, then will throw error when split.
   */
  if (fullEntryName && fullEntryName.length > 0) {
    return fullEntryName.split(".").pop();
  }

  return null;
}

function getFullName(name, ext) {
  return `${name}.${ext}`;
}

function checkFile(root, fname) {
  const cwd = resolve(root, fname);

  return fs.existsSync(cwd);
}

function validateEntry(root, srcPath, entryFile) {
  const entryExt = getFileExtension(srcPath, entryFile);

  return entryExt
    ? {
        entryExt,
        isEntryValid: checkFile(root, getFullName(entryFile, entryExt)),
      }
    : {
        entryExt,
        isEntryValid: false,
      };
}

/**
 * Validates access readability  for `package.json` and project entry if
 * provided.
 *
 * @param {string} [dir="."]
 * @param {string} [entry="index"]
 * @param {string} [srcName="src"]
 *
 * @returns {Object} result
 * @returns {boolean} result.isValid - true, if access is valid
 * @returns {boolean} result.isSrc - true, if project contains src folder
 * @returns {string} result.ext - entry file extension
 */
function validateAccess({ dir = ".", entry = "index", srcName = "src" }) {
  const isValidJson = checkFile(dir, "package.json");

  let isSrc = null;

  /**
   * Let's see where files life in src or flat.
   */
  isSrc = fs.existsSync(resolve(dir, srcName));

  const isValidEntry = [];

  /**
   * Valid package.json and isValidateEntry is required.
   */
  if (entry) {
    const srcPath = isSrc ? resolve(dir, srcName) : dir;

    const entries = typeof entry === "string" ? [entry] : entry;

    entries.forEach((entryFile, i) => {
      isValidEntry.push({
        entry: entries[i],
        ...validateEntry(dir, srcPath, entryFile),
      });
    });
  }

  return {
    isValidJson,
    isSrc,
    ...(isValidEntry.length === 1 ? { ...isValidEntry[0] } : { isValidEntry }),
  };
}

module.exports = {
  getFileExtension,
  validateAccess,
};
