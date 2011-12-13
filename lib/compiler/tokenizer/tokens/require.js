var inherits = require('util').inherits;

var Token = require('./core').Token;


var Require = function(ctx, alias, path, subpath, fullName, subname) {
	this.ctx = ctx;
	this.alias = alias;
	this.path = path;
	this.subpath = subpath;
	this.fullName = fullName;
	this.subname = subname;
};
inherits(Require, Token);

Require.prototype.generatorAction = function(generator) {
	generator.appendRequire(this.ctx, this.alias, this.path, this.subpath, this.fullName, this.subname);
};


module.exports = Require;
