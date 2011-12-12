var inherits = require('util').inherits;


var Token = function(ctx) {
	this.ctx = ctx;
};
Token.prototype.generatorAction = function(generator) {
};


var InvalidToken = function(error) {
	this.error = error;
};
inherits(InvalidToken, Token);


module.exports = {
	Token: Token,
	InvalidToken: InvalidToken
};
