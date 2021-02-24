// @ts-check
const { expect } = require("chai");
const { resolve } = require("path");

const { parseDirIncludesFile } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe("parseDirIncludesFile", () => {
  const noResult = {
    includeValidEntry: false,
    ext: "",
    name: "",
  };

  describe("Invalid includeValidEntry", () => {
    it("with default", () => {
      const filePath = ".";
      const res = parseDirIncludesFile(filePath);

      expect(res).to.deep.equal(noResult);
    });

    it("with dir only", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = parseDirIncludesFile(filePath);

      expect(res).to.deep.equal(noResult);
    });

    it("with src folder only", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "src");

      const res = parseDirIncludesFile(filePath);

      expect(res).to.deep.equal(noResult);
    });

    it("with src folder and invalid extension", () => {
      const filePath = resolve(
        source,
        "valid-json-entries-flat",
        "src",
        "b.js"
      );

      const res = parseDirIncludesFile(filePath);

      expect(res).to.deep.equal(noResult);
    });

    it("with invalid src folder", () => {
      const filePath = resolve(
        source,
        "valid-json-entries-flat",
        "utils",
        "index.js"
      );

      const res = parseDirIncludesFile(filePath);

      expect(res).to.deep.equal(noResult);
    });
  });

  describe("Valid includeValidEntry", () => {
    const resultBDotTS = {
      includeValidEntry: true,
      ext: "ts",
      name: "b",
    };

    it("with lib and an extension", () => {
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir, "b.ts");

      const res = parseDirIncludesFile(filePath);

      expect(res).to.deep.equal(resultBDotTS);
    });

    it("with lib but without an extension", () => {
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir, "b");

      const res = parseDirIncludesFile(filePath);

      expect(res).to.deep.equal(resultBDotTS);
    });
  });
});
