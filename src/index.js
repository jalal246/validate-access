// @ts-check

const fs = require("fs");
const path = require("path");

/**
 * @param {string} dir
 * @param {string} srcName
 * @param {boolean} isValidateJson
 */
function getSrcWithJsonStatus(dir, srcName, isValidateJson) {
  return {
    isSrc: fs.existsSync(path.resolve(dir, srcName)),
    isJsonValid: isValidateJson
      ? fs.existsSync(path.resolve(dir, "package.json"))
      : null,
  };
}

const extensions = ["js", "ts"];

/**
 * @typedef {Object} Input
 * @property {string} input.dir [dir="."]
 * @property {string} input.entry [entry="index"]
 * @property {string} [srcName="src"]
 * @property {boolean} [isValidateJson=true] */

/**
 * Validates access readability  for `package.json` and project entry if
 * provided.
 *
 * @param {Input} input
 */
function validateAccess({
  dir: inputDir,
  entry: inputEntry = "index",
  srcName = "src",
  isValidateJson = true,
}) {
  let result = {};

  const isSrcPathFromDir = fs.existsSync(inputDir);

  let dir;

  let name;
  let ext;

  if (isSrcPathFromDir) {
    dir = inputDir;

    // if this dir includes Json & src
    result = getSrcWithJsonStatus(dir, srcName, isValidateJson);

    // if this dir has also the file entry. covering a special case.
    ({ name, ext } = path.parse(inputDir));

    if (ext.length !== 0) {
      return Object.assign(result, {
        entry: name,
        isEntryValid: true,
        entryExt: ext.split(".")[1],
      });
    }
  } else {
    // no directory, then look into the root as a default.
    dir = ".";

    result = getSrcWithJsonStatus(dir, srcName, isValidateJson);

    if (result.isSrc) {
      dir = path.resolve(dir, srcName);
    }
  }

  const isEntryValid = [];

  let entries;

  if (typeof inputEntry === "string") {
    entries = [inputEntry];
  } else {
    entries = inputEntry;
  }

  const validKyName = entries.length === 1 ? "isEntryValid" : "isValid";

  entries.forEach((entryFile) => {
    let isEntryFilesValid = false;

    // reset to null
    ext = null;

    // extension is embedded
    if (entryFile.includes(".")) {
      ({ name, ext } = path.parse(path.resolve(dir, entryFile)));

      // check if exists. Maybe the format is failed but not exist.

      // has a valid extension
      if (ext.length !== 0) {
        // check if exists. Maybe the format is failed but not exist.
        isEntryFilesValid = fs.existsSync(path.resolve(dir, entryFile));

        // Still invalid? maybe source.
        if (!isEntryFilesValid) {
          if (
            result.isSrc &&
            (!dir.includes(srcName) || !entryFile.includes(srcName))
          ) {
            isEntryFilesValid = fs.existsSync(
              path.resolve(dir, srcName, entryFile)
            );
          }
        }

        [, ext] = ext.split(".");
      }

      isEntryValid.push({
        entry: name,
        entryExt: ext,
        [validKyName]: isEntryFilesValid,
      });
    } else {
      let entry = entryFile;
      let entryExt;

      for (let i = 0; i < extensions.length; i += 1) {
        entryExt = extensions[i];

        isEntryFilesValid = fs.existsSync(
          path.resolve(dir, `${entryFile}.${entryExt}`)
        );

        if (isEntryFilesValid) {
          // Covers src/b
          ({ name: entry } = path.parse(path.resolve(dir, entryFile)));
          break;
        }

        // reset to null
        entryExt = null;
      }

      isEntryValid.push({
        entry,
        entryExt,
        [validKyName]: isEntryFilesValid,
      });
    }
  });

  return isEntryValid.length === 1
    ? Object.assign(result, isEntryValid[0])
    : Object.assign(result, { isEntryValid });
}

module.exports = {
  validateAccess,
};
