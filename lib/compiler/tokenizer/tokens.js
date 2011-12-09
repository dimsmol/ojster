
var InvalidTokenClass = function() {
};
InvalidTokenClass.prototype.generatorAction = function(generator) {
};
var InvalidToken = new InvalidTokenClass();

var Fragment = function(ctx, fragment) {
    this.ctx = ctx;
    this.fragment = fragment;
};
Fragment.prototype.generatorAction = function(generator) {
    generator.appendFragment(this.ctx, this.fragment);
};

var Expression = function(ctx, expression, toBeEscaped) {
    this.ctx = ctx;
    this.expression = expression;
    this.toBeEscaped = toBeEscaped;
};
Expression.prototype.generatorAction = function(generator) {
    generator.appendExpression(this.ctx, this.expression, this.toBeEscaped);
};

var CodeFragment = function(ctx, code) {
    this.ctx = ctx;
    this.code = code;
};
CodeFragment.prototype.generatorAction = function(generator) {
    generator.appendCodeFragment(this.ctx, this.code);
};

var Require = function(ctx, alias, path, subpath, fullName, subname) {
    this.ctx = ctx;
    this.alias = alias;
    this.path = path;
	this.subpath = subpath;
    this.fullName = fullName;
	this.subname = subname;
};
Require.prototype.generatorAction = function(generator) {
    generator.appendRequire(this.ctx, this.alias, this.path, this.subpath, this.fullName, this.subname);
};

var Template = function(ctx, alias, fullName) {
    this.ctx = ctx;
    this.alias = alias;
    this.fullName = fullName;
};
Template.prototype.generatorAction = function(generator) {
    generator.setTemplateInfo(this.ctx, this.alias, this.fullName);
};

var Inherits = function(ctx, templateBaseName, templateBaseFullName) {
    this.ctx = ctx;
    this.templateBaseName = templateBaseName;
    this.templateBaseFullName = templateBaseFullName;
};
Inherits.prototype.generatorAction = function(generator) {
    generator.setInheritanceInfo(this.ctx, this.templateBaseName, this.templateBaseFullName);
};

var OpenBlock = function(ctx, name, args, closedImmediately) {
    this.ctx = ctx;
    this.name = name;
    this.args = args;
    this.closedImmediately = closedImmediately;
};
OpenBlock.prototype.generatorAction = function(generator) {
    generator.openBlock(this.ctx, this.name, this.args, this.closedImmediately);
};

var CloseBlock = function(ctx, name) {
    this.ctx = ctx;
    this.name = name;
};
CloseBlock.prototype.generatorAction = function(generator) {
    generator.closeBlock(this.ctx, this.name);
};

var BlockCall = function(ctx, name, args) {
    this.ctx = ctx;
    this.name = name;
    this.args = args;
};
BlockCall.prototype.generatorAction = function(generator) {
    generator.appendBlockCall(this.ctx, this.name, this.args);
};

var InsertTemplate = function(ctx, name, args) {
    this.ctx = ctx;
    this.name = name;
    this.args = args;
};
InsertTemplate.prototype.generatorAction = function(generator) {
    generator.appendTemplateInsertion(this.ctx, this.name, this.args);
};

var Space = function(ctx) {
    this.ctx = ctx;
};
Space.prototype.generatorAction = function(generator) {
    generator.appendSpace(this.ctx);
};

var Css = function(ctx, nameExpr, nameStr, modifiers) {
    this.ctx = ctx;
    this.nameExpr = nameExpr;
    this.nameStr = nameStr;
    this.modifiers = modifiers;
};
Css.prototype.generatorAction = function(generator) {
    generator.appendCssName(this.ctx, this.nameExpr, this.nameStr, this.modifiers);
};

module.exports = {
    InvalidToken: InvalidToken,
    CodeFragment: CodeFragment,
    Require: Require,
    Template: Template,
    Inherits: Inherits,
    Fragment: Fragment,
    Expression: Expression,
    OpenBlock: OpenBlock,
    CloseBlock: CloseBlock,
	BlockCall: BlockCall,
	InsertTemplate: InsertTemplate,
	Css: Css,
	Space: Space
};
