var inherits = require('util').inherits;

var common = require('./common');

var CommandParser = common.CommandParser;
var regExps = common.regExps;
var tokens = require('../tokens');


var TemplateCommandParser = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(TemplateCommandParser, CommandParser);

TemplateCommandParser.prototype.commandRegExp = RegExp([
	'^\\s*(((',
		regExps.alias,
	')(\\s+(',
		regExps.fullName,
	'))?)|(',
		regExps.fullName,
	'))\\s*$'
].join(''));

TemplateCommandParser.prototype.parseMatched = function (match) {
		var alias = match[3];
		var fullName = match[5] || match[7] || alias;

		return new tokens.Template(this.ctx, alias, fullName);
};


module.exports = TemplateCommandParser;
