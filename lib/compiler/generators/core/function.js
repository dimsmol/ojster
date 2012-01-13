var errors = require('./errors');

var strTools = require('../../../tools/str');


var Func = function(template, token) {
	this.template = template;
	this.token = token;

	this.name = this.token.name;
	this.generator = this.template.generator;
	this.options = this.generator.options;
	this.buffer = null;

	this.nameToUse = this.getNameToUse();
};

Func.prototype.obtainBuffer = function() {
	return this.generator.buffer;
};

Func.prototype.getNameToUse = function() {
	return this.name;
};

Func.prototype.createClosedWithoutOpenningError = function(token) {
	throw new errors.FunctionClosedWithoutOpenning(token.ctx, token.name);
};

// lifecycle

Func.prototype.start = function() {
	this.templateOnStart();

	this.buffer = this.obtainBuffer();
	this.appendStart();

	if (this.token.endImmediately)
	{
		this.end();
	}
};

Func.prototype.end = function(opt_token) {
	if (opt_token != null && opt_token.name != null && this.name != opt_token.name)
	{
		throw this.createClosedWithoutOpenningError(opt_token);
	}

	this.appendEnd(opt_token);

	this.templateOnEnd();
};

Func.prototype.templateOnStart = function() {
	this.template.onFunctionStart(this);
};

Func.prototype.templateOnEnd = function() {
	this.template.onFunctionEnd(this);
};

// within function tokens

Func.prototype.onBaseToken = function(token) {
	this.appendBaseCall(token.ctx, token.args);
};

Func.prototype.onFragmentToken = function(token) {
	this.generator.appendFragmentAsCode(token, this.buffer);
};

// append for tokens

Func.prototype.appendStart = function() {
	var args = this.token.args;

	if (!args)
	{
		args = '';
	}

	this.buffer.push(
		this.template.nameToUse, '.prototype.', this.nameToUse,
		' = function(', args, ') {'
	);

	if (this.options.appendLineNumbersFor.func)
	{
		this.generator.appendLineNumber(this.token.ctx, this.buffer);
	}

	this.appendLocals();

	if (this.token.isInit)
	{
		this.appendBaseCall();
		this.appendBody();
	}
};

Func.prototype.appendEnd = function(opt_token) {
	this.buffer.push('};');

	if (this.options.appendLineNumbersFor.funcEnd)
	{
		var ctx = (opt_token == null ? null : opt_token.ctx);
		this.generator.appendLineNumber(ctx, this.buffer);
	}
};

Func.prototype.appendBaseCall = function(opt_ctx, opt_args) {
	this.template.appendBaseCall(opt_ctx, this.nameToUse, opt_args, this.buffer);

	if (this.options.appendLineNumbersFor.baseCall)
	{
		this.generator.appendLineNumber(opt_ctx, this.buffer);
	}

	this.buffer.push('\n');
};

Func.prototype.appendBody = function() {
	if (this.token.body)
	{
		this.buffer.push(this.token.body);
	}
};

// utility append

Func.prototype.appendLocals = function() {
	this.buffer.push('\n');

	if (this.options.thisAlias && this.options.thisAlias != 'this')
	{
		this.buffer.push(
			this.options.indentStr, 'var ', this.options.thisAlias, ' = this;\n'
		);
	}

	if (this.options.funcLocals)
	{
		this.buffer.push(
			this.options.indentStr, this.options.funcLocals, '\n'
		);
	}
};


module.exports = Func;
