const { expect } = require("chai");
const { resolve } = require("path");

const { validateAccess } = require("../src");

const source = resolve(__dirname, "fixtures");

describe("Name of the group", () => {
  it("valid json", () => {
    const validJsonPath = resolve(source, "valid-json");

    const { isValid } = validateAccess({ dir: validJsonPath });
    expect(isValid).to.equal(true);
  });

  it("valid json entries-flat", () => {
    const validJsonPath = resolve(source, "valid-json-entries-flat");

    const res = validateAccess({
      dir: validJsonPath,
      isValidateEntry: true
    });

    expect(res).to.deep.equal({ isValid: true, isSrc: false, ext: "js" });
  });

  it.only("valid json entries-src", () => {
    const validJsonPath = resolve(source, "valid-json-entries-src");

    const res = validateAccess({
      dir: validJsonPath,
      isValidateEntry: true
    });

    expect(res).to.deep.equal({ isValid: true, isSrc: true, ext: "js" });
  });
});
