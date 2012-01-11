var Buffer = function() {
	this.buff = [];
};

module.exports = Buffer;

Buffer.prototype.append = function() {
	this.buff.push.apply(this.buff, arguments);
};

Buffer.prototype.getValue = function() {
	return this.buff.join('');
};
