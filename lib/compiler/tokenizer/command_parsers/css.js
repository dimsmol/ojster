var inherits = require('util').inherits;

var CommandParser = require('./common').CommandParser;
var tokens = require('../tokens');


var CssCommandParser = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(CssCommandParser, CommandParser);

CssCommandParser.prototype.commandRegExp = /^\s*((\+)?(\S+)(\s+(\S+))?)?\s*$/;

CssCommandParser.prototype.parseMatched = function (match) {
	var isPlus = (match[2] == '+');
	var arg1 = match[3];
	var arg2 = match[5];

	var nameExpr = null;
	var nameStr = null;
	var modifiers = null;

	if (isPlus)
	{
		if (arg2 != null)
		{
			return this.getInvalidSyntaxToken();
		}
		modifiers = arg1;
	}
	else
	{
		if (arg2 != null)
		{
			nameExpr = arg1;
			modifiers = arg2;
		}
		else if (arg1 != null)
		{
			nameStr = arg1;
		}
	}

	return new tokens.Css(this.ctx, nameExpr, nameStr, modifiers);
};


module.exports = CssCommandParser;
