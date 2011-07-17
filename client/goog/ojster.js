
goog.provide('ojster');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');


// StringWriter

ojster.StringWriter = function() {
	this.buff = [];
	this.owner = null;
};

// used to get true writer if wrapper object is passed instead (see Template class code)
ojster.StringWriter.prototype.getWriter = function() {
	return this;
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
	this.writer = writer == null ? new DefaultWriterClass() : writer.getWriter(); // writer argument can actually be writer's wrapper, unwrapping it
	if (this.writer.owner == null) {
		this.writer.owner = this;
	}
};

// an example, will be overriden by child template
ojster.Template.prototype.renderBlockMain = function() {
	var self = this;
	var d = this.data, vars = this.vars; // block locals

	self.writer.write(
		'Template example, data are:\n',
		d
	);
};

ojster.Template.prototype.escape = function(str) {
	return ojster.escape(str);
};

// used to get true writer if template is passed instead of it
ojster.Template.prototype.getWriter = function() {
	return this.writer;
};

ojster.Template.prototype.render = function() {
	this.renderBlockMain();
	if (this.writer.owner == this) {
		return this.writer.done();
	}
	return undefined;
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
