const { expect } = require("chai");
const { resolve } = require("path");

// @ts-checks
const { parseDir } = require("../lib");

const source = resolve(__dirname, "fixtures");

const DEFAULT_EXTENSIONS = ["js", "ts"];

describe("Directory Parser", () => {
  const DEFAULT_SRC_NAME = "src";
  const IS_VALIDATE_JSON = true;

  describe("Directory includes root only", () => {
    it("with default", () => {
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
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with only a valid json", () => {
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
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with a valid json in a flat structure", () => {
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
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });
  });

  describe("Directory includes root and sub dir only", () => {
    it("with src as a sub dir", () => {
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
        isSrc: true,
        isJsonValid: true,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with lib as a sub dir", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir);

      const res = parseDir(
        filePath,
        DEFAULT_SRC_NAME,
        DEFAULT_EXTENSIONS,
        IS_VALIDATE_JSON
      );

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir,
        isSrc: true,
        isJsonValid: true,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with unrecognized a sub dir", () => {
      const subDir = "test";
      const filePath = resolve(source, "valid-json-entry-lib", subDir);

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
        isJsonValid: false,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });
  });

  describe("Directory includes a file name", () => {
    it("with lib and an extension", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir, "b.ts");

      const res = parseDir(
        filePath,
        DEFAULT_SRC_NAME,
        DEFAULT_EXTENSIONS,
        IS_VALIDATE_JSON
      );

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir,
        isSrc: true,
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

      const res = parseDir(
        filePath,
        DEFAULT_SRC_NAME,
        DEFAULT_EXTENSIONS,
        IS_VALIDATE_JSON
      );

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir,
        isSrc: true,
        isJsonValid: true,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with unrecognized sub folder[test] and without an extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b");

      const res = parseDir(
        filePath,
        DEFAULT_SRC_NAME,
        DEFAULT_EXTENSIONS,
        IS_VALIDATE_JSON
      );

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib", "test"),
        subDir: "",
        isSrc: false,
        isJsonValid: false,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with unrecognized sub folder[test] but with an extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b.ts");

      const res = parseDir(
        filePath,
        DEFAULT_SRC_NAME,
        DEFAULT_EXTENSIONS,
        IS_VALIDATE_JSON
      );

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib", "test"),
        subDir: "",
        isSrc: false,
        isJsonValid: false,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with a file name only", () => {
      const expectedPath = resolve(source, "valid-json-entries-flat");
      const filePath = resolve(source, "valid-json-entries-flat", "a");

      const res = parseDir(
        filePath,
        DEFAULT_SRC_NAME,
        DEFAULT_EXTENSIONS,
        IS_VALIDATE_JSON
      );

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "",
        isSrc: false,
        isJsonValid: true,
        includeValidEntry: true,
        ext: "js",
        name: "a",
      });
    });

    it("with file name and extension only", () => {
      const expectedPath = resolve(source, "valid-json-entries-flat");
      const filePath = resolve(source, "valid-json-entries-flat", "a.js");

      const res = parseDir(
        filePath,
        DEFAULT_SRC_NAME,
        DEFAULT_EXTENSIONS,
        IS_VALIDATE_JSON
      );

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "",
        isSrc: false,
        isJsonValid: true,
        includeValidEntry: true,
        ext: "js",
        name: "a",
      });
    });
  });
});
