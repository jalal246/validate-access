const { expect } = require("chai");
const { resolve } = require("path");

const { parseEntry } = require("../lib");

describe("Entry Parser", () => {
  describe("Common Cases", () => {
    const DEFAULT_SRC_NAME = "src";

    it("Empty entry", () => {
      const entry = "";
      const res = parseEntry(entry, DEFAULT_SRC_NAME);

      expect(res).to.deep.equal({
        entry,
        entryDir: "",
        name: "",
        ext: "",
      });
    });

    it("Entry with extension", () => {
      const entry = "a.js";
      const res = parseEntry(entry, DEFAULT_SRC_NAME);

      expect(res).to.deep.equal({
        entry,
        entryDir: "",
        name: "a",
        ext: "js",
      });
    });

    it("Entry without extension", () => {
      const entry = "a";
      const res = parseEntry(entry, DEFAULT_SRC_NAME);

      expect(res).to.deep.equal({
        entry,
        entryDir: "",
        name: "a",
        ext: "",
      });
    });
  });

  describe("Default src name", () => {
    const DEFAULT_SRC_NAME = "src";

    it("Entry with src without extension", () => {
      const entry = "src/a";
      const res = parseEntry(entry, DEFAULT_SRC_NAME);

      expect(res).to.deep.equal({
        entry,
        entryDir: "src",
        name: "a",
        ext: "",
      });
    });

    it("Entry with src and extension", () => {
      const entry = "src/a.ts";
      const res = parseEntry(entry, DEFAULT_SRC_NAME);

      expect(res).to.deep.equal({
        entry,
        entryDir: "src",
        name: "a",
        ext: "ts",
      });
    });
  });

  describe("Named src", () => {
    const DEFAULT_SRC_NAME = "lib";

    it("Entry with src named without extension", () => {
      const entry = "lib/a";
      const res = parseEntry(entry, DEFAULT_SRC_NAME);

      expect(res).to.deep.equal({
        entry,
        entryDir: "lib",
        name: "a",
        ext: "",
      });
    });

    it("Entry with src named and extension", () => {
      const entry = "lib/a.ts";
      const res = parseEntry(entry, DEFAULT_SRC_NAME);

      expect(res).to.deep.equal({
        entry,
        entryDir: "lib",
        name: "a",
        ext: "ts",
      });
    });
  });

  describe("With folder not src", () => {
    it("Entry with folder without extension", () => {
      const entry = "lib/a";
      const res = parseEntry(entry, undefined);

      expect(res).to.deep.equal({
        entry,
        entryDir: "lib",
        name: "a",
        ext: "",
      });
    });

    it("Entry with folder and extension", () => {
      const entry = "lib/a.tsx";
      const res = parseEntry(entry, undefined);

      expect(res).to.deep.equal({
        entry,
        entryDir: "lib",
        name: "a",
        ext: "tsx",
      });
    });
  });

  describe("With folder and default src", () => {
    const DEFAULT_SRC_NAME = "src";

    it("Entry with src/folder without extension", () => {
      const fullEntry = resolve("src", "lib", "a");
      const entryDir = resolve("src", "lib");

      const res = parseEntry(fullEntry, DEFAULT_SRC_NAME);

      expect(res).to.deep.equal({
        entry: fullEntry,
        entryDir,
        name: "a",
        ext: "",
      });
    });
    it("Entry with src/folder and extension", () => {
      const fullEntry = resolve("src", "lib", "a.jsx");
      const entryDir = resolve("src", "lib");

      const res = parseEntry(fullEntry, DEFAULT_SRC_NAME);

      expect(res).to.deep.equal({
        entry: fullEntry,
        entryDir,
        name: "a",
        ext: "jsx",
      });
    });
  });
});
