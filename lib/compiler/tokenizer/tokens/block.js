var inherits = require('util').inherits;

var func = require('./function');


var BlockStart = function(ctx, name, args, endImmediately) {
	func.FunctionStart.call(this, ctx, name, args, endImmediately);
};
inherits(BlockStart, func.FunctionStart);

BlockStart.prototype.generatorAction = function(generator) {
	generator.startBlock(this.ctx, this.name, this.args, this.endImmediately);
};


var BlockEnd = function(ctx, name) {
	func.FunctionEnd.call(this, ctx, name);
};
inherits(BlockEnd, func.FunctionEnd);

BlockEnd.prototype.generatorAction = function(generator) {
	generator.endBlock(this.ctx, this.name);
};


var BlockCall = function(ctx, name, args) {
	func.FunctionCall.call(this, ctx, name, args);
};
inherits(BlockCall, func.FunctionCall);

BlockCall.prototype.generatorAction = function(generator) {
	generator.appendBlockCall(this.ctx, this.name, this.args);
};


module.exports = {
	BlockStart: BlockStart,
	BlockEnd: BlockEnd,
	BlockCall: BlockCall
};
