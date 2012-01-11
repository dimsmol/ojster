var Sequence = require('../core/sequence');
var errors = require('../core/errors');

var strTools = require('../../../tools/str_tools');


var Block = function(template, token) {
	this.template = template;
	this.token = token;

	this.name = this.token.name;
	this.generator = this.template.generator;
	this.options = this.generator.options;

	this.sequence = this.createSequence();
	this.buffer = null;
};

Block.prototype.createSequence = function() {
	return new Sequence(this);
};

// names

Block.prototype.getBlockFunctionName = function(name) {
	return this.options.block.funcNamePrefix + strTools.capFirst(name);
};

// lifecycle

Block.prototype.start = function() {
	this.template.onBlockStart(this);

	this.buffer = this.generator.reserveBuffer();
	this.appendStart();

	if (this.token.endImmediately)
	{
		this.end();
	}
};

Block.prototype.end = function(opt_token) {
	if (opt_token != null && opt_token.name != null && this.name != opt_token.name)
	{
		throw new errors.BlockOpeningMissed(token);
	}

	var token = opt_token || this.token;
	var ctx = token.ctx;
	this.sequence.close(this.options.appendLineNumbersFor.sequenceCloseBeforeBlockClose ? ctx : null);
	this.appendEnd(opt_token);

	this.template.onBlockEnd(this);
};

// within block tokens

Block.prototype.onCodeToken = function(token) {
	if (token.code.match(/\S/))
	{
		this.sequence.close(token.ctx);
		this.generator.appendCode(token, this.buffer, true);
	}
};

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
	var funcName = this.getBlockFunctionName(this.name);
	var args = this.token.args;

	var prepend = null;
	if (this.template.blockStack.length > 1)
	{
		prepend = '\n\n';
	}

	// TODO review
	this.template.appendFunctionDefinitionStart(this.token.ctx, funcName, args, prepend, this.buffer);
	this.appendLocals();
};

Block.prototype.appendEnd = function(opt_token) {
	var ctx = (opt_token == null ? null : opt_token.ctx);
	// TODO review
	this.template.appendFunctionDefinitionEnd(ctx, this.buffer);
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
		this.buffer.append("'", this.jsStringEscape(fragment), "'");
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
		this.buffer.append(
			this.options.thisAlias, '.',
			this.options.funcStrs.escape, '(', expression, ')'
		);
	}
	else
	{
		this.buffer.append(expression);
	}

	this.sequence.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.expression);
};

Block.prototype.appendBlockCall = function(token) {
	this.sequence.close(token.ctx);

	if (token.name == '$base')
	{
		this.appendBaseCall(token);
	}
	else
	{
		this.buffer.append(
			this.options.indentStr,
			this.options.thisAlias, '.',
			this.getBlockFunctionName(token.name), '(', token.args, ');'
		);
	}

	if (this.options.appendLineNumbersFor.blockCall)
	{
		this.generator.appendLineNumber(token.ctx, this.buffer);
	}

	this.buffer.append('\n');
};

Block.prototype.appendBaseCall = function(token) {
	var blockFuncName = this.getBlockFunctionName(this.name);
	this.generator.appendBaseCall(token.ctx, blockFuncName, token.args, this.options.thisAlias, this.buffer);
};

Block.prototype.appendCssName = function(token) {
	this.sequence.openOrSeparateIfNeed();

	var buffer = this.buffer;

	if (token.nameExpr == null && token.nameStr == null && token.modifiers == null)
	{
		buffer.append(this.options.thisAlias, '.', this.options.css.baseCssNamePropStr);
	}
	else if (this.options.css.appendCssNamesLiterallyWhenPossible && token.nameStr != null)
	{
		buffer.append('\'', this.jsStringEscape(token.nameStr.trim()), '\'');
	}
	else
	{
		this.appendGetCssNameFunctionFullStr();
		buffer.append('(');
		if (token.nameStr != null)
		{
			buffer.append('\'', this.jsStringEscape(token.nameStr.trim()), '\'');
		}
		else
		{
			if (token.nameExpr == null)
			{
				buffer.append(this.options.thisAlias, '.', this.options.css.baseCssNamePropStr);
			}
			else
			{
				buffer.append(token.nameExpr.trim());
			}
			buffer.append(', \'', this.jsStringEscape(token.modifiers.trim()), '\'');
		}
		buffer.append(')');
	}

	this.sequence.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.expression);
};

Block.prototype.appendSpace = function(token) {
	this.sequence.openOrSeparateIfNeed();
	this.buffer.append("' '");
	this.sequence.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.fragment);
};

Block.prototype.appendInsertTemplate = function(token) {
	this.sequence.close(token.ctx);

	this.buffer.append(
		this.options.indentStr,
		'new ', token.name, '(', token.args, ').renderTo(', this.options.thisAlias,');'
	);

	if (this.options.appendLineNumbersFor.templateInsertion)
	{
		this.generator.appendLineNumber(token.ctx, this.buffer);
	}

	this.buffer.append('\n');
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
		this.buffer.append(
			this.options.indentStr, 'var ', this.options.thisAlias, ' = this;\n'
		);
	}

	if (this.options.block.locals)
	{
		this.buffer.append(
			this.options.indentStr, this.options.block.locals, '\n'
		);
	}
};

Block.prototype.appendGetCssNameFunctionFullStr = function() {
	this.buffer.append(this.options.thisAlias, '.', this.options.css.getCssNameFuncStr);
};


module.exports = Block;
