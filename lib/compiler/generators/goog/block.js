var inherits = require('util').inherits;

var Block = require('../node/block');


var GoogBlock = function(template, token) {
	Block.call(this, template, token);
};
inherits(GoogBlock, Block);

GoogBlock.prototype.appendGetCssNameFunctionFullStr = function() {
	if (this.options.css.useGoogGetCssName)
	{
		// direct generation of goog.getCssName, tribute to Closure Compiler
		this.buffer.push(this.options.css.googGetCssNameFuncStr);
	}
	else
	{
		GoogBlock.super_.prototype.appendGetCssNameFunctionFullStr.call(this);
	}
};


module.exports = GoogBlock;
