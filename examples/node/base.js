
var inherits = require('util').inherits;

var Template = require('ojster/lib/template');

var Base = function() {
	Template.apply(this, arguments);
};
inherits(Base, Template);

Base.prototype.renderBlockMain = function() { // @4:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<html><head>'
	); // @7:1
	self.renderBlockMeta();
	self.writer.write(
		'<title>'
	); // @8:8
	self.renderBlockTitle();
	self.writer.write(
		'</title>'
	); // @9:1
	self.renderBlockCss();
	self.writer.write(
		' '
	); // @10:1
	self.renderBlockScript();
	self.writer.write(
		'</head><body>'
	); // @12:7
	self.renderBlockContent();
	self.writer.write(
		'</body></html>'
	);
}; // @14:1

Base.prototype.renderBlockMeta = function() { // @7:1
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockTitle = function() { // @8:8
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockCss = function() { // @9:1
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockScript = function() { // @10:1
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockContent = function() { // @12:7
	var self = this;
	var d = this.data, vars = this.vars;
};

module.exports = Base;
