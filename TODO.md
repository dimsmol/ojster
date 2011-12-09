# TODO

* fix @insert - support the same syntax as @inherits

* fail with error in generator if some required component is not found (alias, path, etc.)

* write generic generator for jQuery/commonJS/...

* write usage for bin/ojster (within the script)

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
* way to override constructor (?)
* make Tokenizer extendable (allow to add new commands)
* dynamic inheritance (skins support) - allow to choose which template to inherit in runtime
