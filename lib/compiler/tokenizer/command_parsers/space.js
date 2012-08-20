"use strict";
var inherits = require('util').inherits;
var tokens = require('../tokens');
var CommandParser = require('./core').CommandParser;


var Space = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(Space, CommandParser);

Space.prototype.commandRegExp = /^\s*$/;

Space.prototype.parseMatched = function (match) {
	return new tokens.Space(this.ctx);
};


module.exports = Space;
