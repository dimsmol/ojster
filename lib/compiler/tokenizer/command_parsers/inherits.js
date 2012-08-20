"use strict";
var inherits = require('util').inherits;
var tokens = require('../tokens');
var core = require('./core');

var CommandParser = core.CommandParser;
var regExps = core.regExps;


var Inherits = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(Inherits, CommandParser);

Inherits.prototype.commandRegExp = new RegExp([
	'^\\s*(((',
		regExps.dotSeparatedNames,
	')(\\s+(',
		regExps.fullName,
	'))?)|(',
		regExps.fullName,
	'))\\s*$'
].join(''));

Inherits.prototype.parseMatched = function (match) {
	var name = match[3];
	var fullName = match[6] || match[8] || name;

	return new tokens.Inherits(this.ctx, name, fullName);
};


module.exports = Inherits;
