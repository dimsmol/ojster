var inherits = require('util').inherits;

var Template = require('../node/template');

var GoogBlock = require('./block');


var GoogTemplate = function(generator, token) {
	Template.call(this, generator, token);
};
inherits(GoogTemplate, Template);

GoogTemplate.prototype.createBlock = function(token) {
	return new GoogBlock(this, token);
};

// names

GoogTemplate.prototype.getNameToUse = function() {
	if (this.options.useScope && this.token.alias)
	{
		return this.token.alias;
	}

	return this.fullName;
};

GoogTemplate.prototype.getBaseNameToUse = function() {
	if (this.options.useScope && this.inheritsToken.templateBaseName)
	{
		return this.inheritsToken.templateBaseName;
	}

	return this.inheritsToken.templateBaseFullName;
};

// utility append

GoogTemplate.prototype.appendDefinitionStart = function() {
	this.definitionBuffer.append(
		'/**\n',
		' * @param {Object=} opt_data\n',
		' * @param {Object=} opt_ctx\n',
		' * @param {Object=} opt_writer\n',
		' * @constructor\n',
		' * @extends {', this.baseNameToUse,'}\n',
		' */\n',
		this.fullName, ' = function(opt_data, opt_ctx, opt_writer) {'
	);
};

GoogTemplate.prototype.appendDefinitionEnd = function() {
	GoogTemplate.super_.prototype.appendDefinitionEnd.call(this);

	if (this.options.useScope) // aliasing template name
	{
		this.definitionBuffer.append(
			'\nvar ', this.token.alias, ' = ',
			this.fullName, ';'
		);
	}
};

GoogTemplate.prototype.appendBaseCall = function(ctx, funcName, args, thisStr, buffer) {
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

	buffer.append(
		this.options.indentStr,
		'goog.base(', thisStr, ", '", funcName, "'", comma, args, ');'
	);
};

GoogTemplate.prototype.appendBaseConstructorCall = function() {
	this.definitionBuffer.append(
		'goog.base(this, opt_data, opt_ctx, opt_writer);'
	);
};


module.exports = GoogTemplate;
