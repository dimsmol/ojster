
var escape = require('./rendering/escape');
var DefaultWriterClass = require('./rendering/string_writer');

var Template = function(ctx, data, writer) {
	this.ctx = ctx;
	this.data = data;
	this.writer = writer == null ? new DefaultWriterClass() : writer.getWriter();
};

// an example, will be overriden by child template
Template.prototype.renderBlockMain = function() {
	var self = this;
	var d = this.data, vars = this.vars; // block locals

	self.writer.write(
		'Template example, data are:\n',
		d
	);
};

Template.prototype.escape = function(str) {
	return escape(str);
};

Template.prototype.getWriter = function() {
	return this.writer;
};

Template.prototype.write = function() {
	this.writer.write.apply(this.writer, arguments);
	return this;
};

Template.prototype.template = function(TemplateClass, ctx, data) {
	return new TemplateClass(ctx, data, this);
};

Template.prototype.renderTemplate = function(TemplateClass, ctx, data, args) {
	var instance = this.template(templateClass, ctx, data, this);
	return instance.render.apply(instance, args);
};

Template.prototype.done = function() {
    return this.writer.done();
};

Template.prototype.getRendered = function() {
	if (arguments.length == 0) {
		return this.renderBlockMain().done();
	}
	return this.renderBlockMain.apply(this, arguments).done();
};

Template.prototype.render = function() {
	if (arguments.length == 0) {
		return this.renderBlockMain();
	}
	return this.renderBlockMain.apply(this, arguments);
};

module.exports = Template;
