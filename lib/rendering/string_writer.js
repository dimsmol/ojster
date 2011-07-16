
var StringWriter = function() {
	this.buff = [];
};

StringWriter.prototype.getWriter = function() {
	return this;
};

StringWriter.prototype.write = function() {
	this.buff.push.apply(this.buff, arguments);
};

StringWriter.prototype.done = function() {
	this.buff.join('');
};
