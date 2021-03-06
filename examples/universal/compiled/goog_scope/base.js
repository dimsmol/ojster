// Content below is autogenerated by ojster template engine
// usually there is no reason to edit it manually
goog.provide('ojster.example.Base');

// universal templates must provide both aliases and fully qualified names

// @require also needs path to library for node
goog.require('ojster'); // normally here will be just 'ojster'
// example of handling subpath and subname
goog.require('ojster.examples.somemodule');

goog.scope(function () {
"use strict";

var SomeClass = ojster.examples.somemodule.sub.SomeClass;

/**
 * @param {Object=} opt_data
 * @param {Object=} opt_ctx
 * @param {ojster.StringWriter=} opt_writer
 * @constructor
 * @extends {ojster.Template}
 */
ojster.example.Base = function (opt_data, opt_ctx, opt_writer) {
	ojster.example.Base.base(this, 'constructor', opt_data, opt_ctx, opt_writer);
};
var Base = ojster.example.Base;
goog.inherits(Base, ojster.Template);


// aliases can be used only if you are planning to compile with goog.scope enabled
// else there is no way to introduce them without poluting global

// variables defined outside of blocks will become global if goog.scope is not enabled
// the same is true for functions

// on the other hand, fully qualified names also cannot be used,
// because node knows nothing about them

// so, enabling goog.scope can sometimes be the only way to get trully universal template


Base.prototype.renderBlockMain = function () { // @24:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<!DOCTYPE HTML><html><head>'
	); // @28:1
	self.renderBlockMeta(); // @28:1
	self.writer.write(
		'<title>'
	); // @29:8
	self.renderBlockTitle(); // @29:8
	self.writer.write(
		'</title>'
	); // @30:1
	self.renderBlockCss(); // @30:1
	self.renderBlockScript(); // @31:1
	self.writer.write(
		'</head><body>'
	); // @33:7
	self.renderBlockContent(); // @33:7
	self.writer.write(
		'</body></html>'
	);
}; // @35:1

Base.prototype.renderBlockMeta = function () { // @28:1
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockTitle = function () { // @29:8
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockCss = function () { // @30:1
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockScript = function () { // @31:1
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockContent = function () { // @33:7
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockTest1 = function () { // @37:1
	var self = this;
	var d = this.data, vars = this.vars;
};

Base.prototype.renderBlockTest2 = function (a, b) { // @39:1
	var self = this;
	var d = this.data, vars = this.vars;
};

}); // goog.scope
