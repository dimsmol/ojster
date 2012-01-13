var inherits = require('util').inherits;

var strTools = require('../../../tools/str');

var Sequence = require('../core/sequence');
var errors = require('../core/errors');

var Func = require('./function');


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

Block.prototype.onStart = function() {
	Block.super_.prototype.onStart.call(this);
	this.template.onBlockStart(this);
};

Block.prototype.onEnd = function() {
	this.template.onBlockEnd(this);
	Block.super_.prototype.onEnd.call(this);
};

// within block tokens

Block.prototype.onFragmentToken = function(token) {
	this.appendFragment(token);
};

Block.prototype.onExpressionToken = function(token) {
	this.appendExpression(token);
};

Block.prototype.onBlockCallToken = function(token) {
	this.appendBlockCall(token);
};

Block.prototype.onCssToken = function(token) {
	this.appendCssName(token);
};

Block.prototype.onSpaceToken = function(token) {
	this.appendSpace(token);
};

Block.prototype.onInsertTemplateToken = function(token) {
	this.appendInsertTemplate(token);
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

Block.prototype.appendFragment = function(token) {
	var fragment = token.fragment;

	if (this.options.needCompactFragmentWhitespaces)
	{
		fragment = this.compactFragmentWhitespaces(fragment);
	}

	if (fragment)
	{
		this.sequence.openOrSeparateIfNeed();
		this.buffer.push("'", this.jsStringEscape(fragment), "'");
		this.sequence.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.fragment);
	}
};

Block.prototype.appendExpression = function(token) {
	var expression = token.expression;

	if (expression.search(/[\r\n]/) == -1)
	{
		expression = expression.trim();
	}

	this.sequence.openOrSeparateIfNeed();
	if (token.toBeEscaped)
	{
		this.buffer.push(
			this.options.thisAlias, '.',
			this.options.funcStrs.escape, '(', expression, ')'
		);
	}
	else
	{
		this.buffer.push(expression);
	}

	this.sequence.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.expression);
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

Block.prototype.appendCssName = function(token) {
	this.sequence.openOrSeparateIfNeed();

	var buffer = this.buffer;

	if (token.nameExpr == null && token.nameStr == null && token.modifiers == null)
	{
		buffer.push(this.options.thisAlias, '.', this.options.css.baseCssNamePropStr);
	}
	else if (this.options.css.appendCssNamesLiterallyWhenPossible && token.nameStr != null)
	{
		buffer.push('\'', this.jsStringEscape(token.nameStr.trim()), '\'');
	}
	else
	{
		this.appendGetCssNameFunctionFullStr();
		buffer.push('(');
		if (token.nameStr != null)
		{
			buffer.push('\'', this.jsStringEscape(token.nameStr.trim()), '\'');
		}
		else
		{
			if (token.nameExpr == null)
			{
				buffer.push(this.options.thisAlias, '.', this.options.css.baseCssNamePropStr);
			}
			else
			{
				buffer.push(token.nameExpr.trim());
			}
			buffer.push(', \'', this.jsStringEscape(token.modifiers.trim()), '\'');
		}
		buffer.push(')');
	}

	this.sequence.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.expression);
};

Block.prototype.appendSpace = function(token) {
	this.sequence.openOrSeparateIfNeed();
	this.buffer.push("' '");
	this.sequence.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.fragment);
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

// string utilities

Block.prototype.compactFragmentWhitespaces = function(fragment) {
	// NOTE keep in mind that html can contain not only text and tags but also script blocks
	return fragment
		.replace(/\s*[\r\n]+\s*</g, '<')
		.replace(/>\s*[\r\n]+\s*/g, '>')
		.replace(/(^\s*[\r\n]\s*)|(\s*[\r\n]\s*$)/g, '');
};

Block.prototype.jsStringEscape = function(str) {
	return strTools.jsStringEscape(str);
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

Block.prototype.appendGetCssNameFunctionFullStr = function() {
	if (!this.options.css.getCssNameFuncIsGlobal)
	{
		this.buffer.push(this.options.thisAlias, '.');
	}
	this.buffer.push(this.options.css.getCssNameFuncStr);
};


module.exports = Block;
