var strTools = require('../../tools/str_tools');

var commandParsers = require('./command_parsers');
var tokens = require('./tokens');
var errors = require('./errors');


var Tokenizer = function(src, options) {
	options = options || {};

	this.tabSize = options.tabSize === undefined ? 4 : options.tabSize;

	this.instructionStartMark = options.instructionStartMark || '<%';
	this.instructionEndMark = options.instructionEndMark || '%>';
	this.expressionEscapedMark = options.expressionEscapedMark || '=';
	this.expressionMark = options.expressionMark || '-';
	this.commandMark = options.commandMark || ' @';

	this.commandParserClasses = commandParsers.parsers;

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

Tokenizer.prototype.getCtx = function() {
	return {
		lineNumber: this.ctx.lineNumber,
		linePos: this.ctx.linePos,
		lineStartPos: this.ctx.lastLineStartPos
	};
};

Tokenizer.prototype.getOffset = function(str) {
	tabCount = strTools.charCount(str, '\t');
	return str.length - tabCount + tabCount * this.tabSize;
};

Tokenizer.prototype.updateCtx = function(str) {
	// TODO make it faster ?
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
		var instruction;
		try
		{
			instruction = this.getInstruction();
		}
		catch(exc)
		{
			if (exc instanceof errors.TokenizationError)
			{
				result = new tokens.InvalidToken(exc);
			}
			else
			{
				throw exc;
			}
		}

		if (result == null)
		{
			result = this.parseInstruction(instruction);
			this.expectFragment = true;
		}
	}

	return result;
};

Tokenizer.prototype.getFragment = function() {
	var start = this.pos;
	var end = this.src.indexOf(this.instructionStartMark, start);

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
	var end = this.src.indexOf(this.instructionEndMark, start + this.instructionStartMark.length);

	if (end == -1)
	{
		throw new errors.MissingCloseInstructionMark(this.getCtx());
	}

	end += this.instructionEndMark.length;
	this.pos = end;

	return this.src.substring(start, end);
};

Tokenizer.prototype.parseFragment = function(fragment) {
	if (fragment == null)
	{
		return null;
	}

	this.updateCtx(fragment);

	// TODO optionally check fragment does not contain this.instructionEndMark

	return new tokens.Fragment(this.getCtx(), fragment);
};

Tokenizer.prototype.parseInstruction = function(instruction) {
	if (!instruction)
	{
		return null;
	}

	this.updateCtx(instruction);

	// TODO optionally check instruction does not contain this.instructionStartMark

	var start = this.instructionStartMark.length;
	var end = instruction.length - this.instructionEndMark.length;

	if (instruction.indexOf(this.commandMark, start) == start)
	{
		return this.parseCommand(instruction.substring(start + this.commandMark.length, end));
	}
	else
	{
		var action = instruction[start];

		switch (action)
		{
			case this.expressionEscapedMark:
				return new tokens.Expression(this.getCtx(), instruction.substring(start + this.expressionEscapedMark.length, end), true);
			case this.expressionMark:
				return new tokens.Expression(this.getCtx(), instruction.substring(start + this.expressionMark.length, end));
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
		return new tokens.InvalidToken(new errors.UnknownCommand(this.getCtx(), name));
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
