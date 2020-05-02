const { expect } = require("chai");
const { resolve } = require("path");

const { validateAccess } = require("../src");

const source = resolve(__dirname, "fixtures");

describe("validateAccess", () => {
  describe("valid", () => {
    it("valid json", () => {
      const filePath = resolve(source, "valid-json");

      const res = validateAccess({ dir: filePath });

      expect(res).to.deep.equal({
        isValidJson: true,
        isSrc: false,
        ext: null,
      });
    });

    it("valid json entries-flat", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true,
      });

      expect(res).to.deep.equal({ isValidJson: true, isSrc: false, ext: "js" });
    });

    it("valid json entries-src", () => {
      const filePath = resolve(source, "valid-json-entries-src");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true,
      });

      expect(res).to.deep.equal({ isValidJson: true, isSrc: true, ext: "js" });
    });

    it("valid json custom entries-src", () => {
      const filePath = resolve(source, "valid-json-entries-src");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true,
        entry: "a",
      });

      expect(res).to.deep.equal({ isValidJson: true, isSrc: true, ext: "js" });
    });

    it("valid json custom entries-src different ext", () => {
      const filePath = resolve(source, "valid-json-entries-src");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true,
        entry: "b",
      });

      expect(res).to.deep.equal({ isValidJson: true, isSrc: true, ext: "ts" });
    });

    it("valid json custom entries-lib different ext", () => {
      const filePath = resolve(source, "valid-json-entry-lib");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true,
        srcName: "lib",
      });

      expect(res).to.deep.equal({ isValidJson: true, isSrc: true, ext: "js" });
    });
  });

  describe("invalid", () => {
    it("invalid json", () => {
      const filePath = resolve(source, "invalid-json");

      const { isValidJson } = validateAccess({ dir: filePath });
      expect(isValidJson).to.equal(false);
    });

    it("invalid json entries-flat", () => {
      const filePath = resolve(source, "invalid-entries-flat");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true,
      });

      expect(res).to.deep.equal({
        isValidJson: false,
        isSrc: false,
        ext: null,
      });
    });

    it("invalid json entries-src", () => {
      const filePath = resolve(source, "invalid-entries-src");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true,
      });

      expect(res).to.deep.equal({
        isValidJson: false,
        isSrc: false,
        ext: null,
      });
    });
  });
});
