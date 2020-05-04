# validate-access

> Validate project accessibility files

```bash
npm install validate-access
```

## API

### validateAccess

Validates package accessibility including package.json and entry/entries.

```js
validateAccess({
dir?: string,
entry?: string|Array,
srcName? :string
})
```

The result object depends on input. for one entry:

- `isJsonValid: boolean` - true if dir has package.json
- `isSrc: boolean` - true if there's src folder.
- `isEntryValid: boolean` - if given entry is exist.
- `entry: string` - entry name.
- `entryExt: string|null` - entry extension if exist.

And for multi entries:

- `isJsonValid` and `isSrc` (same as above).
- `isEntryValid: Array <entryValidateInfo>`
  - `entry: string` - entry name.
  - `isEntryValid: boolean` - true if entry is valid.
  - `entryExt: string|null` - entry extension if exist.

### Example - One Entry

```js
import { validateAccess } from "validate-access";

// ├───package.json
// ├───src
// │   ├───index.js
// │   └───foo.js
const { isJsonValid, isSrc, entry, isEntryValid, entryExt } = validateAccess({
  dir: "path/to/valid/package",
});

// { isJsonValid: true, isSrc: true, entry: "index", isEntryValid: true, entryExt: "js" }
```

### Example - Multi Entries

```js
import { validateAccess } from "validate-access";

// ├───src
// │   ├───bar.ts
// │   └───foo.js
const { isJsonValid, isSrc, entry, isEntryValid, entryExt } = validateAccess({
  dir: "path/to/valid/package",
  entry: ["bar", "foo", "foobar"],
});

// isJsonValid: false,
// isSrc: true,
// isEntryValid: [
//   {
//     entry: "bar",
//     entryExt: "ts",
//     isEntryValid: true,
//   },
//   {
//     entry: "foo",
//     entryExt: "js",
//     isEntryValid: true,
//   },
//   {
//     entry: "foobar",
//     entryExt: null,
//     isEntryValid: false,
//   },
// ],
```

### getFileExtension

`getFileExtension` is used internally by `validateAccess` however it is exported
for further use.

```js
/**
 * Gets extension used in for given entry
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

- [builderz](https://github.com/jalal246/builderz) - Zero Configuration JS bundler.

- [packageSorter](https://github.com/jalal246/packageSorter) - Sorting packages
  for monorepos production.

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
