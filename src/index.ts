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

interface Entry {
  entry: string;
  isEntryValid: boolean;
  entryExt: string;
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

function isEntryFileValid(
  dir: string,
  entry: string,
  isSrc: boolean,
  srcName: string
): boolean {
  // check if exists. Maybe the format is failed but not exist.
  let isValid = fs.existsSync(path.resolve(dir, entry));

  // Still invalid? maybe source.
  if (!isValid) {
    if (isSrc && (!dir.includes(srcName) || !entry.includes(srcName))) {
      isValid = fs.existsSync(path.resolve(dir, srcName, entry));
    }
  }

  return isValid;
}

function isFileHasExt(entry: string): boolean {
  return entry.includes(".");
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

  for (let i = 0; i < extensions.length; i += 1) {
    entryExt = extensions[i];

    isEntryValid = entry
      ? fs.existsSync(path.resolve(dir, `${entry}.${entryExt}`))
      : fs.existsSync(`${dir}.${entryExt}`);

    if (isEntryValid) {
      // Covers src/b
      // eslint-disable-next-line no-param-reassign
      ({ name: entry } = path.parse(entry ? path.resolve(dir, entry) : dir));

      break;
    }

    // reset
    entryExt = "";
  }

  // @ts-expect-error
  return { entry, entryExt, isEntryValid };
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

/**
 * Validates access readability  for `package.json` and project entry if
 * provided.
 */
function validateAccess({
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

  if (inputDir) {
    // if this dir has also the file entry. covering a special case.
    ({ name, ext } = path.parse(inputDir));

    const hasExt = ext.length !== 0;
    const isSrcPathFromDir: boolean = inputDir.length > 0;

    if (hasExt || isSrcPathFromDir) {
      dir = inputDir;

      // if this dir includes Json & src
      result = getSrcWithJsonStatus(dir, srcName, isValidateJson);

      if (hasExt) {
        return Object.assign(result, {
          entry: name,
          isEntryValid: fs.existsSync(dir),
          entryExt: ext.split(".")[1],
        });
      }
      const dirPossibilities = ["index", null];

      if (!inputEntry) {
        for (let i = 0; i < dirPossibilities.length; i += 1) {
          const entryFile = dirPossibilities[i];

          // then, check dir as it's supposed comes with a file include but without
          // extension
          const entry = getEntry(extensions, dir, entryFile);

          if (entry.isEntryValid) {
            return Object.assign(result, entry);
          }
        }
      }
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
  const entries: Entry[] = [];

  let inputEntries: Array<string | null>;

  if (inputEntry) {
    if (typeof inputEntry === "string") {
      inputEntries = [inputEntry];
    } else {
      inputEntries = inputEntry;
    }
  } else {
    // two choice.
    inputEntries = ["index"];
  }

  inputEntries.forEach((entryFile) => {
    let isEntryValid = false;

    // reset
    ext = "";

    // extension is embedded
    if (entryFile && isFileHasExt(entryFile)) {
      ({ name, ext } = getNameWithExt(dir, entryFile));

      // has a valid extension
      if (ext.length !== 0) {
        // check if exists. Maybe the format is failed but not exist.
        isEntryValid = isEntryFileValid(dir, entryFile, result.isSrc, srcName);

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
    ? // @ts-expect-error
      Object.assign(result, entries[0])
    : // @ts-expect-error
      Object.assign(result, { entries });
}

module.exports = {
  validateAccess,
};
