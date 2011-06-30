# TODO

* finalize readme.md

* write usage for bin/ojster (within the script)
* add template examples

* ensure ojster can be used with jQuery and other libraries, at least skipping module-related stuff (without maintaining compatibility with Node and Closure)
* fs watcher for autocompilation (needs some kind of config - which src and dst paths to use, which options)
* perform JS-linting after template compilation

* make Tokenizer extendable (allow to add new commands)

* fix single file compilation support for path_compiler (works partially)

* provide a way to render template directly to stream (for node.js templates), also a way to render to stream of other template (for cases when one template renders other as part of itself)

## GoogRenderer

* make usage of goog.scope an option
* fix handling of module subObjects (prohibited now)
