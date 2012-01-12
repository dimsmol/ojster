var inherits = require('util').inherits;

var CompilationError = require('../errors').CompilationError;


var TokenizationError = function(ctx) {
	CompilationError.call(this, ctx);
};
inherits(TokenizationError, CompilationError);

TokenizationError.prototype.canContinue = true;
TokenizationError.prototype.getMessage = function() {
	return 'Generic tokenization error';
};


var CloseInstructionMarkMissed = function(ctx) {
	TokenizationError.call(this, ctx);
};
inherits(CloseInstructionMarkMissed, TokenizationError);

CloseInstructionMarkMissed.prototype.canContinue = false;
CloseInstructionMarkMissed.prototype.getMessage = function() {
	return 'Close instruction mark missed';
};


var UnknownCommand = function(ctx, commandName) {
	this.commandName = commandName;
	TokenizationError.call(this, ctx);
};
inherits(UnknownCommand, TokenizationError);

UnknownCommand.prototype.getMessage = function() {
	return ['Unknown command "', this.commandName, '"'].join('');
};


var InvalidCommandSyntax = function(ctx, commandName) {
	this.commandName = commandName;
	TokenizationError.call(this, ctx);
};
inherits(InvalidCommandSyntax, TokenizationError);

InvalidCommandSyntax.prototype.getMessage = function() {
	return ['Invalid command "', this.commandName, '" syntax'].join('');
};


module.exports = {
	TokenizationError: TokenizationError,
	CloseInstructionMarkMissed: CloseInstructionMarkMissed,
	UnknownCommand: UnknownCommand,
	InvalidCommandSyntax: InvalidCommandSyntax
};
