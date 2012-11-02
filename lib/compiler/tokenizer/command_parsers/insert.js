"use strict";
var inherits = require('util').inherits;
var tokens = require('../tokens');
var core = require('./core');

var CommandParser = core.CommandParser;
var regExps = core.regExps;


var Insert = function (ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(Insert, CommandParser);

Insert.prototype.commandRegExp = new RegExp([
	'^\\s*(',
		regExps.fullName,
	')(\\s*\\(([\\s\\S]*)?\\))?\\s*(\\{([\\s\\S]*)?\\})?\\s*$'
].join(''));

Insert.prototype.parseMatched = function (match) {
	var templateName = match[1];
	var args = match[4];
	var setupFunc = match[6];

	return new tokens.InsertTemplate(this.ctx, templateName, args, setupFunc);
};


module.exports = Insert;
