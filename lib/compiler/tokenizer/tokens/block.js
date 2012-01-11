var inherits = require('util').inherits;

var func = require('./function');


var BlockStart = function(ctx, name, args, endImmediately) {
	func.FunctionStart.call(this, ctx, name, args, endImmediately);
};
inherits(BlockStart, func.FunctionStart);

BlockStart.prototype.visitGenerator = function(generator) {
	generator.onBlockStartToken(this);
};


var BlockEnd = function(ctx, name) {
	func.FunctionEnd.call(this, ctx, name);
};
inherits(BlockEnd, func.FunctionEnd);

BlockEnd.prototype.visitGenerator = function(generator) {
	generator.onBlockEndToken(this);
};


var BlockCall = function(ctx, name, args) {
	func.FunctionCall.call(this, ctx, name, args);
};
inherits(BlockCall, func.FunctionCall);

BlockCall.prototype.visitGenerator = function(generator) {
	generator.onBlockCallToken(this);
};


module.exports = {
	BlockStart: BlockStart,
	BlockEnd: BlockEnd,
	BlockCall: BlockCall
};
