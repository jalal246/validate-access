/* eslint-disable no-console */
const fs = require("fs");
const { resolve } = require("path");

/**
 * Gets extension used in for given entry.
 *
 * @param {string} dir - project directory
 * @param {string} entry - project file entry name
 * @returns {string} extension.
 */
function getFileExtension(dir, entry) {
  const files = fs.readdirSync(dir);

  const indx = files.find(file => {
    return file.includes(entry);
  });

  if (!indx) {
    console.error(`getFileExtension: Unable to detect extension In: ${dir}`);
  }

  const extension = indx.split(".").pop();

  return extension;
}

/**
 * Validates access readability  for `package.json` and project entry if
 * provided.
 *
 * @param {string} [dir="."]
 * @param {boolean} [isValidateEntry=false]
 * @param {string} [entry="index"]
 * @param {string} [srcName="src"]
 *
 * @returns {Object} result
 * @returns {boolean} result.isValid - true, if access is valid
 * @returns {boolean} result.isSrc - true, if project contains src folder
 * @returns {string} result.ext - entry file extension
 */
function validateAccess({
  dir = ".",
  isValidateEntry = false,
  entry = "index",
  srcName = "src"
}) {
  const pkgJsonPath = resolve(dir, "package.json");

  const isPkgJson = fs.existsSync(pkgJsonPath);

  let isValid = true;

  if (!isPkgJson) {
    return { isValid: false };
  }

  let isSrc;
  let ext;

  /**
   * Valid package.json and isValidateEntry is required.
   */
  if (isValidateEntry) {
    /**
     * Let's see where files life in src or flat.
     */
    isSrc = fs.existsSync(resolve(dir, srcName));

    const src = isSrc ? resolve(dir, srcName) : dir;

    ext = getFileExtension(src, entry);

    const entryPath = resolve(src, `${entry}.${ext}`);

    isValid = fs.existsSync(entryPath);
  }

  return { isValid, ext, isSrc };
}

module.exports = {
  getFileExtension,
  validateAccess
};
