
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

var Require = function(ctx, alias, path, subpath, fullName) {
    this.ctx = ctx;
    this.alias = alias;
    this.path = path;
	this.subpath = subpath;
    this.fullName = fullName;
};
Require.prototype.generatorAction = function(generator) {
    generator.appendRequire(this.ctx, this.alias, this.path, this.subpath, this.fullName);
};

var Template = function(ctx, alias, fullName) {
    this.ctx = ctx;
    this.alias = alias;
    this.fullName = fullName;
};
Template.prototype.generatorAction = function(generator) {
    generator.setTemplateInfo(this.ctx, this.alias, this.fullName);
};

var Inherits = function(ctx, templateBaseAlias, templateBaseFullName) {
    this.ctx = ctx;
    this.templateBaseAlias = templateBaseAlias;
    this.templateBaseFullName = templateBaseFullName;
};
Inherits.prototype.generatorAction = function(generator) {
    generator.setInheritanceInfo(this.ctx, this.templateBaseAlias, this.templateBaseFullName);
};

var OpenBlock = function(ctx, name, closedImmediately) {
    this.ctx = ctx;
    this.name = name;
    this.closedImmediately = closedImmediately;
};
OpenBlock.prototype.generatorAction = function(generator) {
    generator.openBlock(this.ctx, this.name, this.closedImmediately);
};

var CloseBlock = function(ctx, name) {
    this.ctx = ctx;
    this.name = name;
};
CloseBlock.prototype.generatorAction = function(generator) {
    generator.closeBlock(this.ctx, this.name);
};

module.exports = {
    InvalidToken: InvalidToken,
    Fragment: Fragment,
    Expression: Expression,
    CodeFragment: CodeFragment,
    Require: Require,
    Template: Template,
    OpenBlock: OpenBlock,
    CloseBlock: CloseBlock,
    Inherits: Inherits
};
