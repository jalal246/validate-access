// @ts-check
const { expect } = require("chai");
const { resolve } = require("path");

const { detectFileInDir } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe.only("detectFileInDir", () => {
  const noResult = {
    includeValidEntry: false,
    ext: "",
    name: "",
  };

  describe("Invalid includeValidEntry", () => {
    it("with default", () => {
      const filePath = resolve(".");
      const res = detectFileInDir(filePath);

      expect(res).to.deep.equal(noResult);
    });

    it("with dir only", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = detectFileInDir(filePath);

      expect(res).to.deep.equal(noResult);
    });

    it("with src folder only", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "src");

      const res = detectFileInDir(filePath);

      expect(res).to.deep.equal(noResult);
    });

    it("with src folder and invalid extension", () => {
      const filePath = resolve(
        source,
        "valid-json-entries-flat",
        "src",
        "b.js"
      );

      const res = detectFileInDir(filePath);

      expect(res).to.deep.equal({
        includeValidEntry: false,
        ext: "js",
        name: "b",
      });
    });

    it("with invalid src folder", () => {
      const filePath = resolve(
        source,
        "valid-json-entries-flat",
        "utils",
        "index.js"
      );

      const res = detectFileInDir(filePath);

      expect(res).to.deep.equal({
        includeValidEntry: false,
        ext: "js",
        name: "index",
      });
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

      const res = detectFileInDir(filePath);

      expect(res).to.deep.equal(resultBDotTS);
    });

    it("with lib but without an extension", () => {
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir, "b");

      const res = detectFileInDir(filePath);

      expect(res).to.deep.equal(resultBDotTS);
    });
  });
});
