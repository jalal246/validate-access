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
        isValid: true,
        isSrc: undefined,
        ext: undefined
      });
    });

    it("valid json entries-flat", () => {
      const filePath = resolve(source, "valid-json-entries-flat");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true
      });

      expect(res).to.deep.equal({ isValid: true, isSrc: false, ext: "js" });
    });

    it("valid json entries-src", () => {
      const filePath = resolve(source, "valid-json-entries-src");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true
      });

      expect(res).to.deep.equal({ isValid: true, isSrc: true, ext: "js" });
    });
  });

  describe("invalid", () => {
    it("invalid json", () => {
      const filePath = resolve(source, "invalid-json");

      const { isValid } = validateAccess({ dir: filePath });
      expect(isValid).to.equal(false);
    });

    it("invalid json entries-flat", () => {
      const filePath = resolve(source, "invalid-entries-flat");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true
      });

      expect(res).to.deep.equal({
        isValid: false,
        isSrc: false,
        ext: undefined
      });
    });

    it("invalid json entries-src", () => {
      const filePath = resolve(source, "invalid-entries-src");

      const res = validateAccess({
        dir: filePath,
        isValidateEntry: true
      });

      expect(res).to.deep.equal({
        isValid: false,
        isSrc: true,
        ext: undefined
      });
    });
  });
});
