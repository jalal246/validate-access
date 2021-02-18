/* eslint-disable import/no-extraneous-dependencies */

const { expect } = require("chai");
const { resolve } = require("path");

const { validateAccess } = require("../lib");

const source = resolve(__dirname, "fixtures");

describe("Valid", () => {
  describe.only("No directory but only entry", () => {
    const EXPECTED_DIR = ".";
    const IS_JSON_VALID = true;
    const IS_SRC = true;

    it("Default args", () => {
      const res = validateAccess({});

      expect(res).to.deep.equal({
        dir: EXPECTED_DIR,
        isJsonValid: IS_JSON_VALID,
        isSrc: IS_SRC,
        isEntryValid: true,
        entry: "",
        name: "index",
        ext: "ts",
      });
    });

    it("Specify one input", () => {
      const res = validateAccess({ entry: "index" });

      expect(res).to.deep.equal({
        dir: EXPECTED_DIR,
        isJsonValid: IS_JSON_VALID,
        isSrc: IS_SRC,
        isEntryValid: true,
        entry: "index",
        name: "index",
        ext: "ts",
      });
    });

    it("Specify one input in an array", () => {
      const res = validateAccess({ entry: ["index"] });

      expect(res).to.deep.equal({
        dir: EXPECTED_DIR,
        isJsonValid: IS_JSON_VALID,
        isSrc: IS_SRC,
        entry: "index",
        name: "index",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it("Specify multi inputs", () => {
      const res = validateAccess({
        entry: ["a.js", "index", "src/index", "src/index.js"],
      });

      expect(res).to.deep.equal({
        dir: EXPECTED_DIR,
        isJsonValid: IS_JSON_VALID,
        isSrc: IS_SRC,
        entries: [
          {
            entry: "a.js",
            name: "a",
            isEntryValid: false,
            ext: "js",
          },
          {
            entry: "index",
            name: "index",
            isEntryValid: true,
            ext: "ts",
          },
          {
            entry: "src/index",
            name: "index",
            isEntryValid: true,
            ext: "ts",
          },
          {
            entry: "src/index.js",
            name: "index",
            isEntryValid: false,
            ext: "js",
          },
        ],
      });
    });
  });

  describe.only("Only valid json", () => {
    it("Dealing with directory only as input", () => {
      const filePath = resolve(source, "valid-json");

      const res = validateAccess({ dir: filePath });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: false,
        entry: "",
        name: "index",
        isEntryValid: false,
        ext: "",
      });
    });

    it("Dealing with directory and entry as input", () => {
      const filePath = resolve(source, "valid-json");
      const entry = "b.ts";

      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: false,
        entry,
        name: "b",
        isEntryValid: false,
        ext: "ts",
      });
    });

    it("Dealing with directory and entry as input contains src", () => {
      const filePath = resolve(source, "valid-json");
      const entry = "./src/b.ts";

      const res = validateAccess({ dir: filePath, entry });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: false,
        entry,
        name: "b",
        isEntryValid: false,
        ext: "ts",
      });
    });
  });

  describe.only("All valid in flat structure ", () => {
    it("Dealing with directory only as input", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: false,
        entry: "",
        name: "index",
        isEntryValid: true,
        ext: "js",
      });
    });

    it("Dealing with a valid targeted entry no extension involved", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const entry = "b";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: false,
        entry,
        name: "b",
        isEntryValid: true,
        ext: "ts",
      });
    });

    it("Dealing with a valid targeted entry with an extension involved", () => {
      const filePath = resolve(source, "valid-json-entries-flat");
      const entry = "b.ts";

      const res = validateAccess({
        dir: filePath,
        entry,
      });

      expect(res).to.deep.equal({
        dir: filePath,
        isJsonValid: true,
        isSrc: false,
        entry,
        name: "b",
        isEntryValid: true,
        ext: "ts",
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

  describe.only("Multi entries", () => {
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
          ext: "js",
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
          ext: "js",
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
          ext: "js",
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
          ext: "js",
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
          ext: "js",
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
      ext: "ts",
    });
  });
});
