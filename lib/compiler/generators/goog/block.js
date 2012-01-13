var inherits = require('util').inherits;

var CoreBlock = require('../core/block');


var Block = function(template, token) {
	CoreBlock.call(this, template, token);
};
inherits(Block, CoreBlock);

Block.prototype.appendGetCssNameFunctionFullStr = function() {
	if (this.options.css.useGoogGetCssName)
	{
		// direct generation of goog.getCssName, tribute to Closure Compiler
		this.buffer.push(this.options.css.googGetCssNameFuncStr);
	}
	else
	{
		Block.super_.prototype.appendGetCssNameFunctionFullStr.call(this);
	}
};


module.exports = Block;
