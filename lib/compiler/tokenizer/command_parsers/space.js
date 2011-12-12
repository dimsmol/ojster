var inherits = require('util').inherits;

var CommandParser = require('./common').CommandParser;
var tokens = require('../tokens');


var SpaceCommandParser = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(SpaceCommandParser, CommandParser);

SpaceCommandParser.prototype.commandRegExp = /^\s*$/;

SpaceCommandParser.prototype.parseMatched = function (match) {
	return new tokens.Space(this.ctx);
};


module.exports = SpaceCommandParser;
