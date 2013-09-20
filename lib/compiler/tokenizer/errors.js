"use strict";
var inherits = require('util').inherits;
var mt = require('marked_types');
var CompilationError = require('../errors').CompilationError;


var TokenizationError = function (ctx) {
	CompilationError.call(this, ctx);
};
inherits(TokenizationError, CompilationError);
mt.mark(TokenizationError, 'ojster:TokenizationError');

TokenizationError.prototype.name = 'TokenizationError';
TokenizationError.prototype.canContinue = true;

TokenizationError.prototype.getMessageInternal = function () {
	return 'Generic tokenization error';
};


var CloseInstructionMarkMissed = function (ctx) {
	TokenizationError.call(this, ctx);
};
inherits(CloseInstructionMarkMissed, TokenizationError);
mt.mark(CloseInstructionMarkMissed, 'ojster:CloseInstructionMarkMissed');

CloseInstructionMarkMissed.prototype.name = 'CloseInstructionMarkMissed';
CloseInstructionMarkMissed.prototype.canContinue = false;

CloseInstructionMarkMissed.prototype.getMessageInternal = function () {
	return 'Close instruction mark missed';
};


var UnknownCommand = function (ctx, commandName) {
	TokenizationError.call(this, ctx);
	this.commandName = commandName;
};
inherits(UnknownCommand, TokenizationError);
mt.mark(UnknownCommand, 'ojster:UnknownCommand');

UnknownCommand.prototype.name = 'UnknownCommand';

UnknownCommand.prototype.getMessageInternal = function () {
	return ['Unknown command "', this.commandName, '"'].join('');
};


var InvalidCommandSyntax = function (ctx, commandName) {
	TokenizationError.call(this, ctx);
	this.commandName = commandName;
};
inherits(InvalidCommandSyntax, TokenizationError);
mt.mark(InvalidCommandSyntax, 'ojster:InvalidCommandSyntax');

InvalidCommandSyntax.prototype.name = 'InvalidCommandSyntax';

InvalidCommandSyntax.prototype.getMessageInternal = function () {
	return ['Invalid "', this.commandName, '" command syntax'].join('');
};


module.exports = {
	TokenizationError: TokenizationError,
	CloseInstructionMarkMissed: CloseInstructionMarkMissed,
	UnknownCommand: UnknownCommand,
	InvalidCommandSyntax: InvalidCommandSyntax
};
