var errors = require('../core/errors');

var strTools = require('../../../tools/str');


var Func = function(template, token) {
	this.template = template;
	this.token = token;

	this.name = this.token.name;
	this.generator = this.template.generator;
	this.options = this.generator.options;
	this.buffer = null;

	this.nameToUse = this.getNameToUse();
	this.thisAliasToUse = this.getThisAliasToUse();
};

Func.prototype.obtainBuffer = function() {
	return this.generator.buffer;
};

Func.prototype.getNameToUse = function() {
	return this.name;
};

Func.prototype.getThisAliasToUse = function() {
	return 'this';
};

Func.prototype.createClosedWithoutOpenningError = function(token) {
	// TODO new error
	throw new errors.FunctionClosedWithoutOpenning(token.ctx, token.name);
};

// lifecycle

Func.prototype.start = function() {
	this.onStart();

	this.appendStart();

	if (this.token.endImmediately)
	{
		this.end();
	}
};

Func.prototype.onStart = function() {
	this.buffer = this.obtainBuffer();
	// TODO new handler
	this.template.onFunctionStart(this);
};

Func.prototype.end = function(opt_token) {
	if (opt_token != null && opt_token.name != null && this.name != opt_token.name)
	{
		throw this.createClosedWithoutOpenningError(opt_token);
	}

	this.appendEnd(opt_token);

	this.onEnd();
};

Func.prototype.onEnd = function() {
	// TODO new handler
	this.template.onFunctionEnd(this);
};

// within function tokens

Func.prototype.onCodeToken = function(token) {
	if (token.code.match(/\S/))
	{
		this.appendCode(token);
	}
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

	this.buffer.push('\n');
};

Func.prototype.appendEnd = function(opt_token) {
	this.buffer.push('};');

	if (this.options.appendLineNumbersFor.funcEnd)
	{
		var ctx = (opt_token == null ? null : opt_token.ctx);
		this.generator.appendLineNumber(ctx, this.buffer);
	}
};

Func.prototype.appendCode = function(token) {
	this.generator.appendCode(token, this.buffer, true); // TODO 3rd arg name
};


module.exports = Func;
