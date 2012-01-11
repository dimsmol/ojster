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


var FunctionCall = function(ctx, name, args) {
	this.ctx = ctx;
	this.name = name;
	this.args = args;
};
inherits(FunctionCall, Token);

FunctionCall.prototype.visitGenerator = function(generator) {
	generator.onFunctionCallToken(this);
};


module.exports = {
	FunctionStart: FunctionStart,
	FunctionEnd: FunctionEnd,
	FunctionCall: FunctionCall
};
