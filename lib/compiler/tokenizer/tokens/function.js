var inherits = require('util').inherits;

var Token = require('./core').Token;


var FunctionStart = function(ctx, name, args, endImmediately) {
	this.ctx = ctx;
	this.name = name;
	this.args = args;
	this.endImmediately = endImmediately;
};
inherits(FunctionStart, Token);

FunctionStart.prototype.visitGenerator = function(generator) {
	generator.onFunctionStartToken(this);
};


var FunctionEnd = function(ctx, name) {
	this.ctx = ctx;
	this.name = name;
};
inherits(FunctionEnd, Token);

FunctionEnd.prototype.visitGenerator = function(generator) {
	generator.onFunctionEndToken(this);
};


module.exports = {
	FunctionStart: FunctionStart,
	FunctionEnd: FunctionEnd
};
