/* eslint-disable no-console */
const fs = require("fs");
const { resolve } = require("path");

/**
 * Gets files in given directory
 *
 * @param {string|Array} dir
 * @returns {Array} - files in directory
 */
function getFiles(dir) {
  return typeof dir === "string" ? fs.readdirSync(dir) : dir;
}

/**
 * Gets full name with extension
 *
 * @param {string} name
 * @param {string} ext
 * @returns {string} - full name
 */
function getFullName(name, ext) {
  return `${name}.${ext}`;
}

/**
 * Validates file existence in given directory
 *
 * @param {string} dir
 * @param {string} fname
 * @returns {boolean} -  true if exists
 */
function isValid(dir, fname) {
  const cwd = resolve(dir, fname);

  return fs.existsSync(cwd);
}

/**
 * Gets extension used in for given entry.
 *
 * @param {string} dir - project directory
 * @param {string} entry - project file entry name
 * @returns {string|null} extension if exist
 */
function getExtension(dir, entry) {
  const files = getFiles(dir);

  const regExp = new RegExp(`^${entry}.[a-z]+$`, "i");

  const fullEntryName = files.find((file) => {
    return regExp.test(file);
  });

  /**
   * If not found, then will throw error when split.
   */
  if (fullEntryName && fullEntryName.length > 0) {
    return fullEntryName.split(".").pop();
  }

  return null;
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
function validateAccess({ dir = ".", entry = "index", srcName = "src" } = {}) {
  const isJsonValid = isValid(dir, "package.json");

  let isSrc = null;

  /**
   * Let's see where files life in src or flat.
   */
  isSrc = fs.existsSync(resolve(dir, srcName));

  const isEntryValid = [];

  /**
   * Valid package.json and isValidateEntry is required.
   */
  if (entry) {
    const srcPath = isSrc ? resolve(dir, srcName) : dir;

    const entries = typeof entry === "string" ? [entry] : entry;

    const dirFiles = getFiles(srcPath);

    entries.forEach((entryFile) => {
      const entryExt = getExtension(dirFiles, entryFile);

      const isEntryFilesValid = isValid(
        srcPath,
        getFullName(entryFile, entryExt)
      );

      isEntryValid.push({
        entry: entryFile,
        entryExt,
        isEntryValid: isEntryFilesValid,
      });
    });
  }

  return {
    isJsonValid,
    isSrc,
    ...(isEntryValid.length === 1 ? { ...isEntryValid[0] } : { isEntryValid }),
  };
}

module.exports = {
  getExtension,
  validateAccess,
};
