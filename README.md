# validate-access

> The only function which is crazy enough to validate project accessibility
> files in all possible means - literally.

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
srcName? :string,
isValidateJson? :boolean
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
  - `isValid: boolean` - true if entry is valid.
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

It works with different form of entry. So, `isEntryValid: true` in all the
following cases:  
`entry: "src/foo"`  
`entry: "src/foo.js"`  
`entry: "foo.js"`  
`entry: "foo"`

### Example - Different Entry Form

```js
import { validateAccess } from "validate-access";

// ├───package.json
// ├───src
// │   ├───index.js
// │   └───foo.js

const { isJsonValid, isSrc, entry, isEntryValid, entryExt } = validateAccess({
  dir: "path/to/valid/package",
  entry: "src/foo.js",
});

// { isJsonValid: true, isSrc: true, entry: "foo", isEntryValid: true, entryExt: "js" }
```

### Example - Custom Entry

```js
import { validateAccess } from "validate-access";

// ├───index.json
// ├───foo.ts

const { isJsonValid, isSrc, entry, isEntryValid, entryExt } = validateAccess({
  dir: "path/to/valid/package",
  entry: "foo",
});

// { isJsonValid: false, isSrc: false, entry: "foo", isEntryValid: true, entryExt: "ts" }
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
//     isValid: true,
//   },
//   {
//     entry: "foo",
//     entryExt: "js",
//     isValid: true,
//   },
//   {
//     entry: "foobar",
//     entryExt: null,
//     isValid: false,
//   },
// ],
```

## Test

```sh
npm test
```

## License

This project is licensed under the [GPL-3.0 License](https://github.com/jalal246/validate-access/blob/master/LICENSE)

### Related projects

- [builderz](https://github.com/jalal246/builderz) - Zero Configuration JS bundler.

- [packageSorter](https://github.com/jalal246/packageSorter) - Sorting packages
  for monorepos production.

- [corename](https://github.com/jalal246/corename) - Extracts package name.

- [move-position](https://github.com/jalal246/move-position) - Moves element
  index in an array.

- [get-info](https://github.com/jalal246/get-info) - Utility functions for projects production.

- [textics](https://github.com/jalal246/textics) &
  [textics-stream](https://github.com/jalal246/textics-stream) - Counts lines,
  words, chars and spaces for a given string.

- [folo](https://github.com/jalal246/folo) - Form & Layout Components Built with React.
