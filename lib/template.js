
var escape = require('./rendering/escape');
var DefaultWriterClass = require('./rendering/string_writer');

var Template = function(ctx, data, writer) {
	this.ctx = ctx;
	this.data = data;
	this.writer = writer;
};

Template.prototype.escape = function(str) {
	return escape(str);
};

Template.prototype.render = function() {
	// ensure we have a writer
	if (this.writer == null) {
		this.writer = new DefaultWriterClass();
	}

	// render
	this.renderBlockMain();
	return this.writer.done();
};

Template.prototype.renderTo = function(template) {
	this.writer = template.writer;
	this.renderBlockMain();
};

Template.prototype.renderBlockMain = function() {
	throw new Error('Not implemented');
};

module.exports = Template;
