var inherits = require('util').inherits;

var Token = require('./common').Token;


var Inherits = function(ctx, templateBaseName, templateBaseFullName) {
	this.ctx = ctx;
	this.templateBaseName = templateBaseName;
	this.templateBaseFullName = templateBaseFullName;
};
inherits(Inherits, Token);

Inherits.prototype.generatorAction = function(generator) {
	generator.setInheritanceInfo(this.ctx, this.templateBaseName, this.templateBaseFullName);
};


module.exports = Inherits;
