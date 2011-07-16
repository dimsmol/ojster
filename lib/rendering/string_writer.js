
var StringWriter = function() {
	this.buff = [];
};

// used to get true writer if wrapper object is passed instead (see Template class code)
StringWriter.prototype.getWriter = function() {
	return this;
};

StringWriter.prototype.write = function() {
	this.buff.push.apply(this.buff, arguments);
};

StringWriter.prototype.done = function() {
	this.buff.join('');
};
