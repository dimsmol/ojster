var inherits = require('util').inherits;


var Token = function(ctx) {
	this.ctx = ctx;
};
Token.prototype.generatorAction = function(generator) {
};


var InvalidTokenClass = function() {
};
inherits(InvalidTokenClass, Token);

InvalidTokenClass.prototype.generatorAction = function(generator) {
};


var InvalidToken = new InvalidTokenClass();


module.exports = {
	Token: Token,
	InvalidTokenClass: InvalidTokenClass,
	InvalidToken: InvalidToken
};
