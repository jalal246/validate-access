/* eslint-disable import/no-extraneous-dependencies */

const { expect } = require("chai");
const { resolve } = require("path");

const { validateAccess } = require("../src");

const source = resolve(__dirname, "fixtures");

describe("valid", () => {
  it("default ", () => {
    const res = validateAccess();

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: true,
      entry: "index",
      isEntryValid: true,
      entryExt: "js",
    });
  });

  it("valid json", () => {
    const filePath = resolve(source, "valid-json");

    const res = validateAccess({ dir: filePath });

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: false,
      entry: "index",
      isEntryValid: false,
      entryExt: null,
    });
  });

  it("default entry", () => {
    const filePath = resolve(source, "valid-json-entries-flat");

    const res = validateAccess({
      dir: filePath,
    });

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: false,
      entry: "index",
      isEntryValid: true,
      entryExt: "js",
    });
  });

  it("specific entry", () => {
    const filePath = resolve(source, "valid-json-entries-flat");

    const res = validateAccess({
      dir: filePath,
      entry: "b",
    });

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: false,
      entry: "b",
      isEntryValid: true,
      entryExt: "ts",
    });
  });

  it("multi entries", () => {
    const filePath = resolve(source, "valid-json-entries-flat");

    const res = validateAccess({
      dir: filePath,
      entry: ["b", "index", "c"],
    });

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: false,
      isEntryValid: [
        {
          entry: "b",
          entryExt: "ts",
          isEntryValid: true,
        },
        {
          entry: "index",
          entryExt: "js",
          isEntryValid: true,
        },
        {
          entry: "c",
          entryExt: null,
          isEntryValid: false,
        },
      ],
    });
  });

  it("specific entry non-flat", () => {
    const filePath = resolve(source, "valid-json-entries-src");

    const res = validateAccess({
      dir: filePath,
      entry: "b",
    });

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: true,
      entry: "b",
      isEntryValid: true,
      entryExt: "ts",
    });
  });

  it("valid json custom entries-lib different ext", () => {
    const filePath = resolve(source, "valid-json-entry-lib");

    const res = validateAccess({
      dir: filePath,
      srcName: "lib",
    });

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: true,
      entry: "index",
      isEntryValid: true,
      entryExt: "js",
    });
  });
});
