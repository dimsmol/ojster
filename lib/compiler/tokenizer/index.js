var strTools = require('../../tools/str');
var optionTools = require('../../tools/options');

var commandParsers = require('./command_parsers');
var tokens = require('./tokens');
var errors = require('./errors');

var defaultOptions = require('./options');


var Tokenizer = function(src, options) {
	this.options = optionTools.cloneWithDefaults(options, this.getDefaultOptions());

	var marks = this.options.marks;

	this.startInstructionMark = marks.instruction.start;
	this.endInstructionMark = marks.instruction.end;
	this.commandMark = marks.command;
	this.escapedExpressionMark = marks.expression.escaped;
	this.unescapedExpressionMark = marks.expression.unescaped;

	this.startInstructionMarkLength = this.startInstructionMark.length;
	this.endInstructionMarkLength = this.endInstructionMark.length;
	this.commandMarkLength = this.commandMark.length;
	this.escapedExpressionMarkLength = this.escapedExpressionMark.length;
	this.unescapedExpressionMarkLength = this.unescapedExpressionMark.length;

	this.commandParserClasses = this.getCommandParserClasses();

	this.src = src;
	this.finished = false;
	this.pos = 0;
	this.expectFragment = true;

	this.ctx = {
		lineNumber: 1,
		linePos: 1,
		lastLineStartPos: 0,

		lastTokenLineBreaks: 0,
		lastTokenLastLineChars: 0,
		lastTokenLineStartPos: 0,
		charsSoFar: 0
	};
};

Tokenizer.prototype.getDefaultOptions = function() {
	return defaultOptions;
};

Tokenizer.prototype.getCommandParserClasses = function() {
	return commandParsers.parsers;
};

Tokenizer.prototype.getCtx = function() {
	return {
		lineNumber: this.ctx.lineNumber,
		linePos: this.ctx.linePos,
		lineStartPos: this.ctx.lastLineStartPos
	};
};

Tokenizer.prototype.getOffset = function(str) {
	tabCount = strTools.charCount(str, '\t');
	return str.length - tabCount + tabCount * this.options.tabSize;
};

Tokenizer.prototype.updateCtx = function(str) {
	var lineBreaks = str.match(/^/gm).length - 1;

	if (lineBreaks > 0)
	{
		this.ctx.lastTokenLastLineChars = this.getOffset(str.match(/[\r\n]([^\r\n]*)$/)[1]);
		this.ctx.lastTokenLineStartPos = this.ctx.charsSoFar + strTools.lastIndexOfAny(str, ['\n', '\r']) + 1;
	}
	else
	{
		this.ctx.lastTokenLastLineChars = this.getOffset(str);
	}

	this.ctx.charsSoFar += str.length;
	this.ctx.lastTokenLineBreaks = lineBreaks;
};

Tokenizer.prototype.getNextToken = function() {
	if (this.finished)
	{
		return null;
	}

	if (this.ctx.lastTokenLineBreaks > 0)
	{
		this.ctx.lineNumber += this.ctx.lastTokenLineBreaks;
		this.ctx.linePos = this.ctx.lastTokenLastLineChars + 1;
	}
	else
	{
		this.ctx.linePos += this.ctx.lastTokenLastLineChars;
	}
	this.ctx.lastLineStartPos = this.ctx.lastTokenLineStartPos;

	var result;
	if (this.expectFragment)
	{
		result = this.parseFragment(this.getFragment());
		this.expectFragment = false;
	}
	else
	{
		var instruction = this.getInstruction();
		result = this.parseInstruction(instruction);
		this.expectFragment = true;
	}

	return result;
};

Tokenizer.prototype.getFragment = function() {
	var start = this.pos;
	var end = this.src.indexOf(this.startInstructionMark, start);

	var fragment;

	if (end == -1)
	{
		this.finished = true;
		fragment = this.src.substring(start);
	}
	else
	{
		this.pos = end;
		fragment = this.src.substring(start, end);
	}

	return fragment;
};

Tokenizer.prototype.getInstruction = function() {
	var start = this.pos;
	var end = this.src.indexOf(this.endInstructionMark, start + this.startInstructionMarkLength);

	if (end == -1)
	{
		throw new errors.MissingCloseInstructionMark(this.getCtx());
	}

	end += this.endInstructionMarkLength;
	this.pos = end;

	return this.src.substring(start, end);
};

Tokenizer.prototype.parseFragment = function(fragment) {
	if (fragment == null)
	{
		return null;
	}

	this.updateCtx(fragment);

	// TODO check fragment does not contain this.endInstructionMark

	return new tokens.Fragment(this.getCtx(), fragment);
};

Tokenizer.prototype.parseInstruction = function(instruction) {
	if (!instruction)
	{
		return null;
	}

	this.updateCtx(instruction);

	// TODO check instruction does not contain this.startInstructionMark

	var start = this.startInstructionMarkLength;
	var end = instruction.length - this.endInstructionMarkLength;

	if (instruction.indexOf(this.commandMark, start) == start)
	{
		return this.parseCommand(instruction.substring(start + this.commandMarkLength, end));
	}
	else
	{
		var action = instruction[start];

		switch (action)
		{
			case this.escapedExpressionMark:
				return new tokens.Expression(this.getCtx(), instruction.substring(start + this.escapedExpressionMarkLength, end), true);
			case this.unescapedExpressionMark:
				return new tokens.Expression(this.getCtx(), instruction.substring(start + this.unescapedExpressionMarkLength, end));
			default:
				return new tokens.Code(this.getCtx(), instruction.substring(start, end));
		}
	}
};

Tokenizer.prototype.parseCommand = function(command) {
	var parts = this.splitCommandName(command);
	var name = parts[0];
	var rest = parts[1];

	var CommandParserClass = this.commandParserClasses[name];
	if (CommandParserClass == null)
	{
		throw new errors.UnknownCommand(this.getCtx(), name);
	}
	else
	{
		return new CommandParserClass(this.getCtx(), name, rest).parse();
	}
};

Tokenizer.prototype.splitCommandName = function(command) {
	var pos = command.indexOf(' ');

	if (pos == -1)
	{
		return [command, ''];
	}

	return [command.substring(0, pos), command.substring(pos)];
};


module.exports = Tokenizer;
