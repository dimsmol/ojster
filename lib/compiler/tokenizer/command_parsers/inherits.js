var inherits = require('util').inherits;

var core = require('./core');

var CommandParser = core.CommandParser;
var regExps = core.regExps;
var tokens = require('../tokens');


var InheritsCommandParser = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(InheritsCommandParser, CommandParser);

InheritsCommandParser.prototype.commandRegExp = RegExp([
	'^\\s*(((',
		regExps.dotSeparatedNames,
	')(\\s+(',
		regExps.fullName,
	'))?)|(',
		regExps.fullName,
	'))\\s*$'
].join(''));

InheritsCommandParser.prototype.parseMatched = function (match) {
	var name = match[3];
	var fullName = match[6] || match[8] || name;

	return new tokens.Inherits(this.ctx, name, fullName);
};


module.exports = InheritsCommandParser;
