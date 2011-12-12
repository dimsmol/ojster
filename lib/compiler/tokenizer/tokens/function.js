var inherits = require('util').inherits;

var Token = require('./common').Token;


var FunctionStart = function(ctx, name, args, endImmediately) {
	this.ctx = ctx;
	this.name = name;
	this.args = args;
	this.endImmediately = endImmediately;
};
inherits(FunctionStart, Token);

FunctionStart.prototype.generatorAction = function(generator) {
	generator.startFunction(this.ctx, this.name, this.args, this.endImmediately);
};


var FunctionEnd = function(ctx, name) {
	this.ctx = ctx;
	this.name = name;
};
inherits(FunctionEnd, Token);

FunctionEnd.prototype.generatorAction = function(generator) {
	generator.endFunction(this.ctx, this.name);
};


var FunctionCall = function(ctx, name, args) {
	this.ctx = ctx;
	this.name = name;
	this.args = args;
};
inherits(FunctionCall, Token);

FunctionCall.prototype.generatorAction = function(generator) {
	generator.appendFunctionCall(this.ctx, this.name, this.args);
};


module.exports = {
	FunctionStart: FunctionStart,
	FunctionEnd: FunctionEnd,
	FunctionCall: FunctionCall
};
