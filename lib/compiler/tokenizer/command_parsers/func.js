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
		match = this.commandStr.match(/^\s*(\/\/)?(\w+)(\s*\(\s*(\w+(\s*\,\s*\w+)*)?\s*\))?\s+\{\s*(\})?\s*$/);

		if (match) {
			var isCommented = !!match[1];
			var name = match[2];
			var args = match[4];
			var closingBrace = match[6];

			return this.createStartToken(name, args, !!closingBrace, isCommented);
		}
		else {
			throw this.createInvalidCommandSyntaxError();
		}
	}
};

Func.prototype.createStartToken = function (name, args, endImmediately, isCommented) {
	return new tokens.FunctionStart(this.ctx, name, args, endImmediately, isCommented);
};

Func.prototype.createEndToken = function (opt_name) {
	return new tokens.FunctionEnd(this.ctx, opt_name);
};


module.exports = Func;
