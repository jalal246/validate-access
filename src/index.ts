/* eslint-disable import/prefer-default-export */

const fs = require("fs");
const path = require("path");

const defaultExtensions: string[] = ["js", "ts"];

interface Input {
  dir: ".";
  entry?: string;
  srcName: "src";
  isValidateJson: true;
  extensions: typeof defaultExtensions;
}

interface ParseDir {
  dir: string;
  isSrc: boolean;
  isEntryValid: boolean;
  ext: string;
  name: string;
}

interface Entry {
  entry: string;
  ext: string;
  name: string;
  isEntryValid: boolean;
}

interface ValidationOneEntry extends Entry {
  isJsonValid: boolean | null;
  isSrc: boolean;
}

interface ValidationMulti {
  isJsonValid: boolean | null;
  isSrc: boolean;
  entries: Entry[];
}

/**
 * Check if the file has an extension included.
 *
 * @param entry
 * @param srcName
 */
function hasSrcName(entry: string, srcName: string): boolean {
  return entry.includes(srcName);
}

/**
 * Check if the file has an extension included.
 *
 * @param entry
 */
function isFileHasExt(entry: string): boolean {
  return entry.includes(".");
}

/**
 * Check if the path need src to be inserted.
 *
 * @param dir
 * @param isSrc
 * @param srcName
 * @param entry
 */
function isPathNeedSrc(
  dir: string,
  isSrc: boolean,
  srcName: string,
  entry: string
): boolean {
  return isSrc && (!hasSrcName(dir, srcName) || !hasSrcName(entry, srcName));
}

/**
 * Check for entry files existence. Flat structure or in src folder.
 *
 * @param dir
 * @param entry
 * @param isSrc
 * @param srcName
 */
function isFileExist(
  dir: string,
  entry: string,
  isSrc: boolean,
  srcName: string
) {
  let isFoundInSrc = false;
  // check if exists. Maybe the format is failed but not exist.
  let isValid: boolean = fs.existsSync(path.resolve(dir, entry));

  // Still invalid? maybe source.
  if (!isValid) {
    if (isPathNeedSrc(dir, isSrc, srcName, entry)) {
      isValid = fs.existsSync(path.resolve(dir, srcName, entry));
      isFoundInSrc = isValid;
    }
  }

  return { isValid, isFoundInSrc };
}

function getNameWithExt(
  dir: string,
  entry: string
): { name: string; ext: string } {
  const { name, ext } = path.parse(path.resolve(dir, entry));

  return { name, ext };
}

function getEntry(
  extensions: string[],
  dir: string,
  entry: string | null
): Entry {
  let isEntryValid = false;
  let entryExt = "";
  let entryFile = entry || dir;

  for (let i = 0; i < extensions.length; i += 1) {
    entryExt = extensions[i];

    let fileName;
    let resolvedPath;

    if (entry) {
      fileName = `${entry}.${entryExt}`;
      resolvedPath = path.resolve(dir, fileName);
    } else {
      fileName = `${dir}.${entryExt}`;
      resolvedPath = fileName;
    }

    isEntryValid = fs.existsSync(resolvedPath);

    if (isEntryValid) {
      // Covers src/b
      ({ name: entryFile } = path.parse(resolvedPath));

      break;
    }

    // reset
    entryExt = "";
  }

  return { entry: entryFile, entryExt, isEntryValid };
}

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

function parseDir(
  inputDir: string,
  srcName: string,
  extensions: string[]
): ParseDir {
  if (!inputDir || inputDir.length === 0) {
    return {
      dir: ".",
      isSrc: fs.existsSync(path.resolve(".", srcName)),
      isEntryValid: false,
      ext: "",
      name: "",
    };
  }

  const {
    dir: extractedDir,
    ext: extractedExt,
    name: extractedName,
  } = path.parse(inputDir);

  let dir = extractedDir;
  let isSrc = false;
  let isEntryValid = false;
  let ext = extractedExt || "";
  let name = extractedName;

  const secondCheck = path.parse(extractedDir);
  if (secondCheck.base === srcName) {
    isSrc = true;
    dir = secondCheck.dir;
  } else {
    name = "";
  }

  if (extractedExt.length > 0) {
    isEntryValid = fs.existsSync(inputDir);
    [, ext] = ext.split(".");
  } else {
    // we can't know this earlier we have to check extension first.
    const isGivenDirValid = fs.existsSync(inputDir);

    if (isGivenDirValid) {
      dir = inputDir;
    }

    for (let j = 0; j < extensions.length; j += 1) {
      isEntryValid = fs.existsSync(`${extractedDir}.${extensions[j]}`);

      if (isEntryValid) {
        ext = extensions[j];
        break;
      }
    }
  }

  const result = {
    dir,
    isSrc,
    isEntryValid,
    ext,
    name,
  };

  return result;
}

function validateAccess({
  dir: inputDir,
  entry: entries,
  srcName = "src",
  isValidateJson = true,
  extensions = defaultExtensions,
}: Input): ValidationOneEntry | ValidationMulti {
  const { isSrc, dir } = parseDir(inputDir, srcName, extensions);

  const extractedEntries: Entry[] = [];

  if (entries) {
    if (Array.isArray(entries) && entries.length > 0) {
      // parsing entries
      entries.forEach((entry) => {
        const { ext, name } = path.parse(entry);

        extractedEntries.push({
          entry,
          ext: ext.length === 0 ? ext : ext.split(".")[1],
          name,
          isEntryValid: false,
        });
      });
    } else if (entries.length > 0) {
      const { ext, name } = path.parse(entries);

      extractedEntries.push({
        entry: entries,
        ext: ext.length === 0 ? ext : ext.split(".")[1],
        name,
        isEntryValid: false,
      });
    }
  } else {
    extractedEntries.push({
      entry: "",
      ext: "",
      name: "index",
      isEntryValid: false,
    });
  }

  const pathWithSrc = isSrc ? path.resolve(dir, srcName) : dir;

  for (let i = 0; i < extractedEntries.length; i += 1) {
    const { name, ext } = extractedEntries[i];

    if (ext.length === 0) {
      for (let j = 0; j < extensions.length; j += 1) {
        const resolvedPath = path.resolve(
          pathWithSrc,
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
      const resolvedPath = path.resolve(pathWithSrc, `${name}.${ext}`);
      const isEntryValid = fs.existsSync(resolvedPath);

      if (isEntryValid) {
        extractedEntries[i].isEntryValid = true;
      }
    }
  }

  return {
    isSrc,
    isJsonValid: isValidateJson
      ? fs.existsSync(path.resolve(dir, "package.json"))
      : null,
    ...(extractedEntries.length === 1
      ? extractedEntries[0]
      : { entries: extractedEntries }),
  };
}

/**
 * Validates access readability  for `package.json` and project entry if
 * provided.
 */
function validateAccessDraft({
  dir: inputDir,
  entry: inputEntry,
  srcName = "src",
  isValidateJson = true,
  extensions = defaultExtensions,
}: Input): ValidationOneEntry | ValidationMulti {
  let result: ReturnType<typeof getSrcWithJsonStatus>;

  let dir: string;
  let name: string;
  let ext: string;

  if (!inputDir || inputDir.length === 0) {
    // no directory, then look into the root as a default.
    dir = ".";

    result = getSrcWithJsonStatus(dir, srcName, isValidateJson);

    if (result.isSrc) {
      dir = path.resolve(dir, srcName);
    }

    const entry = checkExistenceInDir(
      extensions,
      dir,
      srcName,
      result.isSrc,
      inputEntry
    );

    if (Array.isArray(entry)) {
      return Object.assign(result, { entries: entry });
    }

    if (entry.isEntryValid) {
      return Object.assign(result, entry);
    }
  } else {
    dir = inputDir;

    // if this dir has also the file entry. covering a special case.
    ({ name, ext } = path.parse(inputDir));

    // if this dir includes Json & src
    result = getSrcWithJsonStatus(dir, srcName, isValidateJson);

    if (ext.length !== 0) {
      return Object.assign(result, {
        entry: name,
        isEntryValid: fs.existsSync(inputDir),
        entryExt: ext.split(".")[1],
      });
    }

    if (!inputEntry || inputEntry.length === 0) {
      const entry = checkExistenceInDir(
        extensions,
        dir,
        srcName,
        result.isSrc,
        inputEntry
      );

      if (entry.isEntryValid) {
        return Object.assign(result, entry);
      }
    }
  }

  // output entries
  const entries: Entry[] = [];

  let inputEntries: Array<string>;

  if (inputEntry) {
    if (typeof inputEntry === "string") {
      inputEntries = [inputEntry];
    } else {
      inputEntries = inputEntry;
    }
  } else {
    inputEntries = ["index"];
    // two choice.
  }

  inputEntries.forEach((entryFile) => {
    let isEntryValid = false;

    // reset
    ext = "";

    // extension is embedded
    if (isFileHasExt(entryFile)) {
      ({ name, ext } = getNameWithExt(dir, entryFile));

      // has a valid extension
      if (ext.length !== 0) {
        // check if exists. Maybe the format is failed but not exist.
        ({ isValid: isEntryValid } = isFileExist(
          dir,
          entryFile,
          result.isSrc,
          srcName
        ));

        [, ext] = ext.split(".");
      }

      entries.push({
        entry: name,
        entryExt: ext,
        isEntryValid,
      });
    } else {
      const entry = getEntry(extensions, dir, entryFile);

      entries.push(entry);
    }
  });

  return entries.length === 1
    ? Object.assign(result, entries[0])
    : Object.assign(result, { entries });
}

export { validateAccess };
