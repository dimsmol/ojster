
var Block = function(name, args, buffer) {
    this.name = name;
    this.args = args;
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
