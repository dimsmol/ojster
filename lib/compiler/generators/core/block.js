var inherits = require('util').inherits;

var strTools = require('../../../tools/str');

var Func = require('./function');
var Sequence = require('./sequence');
var errors = require('./errors');


var Block = function(template, token) {
	Func.call(this, template, token);
	this.sequence = this.createSequence();
};
inherits(Block, Func);

Block.prototype.createSequence = function() {
	return new Sequence(this);
};

Block.prototype.obtainBuffer = function() {
	return this.generator.reserveBuffer();
};

Block.prototype.getNameToUse = function() {
	return this.getBlockFunctionName(this.name);
};

Block.prototype.getBlockFunctionName = function(name) {
	return this.options.block.funcNamePrefix + strTools.capFirst(name);
};

Block.prototype.getThisAliasToUse = function() {
	return this.options.thisAlias;
};

Block.prototype.createClosedWithoutOpenningError = function(token) {
	throw new errors.BlockClosedWithoutOpenning(token.ctx, token.name);
};

// lifecycle

Block.prototype.templateOnStart = function() {
	this.template.onBlockStart(this);
};

Block.prototype.templateOnEnd = function() {
	this.template.onBlockEnd(this);
};

// within block tokens

Block.prototype.onBlockCallToken = function(token) {
	this.appendBlockCall(token);
};

Block.prototype.onInsertTemplateToken = function(token) {
	this.appendInsertTemplate(token);
};

// within sequence tokens

Block.prototype.onFragmentToken = function(token) {
	this.sequence.onFragmentToken(token);
};

Block.prototype.onExpressionToken = function(token) {
	this.sequence.onExpressionToken(token);
};

Block.prototype.onCssToken = function(token) {
	this.sequence.onCssToken(token);
};

Block.prototype.onSpaceToken = function(token) {
	this.sequence.onSpaceToken(token);
};

// append for tokens

Block.prototype.appendStart = function() {
	if (this.template.blockStack.length > 1)
	{
		this.buffer.push('\n\n');
	}

	Block.super_.prototype.appendStart.call(this);

	this.appendLocals();
};

Block.prototype.appendEnd = function(opt_token) {
	var ctx = (opt_token == null ? null : opt_token.ctx);
	this.sequence.close(this.options.appendLineNumbersFor.sequenceCloseBeforeBlockClose ? ctx : null);
	Block.super_.prototype.appendEnd.call(this, opt_token);
};

Block.prototype.appendCode = function(token) {
	this.sequence.close(token.ctx);
	Block.super_.prototype.appendCode.call(this, token);
};

Block.prototype.appendBlockCall = function(token) {
	this.sequence.close(token.ctx);

	if (token.name == '$base')
	{
		this.template.appendBaseCall(token.ctx, this.thisAliasToUse, this.nameToUse, token.args, this.buffer);
	}
	else
	{
		this.buffer.push(
			this.options.indentStr,
			this.options.thisAlias, '.',
			this.getBlockFunctionName(token.name), '(', token.args, ');'
		);
	}

	if (this.options.appendLineNumbersFor.blockCall)
	{
		this.generator.appendLineNumber(token.ctx, this.buffer);
	}

	this.buffer.push('\n');
};

Block.prototype.appendInsertTemplate = function(token) {
	this.sequence.close(token.ctx);

	this.buffer.push(
		this.options.indentStr,
		'new ', token.name, '(', token.args, ').renderTo(', this.options.thisAlias,');'
	);

	if (this.options.appendLineNumbersFor.templateInsertion)
	{
		this.generator.appendLineNumber(token.ctx, this.buffer);
	}

	this.buffer.push('\n');
};

// utility append

Block.prototype.appendLocals = function() {
	if (this.options.thisAlias && this.options.thisAlias != 'this')
	{
		this.buffer.push(
			this.options.indentStr, 'var ', this.options.thisAlias, ' = this;\n'
		);
	}

	if (this.options.block.locals)
	{
		this.buffer.push(
			this.options.indentStr, this.options.block.locals, '\n'
		);
	}
};


module.exports = Block;
