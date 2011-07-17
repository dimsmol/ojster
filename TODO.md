# TODO

* parametrized blocks
* way to override constructor
* fix single file compilation support for path_compiler (works partially)

* add template examples

* fix problem with various number of line breaks between requires for default and custom template based templates
* fix possible collisions problem with auto-requiring default base class and other such things

* fix problem with path to ojster/lib/template (?)
* finalize readme.md

* write usage for bin/ojster (within the script)

* ensure ojster can be used with jQuery and other libraries, at least skipping module-related stuff (without maintaining compatibility with Node and Closure)
* fs watcher for autocompilation (needs some kind of config - which src and dst paths to use, which options)
* perform JS-linting after template compilation

* make Tokenizer extendable (allow to add new commands)
* dynamic inheritance (skins support) - allow to choose which template to inherit in runtime

## GoogRenderer

* fix handling of module subObjects (prohibited now)
* move all goog-related stuff from default generator to GoogGenerator
