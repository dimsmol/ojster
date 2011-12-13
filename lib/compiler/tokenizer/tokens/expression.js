var inherits = require('util').inherits;

var Token = require('./core').Token;


var Expression = function(ctx, expression, toBeEscaped) {
	this.ctx = ctx;
	this.expression = expression;
	this.toBeEscaped = toBeEscaped;
};
inherits(Expression, Token);

Expression.prototype.generatorAction = function(generator) {
	generator.appendExpression(this.ctx, this.expression, this.toBeEscaped);
};


module.exports = Expression;
