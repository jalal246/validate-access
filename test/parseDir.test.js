// @ts-check
const { expect } = require("chai");
const { resolve, sep } = require("path");

const { parseDir } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe("parseDir", () => {
  const noResult = (dir) => ({
    dir,
    subDir: "",
    srcName: "",
    filename: "",
  });

  describe("No Result:", () => {
    it("with default", () => {
      const filePath = ".";
      const res = parseDir(filePath);

      expect(res).to.deep.equal(noResult(filePath));
    });

    it("with skip a valid-json dir", () => {
      const filePath = resolve(source, "valid-json");

      const res = parseDir(filePath);

      expect(res).to.deep.equal(noResult(filePath));
    });

    it("with a valid-json-entries-flat dir", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = parseDir(filePath);

      expect(res).to.deep.equal(noResult(filePath));
    });
  });

  describe("Directory includes:", () => {
    it("with src folder - no sub dir", () => {
      const expectedPath = resolve(source, "valid-json-entries-flat");
      const filePath = resolve(source, "valid-json-entries-flat", "src");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "",
        srcName: "src",
        filename: "",
      });
    });

    it("with lib folder - no sub dir", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir);

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "",
        filename: "",
        srcName: "lib",
      });
    });

    it("with unrecognized a sub dir", () => {
      const subDir = "test";
      const filePath = resolve(source, "valid-json-entry-lib", subDir);

      const res = parseDir(filePath);

      expect(res).to.deep.equal(noResult(filePath));
    });
  });

  describe("Directory includes a file name/extension:", () => {
    it("with lib and an extension", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir, "b.ts");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "",
        filename: "b.ts",
        srcName: "lib",
      });
    });

    it("with lib but without an extension", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir, "b");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "b",
        filename: "",
        srcName: "lib",
      });
    });

    it("with unrecognized sub folder[test] and without an extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b");

      const res = parseDir(filePath);

      expect(res).to.deep.equal(noResult(filePath));
    });

    it("with unrecognized sub folder[test] but with an extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b.ts");

      const res = parseDir(filePath);

      expect(res).to.deep.equal(noResult(filePath));
    });

    it("with a file name skip", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "a");

      const res = parseDir(filePath);

      expect(res).to.deep.equal(noResult(filePath));
    });

    it("with file name and extension skip", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "a.js");

      const res = parseDir(filePath);

      expect(res).to.deep.equal(noResult(filePath));
    });
  });

  describe("Custom targeted folders", () => {
    const expectedPath = resolve(source, "valid-json-entry-lib");
    const filePath = resolve(source, "valid-json-entry-lib", "dist", "b.ts");

    const expectedResult = {
      dir: expectedPath,
      filename: "b.ts",
      subDir: "",
      srcName: "dist",
    };

    it("Should pass with an array", () => {
      const res = parseDir(filePath, ["dist"]);

      expect(res).to.deep.equal(expectedResult);
    });

    it("Should pass with a string", () => {
      const res = parseDir(filePath, "dist");

      expect(res).to.deep.equal(expectedResult);
    });

    it("Should pass with a sub entry", () => {
      const input = `lib${sep}b.ts`;

      const res = parseDir(input);

      expect(res).to.deep.equal({
        dir: "",
        subDir: "",
        filename: "b.ts",
        srcName: "lib",
      });
    });
  });
});