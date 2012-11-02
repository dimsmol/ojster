"use strict";
var inherits = require('util').inherits;
var tokens = require('../tokens');
var CommandParser = require('./core').CommandParser;


var Base = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(Base, CommandParser);

Base.prototype.commandRegExp = /^\s*(\(\s*(\w+(\s*\,\s*\w+)*)?\s*\))?\s*$/;

Base.prototype.parseMatched = function (match) {
	var args = match[2];

	return new tokens.Base(this.ctx, args);
};


module.exports = Base;
