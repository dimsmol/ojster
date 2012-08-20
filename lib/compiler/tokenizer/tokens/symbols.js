"use strict";
var inherits = require('util').inherits;
var Token = require('./core').Token;


var Space = function(ctx) {
	this.ctx = ctx;
};
inherits(Space, Token);

Space.prototype.visitGenerator = function(generator) {
	generator.onSpaceToken(this);
};


module.exports = {
	Space: Space
};
