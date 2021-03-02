// @ts-check

const { expect } = require("chai");
const { resolve } = require("path");

const { parseAndValidateDir } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe("parseAndValidateDir", () => {
  describe("Directory includes root", () => {
    it("with a valid json", () => {
      const filePath = resolve(source, "valid-json");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source),
        subDir: "valid-json",
        srcName: "",
        includeSrcName: false,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with a valid json in a flat structure", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source),
        subDir: "valid-json-entries-flat",
        srcName: "",
        includeSrcName: false,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with a no source provided", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source),
        subDir: "valid-json-entry-lib",
        srcName: "src",
        includeSrcName: false,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with a source provided", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "lib");
      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "lib",
        srcName: "lib",
        includeSrcName: true,
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

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "src",
        srcName: "src",
        includeSrcName: true,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with lib as a sub dir", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const filePath = resolve(source, "valid-json-entry-lib", "lib");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "lib",
        srcName: "lib",
        includeSrcName: true,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with unrecognized a sub dir", () => {
      const subDir = "test";
      const filePath = resolve(source, "valid-json-entry-lib", subDir);

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir,
        srcName: "",
        includeSrcName: false,
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

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "lib",
        srcName: "lib",
        includeSrcName: true,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with lib but without an extension", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const subDir = "lib";
      const filePath = resolve(source, "valid-json-entry-lib", subDir, "b");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: `lib`,
        srcName: "lib",
        includeSrcName: true,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with unrecognized sub folder[test] and without an extension - invalid", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib", "test"),
        subDir: "b",
        srcName: "",
        includeSrcName: false,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with unrecognized sub folder[test] but with an extension - invalid", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b.ts");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "test",
        srcName: "",
        includeSrcName: false,
        includeValidEntry: false,
        ext: "ts",
        name: "b",
      });
    });

    it("with unrecognized sub folder[random] and without an extension - valid", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "random", "b");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "random",
        srcName: "",
        includeSrcName: false,
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

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "random",
        srcName: "",
        includeSrcName: false,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });

    it("with a valid file name no folder", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "a");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: source,
        subDir: "valid-json-entries-flat",
        srcName: "",
        includeSrcName: false,
        includeValidEntry: true,
        ext: "js",
        name: "a",
      });
    });

    it("with invalid file name no folder", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "x");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entries-flat"),
        subDir: "x",
        srcName: "",
        includeSrcName: false,
        includeValidEntry: false,
        ext: "",
        name: "",
      });
    });

    it("with file name and extension", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "a.js");

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: source,
        subDir: "valid-json-entries-flat",
        srcName: "",
        includeSrcName: false,
        includeValidEntry: true,
        ext: "js",
        name: "a",
      });
    });

    it("with a valid sub dir", () => {
      const filePath = resolve(
        source,
        "valid-json-entry-lib",
        "random",
        "b.ts"
      );

      const res = parseAndValidateDir({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "random",
        srcName: "",
        includeSrcName: false,
        includeValidEntry: true,
        ext: "ts",
        name: "b",
      });
    });
  });
});
