var inherits = require('util').inherits;

var CommandParser = require('./common').CommandParser;
var tokens = require('../tokens');


var CallCommandParser = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(CallCommandParser, CommandParser);

CallCommandParser.prototype.commandRegExp = /^\s*(\$?\w+)(\s*\((.*)?\))?\s*$/;

CallCommandParser.prototype.parseMatched = function (match) {
	var blockName = match[1];
	var args = match[3];

	return new tokens.BlockCall(this.ctx, blockName, args);
};


module.exports = CallCommandParser;
