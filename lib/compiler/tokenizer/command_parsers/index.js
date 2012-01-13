var Func = require('./func');
var Block = require('./block');
var Call = require('./call');
var Css = require('./css');
var Inherits = require('./inherits');
var Insert = require('./insert');
var Require = require('./require');
var Space = require('./space');
var Template = require('./template');


module.exports = {
	Func: Func,
	Block: Block,
	Call: Call,
	Css: Css,
	Inherits: Inherits,
	Insert: Insert,
	Require: Require,
	Space: Space,
	Template: Template,

	parsers: {
		'func': Func,
		'block': Block,
		'call': Call,
		'css': Css,
		'inherits': Inherits,
		'insert': Insert,
		'require': Require,
		'space': Space,
		'template': Template
	}
};
