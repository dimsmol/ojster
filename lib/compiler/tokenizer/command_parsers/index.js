var Init = require('./init');
var Func = require('./func');
var Block = require('./block');
var Base = require('./base');
var Call = require('./call');
var Css = require('./css');
var Inherits = require('./inherits');
var Insert = require('./insert');
var Require = require('./require');
var Space = require('./space');
var Template = require('./template');


module.exports = {
	Init: Init,
	Func: Func,
	Block: Block,
	Base: Base,
	Call: Call,
	Css: Css,
	Inherits: Inherits,
	Insert: Insert,
	Require: Require,
	Space: Space,
	Template: Template,

	parsers: {
		'init': Init,
		'func': Func,
		'block': Block,
		'base': Base,
		'call': Call,
		'css': Css,
		'inherits': Inherits,
		'insert': Insert,
		'require': Require,
		'space': Space,
		'template': Template
	}
};
