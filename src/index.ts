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
  targetedFolders?: string | string[];
  extensions?: string | string[];
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

function normalizeInputToArray(input: string | string[]) {
  return Array.isArray(input) ? input : [input];
}

function validate(dir: string, fName?: string): boolean {
  return fs.existsSync(fName ? path.resolve(dir, fName) : dir);
}

function extractSrcFolderFromDir(
  pureDir: string,
  targetedFolders: string[] | string = DEFAULT_DIR_FOLDERS
) {
  let dir = pureDir;
  let subDir = "";
  let isSrc = false;
  let srcName = "";

  const foldersName = normalizeInputToArray(targetedFolders);

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

function lookupSrcFolderFromDir(
  dir: string,
  targetedFolders: string[] | string = DEFAULT_DIR_FOLDERS
) {
  const finalTargetedFolders = normalizeInputToArray(targetedFolders);

  let isSrc = false;
  let srcName = "";

  for (let i = 0; i < finalTargetedFolders.length; i += 1) {
    isSrc = validate(dir, finalTargetedFolders[i]);

    if (isSrc) {
      srcName = finalTargetedFolders[i];
      break;
    }
  }

  return { isSrc, srcName };
}

function lookupExtFromDir(
  dir: string,
  extensions: string[] | string = DEFAULT_EXTENSIONS
) {
  const finalExts = normalizeInputToArray(extensions);

  let isEntryValid = false;
  let ext = "";

  for (let i = 0; i < finalExts.length; i += 1) {
    isEntryValid = validate(`${dir}.${finalExts[i]}`);

    if (isEntryValid) {
      ext = finalExts[i];
      break;
    }
  }

  return { isEntryValid, ext };
}

function parseDirIncludesFile(
  dir: string,
  extensions: string | string[] = DEFAULT_EXTENSIONS
) {
  const parsedSubDir = path.parse(dir);

  let includeValidEntry = false;

  if (parsedSubDir.ext.length === 0) {
    // maybe :
    // to/src/b or  to/b or to
    ({
      isEntryValid: includeValidEntry,
      ext: parsedSubDir.ext,
    } = lookupExtFromDir(dir, extensions));
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

interface resolveConflictedDirInput {
  dir: string;
  subDir: string;
  isSrc: boolean;
  srcName: string;
}

function resolveConflictedDir(
  mainDir: resolveConflictedDirInput,
  dirBranch: resolveConflictedDirInput,
  targetedFolders: string[] | string = DEFAULT_DIR_FOLDERS
) {
  const dirObj = mainDir;
  const entryObj = dirBranch;

  if (entryObj.isSrc) {
    if (!dirObj.isSrc) {
      dirObj.isSrc = true;
      dirObj.srcName = entryObj.srcName;

      if (dirObj.subDir.length === 0) {
        dirObj.subDir = entryObj.subDir;
      } else {
        dirObj.subDir += path.sep + entryObj.subDir;
      }
      entryObj.subDir = "";

      return { dir: dirObj, entry: entryObj };
    }

    if (entryObj.srcName === dirObj.srcName) {
      entryObj.isSrc = false;
      entryObj.srcName = "";

      return { dir: dirObj, entry: entryObj };
    }

    dirObj.srcName += path.sep + entryObj.srcName;
    dirObj.subDir += path.sep + entryObj.subDir;

    entryObj.isSrc = false;
    entryObj.srcName = "";
    entryObj.subDir = "";

    return { dir: dirObj, entry: entryObj };
  }

  if (!dirObj.isSrc) {
    ({ isSrc: dirObj.isSrc, srcName: dirObj.srcName } = lookupSrcFolderFromDir(
      dirObj.dir,
      targetedFolders
    ));
  }

  return { dir: dirObj, entry: entryObj };
}

function parseDir({
  dir: pureDir,
  targetedFolders = DEFAULT_DIR_FOLDERS,
  extensions = DEFAULT_EXTENSIONS,
  isValidateJson = true,
}: ParseDirInput): ParseDirOutput {
  let dir = pureDir;

  if (!dir || dir.length === 0) {
    dir = path.resolve(".");

    const lookupSrcResult = lookupSrcFolderFromDir(dir, targetedFolders);

    return {
      dir,
      subDir: "",
      isJsonValid: isValidateJson
        ? validate(path.resolve("."), PKG_JSON)
        : null,
      includeValidEntry: false,
      ext: "",
      name: "",
      ...lookupSrcResult,
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

function validateAccess({
  dir: inputDir,
  entry: entries = "index",
  targetedFolders = DEFAULT_DIR_FOLDERS,
  extensions = DEFAULT_EXTENSIONS,
  isValidateJson = true,
}: ValidateAccessInput): ValidationOneEntry | ValidationMulti {
  const parsedDir = parseDir({
    dir: inputDir,
    targetedFolders,
    extensions,
    isValidateJson,
  });

  const finalEntries = normalizeInputToArray(entries);

  const { includeValidEntry, ...restDirInfo } = parsedDir;

  // Discovered file inside dir?
  if (includeValidEntry) {
    return {
      entry: finalEntries[0],
      entryDir: "",
      isEntryValid: includeValidEntry,
      ...restDirInfo,
    };
  }

  const { name, ext, isJsonValid, ...resolvedDirWithSrc } = restDirInfo;

  // parsing entries
  const results = finalEntries.map((entry) => {
    const parsedEntry = path.parse(entry);

    let resolvedEntryFromSrc = extractSrcFolderFromDir(entry, targetedFolders);

    ({
      dir: resolvedEntryFromSrc,
      entry: resolvedEntryFromSrc,
    } = resolveConflictedDir(
      resolvedDirWithSrc,
      resolvedEntryFromSrc,
      targetedFolders
    ));

    const workingDir = getWorkingDir(
      resolvedDirWithSrc.dir,
      resolvedDirWithSrc.subDir,
      resolvedEntryFromSrc.subDir,
      resolvedDirWithSrc.srcName
    );

    let isEntryValid = false;

    if (parsedEntry.ext.length > 0) {
      [, parsedEntry.ext] = parsedEntry.ext.split(".");

      const resolvedPath = path.resolve(
        workingDir,
        `${parsedEntry.name}.${parsedEntry.ext}`
      );

      isEntryValid = fs.existsSync(resolvedPath);
    } else {
      for (let j = 0; j < extensions.length; j += 1) {
        const resolvedPath = path.resolve(
          workingDir,
          `${parsedEntry.name}.${extensions[j]}`
        );

        isEntryValid = fs.existsSync(resolvedPath);

        if (isEntryValid) {
          parsedEntry.ext = extensions[j];
          break;
        }
      }
    }

    const hasEntryDir = resolvedEntryFromSrc.subDir.length > 0;

    return {
      isEntryValid,
      entry: hasEntryDir ? resolvedEntryFromSrc.dir : entry,
      entryDir: resolvedEntryFromSrc.subDir,
      name: parsedEntry.name,
      ext: parsedEntry.ext,
    };
  });

  return {
    isJsonValid,
    ...resolvedDirWithSrc,
    ...(results.length === 1 ? results[0] : { entries: results }),
  };
}

export {
  validateAccess,
  extractSrcFolderFromDir,
  parseDirIncludesFile,
  parseDir,
};
