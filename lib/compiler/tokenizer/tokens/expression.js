var inherits = require('util').inherits;

var Token = require('./core').Token;


var Expression = function(ctx, expression, toBeEscaped) {
	this.ctx = ctx;
	this.expression = expression;
	this.toBeEscaped = toBeEscaped;
};
inherits(Expression, Token);

Expression.prototype.visitGenerator = function(generator) {
	generator.onExpressionToken(this);
};


module.exports = Expression;
