# validate-access

> Validate project accessability files

```bash
npm install validate-access
```

## API

### validateAccess

```js
/**
 * Validates access for `package.json` and project entry if
 * provided.
 *
 * @param {string} [dir="."] - project directory
 * @param {boolean} [isValidateEntry=false] - if false, it only validate `package.json`
 * @param {string} [entry="index"]
 * @param {string} [srcName="src"]
 *
 * @returns {Object} result
 * @returns {boolean} result.isValid - true, if access is valid
 * @returns {boolean} result.isSrc - true, if project contains src folder
 * @returns {string} result.ext - entry file extension
 */
function validateAccess({
  dir,
  isValidateEntry,
  entry,
  srcName
})
```

### Example(1)

```js
import { validateAccess } from "validate-access";

const { isValid, isSrc, ext } = validateAccess({
  dir: "path/to/valid",
  isValidateEntry: true
});

// { isValid: true, isSrc: true, ext: js }
```

### getFileExtension

`getFileExtension` is used internally by `validateAccess` however it is exproted
for further use.

```js
/**
 * Gets extension used in for given entry. 
 *
 * @param {string} dir - project directory
 * @param {string} entry - project file entry name
 * @returns {string|undefined} extension if exist
 */
function getFileExtension(dir, entry)
```

### Example(2)

```js
import { validateAccess } from "validate-access";

const extension = getFileExtension("path/to/valid", "index");

// extension > js
```

### Related projects

- [packageSorter](https://github.com/jalal246/packageSorter) - Sorting packages
  for monorepos production.

- [builderz](https://github.com/jalal246/builderz) - Build your project(s) with zero configuration

- [corename](https://github.com/jalal246/corename) - Extracts package name.

- [move-position](https://github.com/jalal246/move-position) - Moves element
  index in an array.

- [get-info](https://github.com/jalal246/get-info) - Utility functions for projects production.

- [textics](https://github.com/jalal246/textics) & [textics-stream](https://github.com/jalal246/textics-stream) - Counts lines, words, chars and spaces for a given string.

## Test

```sh
npm test
```

## License

This project is licensed under the [GPL-3.0 License](https://github.com/jalal246/validate-access/blob/master/LICENSE)
