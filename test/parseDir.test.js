// @ts-check

const { expect } = require("chai");
const { resolve, sep } = require("path");

const { parseDir } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe("parseDir", () => {
  describe("No Result:", () => {
    it("with a valid-json dir", () => {
      const filePath = resolve(source, "valid-json");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: resolve(source),
        subDir: "valid-json",
        srcName: "",
        filename: "",
      });
    });

    it("with a valid-json-entries-flat dir", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: resolve(source),
        subDir: "valid-json-entries-flat",
        srcName: "",
        filename: "",
      });
    });
  });

  describe("Directory includes:", () => {
    it("with src folder - no sub dir", () => {
      const expectedPath = resolve(source, "valid-json-entries-flat");
      const filePath = resolve(source, "valid-json-entries-flat", "src");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "src",
        srcName: "src",
        filename: "",
      });
    });

    it("with lib folder - no sub dir", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const filePath = resolve(source, "valid-json-entry-lib", "lib");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: "lib",
        filename: "",
        srcName: "lib",
      });
    });

    it("with lib folder and sub dir", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const filePath = resolve(
        source,
        "valid-json-entry-lib",
        "lib",
        "random",
        "a.js"
      );

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: `lib${sep}random`,
        filename: "a.js",
        srcName: "lib",
      });
    });

    it("with unrecognized a sub dir", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "test",
        filename: "",
        srcName: "",
      });
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
        subDir: "lib",
        filename: "b.ts",
        srcName: "lib",
      });
    });

    it("with unrecognized sub folder[test] and without an extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib", "test"),
        filename: "",
        subDir: "b",
        srcName: "",
      });
    });

    it("with unrecognized sub folder[test] but with an extension.", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "test", "b.ts");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        filename: "b.ts",
        subDir: "test",
        srcName: "",
      });
    });

    it("with a file name not extension", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "a");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entries-flat"),
        filename: "",
        subDir: "a",
        srcName: "",
      });
    });

    it("with a file name and extension", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "a.js");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: resolve(source),
        filename: "a.js",
        subDir: "valid-json-entries-flat",
        srcName: "",
      });
    });
  });

  describe("Custom targeted folders", () => {
    const expectedPath = resolve(source, "valid-json-entry-lib");
    const filePath = resolve(source, "valid-json-entry-lib", "dist", "b.ts");

    const expectedResult = {
      dir: expectedPath,
      filename: "b.ts",
      subDir: "dist",
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
        subDir: "lib",
        filename: "b.ts",
        srcName: "lib",
      });
    });
  });

  describe("Detect sub dir", () => {
    it("With a valid sub dir", () => {
      const filePath = resolve(
        source,
        "valid-json-entry-lib",
        "random",
        "b.ts"
      );

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "random",
        filename: "b.ts",
        srcName: "",
      });
    });

    it("With a valid sub dir and src name", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const filePath = resolve(source, "valid-json-entry-lib", "lib", "random");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: `lib${sep}random`,
        filename: "",
        srcName: "lib",
      });
    });

    it("With a valid sub dir and src name", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const filePath = resolve(
        source,
        "valid-json-entry-lib",
        "lib",
        "random",
        "a.js"
      );

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: `lib${sep}random`,
        filename: "a.js",
        srcName: "lib",
      });
    });

    it("with lib but without an extension", () => {
      const expectedPath = resolve(source, "valid-json-entry-lib");
      const filePath = resolve(source, "valid-json-entry-lib", "lib", "b");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: expectedPath,
        subDir: `lib${sep}b`,
        filename: "",
        srcName: "lib",
      });
    });

    it("with unrecognized sub folder[random] and a file without an extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "random", "b");

      const res = parseDir(filePath);

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib", "random"),
        subDir: `b`,
        filename: "",
        srcName: "",
      });
    });
  });
});
