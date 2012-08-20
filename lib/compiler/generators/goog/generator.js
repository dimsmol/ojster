"use strict";
var inherits = require('util').inherits;

var CoreGenerator = require('../core/generator');

var Template = require('./template');
var defaultOptions = require('./options');


var Generator = function(options) {
	CoreGenerator.call(this, options);

	this.providesBuffer = null;
	this.isScopeOpened = false;
};
inherits(Generator, CoreGenerator);

Generator.prototype.getDefaultOptions = function() {
	return defaultOptions;
};

Generator.prototype.createTemplate = function(token) {
	return new Template(this, token);
};

// lifecycle

Generator.prototype.onStart = function() {
	this.providesBuffer = this.reserveBuffer();
};

Generator.prototype.onEnd = function() {
	this.appendProvides();

	if (this.options.useScope && this.isScopeOpened)
	{
		this.appendCloseScope();
	}
};

// template level tokens

Generator.prototype.onTemplateToken = function(token) {
	if (this.options.useScope && !this.isScopeOpened)
	{
		this.appendOpenScope();
		this.isScopeOpened = true;
		this.appendRequireAliases();
	}

	Generator.super_.prototype.onTemplateToken.call(this, token);
};

// append for tokens

Generator.prototype.appendRequire = function(token) {
	this.buffer.push(
		"goog.require('", token.fullName, "');"
	);

	if (this.options.appendLineNumbersFor.require)
	{
		this.appendLineNumber(token.ctx);
	}
};

// utility append

Generator.prototype.appendOpenScope = function() {
	this.buffer.push(
		'goog.scope(function() {\n\n'
	);
};

Generator.prototype.appendCloseScope = function() {
	this.buffer.push(
		'\n}); // goog.scope'
	);
};

Generator.prototype.appendProvides = function() {
	for (var i = 0; i < this.templates.length; i++)
	{
		var template = this.templates[i];
		this.providesBuffer.push(
			"\ngoog.provide('",
			template.fullName,
			"');\n\n"
		);
	}
};

Generator.prototype.appendRequireAliases = function() {
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
		this.buffer.push('\n');
	}
};

Generator.prototype.appendRequireAlias = function(alias, fullName, subname) {
	this.buffer.push(
		'var ', alias, ' = ', fullName
	);
	if (subname)
	{
		this.buffer.push('.', subname);
	}
	this.buffer.push(';\n');
};


module.exports = Generator;
