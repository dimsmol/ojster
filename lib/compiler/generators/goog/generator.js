var inherits = require('util').inherits;

var defaultOptions = require('./options');
var Generator = require('../node/generator');

var GoogTemplate = require('./template');


var GoogGenerator = function(options) {
	Generator.call(this, options);

	this.providesBuffer = null;
	this.isScopeOpened = false;
};
inherits(GoogGenerator, Generator);

GoogGenerator.prototype.getDefaultOptions = function() {
	return defaultOptions;
};

GoogGenerator.prototype.createTemplate = function(token) {
	return new GoogTemplate(this, token);
};

// lifecycle

GoogGenerator.prototype.onStart = function() {
	this.providesBuffer = this.reserveBuffer();
};

GoogGenerator.prototype.onEnd = function() {
	this.appendProvides();

	if (this.options.useScope && this.isScopeOpened)
	{
		this.appendCloseScope();
	}
};

// template level tokens

GoogGenerator.prototype.onTemplateToken = function(token) {
	if (this.options.useScope && !this.isScopeOpened)
	{
		this.appendOpenScope();
		this.isScopeOpened = true;
		this.appendRequireAliases();
	}

	GoogGenerator.super_.prototype.onTemplateToken.call(this, token);
};

// append for tokens

GoogGenerator.prototype.appendRequire = function(token) {
	this.buffer.append(
		"goog.require('", token.fullName, "');"
	);

	if (this.options.appendLineNumbersFor.require)
	{
		this.appendLineNumber(token.ctx);
	}
};

// utility append

GoogGenerator.prototype.appendRequireInherits = function() {
};

GoogGenerator.prototype.appendExports = function() {
};

//

GoogGenerator.prototype.appendOpenScope = function() {
	this.buffer.append(
		'goog.scope(function() {\n\n'
	);
};

GoogGenerator.prototype.appendCloseScope = function() {
	this.buffer.append(
		'\n}); // goog.scope'
	);
};

GoogGenerator.prototype.appendProvides = function() {
	for (var i = 0; i < this.templates.length; i++)
	{
		var template = this.templates[i];
		this.providesBuffer.append(
			"\ngoog.provide('",
			template.fullName,
			"');\n\n"
		);
	}
};

GoogGenerator.prototype.appendRequireAliases = function() {
	var added = false;

	for(var i = 0, l = this.requirements.length; i < l; i++)
	{
		var requirement = this.requirements[i];
		var fullName = requirement.fullName;
		var subname = requirement.subname;

		if (subname || fullName.indexOf('.') != -1)
		{
			this.appendRequireAlias(requirement.alias, fullName, subname);
			added = true;
		}
	}

	if (added)
	{
		this.buffer.append('\n');
	}
};

GoogGenerator.prototype.appendRequireAlias = function(alias, fullName, subname) {
	this.buffer.append(
		'var ', alias, ' = ', fullName
	);
	if (subname)
	{
		this.buffer.append('.', subname);
	}
	this.buffer.append(';\n');
};


module.exports = GoogGenerator;
