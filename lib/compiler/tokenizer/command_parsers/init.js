var inherits = require('util').inherits;

var tokens = require('../tokens');

var Func = require('./func');


var Init = function(ctx, commandName, commandStr) {
	Func.call(this, ctx, commandName, commandStr);
};
inherits(Init, Func);

Init.prototype.parse = function () {
	var match = this.commandStr.match(/^\s*\}\s*$/);

	if (match)
	{
		return this.createEndToken(null);
	}
	else
	{
		match = this.commandStr.match(/^\s*\{\s*(\})?\s*$/);

		if (match)
		{
			var closingBrace = match[1];

			return this.createStartToken(null, null, !!closingBrace);
		}
		else
		{
			throw this.createInvalidCommandSyntaxError();
		}
	}
};

Init.prototype.createStartToken = function(name, args, endImmediately) {
	return new tokens.FunctionStart(this.ctx, 'init', null, endImmediately, false, true);
};

Init.prototype.createEndToken = function(opt_name) {
	return new tokens.FunctionEnd(this.ctx, 'init', false, true);
};


module.exports = Init;
