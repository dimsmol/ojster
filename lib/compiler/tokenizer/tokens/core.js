"use strict";
var inherits = require('util').inherits;


var Token = function(ctx) {
	this.ctx = ctx;
};
Token.prototype.visitGenerator = function(generator) {
};


module.exports = {
	Token: Token
};
