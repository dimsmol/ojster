"use strict";
var inherits = require('util').inherits;
var Token = require('./core').Token;


var Inherits = function(ctx, templateBaseName, templateBaseFullName) {
	this.ctx = ctx;
	this.templateBaseName = templateBaseName;
	this.templateBaseFullName = templateBaseFullName;
};
inherits(Inherits, Token);

Inherits.prototype.visitGenerator = function(generator) {
	generator.onInheritsToken(this);
};


module.exports = Inherits;
