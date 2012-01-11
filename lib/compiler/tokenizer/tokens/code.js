var inherits = require('util').inherits;

var Token = require('./core').Token;


var Code = function(ctx, code) {
	this.ctx = ctx;
	this.code = code;
};
inherits(Code, Token);

Code.prototype.visitGenerator = function(generator) {
	generator.onCodeToken(this);
};

module.exports = Code;
