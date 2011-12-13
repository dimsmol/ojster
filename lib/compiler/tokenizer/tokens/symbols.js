var inherits = require('util').inherits;

var Token = require('./core').Token;


var Space = function(ctx) {
	this.ctx = ctx;
};
inherits(Space, Token);

Space.prototype.generatorAction = function(generator) {
	generator.appendSpace(this.ctx);
};


module.exports = {
	Space: Space
};
