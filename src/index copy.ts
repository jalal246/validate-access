// const fs = require("fs");
// const path = require("path");

// interface Input {
//   dir: ".";
//   entry: "index";
//   srcName: "src";
//   isValidateJson: true;
//   extensions: typeof defaultExtensions;
// }

// interface Entry {
//   entry: string;
//   isEntryValid: boolean;
//   entryExt: string;
// }

// interface ValidationOneEntry extends Entry {
//   isJsonValid: boolean | null;
//   isSrc: boolean;
// }

// interface ValidationMulti {
//   isJsonValid: boolean | null;
//   isSrc: boolean;
//   entries: Entry[];
// }

// function isEntryFileValid(
//   dir: string,
//   entry: string,
//   isSrc: boolean,
//   srcName: string
// ): boolean {
//   // check if exists. Maybe the format is failed but not exist.
//   let isValid = fs.existsSync(path.resolve(dir, entry));

//   // Still invalid? maybe source.
//   if (!isValid) {
//     if (isSrc && (!dir.includes(srcName) || !entry.includes(srcName))) {
//       isValid = fs.existsSync(path.resolve(dir, srcName, entry));
//     }
//   }

//   return isValid;
// }

// function isFileHasExt(entry: string): boolean {
//   return entry.includes(".");
// }

// function getNameWithExt(
//   dir: string,
//   entry: string
// ): { name: string; ext: string } {
//   const { name, ext } = path.parse(path.resolve(dir, entry));

//   return { name, ext };
// }

// function getEntry(extensions: string[], dir: string, entry: string): Entry {
//   let isEntryValid = false;
//   let entryExt = "";

//   for (let i = 0; i < extensions.length; i += 1) {
//     entryExt = extensions[i];

//     isEntryValid = fs.existsSync(path.resolve(dir, `${entry}.${entryExt}`));

//     if (isEntryValid) {
//       // Covers src/b
//       ({ name: entry } = path.parse(path.resolve(dir, entry)));
//       break;
//     }

//     // reset
//     entryExt = "";
//   }

//   return { entry, entryExt, isEntryValid };
// }

// function getSrcWithJsonStatus(
//   dir: string,
//   srcName: string,
//   isValidateJson: boolean
// ): { isSrc: boolean; isJsonValid: boolean | null } {
//   return {
//     isSrc: fs.existsSync(path.resolve(dir, srcName)),
//     isJsonValid: isValidateJson
//       ? fs.existsSync(path.resolve(dir, "package.json"))
//       : null,
//   };
// }

// const defaultExtensions: string[] = ["js", "ts"];

// /**
//  * Validates access readability  for `package.json` and project entry if
//  * provided.
//  */
// function validateAccess({
//   dir: inputDir,
//   entry: inputEntry = "index",
//   srcName = "src",
//   isValidateJson = true,
//   extensions = defaultExtensions,
// }: Input): ValidationOneEntry | ValidationMulti {
//   let result: ReturnType<typeof getSrcWithJsonStatus>;

//   let dir: string;
//   let name: string;
//   let ext: string;
//   let base: string;

//   // if this dir has also the file entry. covering a special case.
//   ({ name, ext, base } = path.parse(inputDir));
//   console.log(
//     "file: index.ts ~ line 118 ~ name, ext, base",
//     path.parse(inputDir)
//   );

//   const hasExt = ext.length !== 0;

//   const isSrcPathFromDir: boolean = inputDir.length > 0;

//   if (hasExt || isSrcPathFromDir) {
//     dir = inputDir;

//     // if this dir includes Json & src
//     result = getSrcWithJsonStatus(dir, srcName, isValidateJson);

//     if (hasExt) {
//       return Object.assign(result, {
//         entry: name,
//         isEntryValid: true,
//         entryExt: ext.split(".")[1],
//       });
//     }
//   } else {
//     // no directory, then look into the root as a default.
//     dir = ".";

//     result = getSrcWithJsonStatus(dir, srcName, isValidateJson);

//     if (result.isSrc) {
//       dir = path.resolve(dir, srcName);
//     }
//   }

//   // output entries
//   const entries: Entry[] = [];

//   let inputEntries: Array<string>;

//   if (typeof inputEntry === "string") {
//     inputEntries = [inputEntry];
//   } else {
//     inputEntries = inputEntry;
//   }

//   inputEntries.forEach((entryFile) => {
//     let isEntryValid = false;

//     // reset
//     ext = "";

//     // extension is embedded
//     if (entryFile && isFileHasExt(entryFile)) {
//       ({ name, ext } = getNameWithExt(dir, entryFile));

//       // has a valid extension
//       if (ext.length !== 0) {
//         // check if exists. Maybe the format is failed but not exist.
//         isEntryValid = isEntryFileValid(dir, entryFile, result.isSrc, srcName);

//         [, ext] = ext.split(".");
//       }

//       entries.push({
//         entry: name,
//         entryExt: ext,
//         isEntryValid,
//       });
//     } else {
//       const entry = getEntry(extensions, dir, entryFile);

//       entries.push(entry);
//     }
//   });

//   return entries.length === 1
//     ? Object.assign(result, entries[0])
//     : Object.assign(result, { entries });
// }

// module.exports = {
//   validateAccess,
// };
