# TODO

* introduce `@funcs` (static func)
* introduce `@init` (with auto base call)
* introduce `setup`, extend @insert syntax

* remove extra line break after function definition
* add locals for func
* add base calls for func
* introduce `@base` (remove $base)

## enhancements

* make errors-generation produces results in random order, do something with it

* write generic generator for client-side (to use with jQuery, etc.)
* write usage for bin/ojster (within the script)

* fail with error in generator if some required component is not found (alias, path, etc.)
* add more checks to tokenizer (see TODOs in source code)

* do not skip BlockStart token on duplicate block name, but still report an error (how?)
* think about way to add common functionality to core by subclassing without need to create subclass for every kind of generator (node, goog, etc.)

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
