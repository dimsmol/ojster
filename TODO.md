# TODO

* examples need fixes related to alias->name in @require
* fail with error in generator if some required component is not found (alias, path, etc.)

* add createElement(html) and others (?)

* parametrized blocks

* fix single file compilation support for path_compiler (works partially)

* add template examples
* finalize readme.md
    * mention that render() always calls renderMainBlock() without arguments

* write usage for bin/ojster (within the script)
* way to override constructor

* ensure ojster can be used with jQuery and other libraries, at least skipping module-related stuff (without maintaining compatibility with Node and Closure)
* fs watcher for autocompilation (needs some kind of config - which src and dst paths to use, which options)
* perform JS-linting after template compilation

* fix identifierRegExp in tokenizer (too strict for now)
* make Tokenizer extendable (allow to add new commands)
* dynamic inheritance (skins support) - allow to choose which template to inherit in runtime
