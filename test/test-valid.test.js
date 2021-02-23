/* eslint-disable import/no-extraneous-dependencies */

// @ts-check

const { expect } = require("chai");
const { resolve } = require("path");

const { validateAccess } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe("Validate Access", () => {
  describe.only("No directory but only entry", () => {
    let EXPECTED_RESULT = {
      dir: ".",
      subDir: "",
      entry: "index",
      entryDir: "",
      isJsonValid: true,
      isSrc: true,
      srcName: "src",
      isEntryValid: true,
      name: "index",
      ext: "ts",
    };

    it.only("Default args", () => {
      const res = validateAccess({});

      expect(res).to.deep.equal(EXPECTED_RESULT);
    });

    it.only("One entry without extension", () => {
      const res = validateAccess({ entry: "index" });

      expect(res).to.deep.equal(EXPECTED_RESULT);
    });

    it.only("One entry without extension inside an array", () => {
      const res = validateAccess({ entry: ["index"] });

      expect(res).to.deep.equal(EXPECTED_RESULT);
    });

    it.only("Entry with dir without extension", () => {
      const entry = "src/index";
      const res = validateAccess({ entry });

      EXPECTED_RESULT = {
        dir: ".",
        subDir: "",
        entry,
        entryDir: "src",
        isJsonValid: true,
        isSrc: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "ts",
      };

      expect(res).to.deep.equal(EXPECTED_RESULT);
    });

    it.only("Entry with dir and extension", () => {
      const entry = "src/index.ts";
      const res = validateAccess({ entry });

      EXPECTED_RESULT = {
        dir: ".",
        subDir: "",
        entry,
        entryDir: "src",
        isJsonValid: true,
        isSrc: true,
        srcName: "src",
        isEntryValid: true,
        name: "index",
        ext: "ts",
      };

      expect(res).to.deep.equal(EXPECTED_RESULT);
    });

    it.only("Entry with dir and wrong extension", () => {
      const entry = "src/index.js";
      const res = validateAccess({ entry });

      EXPECTED_RESULT = {
        dir: ".",
        subDir: "",
        entry,
        entryDir: "src",
        isJsonValid: true,
        isSrc: true,
        srcName: "src",
        isEntryValid: false,
        name: "index",
        ext: "js",
      };

      expect(res).to.deep.equal(EXPECTED_RESULT);
    });

    it.only("Multiple entries", () => {
      const res = validateAccess({
        entry: ["a.js", "index", "src/index", "src/index.js"],
      });

      expect(res).to.deep.equal({
        dir: ".",
        subDir: "",
        isJsonValid: true,
        isSrc: true,
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

  describe.only("Only valid json on the folder", () => {
    it.only("Only dir", () => {
      const filePath = resolve(source, "valid-json");

      const res = validateAccess({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        isSrc: false,
        srcName: "",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: false,
        ext: "",
      });
    });

    it.only("Directory and non-existence entry", () => {
      const filePath = resolve(source, "valid-json");
      const entry = "b.ts";

      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        isSrc: false,
        srcName: "",
        entry,
        entryDir: "",
        name: "b",
        isEntryValid: false,
        ext: "ts",
      });
    });

    it.only("Directory and non-existence entry and src file name", () => {
      const filePath = resolve(source, "valid-json");
      const entry = "./src/b.ts";

      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        isSrc: false,
        srcName: "",
        entry,
        entryDir: "./src",
        name: "b",
        isEntryValid: false,
        ext: "ts",
      });
    });
  });

  describe.only("Testing with flat structure", () => {
    it.only("Directory only", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        isSrc: false,
        srcName: "",
        entry: "index",
        entryDir: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it.only("Directory with an entry without an extension", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const entry = "b";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        isSrc: false,
        srcName: "",
        entry: "b",
        entryDir: "",
        name: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it.only("Directory with an entry and  extension", () => {
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
        isSrc: false,
        srcName: "",
        entry: "b.ts",
        entryDir: "",
        name: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it.only("Directory with an entry and  wrong extension", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const entry = "b.js";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        isSrc: false,
        srcName: "",
        entry: "b.js",
        entryDir: "",
        name: "b",
        isEntryValid: false,
        ext: "js",
      });
    });

    it.only("Multiple entries", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
        entry: ["a.js", "b.ts", "index"],
      });

      expect(res).to.deep.equal({
        dir: filePath,
        subDir: "",
        isJsonValid: true,
        isSrc: false,
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
        ],
      });
    });
  });

  describe.only("All valid project with src structure", () => {
    it("Dealing with directory only as input", () => {
      const filePath = resolve(source, "valid-json-entries-src");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: true,
        entry: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it("Dealing with a valid targeted entry no extension involved", () => {
      const filePath = resolve(source, "valid-json-entries-src");
      const entry = "b";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: true,
        entry,
        name: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it("Dealing with a valid targeted entry with an extension involved", () => {
      const filePath = resolve(source, "valid-json-entries-src");
      const entry = "b.ts";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: true,
        entry,
        name: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });
  });

  describe("Multi entries", () => {
    it("Provides multi files as entries with no extension involved", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const entries = ["b", "index", "c"];

      const res = validateAccess({
        dir: filePath,
        entry: entries,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: false,
        entries: [
          {
            entry: "b",
            ext: "ts",
            name: "b",
            isEntryValid: true,
          },
          {
            entry: "index",
            ext: "js",
            name: "index",
            isEntryValid: true,
          },
          {
            entry: "c",
            ext: "",
            name: "c",
            isEntryValid: false,
          },
        ],
      });
    });

    it("Provides multi files as entries with extensions involved", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
        entry: ["b.ts", "index.js", "c", "z"],
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: false,
        entries: [
          {
            entry: "b.ts",
            name: "b",
            ext: "ts",
            isEntryValid: true,
          },
          {
            entry: "index.js",
            name: "index",
            ext: "js",
            isEntryValid: true,
          },
          {
            entry: "c",
            name: "c",
            ext: "",
            isEntryValid: false,
          },
          {
            entry: "z",
            name: "z",
            ext: "js",
            isEntryValid: true,
          },
        ],
      });
    });

    it("Figures out entries with src included as inputs and extensions attached", () => {
      const filePath = resolve(source, "valid-json-entries-src");

      const res = validateAccess({
        dir: filePath,
        entry: ["src/z", "src/a.js", "src/index.ts", "src/index.js", "src/c"],
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: true,
        entries: [
          {
            entry: "src/z",
            name: "z",
            ext: "js",
            isEntryValid: true,
          },
          {
            entry: "src/a.js",
            name: "a",
            ext: "js",
            isEntryValid: true,
          },
          {
            entry: "src/index.ts",
            name: "index",
            ext: "ts",
            isEntryValid: false,
          },
          {
            entry: "src/index.js",
            name: "index",
            ext: "js",
            isEntryValid: true,
          },
          {
            entry: "src/c",
            name: "c",
            ext: "",
            isEntryValid: false,
          },
        ],
      });
    });
  });

  describe("Passing entry with folder name ignoring a valid src", () => {
    it("A custom entry folder/lib with an ext", () => {
      const filePath = resolve(source, "valid-json-entry-lib");

      const res = validateAccess({
        dir: filePath,
        entry: ["lib/a.js"],
      });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: true,
        entry: "lib/a.js",
        name: "a",
        isEntryValid: true,
        ext: "js",
      });
    });

    it.skip("A custom entry folder/lib without an ext", () => {
      const filePath = resolve(source, "valid-json-entry-lib");

      const res = validateAccess({
        dir: filePath,
        entry: ["lib/a"],
      });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: true,
        entry: "a",
        isEntryValid: true,
        ext: "js",
      });
    });

    it.skip("A custom entry folder/lib with an ext, no array", () => {
      const filePath = resolve(source, "valid-json-entry-lib");

      const res = validateAccess({
        dir: filePath,
        entry: "lib/a.js",
      });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: true,
        entry: "a",
        isEntryValid: true,
        ext: "js",
      });
    });
  });

  describe("Directory directly points to a valid file ignoring entry", () => {
    it("With an extension ", () => {
      const filePath = resolve(source, "valid-json-entries-src", "src", "b.ts");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        isJsonValid: false,
        isSrc: false,
        entry: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it("Without an extension", () => {
      const filePath = resolve(source, "valid-json-entries-src", "src", "b");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        isJsonValid: false,
        isSrc: false,
        entry: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it("With wrong extension", () => {
      const filePath = resolve(source, "valid-json-entries-src", "src", "b.js");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        isJsonValid: false,
        isSrc: false,
        entry: "b",
        isEntryValid: false,
        ext: "js",
      });
    });

    it("With wrong file name", () => {
      const filePath = resolve(source, "valid-json-entries-src", "src", "c.js");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        isJsonValid: false,
        isSrc: false,
        entry: "c",
        isEntryValid: false,
        ext: "js",
      });
    });
  });

  it("specific entry non-flat with extension included", () => {
    const filePath = resolve(source, "valid-json-entries-src");

    const res = validateAccess({
      dir: filePath,
      entry: "b.ts",
    });

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: true,
      entry: "b",
      isEntryValid: true,
      ext: "ts",
    });
  });
});