
goog.provide('ojster');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');


// StringWriter

ojster.StringWriter = function() {
	this.buff = [];
};

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
	this.writer = writer == null ? new DefaultWriterClass() : writer.getWriter();
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

ojster.Template.prototype.getWriter = function() {
	return this.writer;
};

ojster.Template.prototype.write = function() {
	this.writer.write.apply(this.writer, arguments);
	return this;
};

ojster.Template.prototype.done = function() {
    return this.writer.done();
};

ojster.Template.prototype.template = function(TemplateClass, ctx, data) {
	return new TemplateClass(ctx, data, this);
};

ojster.Template.prototype.renderTemplate = function(TemplateClass, ctx, data, args) {
	var instance = this.template(templateClass, ctx, data);
	return instance.render.apply(instance, args);
};

ojster.Template.prototype.getRendered = function() {
	if (arguments.length == 0) {
		return this.renderBlockMain().done();
	}
	return this.renderBlockMain.apply(this, arguments).done();
};

ojster.Template.prototype.render = function() {
	if (arguments.length == 0) {
		return this.renderBlockMain();
	}
	return this.renderBlockMain.apply(this, arguments);
};


// functions

ojster.escape = function(str) {
	return (str+'').replace(/&/g, '&amp;')
   			       .replace(/</g, '&lt;')
			       .replace(/>/g, '&gt;')
			       .replace(/"/g, '&quot;');
};

ojster.template = function(templateClass, ctx, data, writer) {
	var instance = new templateClass(ctx, data, writer);
	return instance;
};

ojster.render = function(templateClass, ctx, data, args, writer) {
	var instance = ojster.template(templateClass, ctx, data, writer);
	return instance.render.apply(instance, args);
};

ojster.getRendered = function(templateClass, ctx, data, args, writer) {
	return ojster.render(templateClass, ctx, data, args, writer).done();
};

ojster.createElement = function(html, domHelper) {
	var dom = opt_domHelper || goog.dom.getDomHelper();
	var wrapper = dom.createElement(goog.dom.TagName.DIV);
	wrapper.innerHTML = html;

	if (wrapper.childNodes.length == 1) {
		var firstChild = wrapper.firstChild;
		if (firstChild.nodeType == goog.dom.NodeType.ELEMENT) {
			return firstChild;
		}
	}

	return wrapper;
};

ojster.createFragment = function(html, domHelper) {
	var dom = opt_domHelper || goog.dom.getDomHelper();
	return dom.htmlToDocumentFragment(html);
};

ojster.renderToElement = function(element, templateClass, ctx, data, args) {
	element.innerHTML = ojster.getRendered(templateClass, ctx, data, args);
	return element;
};

ojster.renderAsElement = function(templateClass, ctx, data, args, domHelper) {
	return ojster.createElement(ojster.getRendered(templateClass, ctx, data, args), domHelper);
};

ojster.renderAsFragment = function(templateClass, ctx, data, args, domHelper) {
	return ojster.createFragment(ojster.getRendered(templateClass, ctx, data, args), domHelper);
};

