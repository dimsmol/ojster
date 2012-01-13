var inherits = require('util').inherits;

var tokens = require('../tokens');

var CommandParser = require('./core').CommandParser;


var Call = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(Call, CommandParser);

Call.prototype.commandRegExp = /^\s*(\$?\w+)(\s*\((.*)?\))?\s*$/;

Call.prototype.parseMatched = function (match) {
	var blockName = match[1];
	var args = match[3];

	return new tokens.BlockCall(this.ctx, blockName, args);
};


module.exports = Call;
