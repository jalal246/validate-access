/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */

/// <reference types="node" />

import fs from "fs";
import path from "path";

// [
//   ".js",
//   ".jsx",
//   ".es6",
//   ".es",
//   ".mjs",
//   ".cjs",
// ]
// const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".es6", ".es", ".mjs"];

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
  dir?: string;
  targetedFolders?: string[];
  extensions?: string[];
  isValidateJson?: boolean;
}

interface ValidateAccessInput extends ParseDirInput {
  entry?: string | string[];
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

function extractSrcFolderFromDir(
  pureDir: string,
  targetedFolders: string[] | string = DEFAULT_DIR_FOLDERS
) {
  let dir = pureDir;
  let subDir = "";
  let isSrc = false;
  let srcName = "";

  const foldersName = Array.isArray(targetedFolders)
    ? targetedFolders
    : [targetedFolders];

  for (let i = 0; i < foldersName.length; i += 1) {
    srcName = foldersName[i];

    // \\lib$|^lib\\|\\lib\\
    const reg = new RegExp(
      `\\${path.sep}${srcName}$|^${srcName}\\${path.sep}|\\${path.sep}${srcName}\\${path.sep}`
    );

    isSrc = reg.test(pureDir);

    if (isSrc) {
      [dir, subDir] = pureDir.split(reg);

      break;
    } else {
      srcName = "";
    }
  }

  return {
    dir,
    subDir,
    isSrc,
    srcName,
  };
}

function validate(dir: string, fName?: string): boolean {
  return fs.existsSync(fName ? path.resolve(dir, fName) : dir);
}

function normalizeInputToArray(input: string | string[]) {
  return Array.isArray(input) ? input : [input];
}

function parseDirIncludesFile(
  dir: string,
  extensions: string | string[] = DEFAULT_EXTENSIONS
) {
  const finalExtensions = normalizeInputToArray(extensions);

  const parsedSubDir = path.parse(dir);

  let includeValidEntry = false;

  if (parsedSubDir.ext.length === 0) {
    // maybe :
    // to/src/b or  to/b or to
    for (let j = 0; j < finalExtensions.length; j += 1) {
      includeValidEntry = validate(`${dir}.${finalExtensions[j]}`);

      if (includeValidEntry) {
        parsedSubDir.ext = finalExtensions[j];

        break;
      }
    }
  } else {
    if (parsedSubDir.ext.includes(".")) {
      [, parsedSubDir.ext] = parsedSubDir.ext.split(".");
    }

    includeValidEntry = includeValidEntry || validate(dir);
  }

  if (!includeValidEntry) {
    parsedSubDir.ext = "";
    parsedSubDir.name = "";
  }

  return {
    includeValidEntry,
    ext: parsedSubDir.ext,
    name: parsedSubDir.name,
  };
}

function parseDir({
  dir: pureDir,
  targetedFolders = DEFAULT_DIR_FOLDERS,
  extensions = DEFAULT_EXTENSIONS,
  isValidateJson = true,
}: ParseDirInput): ParseDirOutput {
  let dir = pureDir;

  if (!dir || dir.length === 0) {
    dir = path.resolve(".", "src");

    const resolvedDirFromSrc = extractSrcFolderFromDir(dir, targetedFolders);

    return {
      isJsonValid: isValidateJson
        ? validate(path.resolve("."), PKG_JSON)
        : null,
      includeValidEntry: false,
      ext: "",
      name: "",
      ...resolvedDirFromSrc,
    };
  }

  dir = path.normalize(dir);

  const parsedDirWithFile = parseDirIncludesFile(dir, extensions);
  const resolvedDirFromSrc = extractSrcFolderFromDir(dir, targetedFolders);

  if (parsedDirWithFile.includeValidEntry) {
    if (
      resolvedDirFromSrc.subDir === parsedDirWithFile.name ||
      parsedDirWithFile.ext.length > 0
    ) {
      resolvedDirFromSrc.subDir = "";
    }
  }

  return {
    isJsonValid: isValidateJson
      ? validate(resolvedDirFromSrc.dir, PKG_JSON)
      : null,
    ...resolvedDirFromSrc,
    ...parsedDirWithFile,
  };
}

function isDirHaSub(dir: string, subDir: string) {
  return (
    subDir.length > 0 &&
    dir.length > 0 &&
    (dir === subDir || path.relative(dir, subDir).length > 0)
  );
}

function getWorkingDir(
  baseDir: string,
  subDir: string,
  entryDir: string,
  srcName: string
): string {
  let upgradeBaseDir = baseDir;

  const isSubDirHasSrc = isDirHaSub(subDir, srcName);
  const isEntryDirHasSrc = isDirHaSub(entryDir, srcName);
  const mustInsetSrc = !isSubDirHasSrc && !isEntryDirHasSrc;

  if (mustInsetSrc) {
    upgradeBaseDir = path.resolve(baseDir, srcName);
  }

  if (subDir.length > 0) {
    return entryDir.length > 0
      ? path.resolve(upgradeBaseDir, subDir, entryDir)
      : path.resolve(upgradeBaseDir, subDir);
  }

  return entryDir.length > 0
    ? path.resolve(upgradeBaseDir, entryDir)
    : upgradeBaseDir;
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

function validateAccess({
  dir: inputDir,
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
      entry: Array.isArray(entries) ? entries[0] : entries,
      entryDir: "",
      isEntryValid: parsedDir.includeValidEntry,
      ext: parsedDir.ext,
      name: parsedDir.name,
    };
  }

  const parsedEntries: Entry[] = [];

  if (Array.isArray(entries)) {
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
      parsedEntry.entryDir,
      parsedDir.srcName
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

export {
  validateAccess,
  extractSrcFolderFromDir,
  parseDirIncludesFile,
  parseEntry,
  parseDir,
};
