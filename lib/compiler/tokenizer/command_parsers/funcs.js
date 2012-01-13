var inherits = require('util').inherits;

var tokens = require('../tokens');

var Func = require('./func');


var Funcs = function(ctx, commandName, commandStr) {
	Func.call(this, ctx, commandName, commandStr);
};
inherits(Funcs, Func);

Funcs.prototype.createStartToken = function(name, args, endImmediately) {
	return new tokens.FunctionStart(this.ctx, name, args, endImmediately, true);
};


module.exports = Funcs;
