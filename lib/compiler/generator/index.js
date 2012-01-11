var Buffer = require('./buffer');
var Template = require('./template');
var errors = require('./generation_errors');

var RequireToken = require('../tokenizer/tokens/require');

var defaultOptions = require('./options');
var createExtendedClone = require('../../tools/object_tools').createExtendedClone;


var Generator = function(options) {
	this.options = createExtendedClone(this.getDefaultOptions(), options);

	this.requirements = [];

	this.templates = [];
	this.currentTemplate = null;

	this.buffers = [];
	this.buffer = null;

	this.requireInheritsBuffer = null;

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
	this.requireInheritsBuffer = this.reserveBuffer();
};

Generator.prototype.end = function() {
	if (this.currentTemplate != null)
	{
		this.currentTemplate.end();
	}

	this.onEnd();

	this.buffer.append('\n'); // trailing \n

	this.isFinished = true;
};

Generator.prototype.onEnd = function() {
	this.appendRequireInherits(); // TODO move to start?
	this.appendExports();
};

Generator.prototype.getResult = function() {
	if (!this.isFinished)
	{
		this.end();
	}

	return this.joinBuffers();
};

// global tokens

Generator.prototype.onRequireToken = function(token) {
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
	else if (this.options.nonBlockFragmentsAreCode) {
		this.appendFragmentAsCode(token);
	}
	else if (fragment.match(/\S/)) {
		this.error(new errors.FragmentBeyondBlock(token));
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
	this.ensureWithinTemplate(token);
	this.currentTemplate.onInheritsToken(token);
};

// block level tokens

Generator.prototype.onBlockStartToken = function(token) {
	this.ensureWithinTemplate(token);
	this.currentTemplate.onBlockStartToken(token);
};

Generator.prototype.onBlockEndToken = function(token) {
	this.ensureWithinTemplate(token);
	this.currentTemplate.onBlockEndToken(token);
};

// within block tokens

Generator.prototype.onExpressionToken = function(token) {
	this.ensureWithinTemplate(token);
	this.currentTemplate.onExpressionToken(token);
};

Generator.prototype.onBlockCallToken = function(token) {
	this.ensureWithinTemplate(token);
	this.currentTemplate.onBlockCallToken(token);
};

Generator.prototype.onCssToken = function(token) {
	this.ensureWithinTemplate(token);
	this.currentTemplate.onCssToken(token);
};

Generator.prototype.onSpaceToken = function(token) {
	this.ensureWithinTemplate(token);
	this.currentTemplate.onSpaceToken(token);
};

Generator.prototype.onInsertTemplateToken = function(token) {
	this.ensureWithinTemplate(token);
	this.currentTemplate.onInsertTemplateToken(token);
};

// checks

Generator.prototype.ensureWithinTemplate = function(token) {
	if (this.currentTemplate == null)
	{
		throw new errors.TemplateNotDefined(token.ctx);
	}
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

Generator.prototype.appendRequire = function(token, opt_buffer) {
	var buffer = opt_buffer || this.buffer;

	buffer.append(
		'var ', token.alias, ' = require(', token.path, ')'
	);
	if (token.subpath) {
		buffer.append(
			'.', token.subpath
		);
	}
	buffer.append(';');

	if (this.options.appendLineNumbersFor.require) {
		this.appendLineNumber(token.ctx, buffer);
	}
};

Generator.prototype.appendFragmentAsCode = function(token, opt_buffer) {
	var buffer = opt_buffer || this.buffer;
	var code = token.fragment;

	buffer.append(code);
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
			buffer.append('\n', this.options.indentStr);
		}
	}
	else
	{
		code = this.removeTrailingSpaces(code);
	}

	buffer.append(code);

	if (opt_withinBlock)
	{
		if (oneLineInstruction)
		{
			if (this.options.appendLineNumbersFor.oneLineCodeFragment)
			{
				this.appendLineNumber(ctx, opt_buffer);
			}
			buffer.append('\n');
		}
		buffer.append('\n');
	}
};

// utility append

Generator.prototype.appendIntro = function() {
	if (this.options.intro)
	{
		this.buffer.append(this.options.intro);
	}
};

Generator.prototype.appendLineNumber = function(ctx, opt_buffer) {
	if (ctx != null)
	{
		var buffer = opt_buffer || this.buffer;
		buffer.append(' // @', ctx.lineNumber, ':', ctx.linePos);
	}
};

Generator.prototype.appendRequireInherits = function() {
	var buffer = this.requireInheritsBuffer;

	buffer.append('\n');
	var token = new RequireToken(
		null,
		this.options.inherits.alias,
		this.options.inherits.path,
		this.options.inherits.subpath,
		this.options.inherits.fullName,
		this.options.inherits.subname
	);
	this.appendRequire(token, this.requireInheritsBuffer);
	buffer.append('\n');
};


// TODO move to template?
Generator.prototype.appendBaseCall = function(ctx, funcName, args, thisStr, opt_buffer) {
	var buffer = opt_buffer || this.buffer;

	// TODO
//	if (!this.inheritsAdded) {
//		this.reportInheritanceInfoMissedError(ctx);
//		return;
//	}

	if (thisStr == null) {
		thisStr = 'this';
	}

	var comma = (args && args != '' ? ', ' : null);
	buffer.append(
		this.options.indentStr,
		this.currentTemplate.baseNameToUse, '.prototype.', funcName,
		'.call(', thisStr, args, ');'
	);
};

Generator.prototype.appendExports = function() {
	if (this.templates.length == 1)
	{
		this.buffer.append(
			'\nmodule.exports = ', this.templates[0].nameToUse, ';'
		);
	}
	else
	{
		this.buffer.append('\nmodule.exports = {\n');
		for (var i = 0; i < this.templates.length; i++)
		{
			var template = this.templates[i];
			var prefix = (i > 0 ? ',\n' : '');
			this.buffer.append(
				prefix,
				this.options.indentStr,
				template.name, ': ', template.nameToUse
			);
		}
		this.buffer.append('\n};');
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
	return new Buffer();
};

Generator.prototype.joinBuffers = function () {
	var result = [];

	for (var i = 0, l = this.buffers.length; i < l; i++)
	{
		var buffer = this.buffers[i];
		result.push(buffer.getValue());
	}

	return result.join('');
};

module.exports = Generator;
