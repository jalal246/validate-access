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
  srcName = "src",
}) {
  const pkgJsonPath = resolve(dir, "package.json");

  let isValid = fs.existsSync(pkgJsonPath);

  let isSrc = null;
  let ext = null;

  if (!isValid) {
    return { isValid, isSrc, ext };
  }

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

    /**
     * Make sure there's valid extension. Otherwise, no point for checking.
     */
    if (ext) {
      const entryPath = resolve(src, `${entry}.${ext}`);

      isValid = fs.existsSync(entryPath);
    } else {
      isValid = false;
    }
  }

  return { isValid, ext, isSrc };
}

module.exports = {
  getFileExtension,
  validateAccess,
};
