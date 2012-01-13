var inherits = require('util').inherits;

var Token = require('./core').Token;


var FunctionStart = function(ctx, name, args, endImmediately, opt_isInit, opt_body) {
	this.ctx = ctx;
	this.name = name;
	this.args = args;
	this.endImmediately = endImmediately;
	this.isInit = !!opt_isInit;
	this.body = opt_body;
};
inherits(FunctionStart, Token);

FunctionStart.prototype.visitGenerator = function(generator) {
	generator.onFunctionStartToken(this);
};


var FunctionEnd = function(ctx, name, opt_isInit) {
	this.ctx = ctx;
	this.name = name;
	this.isInit = !!opt_isInit;
};
inherits(FunctionEnd, Token);

FunctionEnd.prototype.visitGenerator = function(generator) {
	generator.onFunctionEndToken(this);
};


module.exports = {
	FunctionStart: FunctionStart,
	FunctionEnd: FunctionEnd
};
