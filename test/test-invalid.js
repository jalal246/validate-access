// /* eslint-disable import/no-extraneous-dependencies */
// const { expect } = require("chai");
// const { resolve } = require("path");

// const { validateAccess } = require("../lib");

// const source = resolve(__dirname, "fixtures");

// describe("invalid", () => {

//   it("invalid json entries-flat", () => {
//     const filePath = resolve(source, "invalid-entries-flat");

//     const res = validateAccess({
//       dir: filePath,
//     });

//     expect(res).to.deep.equal({
//       isJsonValid: true,
//       isSrc: false,
//       entry: "index",
//       isEntryValid: false,
//       entryExt: "",
//     });
//   });

//   it("invalid json entries-src", () => {
//     const filePath = resolve(source, "invalid-entries-src");

//     const res = validateAccess({
//       dir: filePath,
//     });

//     expect(res).to.deep.equal({
//       isJsonValid: true,
//       isSrc: false,
//       entry: "index",
//       isEntryValid: false,
//       entryExt: "",
//     });
//   });
// });
