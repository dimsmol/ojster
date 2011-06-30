
var Block = function(name, buffer) {
    this.name = name;
    this.buffer = buffer;

    this.sequenceOpened = false;
};

module.exports = Block;

Block.prototype.append = function() {
    this.buffer.append.apply(this.buffer, arguments);
};

Block.prototype.getValue = function() {
    return this.buffer.getValue();
};
