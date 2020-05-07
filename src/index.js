"use_strict";

/* eslint-disable no-nested-ternary */
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
 * @param {boolean} [isValidateJson=true]
 *
 * @returns {Object} results
 */
function validateAccess({
  dir = ".",
  entry = "index",
  srcName = "src",
  isValidateJson = true,
} = {}) {
  const result = {};

  result.isJsonValid = isValidateJson ? isValid(dir, "package.json") : null;

  if (!entry) {
    return result;
  }

  /**
   * Let's see where files life in src or flat.
   */
  result.isSrc = fs.existsSync(resolve(dir, srcName));

  const isEntryValid = [];

  /**
   * Valid package.json and isValidateEntry is required.
   */
  const srcPath = result.isSrc ? resolve(dir, srcName) : dir;

  let entries;
  let validKyName;

  if (typeof entry === "string") {
    entries = [entry];
    validKyName = "isEntryValid";
  } else {
    entries = entry;
    validKyName = "isValid";
  }

  const dirFiles = getFiles(srcPath);

  entries.forEach((entryFile) => {
    let file = entryFile;
    let entryExt;

    if (result.isSrc && file.includes("src/")) {
      [, file] = file.split("/");

      if (file.includes(".")) {
        [file, entryExt] = file.split(".");
      }
    }

    if (!entryExt) {
      entryExt = getExtension(dirFiles, file);
    }

    const isEntryFilesValid = isValid(srcPath, getFullName(file, entryExt));

    isEntryValid.push({
      entry: file,
      entryExt,
      [validKyName]: isEntryFilesValid,
    });
  });

  return isEntryValid.length === 1
    ? Object.assign(result, isEntryValid[0])
    : Object.assign(result, { isEntryValid });
}

module.exports = {
  getExtension,
  validateAccess,
};
