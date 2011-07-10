
var Template = function() {
	this.buff = [];
	this.vars = {}; // here you can store any of your template's instance vars without interferring with any internal stuff

	this.data = null;
	this.ctx = null;
	this.args = null;

	// if no arguments, then skip init (will be manually inited later)
	// allows "render" to pass any it's args to "init" with "apply"
	// ("apply" cannot be used with "new" operator call)
	if (arguments.length > 0) {
		this.init.apply(this, arguments);
	}
};

Template.prototype.init = function(data, ctx, args) {
	this.data = data; // data to render with template
	this.ctx = ctx; // rendering context (request data, settings, any additional stuff)
	this.args = args; // like block parameters, but template-level
};

Template.render = function() {
	var instance = new Template();
	instance.init.apply(this, arguments);
	return instance.render();
};

// just an example, will be overriden in child template
Template.prototype.appendBlockMain = function() {
	var d = this.data, vars = this.vars; // block locals

	this.append([
		'Template example, data are:\n',
		d
	]);
};

Template.escape = function(str) {
	return (str+'').replace(/&/g, '&amp;')
   			       .replace(/</g, '&lt;')
			       .replace(/>/g, '&gt;')
			       .replace(/"/g, '&quot;');
};

Template.prototype.append = function() {
	this.buff.push.apply(this.buff, arguments);
};

Template.prototype.escape = function(str) {
	return Template.escape(str);
};

Template.prototype.render = function() {
	this.appendBlockMain();
	return this.getValue();
};

Template.prototype.getValue = function() {
    return this.buff.join('');
};

module.exports = Template;
