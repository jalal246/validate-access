// @ts-check

const { expect } = require("chai");
const { resolve, sep } = require("path");

const { validateAccess } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe("Validate Access", () => {
  describe("Just entry", () => {
    it("Default args", () => {
      const res = validateAccess({});

      expect(res).to.deep.equal({
        dir: resolve("."),
        subDir: "",
        entry: "index",
        entryDir: "",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "ts",
      });
    });

    it("One entry without extension", () => {
      const entry = "index";
      const res = validateAccess({ entry });

      expect(res).to.deep.equal({
        dir: resolve("."),
        subDir: "",
        entry,
        entryDir: "",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "ts",
      });
    });

    it("One entry without extension inside an array", () => {
      const entry = "index";
      const res = validateAccess({ entry: [entry] });

      expect(res).to.deep.equal({
        dir: resolve("."),
        subDir: "",
        entry,
        entryDir: "",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "ts",
      });
    });

    it("Entry with entry dir without extension", () => {
      const entry = "src/index";
      const res = validateAccess({ entry });

      expect(res).to.deep.equal({
        dir: resolve("."),
        subDir: "",
        entry,
        entryDir: "src",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "ts",
      });
    });

    it("Entry with entry dir and extension", () => {
      const entry = "src/index.ts";
      const res = validateAccess({ entry });

      expect(res).to.deep.equal({
        dir: resolve("."),
        subDir: "",
        entry,
        entryDir: "src",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "ts",
      });
    });

    it("Invalid entry with entry dir and extension", () => {
      const entry = "src/index.js";
      const res = validateAccess({ entry });

      expect(res).to.deep.equal({
        dir: resolve("."),
        subDir: "",
        entry,
        entryDir: "src",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: false,
        name: "index",
        ext: "js",
      });
    });

    it("Entry with invalid entry dir and extension", () => {
      const entry = "noop/index.js";
      const res = validateAccess({ entry });

      expect(res).to.deep.equal({
        dir: resolve("."),
        subDir: "",
        entry,
        entryDir: "noop",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: false,
        name: "index",
        ext: "js",
      });
    });

    it("Multiple entries", () => {
      const res = validateAccess({
        entry: ["a.js", "index", "src/index", "src/index.js"],
      });

      expect(res).to.deep.equal({
        dir: resolve("."),
        subDir: "",
        isJsonValid: true,
        srcName: "src",

        entries: [
          {
            entry: "a.js",
            entryDir: "",
            name: "a",
            isEntryValid: false,
            ext: "js",
          },
          {
            entry: "index",
            entryDir: "",
            name: "index",
            isEntryValid: true,
            ext: "ts",
          },
          {
            entry: "src/index",
            entryDir: "src",
            name: "index",
            isEntryValid: true,
            ext: "ts",
          },
          {
            entry: "src/index.js",
            entryDir: "src",
            name: "index",
            isEntryValid: false,
            ext: "js",
          },
        ],
      });
    });
  });

  describe("Just directory", () => {
    it("Empty Directory", () => {
      const filePath = resolve(source, "valid-json");

      const res = validateAccess({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: false,
        ext: "",
      });
    });

    it("Directory in a flat structure", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const res = validateAccess({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it("Directory includes filename no extension in a flat structure", () => {
      const filePath = resolve(source, "valid-json-entries-flat", "index");
      const res = validateAccess({ dir: filePath });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entries-flat"),
        subDir: "",
        isJsonValid: true,
        srcName: "",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it("Directory in non-flat structure", () => {
      const filePath = resolve(source, "valid-json-entry-lib");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "src",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it("Directory with folder in non-flat structure - valid index", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "src");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "src",
        isJsonValid: true,
        srcName: "src",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it("Directory with folder in non-flat structure - no valid index", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "lib");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "lib",
        isJsonValid: true,
        srcName: "lib",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: false,
        ext: "",
      });
    });

    it("Directory with folder and a filename - no extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "lib", "b");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "lib",
        isJsonValid: true,
        srcName: "lib",
        entry: "index",
        entryDir: "",
        name: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it("Directory with folder and invalid filename - no extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "lib", "z");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: `lib${sep}z`,
        isJsonValid: true,
        srcName: "lib",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: false,
        ext: "",
      });
    });

    it("Directory with folder and a filename - with an extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "lib", "b.ts");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: "lib",
        isJsonValid: true,
        srcName: "lib",
        entry: "index",
        entryDir: "",
        name: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it("Directory with folder and a filename - with invalid extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "lib", "b.js");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: `lib`,
        isJsonValid: true,
        srcName: "lib",
        entry: "index",
        entryDir: "",
        name: "b",
        isEntryValid: false,
        ext: "js",
      });
    });
  });

  describe("Directory and Entry in a flat structure", () => {
    it("Filename no extension", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const entry = "index";

      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entries-flat"),
        subDir: "",
        isJsonValid: true,
        srcName: "",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it("Filename with an extension", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const entry = "b.ts";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "",
        entry: "b.ts",
        entryDir: "",
        name: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it("with invalid entry with an extension", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const entry = "no.ts";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "",
        entry: "no.ts",
        entryDir: "",
        name: "no",
        isEntryValid: false,
        ext: "ts",
      });
    });

    it("Multi entries", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const res = validateAccess({
        dir: filePath,
        entry: ["a.js", "b.ts", "index", "a.ts"],
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "",
        entries: [
          {
            entry: "a.js",
            entryDir: "",
            isEntryValid: true,
            ext: "js",
            name: "a",
          },
          {
            entry: "b.ts",
            entryDir: "",
            isEntryValid: true,
            ext: "ts",
            name: "b",
          },
          {
            entry: "index",
            entryDir: "",
            isEntryValid: true,
            ext: "js",
            name: "index",
          },
          {
            entry: "a.ts",
            entryDir: "",
            isEntryValid: false,
            ext: "ts",
            name: "a",
          },
        ],
      });
    });
  });

  describe("Directory and Entry in a non-flat structure", () => {
    it("Filename no extension - non-flat structure", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "index";

      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "src",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it("Filename with an extension - non-flat structure", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "index.js";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "src",
        entry: "index.js",
        entryDir: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it("with invalid entry with an extension  - non-flat structure", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "no.ts";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "src",
        entry: "no.ts",
        entryDir: "",
        name: "no",
        isEntryValid: false,
        ext: "ts",
      });
    });

    it("One entry without extension inside an array", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "index";
      const res = validateAccess({ dir: filePath, entry: [entry] });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        entry,
        entryDir: "",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "js",
      });
    });

    it("Entry with src folder without extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "src/index";
      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        entry,
        entryDir: "src",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "js",
      });
    });

    it("Entry with source folder and extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "src/index.js";
      const res = validateAccess({ entry, dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        entry,
        entryDir: "src",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "js",
      });
    });

    it("Entry with source folder and invalid extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "src/index.ts";
      const res = validateAccess({ entry, dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        entry,
        entryDir: "src",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: false,
        name: "index",
        ext: "ts",
      });
    });

    it("Entry with source folder lib and invalid extension", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "lib/b.ts";
      const res = validateAccess({ entry, dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        entry,
        entryDir: "lib",
        isJsonValid: true,
        srcName: "lib",
        isEntryValid: true,
        name: "b",
        ext: "ts",
      });
    });

    it("Entry with invalid source folder", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "noop/index.js";
      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        entry,
        entryDir: "noop",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: false,
        name: "index",
        ext: "js",
      });
    });

    it("Directory with unrecognized source folder", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "random");
      const entry = "a.js";
      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        entry,
        entryDir: "",
        isJsonValid: false,
        srcName: "",
        isEntryValid: true,
        name: "a",
        ext: "js",
      });
    });

    it("Nested Directory", () => {
      const filePath = resolve(source, "valid-json-entry-lib", "lib", "random");
      const entry = "a.js";
      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: resolve(source, "valid-json-entry-lib"),
        subDir: `lib${sep}random`,
        entry,
        entryDir: "",
        isJsonValid: true,
        srcName: "lib",
        isEntryValid: true,
        name: "a",
        ext: "js",
      });
    });

    it("Entry with unrecognized source folder", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "random/a.js";
      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        entry,
        entryDir: "random",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: true,
        name: "a",
        ext: "js",
      });
    });

    it("Entry with unrecognized source folder and invalid file", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const entry = "random/index.ts";
      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        entry,
        entryDir: "random",
        isJsonValid: true,
        srcName: "src",
        isEntryValid: false,
        name: "index",
        ext: "ts",
      });
    });

    it("Multi entries", () => {
      const filePath = resolve(source, "valid-json-entries-src");

      const res = validateAccess({
        dir: filePath,
        entry: ["src/z", "src/a.js", "src/index.ts", "src/index.js", "src/c"],
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        srcName: "src",
        subDir: "",
        entries: [
          {
            entry: "src/z",
            entryDir: "src",
            name: "z",
            ext: "js",
            isEntryValid: true,
          },
          {
            entry: "src/a.js",
            entryDir: "src",
            name: "a",
            ext: "js",
            isEntryValid: true,
          },
          {
            entry: "src/index.ts",
            entryDir: "src",
            name: "index",
            ext: "ts",
            isEntryValid: false,
          },
          {
            entry: "src/index.js",
            entryDir: "src",
            name: "index",
            ext: "js",
            isEntryValid: true,
          },
          {
            entry: "src/c",
            entryDir: "src",
            name: "c",
            ext: "",
            isEntryValid: false,
          },
        ],
      });
    });
  });

  describe("Validate flat files in a structured dir", () => {
    it("With a valid file", () => {
      const filePath = resolve(source, "valid-json-entry-lib");
      const res = validateAccess({
        dir: filePath,
        entry: ["index.ts", "foo.js", "src/index.js"],
        enableFoldersLookup: false,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        srcName: "src",
        entries: [
          {
            entry: "index.ts",
            entryDir: "",
            name: "index",
            ext: "ts",
            isEntryValid: true,
          },
          {
            entry: "foo.js",
            entryDir: "",
            name: "foo",
            ext: "js",
            isEntryValid: true,
          },
          {
            entry: "src/index.js",
            entryDir: "src",
            name: "index",
            ext: "js",
            isEntryValid: true,
          },
        ],
      });
    });
  });
});
