"use strict";
var inherits = require('util').inherits;
var CoreTemplate = require('../core/template');
var Block = require('../core/block');


var Template = function (generator, token) {
	CoreTemplate.call(this, generator, token);
};
inherits(Template, CoreTemplate);

Template.prototype.createBlock = function (token) {
	return new Block(this, token);
};

// names

Template.prototype.getNameToUse = function () {
	if (this.options.useScope && this.token.alias) {
		return this.token.alias;
	}

	return this.fullName;
};

Template.prototype.getBaseNameToUse = function () {
	if (this.options.useScope && this.inheritsToken.templateBaseName) {
		return this.inheritsToken.templateBaseName;
	}

	return this.inheritsToken.templateBaseFullName;
};

// utility append

Template.prototype.appendDefinitionStart = function () {
	this.definitionBuffer.push(
		'/**\n',
		' * @param {Object=} opt_data\n',
		' * @param {Object=} opt_ctx\n',
		' * @param {', this.options.writerClass, '=} opt_writer\n',
		' * @constructor\n',
		' * @extends {', this.baseNameToUse,'}\n',
		' */\n',
		this.fullName, ' = function (opt_data, opt_ctx, opt_writer) {'
	);
};

Template.prototype.appendDefinitionEnd = function () {
	Template.super_.prototype.appendDefinitionEnd.call(this);

	// aliasing template name
	if (this.options.useScope) {
		this.definitionBuffer.push(
			'\nvar ', this.token.alias, ' = ',
			this.fullName, ';'
		);
	}
};

Template.prototype.appendBaseCall = function (ctx, funcName, args, buffer) {
	var comma = '';
	if (args) {
		comma = ', ';
	}
	else {
		args = '';
	}

	if (this.options.useOldBaseCall) {
		buffer.push(
			this.options.indentStr,
			"goog.base(this, '", funcName, "'", comma, args, ');'
		);
	}
	else {
		buffer.push(
			this.options.indentStr,
			this.fullName, ".base(this, '", funcName, "'", comma, args, ');'
		);
	}
};

Template.prototype.appendBaseConstructorCall = function () {
	if (this.options.useOldBaseCall) {
		this.definitionBuffer.push(
			'goog.base(this, opt_data, opt_ctx, opt_writer);'
		);
	}
	else {
		this.definitionBuffer.push(
			this.fullName, ".base(this, 'constructor', opt_data, opt_ctx, opt_writer);"
		);
	}
};


module.exports = Template;
