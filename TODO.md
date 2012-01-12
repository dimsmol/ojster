# TODO

* introduce GeneratorBase, extract ClientGenerator superclass

* introduce `@func`
* introduce `@init` (with auto base call)
* introduce `setup`, extend @insert syntax

## enhancements

* write generic generator for jQuery/commonJS/...
* write usage for bin/ojster (within the script)

* fail with error in generator if some required component is not found (alias, path, etc.)
* add more checks to tokenizer (see TODOs in source code)

* do not skip BlockStart token on duplicate block name, but still report an error (how?)

* TODOs in path_compiler.js
* TODOs in tools/fs.js

* think about way of using regular Array as writer

* more error_examples
* make tests (use examples and error_examples)

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
