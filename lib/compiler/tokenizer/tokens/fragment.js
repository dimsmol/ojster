var inherits = require('util').inherits;

var Token = require('./core').Token;


var Fragment = function(ctx, fragment) {
	this.ctx = ctx;
	this.fragment = fragment;
};
inherits(Fragment, Token);

Fragment.prototype.generatorAction = function(generator) {
	generator.appendFragment(this.ctx, this.fragment);
};


module.exports = Fragment;
