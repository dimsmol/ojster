var Sequence = function(block) {
	this.block = block;

	this.generator = this.block.generator;
	this.options = this.block.options;

	this.isOpen = false;
	this.lastCtx = null;
};

Sequence.prototype.open = function() {
	var indent = this.options.indentStr;

	this.block.buffer.push(
		indent, this.options.thisAlias, '.', this.options.funcStrs.append, '(\n',
		indent, indent
	);

	this.isOpen = true;
};

Sequence.prototype.separate = function() {
	var buffer = this.block.buffer;

	buffer.push(',');

	if (this.lastCtx)
	{
		this.generator.appendLineNumber(this.lastCtx, buffer);
	}

	buffer.push(
		'\n',
		this.options.indentStr, this.options.indentStr
	);
};

Sequence.prototype.close = function(ctx) {
	if (this.isOpen)
	{
		var buffer = this.block.buffer;

		if (this.lastCtx)
		{
			this.generator.appendLineNumber(this.lastCtx, buffer);
		}

		buffer.push(
			'\n',
			this.options.indentStr, ');'
		);

		if (this.options.appendLineNumbersFor.sequenceClose)
		{
			this.generator.appendLineNumber(ctx, buffer);
		}

		buffer.push('\n');

		this.isOpen = false;
	}
};

Sequence.prototype.openOrSeparateIfNeed = function() {
	if (!this.isOpen)
	{
		this.open();
	}
	else
	{
		this.separate();
	}
};

Sequence.prototype.updateLastCtx = function(ctx, lineNumbersAllowed) {
	if (lineNumbersAllowed)
	{
		this.lastCtx = ctx;
	}
	else
	{
		this.lastCtx = null;
	}
};


module.exports = Sequence;
