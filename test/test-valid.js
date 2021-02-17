/* eslint-disable import/no-extraneous-dependencies */

const { expect } = require("chai");
const { resolve } = require("path");

const { validateAccess } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe("Valid", () => {
  it("Default args", () => {
    const res = validateAccess({});

    expect(res).to.deep.equal({
      isJsonValid: true,
      isSrc: true,
      entry: "index",
      isEntryValid: true,
      entryExt: "ts",
    });
  });

  describe("Only valid json", () => {
    it("Dealing with directory only as input", () => {
      const filePath = resolve(source, "valid-json");

      const res = validateAccess({ dir: filePath });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: false,
        entry: "index",
        isEntryValid: false,
        entryExt: "",
      });
    });

    it("Dealing with directory and entry as input", () => {
      const filePath = resolve(source, "valid-json");

      const res = validateAccess({ dir: filePath, entry: "b.ts" });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: false,
        entry: "b",
        isEntryValid: false,
        entryExt: "ts",
      });
    });

    it("Dealing with directory and entry as input contains src", () => {
      const filePath = resolve(source, "valid-json");

      const res = validateAccess({ dir: filePath, entry: "./src/b.ts" });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: false,
        entry: "b",
        isEntryValid: false,
        entryExt: "ts",
      });
    });
  });

  describe("All valid in flat structure ", () => {
    it("Dealing with directory only as input", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: false,
        entry: "index",
        isEntryValid: true,
        entryExt: "js",
      });
    });

    it("Dealing with a valid targeted entry no extension involved", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
        entry: "b",
      });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: false,
        entry: "b",
        isEntryValid: true,
        entryExt: "ts",
      });
    });

    it("Dealing with a valid targeted entry with an extension involved", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
        entry: "b.ts",
      });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: false,
        entry: "b",
        isEntryValid: true,
        entryExt: "ts",
      });
    });
  });

  describe("Multi entries", () => {
    it("Provides multi files as entries with no extension involved", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
        entry: ["b", "index", "c"],
      });

      expect(res).to.deep.equal({
        isJsonValid: true,
        isSrc: false,
        entries: [
          {
            entry: "b",
            entryExt: "ts",
            isEntryValid: true,
          },
          {
            entry: "index",
            entryExt: "js",
            isEntryValid: true,
          },
          {
            entry: "c",
            entryExt: "",
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
        isJsonValid: true,
        isSrc: false,
        entries: [
          {
            entry: "b",
            entryExt: "ts",
            isEntryValid: true,
          },
          {
            entry: "index",
            entryExt: "js",
            isEntryValid: true,
          },
          {
            entry: "c",
            entryExt: "",
            isEntryValid: false,
          },
          {
            entry: "z",
            entryExt: "js",
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
        isJsonValid: true,
        isSrc: true,
        entries: [
          {
            entry: "z",
            entryExt: "js",
            isEntryValid: true,
          },
          {
            entry: "a",
            entryExt: "js",
            isEntryValid: true,
          },
          {
            entry: "index",
            entryExt: "ts",
            isEntryValid: false,
          },
          {
            entry: "index",
            entryExt: "js",
            isEntryValid: true,
          },
          {
            entry: "src/c",
            entryExt: "",
            isEntryValid: false,
          },
        ],
      });
    });
  });

  describe("Complexity", () => {
    describe("Ignoring a valid src/index", () => {
      it("A custom entry folder/lib with an ext", () => {
        const filePath = resolve(source, "valid-json-entry-lib");

        const res = validateAccess({
          dir: filePath,
          entry: ["lib/a.js"],
        });

        expect(res).to.deep.equal({
          isJsonValid: true,
          isSrc: true,
          entry: "a",
          isEntryValid: true,
          entryExt: "js",
        });
      });

      it("A custom entry folder/lib without an ext", () => {
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
          entryExt: "js",
        });
      });

      it("A custom entry folder/lib with an ext, no array", () => {
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
          entryExt: "js",
        });
      });
    });

    describe("Directory directly points to a valid file ignoring entry", () => {
      it("With an extension ", () => {
        const filePath = resolve(
          source,
          "valid-json-entries-src",
          "src",
          "b.ts"
        );

        const res = validateAccess({
          dir: filePath,
        });

        expect(res).to.deep.equal({
          isJsonValid: false,
          isSrc: false,
          entry: "b",
          isEntryValid: true,
          entryExt: "ts",
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
          entryExt: "ts",
        });
      });

      it("With wrong extension", () => {
        const filePath = resolve(
          source,
          "valid-json-entries-src",
          "src",
          "b.js"
        );

        const res = validateAccess({
          dir: filePath,
        });

        expect(res).to.deep.equal({
          isJsonValid: false,
          isSrc: false,
          entry: "b",
          isEntryValid: false,
          entryExt: "js",
        });
      });

      it("With wrong file name", () => {
        const filePath = resolve(
          source,
          "valid-json-entries-src",
          "src",
          "c.js"
        );

        const res = validateAccess({
          dir: filePath,
        });

        expect(res).to.deep.equal({
          isJsonValid: false,
          isSrc: false,
          entry: "c",
          isEntryValid: false,
          entryExt: "js",
        });
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
      entryExt: "ts",
    });
  });
});
