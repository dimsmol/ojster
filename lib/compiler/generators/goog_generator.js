var inherits = require('util').inherits;

var Generator = require('../generator');
var strTools = require('../../tools/str_tools');


// TODO provide support for multiple templates

var GoogGenerator = function(options) {
	this.provideBuffer = null;

	Generator.apply(this, arguments);

	options = options || {};
	this.useScope = !!options.useScope;
	this.inheritsAlias = options.inheritsAlias || 'goog.inherits';
	this.inheritsFullName = options.inheritsFullName || 'goog.inherits';
	this.useGoogGetCssName = options.useGoogGetCssName === undefined ? true : !!options.useGoogGetCssName;
	this.googGetCssNameFunctionStr = options.googGetCssNameFunctionStr || 'goog.getCssName';

	this.isScopeOpened = false;
};
inherits(GoogGenerator, Generator);

module.exports = GoogGenerator;

GoogGenerator.prototype.initStack = function() {
	this.appendIntro();
	this.provideBuffer = this.appendBuffer();
	this.requireInheritsBuffer = this.appendBuffer();
};

GoogGenerator.prototype.appendDefinitionBuffer = function() {
	this.appendOpenScope();
	Generator.prototype.appendDefinitionBuffer.call(this);
};

GoogGenerator.prototype.appendRequireTo = function(buffer, ctx, alias, path, subpath, fullName) {
	buffer.append(
		"goog.require('", fullName, "');"
	);

	if (ctx && this.appendLineNumbersFor.require) {
		this.appendLineNumberTo(buffer, ctx);
	}
};

GoogGenerator.prototype.appendInheritsRequire = function() {
};

GoogGenerator.prototype.appendGetCssNameFunctionFullStr = function(buffer) {
	if (!this.useGoogGetCssName) {
		Generator.prototype.appendToSequence.call(this, buffer);
	} else {
		// direct generation of goog.getCssName, tribute to Closure Compiler
		buffer.append(this.googGetCssNameFunctionStr);
	}
};

GoogGenerator.prototype.appendOnTemplateFinalize = function() {
	this.appendProvide();
	Generator.prototype.appendOnTemplateFinalize.call(this);
};

GoogGenerator.prototype.appendOnFinalize = function() {
	Generator.prototype.appendOnFinalize.call(this);
	if (this.useScope) {
		this.appendCloseScope();
	}
};

GoogGenerator.prototype.appendDefinition = function() {
	if (!this.templateInfoSet) {
		this.reportTemplateInfoMissedError();
		return;
	}

	if (this.useScope) {
		this.appendRequireAliases();
	}
	this.definitionBuffer.append(
		'/**\n',
		' * @param {Object=} opt_data\n',
		' * @param {Object=} opt_ctx\n',
		' * @param {Object=} opt_writer\n',
		' * @constructor\n',
		' * @extends {', this.templateBaseNameToUse,'}\n',
		' */\n',
		this.templateFullName, ' = function(opt_data, opt_ctx, opt_writer) {'
	);

	if (this.definitionCtx && this.appendLineNumbersFor.template) {
		this.appendLineNumberTo(this.definitionBuffer, this.definitionCtx);
	}

	this.definitionBuffer.append(
		'\n',
		this.indentStr
	);
	this.appendSuperClassConstructorCall();
	this.definitionBuffer.append(
		'\n};'
	);
	if (this.useScope) { // aliasing template name
		this.definitionBuffer.append(
			'\nvar ', this.templateAlias, ' = ',
			this.templateFullName, ';'
		);
	}
};

GoogGenerator.prototype.appendSuperClassConstructorCall = function() {
	this.definitionBuffer.append(
		'goog.base(this, opt_data, opt_ctx, opt_writer);'
	);
};

GoogGenerator.prototype.appendProvide = function() {
	this.provideBuffer.append(
		"\ngoog.provide('",
		this.templateFullName,
		"');\n\n"
	);
};

GoogGenerator.prototype.appendOpenScope = function() {
	if (this.useScope && !this.isScopeOpened) {
		this.append(
			'goog.scope(function() {\n\n'
		);
		this.isScopeOpened = true;
	}
};

GoogGenerator.prototype.appendCloseScope = function() {
	if (this.isScopeOpened)
	{
		this.append(
			'\n}); // goog.scope'
		);
	}
};

GoogGenerator.prototype.appendRequireAliases = function() {
	var added = false;
	for(var i=0, l=this.requirements.length; i<l; i++) {
		var requirement = this.requirements[i];
		var fullName = requirement.fullName;
		var subname = requirement.subname;
		if (subname || fullName.indexOf('.') != -1) {
			this.appendRequireAlias(requirement.alias, fullName, subname);
			added = true;
		}
	}
	if (added) {
		this.definitionBuffer.append('\n');
	}
};

GoogGenerator.prototype.appendRequireAlias = function(alias, fullName, subname) {
	this.definitionBuffer.append(
		'var ', alias, ' = ', fullName
	);
	if (subname) {
		this.definitionBuffer.append('.', subname);
	}
	this.definitionBuffer.append(';\n');
};

GoogGenerator.prototype.appendExports = function() {
};

GoogGenerator.prototype.getTemplateNameToUse = function() {
	return this.useScope && this.templateAlias ? this.templateAlias : this.templateFullName;
};

GoogGenerator.prototype.getTemplateBaseNameToUse = function() {
	return this.useScope && this.templateBaseName ? this.templateBaseName : this.templateBaseFullName;
};
