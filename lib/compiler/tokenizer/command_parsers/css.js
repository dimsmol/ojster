"use strict";
var inherits = require('util').inherits;
var tokens = require('../tokens');
var CommandParser = require('./core').CommandParser;


var Css = function(ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(Css, CommandParser);

Css.prototype.commandRegExp = /^\s*((\+)?(\S+)(\s+(\S+))?)?\s*$/;

Css.prototype.parseMatched = function (match) {
	var isPlus = (match[2] == '+');
	var arg1 = match[3];
	var arg2 = match[5];

	var nameExpr = null;
	var nameStr = null;
	var modifiers = null;

	if (isPlus) {
		if (arg2 != null) {
			throw this.createInvalidCommandSyntaxError();
		}
		modifiers = arg1;
	}
	else {
		if (arg2 != null) {
			nameExpr = arg1;
			modifiers = arg2;
		}
		else if (arg1 != null) {
			nameStr = arg1;
		}
	}

	return new tokens.Css(this.ctx, nameExpr, nameStr, modifiers);
};


module.exports = Css;
