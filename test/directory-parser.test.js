const { expect } = require("chai");
const { resolve } = require("path");

// @ts-checks
const { parseDir } = require("../lib");

const source = resolve(__dirname, "fixtures");
//       const filePath = resolve(source, "valid-json");

const DEFAULT_EXTENSIONS = ["js", "ts"];

describe("Directory Parser", () => {
  const DEFAULT_SRC_NAME = "src";
  const IS_VALIDATE_JSON = true;

  it("Current dir", () => {
    const res = parseDir(
      "",
      DEFAULT_SRC_NAME,
      DEFAULT_EXTENSIONS,
      IS_VALIDATE_JSON
    );

    expect(res).to.deep.equal({
      dir: ".",
      subDir: "",
      isSrc: true,
      isJsonValid: true,
      isEntryValid: false,
      ext: "",
      name: "",
    });
  });

  it("Directory contains a valid json/invalid src/entry", () => {
    const filePath = resolve(source, "valid-json");

    const res = parseDir(
      filePath,
      DEFAULT_SRC_NAME,
      DEFAULT_EXTENSIONS,
      IS_VALIDATE_JSON
    );

    expect(res).to.deep.equal({
      dir: filePath,
      subDir: "",
      isSrc: false,
      isJsonValid: true,
      isEntryValid: false,
      ext: "",
      name: "",
    });
  });

  it("Directory contains a valid json/invalid src/entry", () => {
    const filePath = resolve(source, "valid-json-entries-flat");

    const res = parseDir(
      filePath,
      DEFAULT_SRC_NAME,
      DEFAULT_EXTENSIONS,
      IS_VALIDATE_JSON
    );

    expect(res).to.deep.equal({
      dir: filePath,
      subDir: "",
      isSrc: false,
      isJsonValid: true,
      isEntryValid: false,
      ext: "",
      name: "",
    });
  });

  it("Directory contains a valid json/valid but no src or entry", () => {
    const filePath = resolve(source, "valid-json-entries-flat");

    const res = parseDir(
      filePath,
      DEFAULT_SRC_NAME,
      DEFAULT_EXTENSIONS,
      IS_VALIDATE_JSON
    );

    expect(res).to.deep.equal({
      dir: filePath,
      subDir: "",
      isSrc: false,
      isJsonValid: true,
      isEntryValid: false,
      ext: "",
      name: "",
    });
  });

  it.only("Directory contains a valid json/invalid with src", () => {
    const expectedPath = resolve(source, "valid-json-entries-flat");
    const filePath = resolve(source, "valid-json-entries-flat", "src");

    const res = parseDir(
      filePath,
      DEFAULT_SRC_NAME,
      DEFAULT_EXTENSIONS,
      IS_VALIDATE_JSON
    );

    expect(res).to.deep.equal({
      dir: expectedPath,
      subDir: "src",
      isSrc: false,
      isJsonValid: true,
      isEntryValid: false,
      ext: "",
      name: "",
    });
  });

  it.only("Directory contains a valid json/invalid with named src", () => {
    const expectedPath = resolve(source, "valid-json-entry-lib");
    const filePath = resolve(source, "valid-json-entry-lib", "lib");

    const res = parseDir(
      filePath,
      DEFAULT_SRC_NAME,
      DEFAULT_EXTENSIONS,
      IS_VALIDATE_JSON
    );

    expect(res).to.deep.equal({
      dir: expectedPath,
      isSrc: false,
      isJsonValid: true,
      isEntryValid: false,
      ext: "",
      name: "",
    });
  });
});
