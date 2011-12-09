
var inherits = require('util').inherits;
var CompilationError = require('../compilation_errors').CompilationError;

var TokenizationError = function() {
	CompilationError.apply(this, arguments);
};
inherits(TokenizationError, CompilationError);

var MissingCloseInstructionMark = function(ctx) {
    TokenizationError.call(this, ctx,
        'Missing end-of-instruction mark');
};
inherits(MissingCloseInstructionMark, TokenizationError);

var UnknownCommand = function(ctx, cmd) {
    this.cmd = cmd;
    TokenizationError.call(this, ctx,
        ['Unknown command "', cmd, '"'].join(''));
};
inherits(UnknownCommand, TokenizationError);

var InvalidBlockCommand = function(ctx) {
    TokenizationError.call(this, ctx,
        'Invalid "block" command syntax');
};
inherits(InvalidBlockCommand, TokenizationError);

var InvalidBlockCallCommand = function(ctx) {
    TokenizationError.call(this, ctx,
        'Invalid "call" command syntax');
};
inherits(InvalidBlockCallCommand, TokenizationError);

var InvalidInsertTemplateCommand = function(ctx) {
    TokenizationError.call(this, ctx,
        'Invalid "insert" command syntax');
};
inherits(InvalidInsertTemplateCommand, TokenizationError);

var InvalidRequireCommand = function(ctx) {
    TokenizationError.call(this, ctx,
        'Invalid "require" command syntax');
};
inherits(InvalidRequireCommand, TokenizationError);

var InvalidTemplateCommand = function(ctx) {
    TokenizationError.call(this, ctx,
        'Invalid "template" command syntax');
};
inherits(InvalidTemplateCommand, TokenizationError);

var InvalidInheritsCommand = function(ctx) {
    TokenizationError.call(this, ctx,
        'Invalid "inherits" command syntax');
};
inherits(InvalidInheritsCommand, TokenizationError);

var InvalidCssCommand = function(ctx) {
    TokenizationError.call(this, ctx,
        'Invalid "css" command syntax');
};
inherits(InvalidCssCommand, TokenizationError);

var InvalidCssCommandExtraArguments = function(ctx) {
    InvalidCssCommand.call(this, ctx,
        'Invalid "css" command syntax: when "+" is used, it requires one argument only');
};
inherits(InvalidCssCommandExtraArguments, InvalidCssCommand);

module.exports = {
    MissingCloseInstructionMark: MissingCloseInstructionMark,
    UnknownCommand: UnknownCommand,
    InvalidBlockCommand: InvalidBlockCommand,
	InvalidBlockCallCommand: InvalidBlockCallCommand,
	InvalidInsertTemplateCommand: InvalidInsertTemplateCommand,
    InvalidRequireCommand: InvalidRequireCommand,
    InvalidTemplateCommand: InvalidTemplateCommand,
    InvalidInheritsCommand: InvalidInheritsCommand,
	InvalidCssCommand: InvalidCssCommand,
	InvalidCssCommandExtraArguments: InvalidCssCommandExtraArguments
};
