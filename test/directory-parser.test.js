const { expect } = require("chai");
const { resolve } = require("path");

const { parseDir } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe("Directory Parser", () => {
  describe("Directory includes root", () => {
    it("with default", () => {
      const res = parseDir({});

      expect(res).to.deep.equal({
        dir: resolve("."),
        subDir: "",
        isSrc: true,
        srcName: "src",
        isJsonValid: true,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with a valid json", () => {
      const filePath = resolve(source, "valid-json");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isSrc: false,
        srcName: "",
        isJsonValid: true,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with a valid json in a flat structure", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isSrc: false,
        srcName: "",
        isJsonValid: true,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });
  });

  describe("Directory includes root and sub dir", () => {
    it("with src as a sub dir", () => {
      const expectedPath = resolve(source, "valid-json-entries-flat");
      const filePath = resolve(source, "valid-json-entries-flat", "src");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "",
        isSrc: true,
        srcName: "src",
        isJsonValid: true,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with lib as a sub dir", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const filePath = resolve(source, "valid-json-entry-lib", "lib");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "",
        isSrc: true,
        srcName: "lib",
        isJsonValid: true,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with unrecognized a sub dir", () => {
      const subDir = "test";
      const filePath = resolve(source, "valid-json-entry-lib", subDir);

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isSrc: false,
        srcName: "",
        isJsonValid: false,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });
  });

  describe("Directory includes a file name", () => {
    it("with lib and a valid extension", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir, "b.ts");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "",
        isSrc: true,
        srcName: "lib",
        isJsonValid: true,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with lib but without an extension", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir, "b");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "",
        isSrc: true,
        srcName: "lib",
        isJsonValid: true,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with unrecognized sub folder[test] and without an extension - invalid", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isSrc: false,
        srcName: "",
        isJsonValid: false,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with unrecognized sub folder[test] but with an extension - invalid", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b.ts");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isSrc: false,
        srcName: "",
        isJsonValid: false,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with unrecognized sub folder[random] and without an extension - valid", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "random", "b");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isSrc: false,
        srcName: "",
        isJsonValid: false,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with unrecognized sub folder[random] but with an extension - valid", () => {
      const filePath = resolve(
        source,
        "valid-json-entry-lib",
        "random",
        "b.ts"
      );

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isSrc: false,
        srcName: "",
        isJsonValid: false,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with a valid file name no folder", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "a");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isSrc: false,
        srcName: "",
        isJsonValid: false,
        includeValidEntry: true,
        ext: "js",
        name: "a",
      });
    });

    it("with file name and extension", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "a.js");

      const res = parseDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isSrc: false,
        srcName: "",
        isJsonValid: false,
        includeValidEntry: true,
        ext: "js",
        name: "a",
      });
    });
  });
});
