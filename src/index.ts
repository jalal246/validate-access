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
    dir,
    isSrc,
    isJsonValid: isValidateJson
      ? fs.existsSync(path.resolve(dir, "package.json"))
      : null,
    ...(extractedEntries.length === 1
      ? extractedEntries[0]
      : { entries: extractedEntries }),
  };
}

export { validateAccess };
