/* eslint-disable import/prefer-default-export */

const fs = require("fs");
const path = require("path");

const DEFAULT_EXTENSIONS: string[] = ["js", "ts"];

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
  isJsonValid: boolean | null;
  isEntryValid: boolean;
  ext: string;
  name: string;
}

interface ParseEntry {
  entry: string;
  entryDir: string;
  ext: string;
  name: string;
}

interface Entry {
  entry: string;
  entryDir: string;
  ext: string;
  name: string;
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

function parseEntry(entry: string): ParseEntry {
  const { ext, name, dir: entryDir } = path.parse(entry);

  return {
    entry,
    entryDir,
    ext: ext.length === 0 ? ext : ext.split(".")[1],
    name,
  };
}

function validateJSON(
  dir: string,
  isValidateJson?: boolean | null
): boolean | null {
  return isValidateJson
    ? fs.existsSync(path.resolve(dir, "package.json"))
    : null;
}

function parseDir(
  inputDir: string,
  srcName: string,
  extensions: string[],
  isValidateJson?: boolean
): ParseDir {
  let dir = ".";
  let subDir = "";
  let ext = "";
  let name = "";

  if (!inputDir || inputDir.length === 0) {
    return {
      dir,
      subDir,
      isJsonValid: validateJSON(".", isValidateJson),
      isSrc: fs.existsSync(path.resolve(".", srcName)),
      isEntryValid: false,
      ext,
      name,
    };
  }

  const {
    dir: extractedDir,
    ext: extractedExt,
    name: extractedName,
  } = path.parse(inputDir);
  console.log(
    "file: index.ts ~ line 91 ~ path.parse(inputDir)",
    path.parse(inputDir)
  );

  let entry;
  let entryDir;

  ({ entry, entryDir, name, ext } = parseEntry(inputDir));
  console.log("file: index.ts ~ line 111 ~ entry", entry);
  console.log("file: index.ts ~ line 111 ~ entryDir", entryDir);

  if (entryDir.length > 0) {
    subDir += ` ${entryDir}`;
    console.log("file: index.ts ~ line 114 ~ subDir", subDir);
  }

  dir = extractedDir;
  ext = extractedExt || "";
  name = extractedName;

  let isEntryValid = false;
  let isSrc = false;

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
      isSrc = fs.existsSync(path.resolve(dir, srcName));
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
    subDir: "",
    isJsonValid: validateJSON(dir, isValidateJson),
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
  extensions = DEFAULT_EXTENSIONS,
}: Input): ValidationOneEntry | ValidationMulti {
  const { isSrc, isJsonValid, dir } = parseDir(
    inputDir,
    srcName,
    extensions,
    isValidateJson
  );

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
    dir,
    isSrc,
    isJsonValid,
    ...(extractedEntries.length === 1
      ? extractedEntries[0]
      : { entries: extractedEntries }),
  };
}

export { validateAccess, parseEntry, parseDir };
