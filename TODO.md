* fix export name for browserglobals
* inherits - add to ojster, allow override
* extra empty lines?

* use args
* use mkdirp

* use Buffer instead of `[]` (?)

* remove ability to use `<% %>` code blocks beyond block

* prevent duplicate func names
* make examples cleaner (remove old style code, etc.)

* use generic Symbol token instead of Space

* `make errors-generation` produces results in random order, do something with it
* write usage for `bin/ojster` (within the script)

* fail with error in generator if some required component is not found (alias, path, etc.)
* add more checks to tokenizer (see TODOs in source code)

* fix alignment for locals of `@insert`

* do not skip BlockStart token on duplicate block name, but still report an error (how?)
* think about way to add common functionality to core by subclassing without need to create subclass for every kind of generator (node, goog, etc.)

* TODOs in `path_compiler.js`

* more error_examples
* tests (use examples and error_examples)

## readme

* add description for all commands
* rewrite readme

## examples

* fixes related to alias->name in @require
* better examples

## known issues

* tokenizer's regex that parses identifiers is too strict, but don't want to fix it

## add if somebody really need it

* generator-specific includes (parts of template script that will be included for specific generators only)
