var inherits = require('util').inherits;

var Token = require('./core').Token;


var Base = function(ctx, args) {
	this.ctx = ctx;
	this.args = args;
};
inherits(Base, Token);

Base.prototype.visitGenerator = function(generator) {
	generator.onBaseToken(this);
};


module.exports = Base;
