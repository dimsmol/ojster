var inherits = require('util').inherits;

var Token = require('./core').Token;


var Template = function(ctx, alias, fullName) {
	this.ctx = ctx;
	this.alias = alias;
	this.fullName = fullName;
};
inherits(Template, Token);

Template.prototype.generatorAction = function(generator) {
	generator.setTemplateInfo(this.ctx, this.alias, this.fullName);
};


var InsertTemplate = function(ctx, name, args) {
	this.ctx = ctx;
	this.name = name;
	this.args = args;
};
inherits(InsertTemplate, Token);

InsertTemplate.prototype.generatorAction = function(generator) {
	generator.appendTemplateInsertion(this.ctx, this.name, this.args);
};


module.exports = {
	Template: Template,
	InsertTemplate: InsertTemplate
};
