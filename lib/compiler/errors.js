"use strict";
var inherits = require('util').inherits;
var ErrorBase = require('nerr').ErrorBase;
var strTools = require('../tools/str');


var CompilationError = function(ctx) {
	ErrorBase.call(this);
	this.ctx = ctx;
};
inherits(CompilationError, ErrorBase);

CompilationError.prototype.name = 'CompilationError';

CompilationError.prototype.getMessageInternal = function() {
	return 'Generic compilation error';
};

CompilationError.prototype.getMessage = function(opt_src, opt_tabSize) {
	var msg = this.getMessageInternal();
	var result;

	if (this.ctx == null) {
		result = msg;
	}
	else if (opt_src == null) {
		result = ['@', this.ctx.lineNumber, ':', this.ctx.linePos, ' ', msg].join('');
	}
	else {
		var src = opt_src;
		var lineNumStr = strTools.padLeft(this.ctx.lineNumber, 5) + ': ';
		var lineEndPos = strTools.indexOfAny(src, ['\n', '\r'], this.ctx.lineStartPos);

		if (lineEndPos == -1) {
			lineEndPos = undefined;
		}

		var tabSize = (opt_tabSize == null ? 4 : opt_tabSize);
		result = [
			lineNumStr, src.substring(this.ctx.lineStartPos, lineEndPos).replace('\t', strTools.repeat(' ', tabSize)), '\n',
			strTools.repeat(' ', this.ctx.linePos - 1 + lineNumStr.length), '^\n',
			strTools.repeat(' ', lineNumStr.length), msg
		].join('');
	}

	return result;
};


module.exports = {
	CompilationError: CompilationError
};
