# TODO

* move tokens parsing code into tokens, handle it more object-oriented way
* refactor generator to make it more object-oriented

* introduce `@func`
* introduce `@init` (with auto base call)
* introduce `setup`, extend @insert syntax
* use goog.base

* fail with error in generator if some required component is not found (alias, path, etc.)

* write generic generator for jQuery/commonJS/...

* write usage for bin/ojster (within the script)

* introduce standard way to handle options and defaults

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
