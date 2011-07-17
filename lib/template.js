
var escape = require('./rendering/escape');
var DefaultWriterClass = require('./rendering/string_writer');

var Template = function(ctx, data, writer) {
	this.ctx = ctx;
	this.data = data;
	this.writer = writer == null ? new DefaultWriterClass() : writer.getWriter(); // writer argument can actually be writer's wrapper, unwrapping it
	if (this.writer.owner == null) {
		this.writer.owner = this;
	}
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

// used to get true writer if template is passed instead of it
Template.prototype.getWriter = function() {
	return this.writer;
};

Template.prototype.render = function() {
	this.renderBlockMain();
	if (this.writer.owner == this) {
		return this.writer.done();
	}
	return undefined;
};

module.exports = Template;
