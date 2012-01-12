var inherits = require('util').inherits;

var strTools = require('../tools/str');


var CompilationError = function(ctx) {
	this.ctx = ctx;
	this.message = this.getMessage();
};
inherits(CompilationError, Error);

CompilationError.prototype.getMessage = function() {
	return 'Generic compilation error';
};

CompilationError.prototype.toString = function(src, tabSize) {
	if (this.ctx == null)
	{
		return this.message;
	}

	if (src == null)
	{
		return ['@', this.ctx.lineNumber, ':', this.ctx.linePos, ' ', this.message].join('');
	}

	var lineNumStr = strTools.padLeft(this.ctx.lineNumber, 5) + ': ';
	var lineEndPos = strTools.indexOfAny(src, ['\n', '\r'], this.ctx.lineStartPos);

	if (lineEndPos == -1)
	{
		lineEndPos = undefined;
	}

	if (tabSize == null)
	{
		tabSize = 4;
	}

	return [
		lineNumStr, src.substring(this.ctx.lineStartPos, lineEndPos).replace('\t', strTools.repeat(' ', tabSize)), '\n',
		strTools.repeat(' ', this.ctx.linePos - 1 + lineNumStr.length), '^\n',
		strTools.repeat(' ', lineNumStr.length), this.message
	].join('');
};


module.exports = {
	CompilationError: CompilationError
};
