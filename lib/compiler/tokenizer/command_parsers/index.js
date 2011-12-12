var BlockCommandParser = require('./block');
var CallCommandParser = require('./call');
var CssCommandParser = require('./css');
var InheritsCommandParser = require('./inherits');
var InsertCommandParser = require('./insert');
var RequireCommandParser = require('./require');
var SpaceCommandParser = require('./space');
var TemplateCommandParser = require('./template');


module.exports = {
	BlockCommandParser: BlockCommandParser,
	CallCommandParser: CallCommandParser,
	CssCommandParser: CssCommandParser,
	InheritsCommandParser: InheritsCommandParser,
	InsertCommandParser: InsertCommandParser,
	RequireCommandParser: RequireCommandParser,
	SpaceCommandParser: SpaceCommandParser,
	TemplateCommandParser: TemplateCommandParser,

	parsers: {
		'block': BlockCommandParser,
		'call': CallCommandParser,
		'css': CssCommandParser,
		'inherits': InheritsCommandParser,
		'insert': InsertCommandParser,
		'require': RequireCommandParser,
		'space': SpaceCommandParser,
		'template': TemplateCommandParser
	}
};
