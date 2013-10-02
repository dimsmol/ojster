"use strict";
var inherits = require('util').inherits;
var Token = require('./core').Token;


var Comment = function (ctx, text) {
	this.ctx = ctx;
	this.text = text;
};
inherits(Comment, Token);

Comment.prototype.visitGenerator = function (generator) {
	generator.onCommentToken(this);
};

module.exports = Comment;
