# TODO

* add --scope option, check correctness in scope mode
* parametrized blocks

* fix single file compilation support for path_compiler (works partially)
* move all goog-related stuff from default generator to GoogGenerator

* add template examples
* finalize readme.md

* write usage for bin/ojster (within the script)
* way to override constructor

* ensure ojster can be used with jQuery and other libraries, at least skipping module-related stuff (without maintaining compatibility with Node and Closure)
* fs watcher for autocompilation (needs some kind of config - which src and dst paths to use, which options)
* perform JS-linting after template compilation

* fix identifierRegExp in tokenizer (too strict for now)
* make Tokenizer extendable (allow to add new commands)
* dynamic inheritance (skins support) - allow to choose which template to inherit in runtime
