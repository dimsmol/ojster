
goog.provide('ojster');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');


// StringWriter

ojster.StringWriter = function() {
};

ojster.StringWriter.prototype.write = function() {
	this.buff.push.apply(this.buff, arguments);
};

ojster.StringWriter.prototype.done = function() {
	this.buff.join('');
};

ojster.DefaultWriterClass = ojster.StringWriter;


// Template

ojster.Template = function(ctx, data, writer) {
	this.ctx = ctx;
	this.data = data;
	this.writer = writer;

	this.vars = {};
};

ojster.Template.prototype.escape = function(str) {
	return ojster.escape(str);
};

ojster.Template.prototype.render = function() {
	// ensure we have a writer
	if (this.writer == null) {
		this.writer = new ojster.DefaultWriterClass();
	}

	// render
	this.renderBlockMain();
	return this.writer.done();
};

ojster.Template.prototype.renderTo = function(template) {
	this.writer = template.writer;
	this.renderBlockMain();
};

ojster.Template.prototype.renderBlockMain = function() {
	throw new Error('Not implemented');
};


// functions

ojster.escape = function(str) {
	return (str+'').replace(/&/g, '&amp;')
   			       .replace(/</g, '&lt;')
			       .replace(/>/g, '&gt;')
			       .replace(/"/g, '&quot;');
};

ojster.fillElement = function(element, template) {
	element.innerHTML = template.render();
	return element;
};

ojster.createElement = function(template, domHelper) {
	var dom = opt_domHelper || goog.dom.getDomHelper();
	var wrapper = dom.createElement(goog.dom.TagName.DIV);
	wrapper.innerHTML = template.render();

	if (wrapper.childNodes.length == 1) {
		var firstChild = wrapper.firstChild;
		if (firstChild.nodeType == goog.dom.NodeType.ELEMENT) {
			return firstChild;
		}
	}

	return wrapper;
};

ojster.createFragment = function(template, domHelper) {
	var dom = opt_domHelper || goog.dom.getDomHelper();
	return dom.htmlToDocumentFragment(template.render());
};
