# Ojster

Ojster is "objective javascript templater" - dead simple template engine which translates .ojst templates into javascript classes capable of template content rendering.

TextMate bundle for Ojster can be found here: https://github.com/4u/Ojster.tmbundle

## Key Concepts

* Templates are JS-based _(similar to EJS)_
* Templates need "compilation" _(similar to Google Closure Templates)_
* Compiled template is a regular JS class

Templates use full power of JS with minimal additions of non-JS syntax. You don't need to learn lot of new stuff, because you already know the language that is powerful enough to manage your templates. Ojster does not stop you from doing terrible things in templates, just like JS hardly stops you from writing terrible code. You can easily use any dirty tricks, but generally you shouldn't. Be good all the time and be evil only when you really have to.
Ojster provides tags and other non-JS constructions only as a syntax sugar and to hide differences between various frameworks' inheritance and module systems.

With compilation templates are faster and have less errors, because they are already parsed and checked when it's time to render.
Compilation is as simple and straight as possible. It always clear what final code will look like. And you can manage this code as any other code in your project - check with linter or your other favorite tool, compress with JS-compressor and so on.
Template is a regular JS class, so you can inherit it from any other class or inherit some class from it or do whatever you usually do with your classes.

## Features

* Templates can be translated into code compatible with:
	* node.js
	* Google Closure Library
	* _other frameworks support can be added easily_
* Same template file _(if properly written)_ can be used to produce code for both node.js and Google Closure Library
* Template blocks can be overriden _(similar to Django templates' blocks, but more rich)_
* Parametrized template blocks are yet not ready, but planned
* Any JS constructions allowed _(for, if, etc.)_
* "Filters" are NOT supported _(use JS code instead)_

Compilation is very fast because it's dumb simple. All JS fragments of template are transferred to final code literally. Template blocks are translated into regular methods of compiled JS class. These methods capable of appending corresponding content and nothing more. They can be called any number of times at any place of template, overriden in child templates and so on.

## Syntax

It's recommended to take a look at `examples` directory before continue to read. Examples are very simple and intuitive.
By examining .ojst files and their corresponding .js files (compilation results) you will understand how template code is translated into JS code clearly enough. Further reading will provide you with details you could missed.

Template syntax is similar to EJS, but it has some extra conceptions.
All the special constructions are enclosed within `<% %>` tags:

* `<%= ... %>`  - calculate expression and render result escaped. Will be translated into something like `this.append(this.escape(...))`
* `<%- ... %>`  - calculate expression and render result unescaped. Will be translated into something like `this.append(...)`
* `<% @commandName ... %>`  - one of the commands _(described below)_.
* `<% ... %>` - raw JS code fragment. Will be transferred literally. Can contain any JS code including `this.append(...)` calls.

### Commands

* `require` - imports required JS modules
* `template` - describes template itself (it's name and so on)
* `inherits` - describes template's base class
* `init` - defines initializing function
* `func` - defines function
* `block` - breaks a template into reusable parts
* `base` - base method call
* `call` - calls block
* `insert` - inserts other template
* `space` - writes space
* `css` - inserts `getCssName(...)` call

_...other command descriptions to be added..._

#### block command

* `<% @block blockName { %>` - opens block _blockName_
* `<% @block blockName } %>` - closes block _blockName_ (blockName is optional here)

Code related to content between these two commands will be placed to _appendBlockBlockName_ method of resulting template class.
Blocks can be nested. If block is nested corresponding method call will be placed in appropriate place of nesting block.

	<% @block A { %>
		a
		<% @block B { %>
			b
		<% @block } %>
	<% @block } %>

will be translated into something like

	TemplateClass.prototype.appendBlockA = function () {
		this.append('a');
		this.appendBlockB();
	};

	TemplateClass.prototype.appendBlockB = function () {
		this.append('b');
	};

Note, that nested blocks haven't access to local variables of nesting block, because blocks are translated into completely separated (not nested) functions. Following example will not work as expected:

	<% @block A { %>
		<% for (var i=0; i<10; i++) { %>
			<% @block B { %>
				<%= i %>
			<% @block } %>
		<% } %>
	<% @block } %>

This examples will be translated into something like this:

	TemplateClass.prototype.appendBlockA = function () {
		for (var i=0; i<10; i++) {
			this.appendBlockB();
		}
	};

	TemplateClass.prototype.appendBlockB = function () {
		this.append(i);
	};

And of course `i` is undefined within `appendBlockB` function scope. Use parametrized blocks to transfer local variables into scope of nested block.

`<% @block blockName {} %>` - opens and closes block _blockName_. Such an empty block can be defined to be overriden in child templates.

`main` is a special block name indicating a block that will be appended on template's `render()` method call.
By default, text outside of any block will be supposed to be a raw JS code.


## Readme TODO

* move detailed descriptions to `doc/` directory, here should be just quick examples
* for `doc/`:
	* more on syntax
	* all the commands
	* locals
	* detailed usage of `bin/ojster`
	* guide to generated code
* programmatic usage of ojster
* provide short usage of `bin/ojster`
* describe difference between Node and Closure module systems and how it is handled by Ojster

## License

MIT
