"use strict";
var strTools = require('../../../tools/str');


var Sequence = function (block) {
	this.block = block;

	this.generator = this.block.generator;
	this.options = this.block.options;

	this.isOpen = false;
	this.lastCtx = null;
};

Sequence.prototype.open = function () {
	var indent = this.options.indentStr;

	this.block.buffer.push(
		indent, this.options.thisAlias, '.', this.options.funcStrs.append, '(\n',
		indent, indent
	);

	this.isOpen = true;
};

Sequence.prototype.separate = function () {
	var buffer = this.block.buffer;

	buffer.push(',');

	if (this.lastCtx) {
		this.generator.appendLineNumber(this.lastCtx, buffer);
	}

	buffer.push(
		'\n',
		this.options.indentStr, this.options.indentStr
	);
};

Sequence.prototype.close = function (ctx) {
	if (this.isOpen) {
		var buffer = this.block.buffer;

		if (this.lastCtx) {
			this.generator.appendLineNumber(this.lastCtx, buffer);
		}

		buffer.push(
			'\n',
			this.options.indentStr, ');'
		);

		if (this.options.appendLineNumbersFor.sequenceClose) {
			this.generator.appendLineNumber(ctx, buffer);
		}

		buffer.push('\n');

		this.isOpen = false;
	}
};

Sequence.prototype.openOrSeparateIfNeed = function () {
	if (!this.isOpen) {
		this.open();
	}
	else {
		this.separate();
	}
};

Sequence.prototype.updateLastCtx = function (ctx, lineNumbersAllowed) {
	if (lineNumbersAllowed) {
		this.lastCtx = ctx;
	}
	else {
		this.lastCtx = null;
	}
};

// within sequence tokens

Sequence.prototype.onFragmentToken = function (token) {
	this.appendFragment(token);
};

Sequence.prototype.onExpressionToken = function (token) {
	this.appendExpression(token);
};

Sequence.prototype.onCssToken = function (token) {
	this.appendCssName(token);
};

Sequence.prototype.onSpaceToken = function (token) {
	this.appendSpace(token);
};

// append for tokens

Sequence.prototype.appendFragment = function (token) {
	var fragment = token.fragment;

	if (this.options.needCompactFragmentWhitespaces) {
		fragment = this.compactFragmentWhitespaces(fragment);
	}

	if (fragment) {
		this.openOrSeparateIfNeed();
		this.block.buffer.push("'", this.jsStringEscape(fragment), "'");
		this.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.fragment);
	}
};

Sequence.prototype.appendExpression = function (token) {
	var expression = token.expression;

	if (expression.search(/[\r\n]/) == -1) {
		expression = expression.trim();
	}

	this.openOrSeparateIfNeed();
	if (token.toBeEscaped) {
		this.block.buffer.push(
			this.options.thisAlias, '.',
			this.options.funcStrs.escape, '(', expression, ')'
		);
	}
	else {
		this.block.buffer.push(expression);
	}

	this.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.expression);
};

Sequence.prototype.appendCssName = function (token) {
	this.openOrSeparateIfNeed();

	var buffer = this.block.buffer;

	if (token.nameExpr == null && token.nameStr == null && token.modifiers == null) {
		buffer.push(this.options.thisAlias, '.', this.options.css.baseCssNamePropStr);
	}
	else if (this.options.css.appendCssNamesLiterallyWhenPossible && token.nameStr != null) {
		buffer.push('\'', this.jsStringEscape(token.nameStr.trim()), '\'');
	}
	else {
		if (!this.options.css.getCssNameFuncIsGlobal) {
			buffer.push(this.options.thisAlias, '.');
		}

		buffer.push(this.options.css.getCssNameFuncStr, '(');

		if (token.nameStr != null) {
			buffer.push('\'', this.jsStringEscape(token.nameStr.trim()), '\'');
		}
		else {
			if (token.nameExpr == null) {
				var useTypeHint = this.options.css.baseCssNamePropUseTypeHint;
				if (useTypeHint) {
					buffer.push('/** @type {string} */ (');
				}
				buffer.push(this.options.thisAlias, '.', this.options.css.baseCssNamePropStr);
				if (useTypeHint) {
					buffer.push(')');
				}
			}
			else {
				buffer.push(token.nameExpr.trim());
			}
			buffer.push(', \'', this.jsStringEscape(token.modifiers.trim()), '\'');
		}

		buffer.push(')');
	}

	this.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.expression);
};

Sequence.prototype.appendSpace = function (token) {
	this.openOrSeparateIfNeed();
	this.block.buffer.push("' '");
	this.updateLastCtx(token.ctx, this.options.appendLineNumbersFor.fragment);
};

// string utilities

Sequence.prototype.compactFragmentWhitespaces = function (fragment) {
	// NOTE keep in mind that html can contain not only text and tags but also script blocks
	return fragment
		.replace(/\s*[\r\n]+\s*</g, '<')
		.replace(/>\s*[\r\n]+\s*/g, '>')
		.replace(/(^\s*[\r\n]\s*)|(\s*[\r\n]\s*$)/g, '');
};

Sequence.prototype.jsStringEscape = function (str) {
	return strTools.jsStringEscape(str);
};


module.exports = Sequence;
