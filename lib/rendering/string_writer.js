var StringWriter = function(owner) {
	this.owner = owner;
	this.buff = [];
};

StringWriter.prototype.becomeOwnedBy = function(owner) {
	if (this.owner == null) {
		this.owner = owner;
		return true;
	}
	return false;
};

StringWriter.prototype.isOwnedBy = function(owner) {
	return this.owner == owner;
};

StringWriter.prototype.write = function() {
	this.buff.push.apply(this.buff, arguments);
};

StringWriter.prototype.done = function() {
	return this.buff.join('');
};

module.exports = StringWriter;
