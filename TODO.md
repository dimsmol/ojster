# TODO

* names for tokens
* examples for error check
* more effective buffers join
* introduce GeneratorBase, extract ClientGenerator superclass

* introduce `@func`
* introduce `@init` (with auto base call)
* introduce `setup`, extend @insert syntax

* write generic generator for jQuery/commonJS/...
* write usage for bin/ojster (within the script)


* make tests (use examples)

* fail with error in generator if some required component is not found (alias, path, etc.)
* add more checks for tokenizer (see TODOs in source code)
* TODOs in path_compiler.js
* TODOs in tools/fs.js

## readme.md

* add description for all commands
* rewrite readme

## examples

* fixes related to alias->name in @require
* better examples

## known issues

* tokenizer's regex that parses identifiers is too strict, but don't want to fix it

## add if somebody really need it

* generator-specific includes (parts of template script that will be included for specific generators only)
* make Tokenizer extendable (allow to add new commands)
* think about skins support
