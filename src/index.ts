/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */

const fs = require("fs");
const path = require("path");

const DEFAULT_EXTENSIONS: string[] = ["js", "ts"];
const DEFAULT_DIR_FOLDERS: string[] = ["src", "lib", "dist"];
const PKG_JSON = "package.json";

interface Input {
  dir: ".";
  entry?: string;
  srcName: "src";
  isValidateJson: true;
  extensions: typeof DEFAULT_EXTENSIONS;
}

interface ParseDir {
  dir: string;
  subDir: string;
  isSrc: boolean;
  srcName: string;
  isJsonValid: boolean | null;
  includeValidEntry: boolean;
  ext: string;
  name: string;
}

interface ParseEntry {
  entry: string;
  entryDir: string;
  ext: string;
  name: string;
}

interface Entry extends ParseEntry {
  isEntryValid: boolean;
}

interface ValidationOneEntry extends Entry {
  dir: string;
  isJsonValid: boolean | null;
  isSrc: boolean;
}

interface ValidationMulti {
  dir: string;
  isJsonValid: boolean | null;
  isSrc: boolean;
  entries: Entry[];
}

function validatorMatchInLoop(
  arr: string[],
  // eslint-disable-next-line no-unused-vars
  validator: (arg: string) => boolean
) {
  let isFound = false;
  let str = "";

  for (let i = 0; i < arr.length; i += 1) {
    str = arr[i];

    if (validator(str)) {
      isFound = true;
      break;
    }
  }

  return { isFound, match: str };
}

function strMatchInLoop(arr: string[], str: string) {
  let isFound = false;

  for (let i = 0; i < arr.length; i += 1) {
    if (str === arr[i]) {
      isFound = true;
      break;
    }
  }

  return { isFound, match: isFound ? str : "" };
}

function validate(dir: string, fName?: string): boolean {
  return fs.existsSync(fName ? path.resolve(dir, fName) : dir);
}

function parseEntry(entry: string): ParseEntry {
  const { ext, name, dir: entryDir } = path.parse(entry);

  return {
    entry,
    entryDir,
    ext: ext.length === 0 ? ext : ext.split(".")[1],
    name,
  };
}

function parseDir(
  inputDir: string,
  subFoldersNames: string[] = DEFAULT_DIR_FOLDERS,
  extensions: string[] = DEFAULT_EXTENSIONS,
  isValidateJson: boolean = true
): ParseDir {
  let dir = ".";
  let subDir = "";
  let srcName = "";
  let ext = "";
  let name = "";

  let isSrc = false;
  let isJsonValid: boolean | null = false;

  if (!inputDir || inputDir.length === 0) {
    ({ isFound: isSrc, match: srcName } = validatorMatchInLoop(
      subFoldersNames,
      validate.bind(".")
    ));

    isJsonValid = isValidateJson ? validate(dir, PKG_JSON) : null;

    return {
      dir,
      subDir,
      isJsonValid,
      isSrc,
      srcName,
      includeValidEntry: false,
      ext,
      name,
    };
  }

  let base = "";

  let includeValidEntry = false;

  ({ dir, ext, name, base } = path.parse(inputDir));

  if (ext.length > 0) {
    // to/[folder]/file.js
    [, ext] = ext.split(".");
    includeValidEntry = validate(inputDir);

    ({ dir, name: subDir, base } = path.parse(dir));

    ({ isFound: isSrc, match: srcName } = strMatchInLoop(
      subFoldersNames,
      subDir
    ));

    if (!isSrc) {
      // Wrong subDir. Undo
      subDir = "";
      ({ dir } = path.parse(inputDir));
    }
  } else {
    // no extension, no name
    name = "";

    ({ isFound: isSrc, match: subDir } = strMatchInLoop(subFoldersNames, base));
    srcName = subDir;

    if (subDir.length === 0) {
      // undo parsing
      dir = inputDir;

      // maybe :
      // to/src/b or  to/b or to
      for (let j = 0; j < extensions.length; j += 1) {
        includeValidEntry = validate(`${dir}.${extensions[j]}`);

        if (includeValidEntry) {
          return parseDir(
            `${dir}.${extensions[j]}`,
            subFoldersNames,
            extensions,
            isValidateJson
          );
        }
      }
    }
  }

  isJsonValid = isValidateJson ? validate(dir, PKG_JSON) : null;

  const result = {
    dir,
    subDir,
    isJsonValid,
    isSrc,
    srcName,
    includeValidEntry,
    ext,
    name,
  };

  return result;
}

function validateEntry(
  entry: Entry,
  extensions: string[],
  workingDir: string
): Entry {
  const { name, ext } = entry;

  if (ext.length === 0) {
    for (let j = 0; j < extensions.length; j += 1) {
      const resolvedPath = path.resolve(workingDir, `${name}.${extensions[j]}`);
      const isEntryValid = fs.existsSync(resolvedPath);

      if (isEntryValid) {
        entry.ext = extensions[j];
        entry.isEntryValid = true;

        break;
      }
    }
  } else {
    const resolvedPath = path.resolve(workingDir, `${name}.${ext}`);
    const isEntryValid = fs.existsSync(resolvedPath);

    if (isEntryValid) {
      entry.isEntryValid = true;
    }
  }

  return entry;
}

function validateAccess({
  dir: inputDir,
  entry: entries,
  srcName = "src",
  isValidateJson = true,
  extensions = DEFAULT_EXTENSIONS,
}: Input): ValidationOneEntry | ValidationMulti {
  const {
    dir,
    subDir,
    isJsonValid,
    isSrc,
    includeValidEntry,
    ext: extDir,
    name: nameDir,
  } = parseDir(inputDir, srcName, extensions, isValidateJson);

  if (includeValidEntry) {
    return {
      dir,
      entryDir: subDir,
      entry: dir,
      isSrc,
      isJsonValid,
      isEntryValid: true,
      ext: extDir,
      name: nameDir,
    };
  }

  const extractedEntries: Entry[] = [];

  if (Array.isArray(entries) && entries.length > 0) {
    // parsing entries
    entries.forEach((entry) => {
      extractedEntries.push({ ...parseEntry(entry), isEntryValid: false });
    });
  } else {
    extractedEntries.push({
      ...parseEntry(entries || ""),
      isEntryValid: false,
    });
  }

  const workingPath = subDir ? path.resolve(dir, subDir) : dir;

  for (let i = 0; i < extractedEntries.length; i += 1) {
    const { name, ext } = extractedEntries[i];

    if (ext.length === 0) {
      for (let j = 0; j < extensions.length; j += 1) {
        const resolvedPath = path.resolve(
          workingPath,
          `${name}.${extensions[j]}`
        );
        const isEntryValid = fs.existsSync(resolvedPath);

        if (isEntryValid) {
          extractedEntries[i].ext = extensions[j];
          extractedEntries[i].isEntryValid = true;

          break;
        }
      }
    } else {
      const resolvedPath = path.resolve(workingPath, `${name}.${ext}`);
      const isEntryValid = fs.existsSync(resolvedPath);

      if (isEntryValid) {
        extractedEntries[i].isEntryValid = true;
      }
    }
  }

  return {
    dir,
    isSrc,
    isJsonValid,
    ...(extractedEntries.length === 1
      ? extractedEntries[0]
      : { entries: extractedEntries }),
  };
}

export { validateAccess, parseEntry, parseDir };
