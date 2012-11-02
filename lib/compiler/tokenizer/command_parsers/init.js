"use strict";
var inherits = require('util').inherits;
var tokens = require('../tokens');
var CommandParser = require('./core').CommandParser;


var Init = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(Init, CommandParser);

Init.prototype.commandRegExp = /^\s*\{([\s\S]*)?\}\s*$/;

Init.prototype.parseMatched = function (match) {
	return new tokens.FunctionStart(this.ctx, 'init', null, true, true, match[1]);
};


module.exports = Init;
