var inherits = require('util').inherits;

var Token = require('./core').Token;


var Css = function(ctx, nameExpr, nameStr, modifiers) {
	this.ctx = ctx;
	this.nameExpr = nameExpr;
	this.nameStr = nameStr;
	this.modifiers = modifiers;
};
inherits(Css, Token);

Css.prototype.generatorAction = function(generator) {
	generator.appendCssName(this.ctx, this.nameExpr, this.nameStr, this.modifiers);
};


module.exports = {
	Css: Css
};
