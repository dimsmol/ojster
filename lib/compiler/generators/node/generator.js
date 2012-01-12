var optionTools = require('../../../tools/options');

var RequireToken = require('../../tokenizer/tokens/require');

var defaultOptions = require('../core/options');
var errors = require('../core/errors');

var Template = require('./template');


var Generator = function(options) {
	this.options = optionTools.cloneWithDefaults(options, this.getDefaultOptions());

	this.requirements = [];

	this.templates = [];
	this.currentTemplate = null;

	this.buffers = [];
	this.buffer = null;

	this.isStarted = false;
	this.isFinished = false;
};

Generator.prototype.getDefaultOptions = function() {
	return defaultOptions;
};

Generator.prototype.createTemplate = function(token) {
	return new Template(this, token);
};

// lifecycle

Generator.prototype.start = function() {
	this.buffer = this.appendBuffer();
	this.appendIntro();

	this.onStart();

	this.isStarted = true;
};

Generator.prototype.onStart = function() {
	this.appendRequireInherits();
};

Generator.prototype.end = function() {
	if (this.currentTemplate != null)
	{
		this.currentTemplate.end();
	}
	else
	{
		throw new errors.TemplateTokenNotFound();
	}

	this.onEnd();

	this.buffer.push('\n'); // trailing \n

	this.isFinished = true;
};

Generator.prototype.onEnd = function() {
	this.appendExports();
};

Generator.prototype.getResult = function() {
	if (!this.isFinished)
	{
		this.end();
	}

	return this.joinBuffers();
};

// checks

Generator.prototype.ensureTokenWithinTemplate = function(token) {
	if (this.currentTemplate == null)
	{
		throw new errors.TokenMustBeWithinTemplate(token);
	}
};

Generator.prototype.ensureTokenBeyondTemplate = function(token) {
	if (this.currentTemplate != null)
	{
		throw new errors.TokenMustBeBeyondTemplate(token);
	}
};

// global tokens

Generator.prototype.onRequireToken = function(token) {
	this.ensureTokenBeyondTemplate(token);

	this.requirements.push(token);
	this.appendRequire(token);
};

Generator.prototype.onCodeToken = function(token) {
	if (this.currentTemplate != null)
	{
		this.currentTemplate.onCodeToken(token);
	}
	else
	{
		this.appendCode(token);
	}
};

Generator.prototype.onFragmentToken = function(token) {
	if (this.currentTemplate != null)
	{
		this.currentTemplate.onFragmentToken(token);
	}
	else if (this.options.nonBlockFragmentsAreCode)
	{
		this.appendFragmentAsCode(token);
	}
	else if (fragment.match(/\S/))
	{
		throw new errors.TokenMustBeWithinBlock(token);
	}
};

// template level tokens

Generator.prototype.onTemplateToken = function(token) {
	if (this.currentTemplate != null)
	{
		// end previous template before start new one
		this.currentTemplate.end();
	}

	var template = this.createTemplate(token);
	template.start();
};

Generator.prototype.onInheritsToken = function(token) {
	this.ensureTokenWithinTemplate(token);
	this.currentTemplate.onInheritsToken(token);
};

// block level tokens

Generator.prototype.onBlockStartToken = function(token) {
	this.ensureTokenWithinTemplate(token);
	this.currentTemplate.onBlockStartToken(token);
};

Generator.prototype.onBlockEndToken = function(token) {
	this.ensureTokenWithinTemplate(token);
	this.currentTemplate.onBlockEndToken(token);
};

// within block tokens

Generator.prototype.onExpressionToken = function(token) {
	this.ensureTokenWithinTemplate(token);
	this.currentTemplate.onExpressionToken(token);
};

Generator.prototype.onBlockCallToken = function(token) {
	this.ensureTokenWithinTemplate(token);
	this.currentTemplate.onBlockCallToken(token);
};

Generator.prototype.onCssToken = function(token) {
	this.ensureTokenWithinTemplate(token);
	this.currentTemplate.onCssToken(token);
};

Generator.prototype.onSpaceToken = function(token) {
	this.ensureTokenWithinTemplate(token);
	this.currentTemplate.onSpaceToken(token);
};

Generator.prototype.onInsertTemplateToken = function(token) {
	this.ensureTokenWithinTemplate(token);
	this.currentTemplate.onInsertTemplateToken(token);
};

// events

Generator.prototype.onToken = function(token) {
	if (!this.isStarted)
	{
		this.start();
	}
	token.visitGenerator(this);
};

Generator.prototype.onTemplateStart = function(template) {
	this.templates.push(template);
	this.currentTemplate = template;
};

Generator.prototype.onTemplateEnd = function(template) {
	this.currentTemplate = null;
};

// append for tokens

Generator.prototype.appendRequire = function(token) {
	this.buffer.push(
		'var ', token.alias, ' = require(', token.path, ')'
	);
	if (token.subpath)
	{
		this.buffer.push(
			'.', token.subpath
		);
	}
	this.buffer.push(';');

	if (this.options.appendLineNumbersFor.require)
	{
		this.appendLineNumber(token.ctx);
	}
};

Generator.prototype.appendFragmentAsCode = function(token, opt_buffer) {
	var buffer = opt_buffer || this.buffer;
	var code = token.fragment;

	buffer.push(code);
};

Generator.prototype.appendCode = function(token, opt_buffer, opt_withinBlock) {
	var buffer = opt_buffer || this.buffer;
	var code = token.code;

	var oneLineInstruction = (code.search(/[\r\n]/) == -1);
	if (oneLineInstruction)
	{
		code = code.trim();
		if (opt_withinBlock)
		{
			buffer.push('\n', this.options.indentStr);
		}
	}
	else
	{
		code = this.removeTrailingSpaces(code);
	}

	buffer.push(code);

	if (opt_withinBlock)
	{
		if (oneLineInstruction)
		{
			if (this.options.appendLineNumbersFor.oneLineCodeFragment)
			{
				this.appendLineNumber(ctx, opt_buffer);
			}
			buffer.push('\n');
		}
		buffer.push('\n');
	}
};

// utility append

Generator.prototype.appendIntro = function() {
	if (this.options.intro)
	{
		this.buffer.push(this.options.intro);
	}
};

Generator.prototype.appendLineNumber = function(ctx, opt_buffer) {
	if (ctx != null)
	{
		var buffer = opt_buffer || this.buffer;
		buffer.push(' // @', ctx.lineNumber, ':', ctx.linePos);
	}
};

Generator.prototype.appendRequireInherits = function() {
	var buffer = this.buffer;

	buffer.push('\n');
	var token = new RequireToken(
		null,
		this.options.inherits.alias,
		this.options.inherits.path,
		this.options.inherits.subpath,
		this.options.inherits.fullName,
		this.options.inherits.subname
	);
	this.appendRequire(token);
	buffer.push('\n');
};

Generator.prototype.appendExports = function() {
	if (this.templates.length == 1)
	{
		this.buffer.push(
			'\nmodule.exports = ', this.templates[0].nameToUse, ';'
		);
	}
	else
	{
		this.buffer.push('\nmodule.exports = {\n');
		for (var i = 0; i < this.templates.length; i++)
		{
			var template = this.templates[i];
			var prefix = (i > 0 ? ',\n' : '');
			this.buffer.push(
				prefix,
				this.options.indentStr,
				template.name, ': ', template.nameToUse
			);
		}
		this.buffer.push('\n};');
	}
};

// string utilities

Generator.prototype.removeTrailingSpaces = function(code) {
	return code.replace(/[\ \t]+$/g, '');
};

// buffers

Generator.prototype.reserveBuffer = function () {
	var buffer = this.appendBuffer();
	this.buffer = this.appendBuffer();
	return buffer;
};

Generator.prototype.appendBuffer = function () {
	var buffer = this.createBuffer();
	this.buffers.push(buffer);
	return buffer;
};

Generator.prototype.createBuffer = function () {
	return [];
};

Generator.prototype.joinBuffers = function () {
	return Array.prototype.concat.apply([], this.buffers).join('');
};

module.exports = Generator;
