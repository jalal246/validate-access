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

## parseDir

> Parse a given directory without validation

```js
// DEFAULT_DIR_FOLDERS = ["src", "lib", "dist"];

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

## detectFileInDir

```js
// DEFAULT_EXTENSIONS= ["js", "ts", "jsx", "tsx"]

function detectFileInDir(
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

This also works:

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

## parseAndValidateDir

> Parse and validate a given directory

```js
function parseAndValidateDir(ParseDirInput): ParseDirOutput;
```

Where `ParseDirInput` object contains:

- `dir?: string`
- `targetedFolders?: string | string[]` Default: `["src", "lib", "dist"]`
- `extensions?: string | string[]` Default: `["js", "ts", "jsx", "tsx"]`
- `isEnforceSub?: boolean`
- `isEnforceSrcLookup?: boolean`

Where `ParseDirOutput` object contains:

- `dir: string`
- `subDir: string`
- `srcName: string`
- `includeSrcName: boolean`
- `includeValidEntry: boolean`
- `ext: string`
- `name: string`

### Example - `parseAndValidateDir`

Assuming we have:

```bash
├─pkg
├───src
│   ├───bar.ts
│   └───foo.js
```

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

## validateAccess

Validates package accessibility including package.json and entry file or
multiple entries. It doesn't just check for string format, it actually goes
deeper to check for valid extension and then validate existence.

```js

function validateAccess({
  dir,
  entry = "index",
  targetedFolders = DEFAULT_DIR_FOLDERS,
  extensions = DEFAULT_EXTENSIONS,
  isValidateJson = true,
  enableFoldersLookup= true
}): ValidationOneEntry | ValidationMulti
```

The result object depends on input.

For one entry it returns `ValidationOneEntry`:

- `dir: string`
- `subDir: string`
- `isJsonValid: boolean | null` - true if dir has package.json.
- `srcName: string` - If there's src folder recognized.

with `EntryInfo`:

- `isEntryValid: boolean` - if the given entry is exist.
- `entry: string` - the input entry.
- `entryDir: string` - extracted entry directory.
- `ext: string` - entry extension if exist.
- `name: string` - entry file name that was checked.

And for multi entries `entries: [EntryInfo]`

```bash
├─pkg
│
├───src
│   ├───bar.ts
│   └───foo.js
│
├───random
│   ├───foobar.ts
│
├───package.json
```

### Example - `validateAccess`

```js
const result = validateAccess({
  dir: "home/to/pkg",
  entry: "random/foobar.ts",
});

result = {
  dir: "home/to/pkg",
  subDir: "",
  entry: "random/foobar.ts",
  entryDir: "random",
  isJsonValid: true,
  srcName: "src",
  isEntryValid: true,
  name: "foo",
  ext: "js",
};
```

You will get the same result for `entry: "random/foobar"` - without extension.

Assuming the dir `"home/to/pkg"`, all the following entries are valid:

`entry: "src/foo"`  
`entry: "src/foo.js"`  
`entry: "foo.js"`  
`entry: "foo"`

Or you can provide dir like the following and still get true validation:

`dir: "path/to/valid/package/src/foo"`  
`dir: "path/to/valid/package/src/foo.js"`

Doing multiple entries is also possible:

```js
const filePath = resolve(source, "valid-json-entries-src");

const result = validateAccess({
  dir: "to/pkg",
  entry: ["foo", "src/bar.ts", "index.js"],
  enableFoldersLookup: false,
});

result = {
  ...essential,
  entries: [
    {
      entry: "foo",
      entryDir: "",
      name: "foo",
      ext: "js",
      isEntryValid: true,
    },
    {
      entry: "src/bar.ts",
      entryDir: "src",
      name: "bar",
      ext: "ts",
      isEntryValid: true,
    },
    {
      entry: "index",
      entryDir: "",
      name: "index",
      ext: "js",
      isEntryValid: false,
    },
  ],
};
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

> Support this package by giving it a Star ⭐
