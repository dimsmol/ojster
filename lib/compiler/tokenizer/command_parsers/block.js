var inherits = require('util').inherits;

var CommandParser = require('./core').CommandParser;
var tokens = require('../tokens');


var BlockCommandParser = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(BlockCommandParser, CommandParser);

BlockCommandParser.prototype.parse = function () {
	var match = this.commandStr.match(/^\s*(\w+)?\s*\}\s*$/);

	if (match)
	{
		return new tokens.BlockEnd(this.ctx, match[1]);
	}
	else
	{
		match = this.commandStr.match(/^\s*(\w+)(\s*\(\s*(\w+(\s*\,\s*\w+)*)?\s*\))?\s+\{\s*(\})?\s*$/);

		if (match)
		{
			var blockName = match[1];
			var args = match[3];
			var closingBrace = match[5];

			return new tokens.BlockStart(this.ctx, blockName, args, !!closingBrace);
		}
		else
		{
			throw this.createInvalidCommandSyntaxError();
		}
	}
};


module.exports = BlockCommandParser;
