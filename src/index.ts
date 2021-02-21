/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */

const fs = require("fs");
const path = require("path");

const DEFAULT_EXTENSIONS: string[] = ["js", "ts"];
const DEFAULT_DIR_FOLDERS: string[] = ["src", "lib", "dist"];
const PKG_JSON = "package.json";

interface ParseDirOutput {
  dir: string;
  subDir: string;
  isSrc: boolean;
  srcName: string;
  isJsonValid: boolean | null;
  includeValidEntry: boolean;
  ext: string;
  name: string;
}

interface ParseDirInput {
  dir: string;
  subFoldersNames: string[];
  extensions: string[];
  isValidateJson: boolean;
}

interface ValidateAccessInput extends ParseDirInput {
  entry: string;
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
  subDir: string;
  isJsonValid: boolean | null;
  isSrc: boolean;
  srcName: string;
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

function getWorkingDir(
  baseDir: string,
  subDir: string,
  entryDir: string
): string {
  if (subDir) {
    return entryDir
      ? path.resolve(baseDir, subDir, entryDir)
      : path.resolve(baseDir, subDir);
  }

  return entryDir ? path.resolve(baseDir, entryDir) : baseDir;
}

function parsePathWithExt(
  givenDir: string,
  extractedDir: string,
  pureExt: string,
  subFoldersNames: string[]
): {
  includeValidEntry: boolean;
  baseDir: string;
  subDir: string;
  ext: string;
  isSrc: boolean;
  srcName: string;
} {
  let baseDir = extractedDir;
  let subDir = "";

  // to/[folder]/file.js
  const [, ext] = pureExt.split(".");

  const includeValidEntry = validate(givenDir);

  // second round looking for sub dir
  ({ dir: baseDir, name: subDir } = path.parse(baseDir));

  const { isFound: isSrc, match: srcName } = strMatchInLoop(
    subFoldersNames,
    subDir
  );

  if (!isSrc) {
    // Wrong subDir. Undo
    subDir = "";

    ({ dir: baseDir } = path.parse(givenDir));
  }

  return { includeValidEntry, baseDir, subDir, ext, isSrc, srcName };
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

function parseDir({
  dir = ".",
  subFoldersNames = DEFAULT_DIR_FOLDERS,
  extensions = DEFAULT_EXTENSIONS,
  isValidateJson = true,
}: ParseDirInput): ParseDirOutput {
  let baseDir = ".";
  let subDir = "";
  let srcName = "";
  let ext = "";
  let name = "";

  let isSrc = false;
  let isJsonValid: boolean | null = false;

  if (!dir || dir.length === 0) {
    ({ isFound: isSrc, match: srcName } = validatorMatchInLoop(
      subFoldersNames,
      validate.bind(".")
    ));

    isJsonValid = isValidateJson ? validate(baseDir, PKG_JSON) : null;

    return {
      dir: baseDir,
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

  ({ dir: baseDir, ext, name, base } = path.parse(dir));

  if (ext.length > 0) {
    ({
      baseDir,
      ext,
      includeValidEntry,
      isSrc,
      srcName,
      subDir,
    } = parsePathWithExt(dir, baseDir, ext, subFoldersNames));
  } else {
    // no extension, no name
    name = "";

    ({ isFound: isSrc, match: subDir } = strMatchInLoop(subFoldersNames, base));
    srcName = subDir;

    if (subDir.length === 0) {
      // undo parsing
      baseDir = dir;

      // maybe :
      // to/src/b or  to/b or to
      for (let j = 0; j < extensions.length; j += 1) {
        includeValidEntry = validate(`${baseDir}.${extensions[j]}`);

        if (includeValidEntry) {
          return parseDir({
            dir: `${baseDir}.${extensions[j]}`,
            subFoldersNames,
            extensions,
            isValidateJson,
          });
        }
      }
    }
  }

  isJsonValid = isValidateJson ? validate(baseDir, PKG_JSON) : null;

  const result = {
    dir: baseDir,
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

function validateAccess({
  dir: inputDir = ".",
  entry: entries = "index",
  subFoldersNames = DEFAULT_DIR_FOLDERS,
  extensions = DEFAULT_EXTENSIONS,
  isValidateJson = true,
}: ValidateAccessInput): ValidationOneEntry | ValidationMulti {
  const parsedDir = parseDir({
    dir: inputDir,
    subFoldersNames,
    extensions,
    isValidateJson,
  });
  console.log("file: index.ts ~ line 267 ~ parsedDir", parsedDir);

  const essentialResult = {
    dir: parsedDir.dir,
    subDir: parsedDir.subDir,
    isJsonValid: parsedDir.isJsonValid,
    isSrc: parsedDir.isSrc,
    srcName: parsedDir.srcName,
  };

  // Discovered file inside dir?
  if (parsedDir.includeValidEntry) {
    return {
      ...essentialResult,
      entry: entries,
      entryDir: "",
      isEntryValid: parsedDir.includeValidEntry,
      ext: parsedDir.ext,
      name: parsedDir.name,
    };
  }

  const parsedEntries: Entry[] = [];

  if (Array.isArray(entries) && entries.length > 0) {
    // parsing entries
    entries.forEach((entry) => {
      parsedEntries.push({ ...parseEntry(entry), isEntryValid: false });
    });
  } else {
    parsedEntries.push({
      ...parseEntry(entries),
      isEntryValid: false,
    });
  }

  for (let i = 0; i < parsedEntries.length; i += 1) {
    const parsedEntry = parsedEntries[i];

    const workingDir = getWorkingDir(
      parsedDir.dir,
      parsedDir.subDir,
      parsedEntry.entryDir
    );

    if (parsedEntry.ext.length === 0) {
      for (let j = 0; j < extensions.length; j += 1) {
        const resolvedPath = path.resolve(
          workingDir,
          `${parsedEntry.name}.${extensions[j]}`
        );

        const isEntryValid = fs.existsSync(resolvedPath);

        if (isEntryValid) {
          parsedEntry.ext = extensions[j];
          parsedEntry.isEntryValid = true;
          break;
        }
      }
    } else {
      const resolvedPath = path.resolve(
        workingDir,
        `${parsedEntry.name}.${parsedEntry.ext}`
      );
      const isEntryValid = fs.existsSync(resolvedPath);

      if (isEntryValid) {
        parsedEntry.isEntryValid = true;
      }
    }
  }

  return {
    ...essentialResult,
    ...(parsedEntries.length === 1
      ? parsedEntries[0]
      : { entries: parsedEntries }),
  };
}

export { validateAccess, parseEntry, parseDir };
