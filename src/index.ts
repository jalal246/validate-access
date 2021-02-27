/// <reference types="node" />

import fs from "fs";
import path from "path";

const DEFAULT_EXTENSIONS: string[] = ["js", "ts", "jsx", "tsx"];
const DEFAULT_DIR_FOLDERS: string[] = ["src", "lib", "dist"];
const PKG_JSON = "package.json";

interface ParseDirOutput {
  dir: string;
  subDir: string;
  srcName: string;
  includeValidEntry: boolean;
  ext: string;
  name: string;
}

interface ParseDirInput {
  dir?: string;
  targetedFolders?: string | string[];
  extensions?: string | string[];
  isEnforceSub?: boolean;
  isEnforceSrcLookup?: boolean;
}

interface ValidateAccessInput extends ParseDirInput {
  isValidateJson?: boolean;
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
  srcName: string;
}

interface ValidationMulti {
  dir: string;
  isJsonValid: boolean | null;
  entries: Entry[];
}

function normalizeInputToArray(input: string | string[]) {
  return Array.isArray(input) ? input : [input];
}

function validate(dir: string, fName?: string): boolean {
  return fs.existsSync(fName ? path.resolve(dir, fName) : dir);
}

function isFile(foo: string) {
  return path.parse(foo).ext.length > 0;
}

/**
 * TODO:
 *
 * @param pureDir
 * @param foldersName
 */
function lookupSrcInDir(pureDir: string, targetedFolders: string | string[]) {
  const foldersName = normalizeInputToArray(targetedFolders);

  let srcName = "";
  let reg;

  for (let i = 0; i < foldersName.length; i += 1) {
    srcName = foldersName[i];

    // is there a better approach? if so, there's a PR waiting for you!
    // \\lib$|^lib\\|\\lib\\
    reg = new RegExp(
      `\\${path.sep}${srcName}$|^${srcName}\\${path.sep}|\\${path.sep}${srcName}\\${path.sep}`
    );

    const isSrc = reg.test(pureDir);

    if (isSrc) break;

    srcName = "";
  }

  return { srcName, reg };
}

/**
 * Parse a given directory without validation.
 *
 * @param pureDir
 * @param targetedFolders
 * @param isEnforceSub
 */
function parseDir(
  pureDir: string,
  targetedFolders: string[] | string = DEFAULT_DIR_FOLDERS,
  isEnforceSub: boolean = true
) {
  let dir = path.normalize(pureDir);

  const lookForSrcRes = lookupSrcInDir(dir, targetedFolders);

  let subDir = "";
  let filename = "";
  const { srcName } = lookForSrcRes;

  if (srcName.length > 0) {
    // TODO: fix it.
    // @ts-expect-error
    [dir, subDir = ""] = pureDir.split(lookForSrcRes.reg);

    if (isFile(subDir)) {
      // does this file had any additional sub?
      const parsedSub = path.parse(subDir);
      filename = parsedSub.dir.length === 0 ? subDir : parsedSub.base;
      subDir = parsedSub.dir;
    }

    if (subDir.length === 0) {
      subDir = srcName;
    } else {
      subDir = srcName + path.sep + subDir;
    }
  } else {
    const parsedDir = path.parse(dir);

    if (isFile(parsedDir.base)) {
      filename = parsedDir.base;

      const parsedForSub = path.parse(parsedDir.dir);

      subDir = parsedForSub.base;
      dir = parsedForSub.dir;
    } else if (isEnforceSub) {
      subDir = parsedDir.base;
      dir = parsedDir.dir;
    }
  }

  return {
    dir,
    subDir,
    filename,
    srcName,
  };
}

/**
 * Returns a valid src folder name for given root directory. If nothing found,
 * it returns empty string.
 *
 * @param dir
 * @param targetedFolders
 */
function searchForSrcFolderInDir(
  dir: string,
  targetedFolders: string[] | string = DEFAULT_DIR_FOLDERS
) {
  const finalTargetedFolders = normalizeInputToArray(targetedFolders);

  let srcName = "";

  for (let i = 0; i < finalTargetedFolders.length; i += 1) {
    const isSrc = validate(dir, finalTargetedFolders[i]);

    if (isSrc) {
      srcName = finalTargetedFolders[i];
      break;
    }
  }

  return srcName;
}

/**
 * Returns a valid extension for given directory has a file name with a missing
 * extension. If nothing found, it returns empty string.
 *
 * @param dir
 * @param extensions
 */
function searchForExtInDir(
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

  return ext;
}

/**
 * Returns a valid file name with an extension for given directory even if the
 * directory is missing file name extension. Accept dir with a missing extension.
 *
 * @param dir
 * @param extensions
 */
function detectFileInDir(
  dir: string,
  extensions: string | string[] = DEFAULT_EXTENSIONS
) {
  const parsedSubDir = path.parse(dir);
  let isInsertExt = false;

  let includeValidEntry = false;

  if (parsedSubDir.ext.length === 0) {
    // maybe :
    // to/src/b or  to/b or to
    parsedSubDir.ext = searchForExtInDir(dir, extensions);
    isInsertExt = parsedSubDir.ext.length > 0;

    if (!isInsertExt) {
      return {
        includeValidEntry: false,
        ext: "",
        name: "",
      };
    }

    includeValidEntry = validate(`${dir}.${parsedSubDir.ext}`);
  } else if (parsedSubDir.ext.includes(".")) {
    [, parsedSubDir.ext] = parsedSubDir.ext.split(".");

    includeValidEntry = validate(dir);
  }

  return {
    includeValidEntry,
    ext: parsedSubDir.ext,
    name: parsedSubDir.name,
  };
}

/**
 *
 * @param ParseDirInput
 */
function parseAndValidateDir({
  dir: pureDir,
  targetedFolders = DEFAULT_DIR_FOLDERS,
  extensions = DEFAULT_EXTENSIONS,
  isEnforceSub = true,
  isEnforceSrcLookup = true,
}: ParseDirInput): ParseDirOutput {
  let dir = pureDir;

  if (!dir || dir.length === 0) {
    dir = path.resolve(".");

    const srcName = searchForSrcFolderInDir(dir, targetedFolders);

    return {
      dir,
      subDir: "",
      includeValidEntry: false,
      ext: "",
      name: "",
      srcName,
    };
  }

  dir = path.normalize(dir);

  const parsedDirWithValidFile = detectFileInDir(dir, extensions);

  const { filename, ...resolvedDirFromSrc } = parseDir(
    dir,
    targetedFolders,
    isEnforceSub
  );

  if (resolvedDirFromSrc.srcName.length === 0 && isEnforceSrcLookup) {
    resolvedDirFromSrc.srcName = searchForSrcFolderInDir(dir, targetedFolders);
  }

  if (parsedDirWithValidFile.includeValidEntry) {
    if (resolvedDirFromSrc.subDir.length === 0) {
      const parsedDirWithoutFile = path.parse(resolvedDirFromSrc.dir);
      resolvedDirFromSrc.dir = parsedDirWithoutFile.dir;
    } else if (resolvedDirFromSrc.subDir === parsedDirWithValidFile.name) {
      const parsedDirWithoutFile = path.parse(resolvedDirFromSrc.dir);
      resolvedDirFromSrc.dir = parsedDirWithoutFile.dir;
      resolvedDirFromSrc.subDir = parsedDirWithoutFile.base;
    }

    if (filename.length === 0) {
      if (
        resolvedDirFromSrc.srcName.length > 0 &&
        resolvedDirFromSrc.subDir.includes(resolvedDirFromSrc.srcName)
      ) {
        resolvedDirFromSrc.subDir = resolvedDirFromSrc.srcName;
      }
    }
  }

  return {
    ...resolvedDirFromSrc,
    ...parsedDirWithValidFile,
  };
}

// interface resolveConflictedDirInput {
//   dir: string;
//   subDir: string;
//   isSrc: boolean;
//   srcName: string;
// }

// function resolveConflictedDir(
//   mainDir: resolveConflictedDirInput,
//   dirBranch: resolveConflictedDirInput,
//   targetedFolders: string[] | string = DEFAULT_DIR_FOLDERS
// ) {
//   const dirObj = mainDir;
//   const entryObj = dirBranch;

//   if (entryObj.isSrc) {
//     if (!dirObj.isSrc) {
//       dirObj.isSrc = true;
//       dirObj.srcName = entryObj.srcName;

//       if (dirObj.subDir.length === 0) {
//         dirObj.subDir = entryObj.subDir;
//       } else {
//         dirObj.subDir += path.sep + entryObj.subDir;
//       }
//       entryObj.subDir = "";

//       return { dir: dirObj, entry: entryObj };
//     }

//     if (entryObj.srcName === dirObj.srcName) {
//       entryObj.isSrc = false;
//       entryObj.srcName = "";

//       return { dir: dirObj, entry: entryObj };
//     }

//     dirObj.srcName += path.sep + entryObj.srcName;
//     dirObj.subDir += path.sep + entryObj.subDir;

//     entryObj.isSrc = false;
//     entryObj.srcName = "";
//     entryObj.subDir = "";

//     return { dir: dirObj, entry: entryObj };
//   }

//   if (!dirObj.isSrc) {
//     ({ isSrc: dirObj.isSrc, srcName: dirObj.srcName } = searchForSrcFolderInDir(
//       dirObj.dir,
//       targetedFolders
//     ));
//   }

//   return { dir: dirObj, entry: entryObj };
// }

function isDirHaSub(dir: string, subDir: string) {
  return (
    subDir.length > 0 &&
    dir.length > 0 &&
    !isFile(dir) &&
    !isFile(subDir) &&
    (dir === subDir || path.isAbsolute(path.relative(dir, subDir)))
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
  const parsedDir = parseAndValidateDir({
    dir: inputDir,
    targetedFolders,
    extensions,
    isEnforceSub: false,
  });

  const finalEntries = normalizeInputToArray(entries);

  const { includeValidEntry, ...restDirInfo } = parsedDir;

  // Discovered file inside dir?
  if (restDirInfo.ext.length > 0) {
    return {
      isJsonValid: isValidateJson ? validate(restDirInfo.dir, PKG_JSON) : null,
      ...restDirInfo,
      entry: finalEntries[0],
      entryDir: "",
      isEntryValid: includeValidEntry,
    };
  }

  const resolvedDir = {
    dir: restDirInfo.dir,
    subDir: restDirInfo.subDir,
    srcName: restDirInfo.srcName,
  };

  // parsing entries
  const results: Entry[] = finalEntries.map((pureEntry) => {
    const entry = path.normalize(pureEntry);

    const parsedEntry = path.parse(entry);

    const resolvedEntryFromSrc = parseDir(entry, targetedFolders);

    const workingDir = getWorkingDir(
      resolvedDir.dir,
      resolvedDir.subDir,
      resolvedEntryFromSrc.dir,
      resolvedDir.srcName
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

          if (resolvedEntryFromSrc.subDir === parsedEntry.name) {
            resolvedEntryFromSrc.subDir = "";
          }

          break;
        }
      }
    }

    // const hasEntryDir = resolvedEntryFromSrc.subDir.length > 0;

    return {
      isEntryValid,
      entry: pureEntry,
      entryDir: parsedEntry.dir,
      name: parsedEntry.name,
      ext: parsedEntry.ext,
    };
  });

  return {
    dir: restDirInfo.dir,
    subDir: restDirInfo.subDir,
    srcName: restDirInfo.srcName,
    isJsonValid: isValidateJson ? validate(restDirInfo.dir, PKG_JSON) : null,
    ...(results.length === 1 ? results[0] : { entries: results }),
  };
}

export { validateAccess, parseDir, detectFileInDir, parseAndValidateDir };
