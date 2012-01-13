var Block = require('../core/block');
var errors = require('../core/errors');


var Template = function(generator, token) {
	this.generator = generator;
	this.token = token;

	this.name = token.alias || token.fullName;
	this.fullName = token.fullName;

	this.options = this.generator.options;

	this.inheritsToken = null;

	this.blockStack = [];
	this.currentBlock = null;
	this.usedBlockNames = {};

	this.nameToUse = this.getNameToUse();
	this.baseNameToUse = null;

	this.definitionBuffer = null;
};

Template.prototype.createBlock = function(token) {
	return new Block(this, token);
};

// lifecycle

Template.prototype.start = function() {
	this.generator.onTemplateStart(this);
	this.definitionBuffer = this.generator.reserveBuffer();
};

Template.prototype.end = function() {
	this.appendDefinition();
	this.generator.onTemplateEnd(this);
};

// names

Template.prototype.getNameToUse = function() {
	return this.token.alias;
};

Template.prototype.getBaseNameToUse = function() {
	return this.inheritsToken.templateBaseName;
};

// checks

Template.prototype.ensureInheritsTokenFound = function(ctx) {
	if (this.inheritsToken == null)
	{
		throw new errors.InheritsTokenNotFound(ctx);
	}
};

Template.prototype.ensureInheritsTokenNotFound = function(ctx) {
	if (this.inheritsToken != null)
	{
		throw new errors.DuplicateInheritsToken(ctx);
	}
};

Template.prototype.ensureTokenWithinBlock = function(token) {
	if (this.currentBlock == null)
	{
		throw new errors.TokenMustBeWithinBlock(token);
	}
};

Template.prototype.ensureTokenBeyondBlock = function(token) {
	if (this.currentBlock != null)
	{
		throw new errors.TokenMustBeBeyondBlock(token);
	}
};

// template level tokens

Template.prototype.onInheritsToken = function(token) {
	this.ensureTokenBeyondBlock(token);
	this.ensureInheritsTokenNotFound(token.ctx);

	this.inheritsToken = token;
	this.baseNameToUse = this.getBaseNameToUse();

	this.appendInherits(token);
};

Template.prototype.onCodeToken = function(token) {
	if (this.currentBlock != null)
	{
		this.currentBlock.onCodeToken(token);
	}
	else
	{
		this.generator.appendCode(token);
	}
};

Template.prototype.onFragmentToken = function(token) {
	if (this.currentBlock != null)
	{
		this.currentBlock.onFragmentToken(token);
	}
	else if (this.options.nonBlockFragmentsAreCode)
	{
		this.generator.appendFragmentAsCode(token);
	}
	else if (fragment.match(/\S/))
	{
		this.error(new errors.TokenMustBeWithinBlock(token));
	}
};

// block level tokens

Template.prototype.onBlockStartToken = function(token) {
	var block = this.createBlock(token);

	if (this.currentBlock != null)
	{
		this.currentBlock.onBlockCallToken(token);
	}

	block.start();
};

Template.prototype.onBlockEndToken = function(token) {
	if (this.currentBlock == null)
	{
		throw new errors.BlockClosedWithoutOpenning(token.ctx, token.name);
	}

	this.currentBlock.end(token);
};

// within block tokens

Template.prototype.onExpressionToken = function(token) {
	this.ensureTokenWithinBlock(token);
	this.currentBlock.onExpressionToken(token);
};

Template.prototype.onBlockCallToken = function(token) {
	this.ensureTokenWithinBlock(token);
	this.currentBlock.onBlockCallToken(token);
};

Template.prototype.onCssToken = function(token) {
	this.ensureTokenWithinBlock(token);
	this.currentBlock.onCssToken(token);
};

Template.prototype.onSpaceToken = function(token) {
	this.ensureTokenWithinBlock(token);
	this.currentBlock.onSpaceToken(token);
};

Template.prototype.onInsertTemplateToken = function(token) {
	this.ensureTokenWithinBlock(token);
	this.currentBlock.onInsertTemplateToken(token);
};

// events

Template.prototype.onBlockStart = function(block) {
	if (block.name in this.usedBlockNames)
	{
		throw new errors.DuplicateBlockName(block.token.ctx, block.name);
	}
	this.usedBlockNames[block.name] = true;

	this.blockStack.push(block);
	this.currentBlock = block;
};

Template.prototype.onBlockEnd = function(block) {
	this.blockStack.pop();
	this.currentBlock = this.blockStack.length > 0 ? this.blockStack[this.blockStack.length - 1] : null;
};

// append for tokens

Template.prototype.appendInherits = function(token) {
	this.generator.buffer.push(
		this.options.inherits.alias, '(', this.nameToUse, ', ', this.baseNameToUse, ');'
	);

	if (this.options.appendLineNumbersFor.inherits)
	{
		this.generator.appendLineNumber(token.ctx);
	}
};

// utility append

Template.prototype.appendDefinition = function() {
	this.appendDefinitionStart();

	if (this.options.appendLineNumbersFor.template)
	{
		this.generator.appendLineNumber(this.token.ctx, this.definitionBuffer);
	}

	this.definitionBuffer.push(
		'\n',
		this.options.indentStr
	);
	this.appendBaseConstructorCall();

	this.appendDefinitionEnd();
};

Template.prototype.appendDefinitionStart = function() {
	this.definitionBuffer.push(
		'var ', this.nameToUse, ' = function(opt_data, opt_ctx, opt_writer) {'
	);
};

Template.prototype.appendDefinitionEnd = function() {
	this.definitionBuffer.push(
		'\n};'
	);
};

Template.prototype.appendBaseCall = function(ctx, funcName, args, thisStr, buffer) {
	this.ensureInheritsTokenFound(ctx);

	if (thisStr == null)
	{
		thisStr = 'this';
	}

	var comma = '';
	if (args)
	{
		comma = ', ';
	}
	else
	{
		args = '';
	}

	buffer.push(
		this.options.indentStr,
		this.baseNameToUse, '.prototype.', funcName,
		'.call(', thisStr, comma, args, ');'
	);
};

Template.prototype.appendBaseConstructorCall = function() {
	this.ensureInheritsTokenFound();

	this.definitionBuffer.push(
		this.baseNameToUse, '.call(this, opt_data, opt_ctx, opt_writer);'
	);
};

Template.prototype.appendFunctionDefinitionStart = function(ctx, funcName, args, prepend, buffer) {
	if (prepend)
	{
		buffer.push(prepend);
	}

	if (!args)
	{
		args = '';
	}

	buffer.push(
		this.nameToUse, '.prototype.', funcName,
		' = function(', args, ') {'
	);

	if (this.options.appendLineNumbersFor.block)
	{
		this.generator.appendLineNumber(ctx, buffer);
	}

	buffer.push('\n');
};

Template.prototype.appendFunctionDefinitionEnd = function(ctx, buffer) {
	buffer.push('};');

	if (this.options.appendLineNumbersFor.blockClose)
	{
		this.generator.appendLineNumber(ctx, buffer);
	}
};


module.exports = Template;
