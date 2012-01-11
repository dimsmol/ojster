var inherits = require('util').inherits;

var Token = require('./core').Token;
var Code = require('./code');


var Fragment = function(ctx, fragment) {
	this.ctx = ctx;
	this.fragment = fragment;
};
inherits(Fragment, Token);

Fragment.prototype.toCode = function() {
	return new Code(this.ctx, this.fragment);
};

Fragment.prototype.visitGenerator = function(generator) {
	generator.onFragmentToken(this);
};


module.exports = Fragment;
