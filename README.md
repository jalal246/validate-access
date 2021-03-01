# validate-access

> Utility functions, parse, validate and extract data for a given directory with
> multiple entries.

```bash
npm install validate-access
```

## API

- [parseDir](#parseDir)
- [detectFileInDir](#detectFileInDir)
- [parseAndValidateDir](#arseAndValidateDir)
- [validateAccess](#validateAccess)

### parseDir

> Parse a given directory without validation

```ts
// DEFAULT_DIR_FOLDERS = ["src", "lib", "dist"];

function parseDir(
  pureDir: string,
  targetedFolders?: string[] | string,
  isEnforceSub?: boolean
): {
  dir: string;
  subDir: string;
  filename: string;
  srcName: string;
};

function parseDir(
  pureDir: string,
  targetedFolders: string[] | string = DEFAULT_DIR_FOLDERS,
  isEnforceSub: boolean = true
): {
  dir: string;
  subDir: string;
  filename: string;
  srcName: string;
};
```

### Example - `parseDir`

Directory includes source folder

```js
let result = parseDir("home/to/pkg/src");

result = {
  dir: "home/to/pkg",
  subDir: "src",
  srcName: "src",
  filename: "",
};
```

Basic directory:

```js
let result = parseDir("home/to/pkg/src");

result = {
  dir: "home/to/pkg",
  subDir: "src",
  srcName: "src",
  filename: "",
};
```

Directory includes a file:

```js
const result = parseDir("home/to/pkg/src/folder/myFile.js");

result = {
  dir: "home/to/pkg",
  subDir: "src/folder",
  srcName: "src",
  filename: "myFile.js",
};
```

Custom source folders:

```js
// You can pass an array or a string
const result = parseDir("home/to/pkg/test/folder/myFile.js", "test");

result = {
  dir: "home/to/pkg",
  subDir: "test/folder",
  srcName: "test",
  filename: "myFile.js",
};
```

### detectFileInDir

```js
// DEFAULT_EXTENSIONS= ["js", "ts", "jsx", "tsx"]

detectFileInDir(
  dir: string,
  extensions: string | string[] = DEFAULT_EXTENSIONS,
  enableSearchForExt = true
): {
  includeValidEntry: boolean;
  ext: string;
  name: string;
};
```

When `enableSearchForExt` the function will add extensions to your directory
and try to validate the output.

### Example - `detectFileInDir`

```js
const result = detectFileInDir("home/to/pkg/folder/myFile.js");

result = {
  includeValidEntry: true,
  name: "myFile",
  ext: "js",
};
```

This is also works:

```js
const result = detectFileInDir("home/to/pkg/folder/myFile");

result = {
  includeValidEntry: true,
  name: "myFile",
  ext: "js",
};
```

No valid file:

```js
const result = detectFileInDir("home/to/pkg/test/folder");

result = {
  includeValidEntry: false,
  name: "",
  ext: "",
};
```

### parseAndValidateDir

> Parse and validate a given directory

```js
parseAndValidateDir(ParseDirInput): ParseDirOutput;
```

Where `ParseDirInput` object contains:

`dir?: string`
`targetedFolders?: string | string[]` Default: `["src", "lib", "dist"]`
`extensions?: string | string[]` Default: `["js", "ts", "jsx", "tsx"]`
`isEnforceSub?: boolean`
`isEnforceSrcLookup?: boolean`

Where `ParseDirOutput` object contains:

`dir: string`
`subDir: string`
`srcName: string`
`includeSrcName: boolean`
`includeValidEntry: boolean`
`ext: string`
`name: string`

### Example - `parseAndValidateDir`

Assuming we have:

├─pkg
├───src
│ ├───bar.ts
│ └───foo.js

```js
const result = parseAndValidateDir({ dir: "home/to/pkg" });

result = {
  subDir: "valid-json-entry-lib",
  srcName: "src", // Auto detected
  includeSrcName: false,
  includeValidEntry: false,
  ext: "",
  name: "",
};
```

If Directory has a srcName:

```js
const result = parseAndValidateDir({ dir: "home/to/pkg/src" });

result = {
  subDir: "valid-json-entry-lib",
  srcName: "src", // Auto detected
  includeSrcName: true,
  includeValidEntry: false,
  ext: "",
  name: "",
};
```

With a file name provided:

```js
const result = parseAndValidateDir({ dir: "home/to/pkg/src/foo.js" });

result = {
  subDir: "valid-json-entry-lib",
  srcName: "src", // Auto detected
  includeSrcName: true,
  includeValidEntry: true,
  name: "foo",
  ext: "js",
};
```

### validateAccess

Validates package accessibility including package.json and entry file or
multiple entries. It doesn't just check for string format, it actually goes
deeper to check for valid extension and then validate existence.

```js
validateAccess({
  dir?: string, // default: .
  entry?: string|string[],
  srcName? :string, // default: src
  isValidateJson? :boolean, // default: true
  extension?: string[] // default: ["js", "ts"];
})
```

The result object depends on input.

For one entry it returns:

- `isJsonValid: boolean | null` - true if dir has package.json.
- `isSrc: boolean` - true if there's src folder.
- `isEntryValid: boolean` - if given entry is exist.
- `entry: string` - entry file name that was checked.
- `entryExt: string` - entry extension if exist.

And for multi entries:

- `isJsonValid` and `isSrc` (same as above).
- `entries: Array <EntryValidateInfo>`
  - `isEntryValid: boolean` - if given entry is exist.
  - `entry: string` - entry file name that was checked.
  - `entryExt: string` - entry extension if exist.

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

>

{ isJsonValid: true, isSrc: true, entry: "index", isEntryValid: true, entryExt: "js" }
```

It works with different form of entry. So, `isEntryValid: true` in all the
following cases:  
`entry: "src/foo"`  
`entry: "src/foo.js"`  
`entry: "foo.js"`  
`entry: "foo"`  
`dir: "path/to/valid/package/src/foo"`  
`dir: "path/to/valid/package/src/foo.js"`

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

>

{ isJsonValid: true, isSrc: true, entry: "foo", isEntryValid: true, entryExt: "js" }
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

>
  {
    isJsonValid: false,
    isSrc: false,
    entry: "foo",
    entryExt: "ts"
    isEntryValid: true,
  }
```

You will get the same result using:

```js
const { isJsonValid, isSrc, entry, isEntryValid, entryExt } = validateAccess({
  dir: "path/to/valid/package/foo",
});
```

Or

```js
const { isJsonValid, isSrc, entry, isEntryValid, entryExt } = validateAccess({
  dir: "path/to/valid/package/foo.ts",
});
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

>
  isJsonValid: false,
  isSrc: true,
  entries: [
    {
      entry: "bar",
      entryExt: "ts",
      isEntryValid: true,
    },
    {
      entry: "foo",
      entryExt: "js",
      isEntryValid: true,
    },
    {
      entry: "foobar",
      entryExt: "",
      isEntryValid: false,
    },
  ],
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
