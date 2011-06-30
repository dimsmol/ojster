
var inherits = require('util').inherits;
var strTools = require('../tools/str_tools');

var CompilationError = function(ctx, msg) {
    this.ctx = ctx;
    this.msg = msg;
};
CompilationError.prototype.toString = function(src) {
	if (src != null) {
		var lineNumStr = strTools.padLeft(this.ctx.lineNumber, 5) + ': ';
		var lineEndPos = strTools.indexOfAny(src, ['\n', '\r'], this.ctx.lineStartPos);
		if (lineEndPos == -1) {
			lineEndPos = undefined;
		}
		return [
			lineNumStr, src.substring(this.ctx.lineStartPos, lineEndPos), '\n',
			strTools.repeat(' ', this.ctx.linePos - 1 + lineNumStr.length), '^\n',
			strTools.repeat(' ', lineNumStr.length), this.msg
		].join('');
	}
    return ['@', this.ctx.lineNumber, ':', this.ctx.linePos, ' ', this.msg].join('');
};

module.exports = {
	CompilationError: CompilationError
};
