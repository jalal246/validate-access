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
          isValid: true,
        },
        {
          entry: "index",
          entryExt: "js",
          isValid: true,
        },
        {
          entry: "c",
          entryExt: null,
          isValid: false,
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

  it("figures out entries with src included or extensions attached", () => {
    const filePath = resolve(source, "valid-json-entries-src");

    const res = validateAccess({
      dir: filePath,
      entry: ["src/b", "src/a.js", "src/index.ts"],
    });

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: true,
      isEntryValid: [
        {
          entry: "b",
          entryExt: "ts",
          isValid: true,
        },
        {
          entry: "a",
          entryExt: "js",
          isValid: true,
        },
        {
          entry: "index",
          entryExt: "ts",
          isValid: false,
        },
      ],
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

  it("don't validate entry", () => {
    const filePath = resolve(source, "valid-json-entries-flat");

    const res = validateAccess({
      dir: filePath,
      entry: null,
    });

    expect(res).to.deep.equal({
      isJsonValid: true,
    });
  });

  it("don't validate json", () => {
    const filePath = resolve(source, "valid-json-entries-flat");

    const res = validateAccess({
      dir: filePath,
      isValidateJson: false,
      entry: "b",
    });

    expect(res).to.deep.equal({
      isJsonValid: null,
      isSrc: false,
      entry: "b",
      isEntryValid: true,
      entryExt: "ts",
    });
  });
});
