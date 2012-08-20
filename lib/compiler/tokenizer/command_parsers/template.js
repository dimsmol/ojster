"use strict";
var inherits = require('util').inherits;
var tokens = require('../tokens');
var core = require('./core');

var CommandParser = core.CommandParser;
var regExps = core.regExps;


var Template = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(Template, CommandParser);

Template.prototype.commandRegExp = new RegExp([
	'^\\s*(((',
		regExps.alias,
	')(\\s+(',
		regExps.fullName,
	'))?)|(',
		regExps.fullName,
	'))\\s*$'
].join(''));

Template.prototype.parseMatched = function (match) {
		var alias = match[3];
		var fullName = match[5] || match[7] || alias;

		return new tokens.Template(this.ctx, alias, fullName);
};


module.exports = Template;
