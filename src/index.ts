const fs = require("fs");
const path = require("path");

function getSrcWithJsonStatus(
  dir: string,
  srcName: string,
  isValidateJson: boolean
): { isSrc: boolean; isJsonValid: boolean | null } {
  return {
    isSrc: fs.existsSync(path.resolve(dir, srcName)),
    isJsonValid: isValidateJson
      ? fs.existsSync(path.resolve(dir, "package.json"))
      : null,
  };
}

const defaultExtensions: string[] = ["js", "ts"];

interface Input {
  dir: ".";
  entry: "index";
  srcName: "src";
  isValidateJson: true;
  extensions: typeof defaultExtensions;
}

interface ValidationMeta {
  entry: string;
  isEntryValid: boolean;
  entryExt: string;
}

interface ValidationOneEntry extends ValidationMeta {
  isJsonValid: boolean;
  isSrc: boolean;
}

interface ValidationMulti {
  isJsonValid: string;
  isSrc: boolean;
  entire: ValidationMeta[];
}

/**
 * Validates access readability  for `package.json` and project entry if
 * provided.
 */
function validateAccess({
  dir: inputDir,
  entry: inputEntry = "index",
  srcName = "src",
  isValidateJson = true,
  extensions = defaultExtensions,
}: Input): ValidationOneEntry | ValidationMulti {
  let result: ReturnType<typeof getSrcWithJsonStatus>;

  const isSrcPathFromDir: boolean = fs.existsSync(inputDir);

  let dir: string;
  let name: string;
  let ext: string;

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

  // output entries
  const entries = [];

  let inputEntries;

  if (typeof inputEntry === "string") {
    inputEntries = [inputEntry];
  } else {
    inputEntries = inputEntry;
  }

  inputEntries.forEach((entryFile) => {
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

      entries.push({
        entry: name,
        entryExt: ext,
        isEntryValid: isEntryFilesValid,
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

      entries.push({
        entry,
        entryExt,
        isEntryValid: isEntryFilesValid,
      });
    }
  });

  return entries.length === 1
    ? Object.assign(result, entries[0])
    : Object.assign(result, { entries });
}

module.exports = {
  validateAccess,
};
