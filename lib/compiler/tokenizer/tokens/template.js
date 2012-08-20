"use strict";
var inherits = require('util').inherits;
var Token = require('./core').Token;


var Template = function(ctx, alias, fullName) {
	this.ctx = ctx;
	this.alias = alias;
	this.fullName = fullName;
};
inherits(Template, Token);

Template.prototype.visitGenerator = function(generator) {
	generator.onTemplateToken(this);
};


var InsertTemplate = function(ctx, name, args, setupFunc) {
	this.ctx = ctx;
	this.name = name;
	this.args = args;
	this.setupFunc = setupFunc;
};
inherits(InsertTemplate, Token);

InsertTemplate.prototype.visitGenerator = function(generator) {
	generator.onInsertTemplateToken(this);
};


module.exports = {
	Template: Template,
	InsertTemplate: InsertTemplate
};
