// // @ts-check

// const { expect } = require("chai");
// const { resolve, sep } = require("path");

// const { validateAccess } = require("../lib");

// const source = resolve(__dirname, "fixtures");

// describe("Validate Access", () => {
//   describe("Just entry", () => {
//     it("Default args", () => {
//       const res = validateAccess({});

//       expect(res).to.deep.equal({
//         dir: resolve("."),
//         subDir: "",
//         entry: "index",
//         entryDir: "",
//         isJsonValid: true,
//         srcName: "src",
//         isEntryValid: true,
//         name: "index",
//         ext: "ts",
//       });
//     });

//     it("One entry without extension", () => {
//       const entry = "index";
//       const res = validateAccess({ entry });

//       expect(res).to.deep.equal({
//         dir: resolve("."),
//         subDir: "",
//         entry,
//         entryDir: "",
//         isJsonValid: true,
//         srcName: "src",
//         isEntryValid: true,
//         name: "index",
//         ext: "ts",
//       });
//     });

//     it("One entry without extension inside an array", () => {
//       const entry = "index";
//       const res = validateAccess({ entry: [entry] });

//       expect(res).to.deep.equal({
//         dir: resolve("."),
//         subDir: "",
//         entry,
//         entryDir: "",
//         isJsonValid: true,
//         srcName: "src",
//         isEntryValid: true,
//         name: "index",
//         ext: "ts",
//       });
//     });

//     it("Entry with entry dir without extension", () => {
//       const entry = "src/index";
//       const res = validateAccess({ entry });

//       expect(res).to.deep.equal({
//         dir: resolve("."),
//         subDir: "",
//         entry,
//         entryDir: "src",
//         isJsonValid: true,
//         srcName: "src",
//         isEntryValid: true,
//         name: "index",
//         ext: "ts",
//       });
//     });

//     it("Entry with entry dir and extension", () => {
//       const entry = "src/index.ts";
//       const res = validateAccess({ entry });

//       expect(res).to.deep.equal({
//         dir: resolve("."),
//         subDir: "",
//         entry,
//         entryDir: "src",
//         isJsonValid: true,
//         srcName: "src",
//         isEntryValid: true,
//         name: "index",
//         ext: "ts",
//       });
//     });

//     it("Invalid entry with entry dir and extension", () => {
//       const entry = "src/index.js";
//       const res = validateAccess({ entry });

//       expect(res).to.deep.equal({
//         dir: resolve("."),
//         subDir: "",
//         entry,
//         entryDir: "src",
//         isJsonValid: true,
//         srcName: "src",
//         isEntryValid: false,
//         name: "index",
//         ext: "js",
//       });
//     });

//     it("Entry with invalid entry dir and extension", () => {
//       const entry = "noop/index.js";
//       const res = validateAccess({ entry });

//       expect(res).to.deep.equal({
//         dir: resolve("."),
//         subDir: "",
//         entry,
//         entryDir: "noop",
//         isJsonValid: true,
//         srcName: "src",
//         isEntryValid: false,
//         name: "index",
//         ext: "js",
//       });
//     });

//     it("Multiple entries", () => {
//       const res = validateAccess({
//         entry: ["a.js", "index", "src/index", "src/index.js"],
//       });

//       expect(res).to.deep.equal({
//         dir: resolve("."),
//         subDir: "",
//         isJsonValid: true,
//         srcName: "src",

//         entries: [
//           {
//             entry: "a.js",
//             entryDir: "",
//             name: "a",
//             isEntryValid: false,
//             ext: "js",
//           },
//           {
//             entry: "index",
//             entryDir: "",
//             name: "index",
//             isEntryValid: true,
//             ext: "ts",
//           },
//           {
//             entry: "src/index",
//             entryDir: "src",
//             name: "index",
//             isEntryValid: true,
//             ext: "ts",
//           },
//           {
//             entry: "src/index.js",
//             entryDir: "src",
//             name: "index",
//             isEntryValid: false,
//             ext: "js",
//           },
//         ],
//       });
//     });
//   });

//   describe("Just directory", () => {
//     it.only("Directory with no valid files and folders", () => {
//       const filePath = resolve(source, "valid-json");

//       const res = validateAccess({ dir: filePath });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "valid-json",
//         isJsonValid: true,
//         srcName: "",
//         entry: "index",
//         entryDir: "",
//         name: "index",
//         isEntryValid: false,
//         ext: "",
//       });
//     });

//     it("Directory with a valid files no folders", () => {
//       const filePath = resolve(source, "valid-json-entries-flat");

//       const res = validateAccess({ dir: filePath });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "",
//         entry: "index",
//         entryDir: "",
//         name: "index",
//         isEntryValid: true,
//         ext: "js",
//       });
//     });

//     it("Directory with files inside src folder", () => {
//       const filePath = resolve(source, "valid-json-entry-lib");

//       const res = validateAccess({
//         dir: filePath,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "src",
//         entry: "index",
//         entryDir: "",
//         name: "index",
//         isEntryValid: true,
//         ext: "js",
//       });
//     });
//   });

//   describe("Directory and file attached in a flat folder", () => {
//     it("with invalid entry with an extension", () => {
//       const filePath = resolve(source, "valid-json-entries-flat");
//       const entry = "no.ts";

//       const res = validateAccess({
//         dir: filePath,
//         entry,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "",
//         entry: "no.ts",
//         entryDir: "",
//         name: "no",
//         isEntryValid: false,
//         ext: "ts",
//       });
//     });

//     it("with a valid extension", () => {
//       const filePath = resolve(source, "valid-json-entries-flat");
//       const entry = "b.ts";

//       const res = validateAccess({
//         dir: filePath,
//         entry,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "",
//         entry: "b.ts",
//         entryDir: "",
//         name: "b",
//         isEntryValid: true,
//         ext: "ts",
//       });
//     });

//     it("without an extension", () => {
//       const filePath = resolve(source, "valid-json-entries-flat");
//       const entry = "b";

//       const res = validateAccess({
//         dir: filePath,
//         entry,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "",
//         entry: "b",
//         entryDir: "",
//         name: "b",
//         isEntryValid: true,
//         ext: "ts",
//       });
//     });
//   });

//   describe("Directory and file attached in a src folder | src is not provided as input", () => {
//     it("Finds the src with invalid file name", () => {
//       const filePath = resolve(source, "valid-json-entry-lib");
//       const entry = "b.ts";

//       const res = validateAccess({
//         dir: filePath,
//         entry,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "src",
//         entry: "b.ts",
//         entryDir: "",
//         name: "b",
//         isEntryValid: false,
//         ext: "ts",
//       });
//     });

//     it("Finds the src with a valid file name", () => {
//       const filePath = resolve(source, "valid-json-entry-lib");
//       const entry = "index";

//       const res = validateAccess({
//         dir: filePath,
//         entry,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "src",
//         entry: "index",
//         entryDir: "",
//         name: "index",
//         isEntryValid: true,
//         ext: "js",
//       });
//     });

//     it("Finds the src with a valid file name and extension", () => {
//       const filePath = resolve(source, "valid-json-entry-lib");
//       const entry = "index.js";

//       const res = validateAccess({
//         dir: filePath,
//         entry,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "src",
//         entry: "index.js",
//         entryDir: "",
//         name: "index",
//         isEntryValid: true,
//         ext: "js",
//       });
//     });
//   });

//   describe("All provided as inputs", () => {
//     it("Targeting non-existence file", () => {
//       const filePath = resolve(source, "valid-json");
//       const entry = "b.ts";

//       const res = validateAccess({ dir: filePath, entry });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "",
//         entry,
//         entryDir: "",
//         name: "b",
//         isEntryValid: false,
//         ext: "ts",
//       });
//     });

//     it("Targeting non-existence entry", () => {
//       const filePath = resolve(source, "valid-json");
//       const entry = "./src/b.ts";

//       const res = validateAccess({ dir: filePath, entry });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "",
//         entry,
//         entryDir: "",
//         name: "b",
//         isEntryValid: false,
//         ext: "ts",
//       });
//     });

//     it("Targeting valid file name", () => {
//       const filePath = resolve(source, "valid-json-entries-flat");
//       const entry = "b.ts";

//       const res = validateAccess({
//         dir: filePath,
//         entry,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "",
//         entry: "b.ts",
//         entryDir: "",
//         name: "b",
//         isEntryValid: true,
//         ext: "ts",
//       });
//     });

//     it("Targeting invalid file name", () => {
//       const filePath = resolve(source, "valid-json-entries-flat");
//       const entry = "b.js";

//       const res = validateAccess({
//         dir: filePath,
//         entry,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "",
//         isJsonValid: true,

//         srcName: "",
//         entry: "b.js",
//         entryDir: "",
//         name: "b",
//         isEntryValid: false,
//         ext: "js",
//       });
//     });

//     it("Entry folder/lib with an extension", () => {
//       const filePath = resolve(source, "valid-json-entry-lib");
//       const entry = `lib${sep}a.js`;

//       const res = validateAccess({
//         dir: filePath,
//         entry,
//       });

//       expect(res).to.deep.equal({
//         dir: filePath,
//         subDir: "a.js",
//         isJsonValid: true,

//         srcName: "lib",
//         entry,
//         entryDir: "",
//         name: "a",
//         isEntryValid: true,
//         ext: "js",
//       });
//     });
//   });

//   // describe("Testing with flat structure", () => {

//   //   it("Multiple entries", () => {
//   //     const filePath = resolve(source, "valid-json-entries-flat");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //       entry: ["a.js", "b.ts", "index"],
//   //     });

//   //     expect(res).to.deep.equal({
//   //       dir: filePath,
//   //       subDir: "",
//   //       isJsonValid: true,
//   //
//   //       srcName: "",
//   //       entries: [
//   //         {
//   //           entry: "a.js",
//   //           entryDir: "",
//   //           isEntryValid: true,
//   //           ext: "js",
//   //           name: "a",
//   //         },
//   //         {
//   //           entry: "b.ts",
//   //           entryDir: "",
//   //           isEntryValid: true,
//   //           ext: "ts",
//   //           name: "b",
//   //         },
//   //         {
//   //           entry: "index",
//   //           entryDir: "",
//   //           isEntryValid: true,
//   //           ext: "js",
//   //           name: "index",
//   //         },
//   //       ],
//   //     });
//   //   });
//   // });

//   // describe("Testing with src folders structure", () => {
//   //   it("Multiple entries", () => {
//   //     const filePath = resolve(source, "valid-json-entries-flat");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //       entry: ["a.js", "b.ts", "index"],
//   //     });

//   //     expect(res).to.deep.equal({
//   //       dir: filePath,
//   //       subDir: "",
//   //       isJsonValid: true,
//   //
//   //       srcName: "",
//   //       entries: [
//   //         {
//   //           entry: "a.js",
//   //           entryDir: "",
//   //           isEntryValid: true,
//   //           ext: "js",
//   //           name: "a",
//   //         },
//   //         {
//   //           entry: "b.ts",
//   //           entryDir: "",
//   //           isEntryValid: true,
//   //           ext: "ts",
//   //           name: "b",
//   //         },
//   //         {
//   //           entry: "index",
//   //           entryDir: "",
//   //           isEntryValid: true,
//   //           ext: "js",
//   //           name: "index",
//   //         },
//   //       ],
//   //     });
//   //   });
//   // });

//   // describe("Multi entries", () => {
//   //   it("Provides multi files as entries with no extension involved", () => {
//   //     const filePath = resolve(source, "valid-json-entries-flat");
//   //     const entries = ["b", "index", "c"];

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //       entry: entries,
//   //     });

//   //     expect(res).to.deep.equal({
//   //       dir: filePath,
//   //       isJsonValid: true,
//   //
//   //       entries: [
//   //         {
//   //           entry: "b",
//   //           ext: "ts",
//   //           name: "b",
//   //           isEntryValid: true,
//   //         },
//   //         {
//   //           entry: "index",
//   //           ext: "js",
//   //           name: "index",
//   //           isEntryValid: true,
//   //         },
//   //         {
//   //           entry: "c",
//   //           ext: "",
//   //           name: "c",
//   //           isEntryValid: false,
//   //         },
//   //       ],
//   //     });
//   //   });

//   //   it("Provides multi files as entries with extensions involved", () => {
//   //     const filePath = resolve(source, "valid-json-entries-flat");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //       entry: ["b.ts", "index.js", "c", "z"],
//   //     });

//   //     expect(res).to.deep.equal({
//   //       dir: filePath,
//   //       isJsonValid: true,
//   //
//   //       entries: [
//   //         {
//   //           entry: "b.ts",
//   //           name: "b",
//   //           ext: "ts",
//   //           isEntryValid: true,
//   //         },
//   //         {
//   //           entry: "index.js",
//   //           name: "index",
//   //           ext: "js",
//   //           isEntryValid: true,
//   //         },
//   //         {
//   //           entry: "c",
//   //           name: "c",
//   //           ext: "",
//   //           isEntryValid: false,
//   //         },
//   //         {
//   //           entry: "z",
//   //           name: "z",
//   //           ext: "js",
//   //           isEntryValid: true,
//   //         },
//   //       ],
//   //     });
//   //   });

//   //   it("Figures out entries with src included as inputs and extensions attached", () => {
//   //     const filePath = resolve(source, "valid-json-entries-src");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //       entry: ["src/z", "src/a.js", "src/index.ts", "src/index.js", "src/c"],
//   //     });

//   //     expect(res).to.deep.equal({
//   //       dir: filePath,
//   //       isJsonValid: true,
//   //
//   //       entries: [
//   //         {
//   //           entry: "src/z",
//   //           name: "z",
//   //           ext: "js",
//   //           isEntryValid: true,
//   //         },
//   //         {
//   //           entry: "src/a.js",
//   //           name: "a",
//   //           ext: "js",
//   //           isEntryValid: true,
//   //         },
//   //         {
//   //           entry: "src/index.ts",
//   //           name: "index",
//   //           ext: "ts",
//   //           isEntryValid: false,
//   //         },
//   //         {
//   //           entry: "src/index.js",
//   //           name: "index",
//   //           ext: "js",
//   //           isEntryValid: true,
//   //         },
//   //         {
//   //           entry: "src/c",
//   //           name: "c",
//   //           ext: "",
//   //           isEntryValid: false,
//   //         },
//   //       ],
//   //     });
//   //   });
//   // });

//   // describe("Passing entry with folder name ignoring a valid src", () => {
//   //   it("A custom entry folder/lib with an ext", () => {
//   //     const filePath = resolve(source, "valid-json-entry-lib");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //       entry: ["lib/a.js"],
//   //     });

//   //     expect(res).to.deep.equal({
//   //       isJsonValid: true,
//   //
//   //       entry: "lib/a.js",
//   //       name: "a",
//   //       isEntryValid: true,
//   //       ext: "js",
//   //     });
//   //   });

//   //   it("A custom entry folder/lib without an ext", () => {
//   //     const filePath = resolve(source, "valid-json-entry-lib");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //       entry: ["lib/a"],
//   //     });

//   //     expect(res).to.deep.equal({
//   //       isJsonValid: true,
//   //
//   //       entry: "a",
//   //       isEntryValid: true,
//   //       ext: "js",
//   //     });
//   //   });

//   //   it("A custom entry folder/lib with an ext, no array", () => {
//   //     const filePath = resolve(source, "valid-json-entry-lib");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //       entry: "lib/a.js",
//   //     });

//   //     expect(res).to.deep.equal({
//   //       isJsonValid: true,
//   //
//   //       entry: "a",
//   //       isEntryValid: true,
//   //       ext: "js",
//   //     });
//   //   });
//   // });

//   // describe("Directory directly points to a valid file ignoring entry", () => {
//   //   it("With an extension ", () => {
//   //     const filePath = resolve(source, "valid-json-entries-src", "src", "b.ts");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //     });

//   //     expect(res).to.deep.equal({
//   //       isJsonValid: false,
//   //
//   //       entry: "b",
//   //       isEntryValid: true,
//   //       ext: "ts",
//   //     });
//   //   });

//   //   it("Without an extension", () => {
//   //     const filePath = resolve(source, "valid-json-entries-src", "src", "b");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //     });

//   //     expect(res).to.deep.equal({
//   //       isJsonValid: false,
//   //
//   //       entry: "b",
//   //       isEntryValid: true,
//   //       ext: "ts",
//   //     });
//   //   });

//   //   it("With wrong extension", () => {
//   //     const filePath = resolve(source, "valid-json-entries-src", "src", "b.js");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //     });

//   //     expect(res).to.deep.equal({
//   //       isJsonValid: false,
//   //
//   //       entry: "b",
//   //       isEntryValid: false,
//   //       ext: "js",
//   //     });
//   //   });

//   //   it("With wrong file name", () => {
//   //     const filePath = resolve(source, "valid-json-entries-src", "src", "c.js");

//   //     const res = validateAccess({
//   //       dir: filePath,
//   //     });

//   //     expect(res).to.deep.equal({
//   //       isJsonValid: false,
//   //
//   //       entry: "c",
//   //       isEntryValid: false,
//   //       ext: "js",
//   //     });
//   //   });
//   // });

//   // it("specific entry non-flat with extension included", () => {
//   //   const filePath = resolve(source, "valid-json-entries-src");

//   //   const res = validateAccess({
//   //     dir: filePath,
//   //     entry: "b.ts",
//   //   });

//   //   expect(res).to.deep.equal({
//   //     isJsonValid: true,
//   //
//   //     entry: "b",
//   //     isEntryValid: true,
//   //     ext: "ts",
//   //   });
//   // });
// });
