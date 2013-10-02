"use strict";
var inherits = require('util').inherits;
var tokens = require('../tokens');
var Func = require('./func');


var Block = function(ctx, commandName, commandStr) {
	Func.call(this, ctx, commandName, commandStr);
};
inherits(Block, Func);

Block.prototype.createStartToken = function(name, args, endImmediately, isCommented) {
	return new tokens.BlockStart(this.ctx, name, args, endImmediately, isCommented);
};

Block.prototype.createEndToken = function(opt_name) {
	return new tokens.BlockEnd(this.ctx, opt_name);
};


module.exports = Block;
