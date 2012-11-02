"use strict";
var StringWriter = function () {
	this.buff = [];
};

StringWriter.prototype.write = function () {
	this.buff.push.apply(this.buff, arguments);
};

StringWriter.prototype.done = function () {
	return this.buff.join('');
};


module.exports = StringWriter;
