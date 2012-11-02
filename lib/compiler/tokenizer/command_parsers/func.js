"use strict";
var inherits = require('util').inherits;
var tokens = require('../tokens');
var CommandParser = require('./core').CommandParser;


var Func = function (ctx, commandName, commandStr) {
	CommandParser.call(this, ctx, commandName, commandStr);
};
inherits(Func, CommandParser);

Func.prototype.parse = function () {
	var match = this.commandStr.match(/^\s*(\w+)?\s*\}\s*$/);

	if (match) {
		return this.createEndToken(match[1]);
	}
	else {
		match = this.commandStr.match(/^\s*(\w+)(\s*\(\s*(\w+(\s*\,\s*\w+)*)?\s*\))?\s+\{\s*(\})?\s*$/);

		if (match) {
			var name = match[1];
			var args = match[3];
			var closingBrace = match[5];

			return this.createStartToken(name, args, !!closingBrace);
		}
		else {
			throw this.createInvalidCommandSyntaxError();
		}
	}
};

Func.prototype.createStartToken = function (name, args, endImmediately) {
	return new tokens.FunctionStart(this.ctx, name, args, endImmediately);
};

Func.prototype.createEndToken = function (opt_name) {
	return new tokens.FunctionEnd(this.ctx, opt_name);
};


module.exports = Func;
