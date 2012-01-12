var inherits = require('util').inherits;

var CompilationError = require('../errors').CompilationError;


var TokenizationError = function(ctx, msg) {
	CompilationError.call(this, ctx, msg);
};
inherits(TokenizationError, CompilationError);

TokenizationError.prototype.canContinue = true;


var MissingCloseInstructionMark = function(ctx) {
	TokenizationError.call(this, ctx,
		'Missing end-of-instruction mark');
};
inherits(MissingCloseInstructionMark, TokenizationError);

MissingCloseInstructionMark.prototype.canContinue = false;


var UnknownCommand = function(ctx, cmd) {
	this.cmd = cmd;
	TokenizationError.call(this, ctx,
		['Unknown command "', cmd, '"'].join(''));
};
inherits(UnknownCommand, TokenizationError);


var InvalidCommandSyntax = function(ctx, cmd) {
	this.cmd = cmd;
	TokenizationError.call(this, ctx,
		['Invalid command "', cmd, '" syntax'].join(''));
};
inherits(InvalidCommandSyntax, TokenizationError);


module.exports = {
	TokenizationError: TokenizationError,
	MissingCloseInstructionMark: MissingCloseInstructionMark,
	UnknownCommand: UnknownCommand,
	InvalidCommandSyntax: InvalidCommandSyntax
};
