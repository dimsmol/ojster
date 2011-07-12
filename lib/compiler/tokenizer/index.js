
/*

TODO:
- parametrized blocks: <% @block someBlock = function(a, b, c) { %>...<% @block } someBlock %>
  - how to specify in-place call args? perhaps <% @block(1, 2, 3) = function(a, b, c) { %>

- <% @template name [namespace-for-client-side] [ = function() { ...code... } ] %> (?) - don't need, just override "init"?

- provide <% @block TemplateName.blockName ... %> syntax for top-level blocks to allow templates without <% @template ... %> tag (?)

- extendability
  - move commands to separate file
  - provide a way to add new commands

*/

var tokens = require('./tokens');
var tokenizationErrors = require('./tokenization_errors');
var strTools = require('../../tools/str_tools');

var Tokenizer = function(src, options, errors) {
    options = options || {};

    this.instructionStartMark = options.instructionStartMark || '<%';
    this.instructionEndMark = options.instructionEndMark || '%>';
    this.expressionEscapedMark = options.expressionEscapedMark || '=';
    this.expressionMark = options.expressionMark || '-';
    this.commandMark = options.commandMark || ' @';

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
    this.errors = errors;
};

module.exports = Tokenizer;

Tokenizer.prototype.error = function(err) {
    this.errors.push(err);
};

Tokenizer.prototype.getCtx = function() {
    return {
        lineNumber: this.ctx.lineNumber,
        linePos: this.ctx.linePos,
		lineStartPos: this.ctx.lastLineStartPos
    };
};

Tokenizer.prototype.updateCtx = function(str) {
    // TODO make it faster ?
    var lineBreaks = str.match(/^/gm).length - 1;

    if (lineBreaks > 0) {
        this.ctx.lastTokenLastLineChars = str.match(/[\r\n]([^\r\n]*)$/)[1].length;
		this.ctx.lastTokenLineStartPos = this.ctx.charsSoFar + strTools.lastIndexOfAny(str, ['\n', '\r']) + 1;
    } else {
        this.ctx.lastTokenLastLineChars = str.length;
    }
	this.ctx.charsSoFar += str.length;

    this.ctx.lastTokenLineBreaks = lineBreaks;
};

Tokenizer.prototype.getNextToken = function() {
    if (this.finished)
        return null;

    if (this.ctx.lastTokenLineBreaks > 0) {
        this.ctx.lineNumber += this.ctx.lastTokenLineBreaks;
        this.ctx.linePos = this.ctx.lastTokenLastLineChars + 1;
    } else {
        this.ctx.linePos += this.ctx.lastTokenLastLineChars;
    }
	this.ctx.lastLineStartPos = this.ctx.lastTokenLineStartPos;

    var result;
    if (this.expectFragment) {
        result = this.parseFragment(this.getFragment());
        this.expectFragment = false;
    } else {
        result = this.parseInstruction(this.getInstruction());
        this.expectFragment = true;
    }

    return result;
};

Tokenizer.prototype.getFragment = function() {
    if (this.finished) {
        return null;
    }

    var start = this.pos;
    var end = this.src.indexOf(this.instructionStartMark, start);

    var fragment;

    if (end == -1) {
        this.finished = true;
        fragment = this.src.substring(start);
    } else {
        this.pos = end;
        fragment = this.src.substring(start, end);
    }

    return fragment;
};

Tokenizer.prototype.getInstruction = function() {
    if (this.finished) {
        return null;
    }

    var start = this.pos;
    var end = this.src.indexOf(this.instructionEndMark, start + this.instructionStartMark.length);

    if (end == -1) {
        this.error(new tokenizationErrors.MissingCloseInstructionMark(this.getCtx()));
        return null;
    }

    end += this.instructionEndMark.length;
    this.pos = end;

    return this.src.substring(start, end);
};

Tokenizer.prototype.parseFragment = function(fragment) {
    if (fragment == null) {
        return null;
    }

    this.updateCtx(fragment);

    // TODO optionally check fragment does not contain this.instructionEndMark

    return new tokens.Fragment(this.getCtx(), fragment);
};

Tokenizer.prototype.parseInstruction = function(instruction) {
    if (!instruction) {
        return null;
    }

    this.updateCtx(instruction);

    // TODO optionally check instruction does not contain this.instructionStartMark

    var start = this.instructionStartMark.length;
    var end = instruction.length - this.instructionEndMark.length;

    if (instruction.indexOf(this.commandMark, start) == start) {
        return this.parseCommand(instruction.substring(start + this.commandMark.length, end));
    } else {
        var action = instruction[start];

        switch (action) {
            case this.expressionEscapedMark:
                return new tokens.Expression(this.getCtx(), instruction.substring(start + this.expressionEscapedMark.length, end), true);
            case this.expressionMark:
                return new tokens.Expression(this.getCtx(), instruction.substring(start + this.expressionMark.length, end));
            default:
                return new tokens.CodeFragment(this.getCtx(), instruction.substring(start, end));
        }
    }
};

Tokenizer.prototype.parseCommand = function(command) {
    var parts = this.splitCommandName(command);
    var name = parts[0];
    var rest = parts[1];

    switch (name) {
        case 'block':
            return this.parseBlockCommand(rest);
        case 'require':
            return this.parseRequireCommand(rest);
        case 'template':
            return this.parseTemplateCommand(rest);
        case 'inherits':
            return this.parseInheritsCommand(rest);
        default:
            this.error(new tokenizationErrors.UnknownCommand(this.getCtx(), name));
            return tokens.InvalidToken;
    }
};

Tokenizer.prototype.splitCommandName = function(command) {
    var pos = command.indexOf(' ');
    if (pos == -1) {
        return [command, null];
    }
    return [command.substring(0, pos), command.substring(pos)];
};

Tokenizer.prototype.parseBlockCommand = function(command) {
    match = command.match(/^\s*\}\s*(\w+)?\s*$/);
    if (match) {
        return new tokens.CloseBlock(this.getCtx(), match[1]);
    } else {
        match = command.match(/^\s*(\w+)\s+\{\s*(\})?\s*$/);
        if (match) {
            return new tokens.OpenBlock(this.getCtx(), match[1], !!match[2]);
        } else {
            this.error(new tokenizationErrors.InvalidBlockCommand(this.getCtx()));
            return tokens.InvalidToken;
        }
    }
};

Tokenizer.prototype.parseRequireCommand = function(command) {
    match = command.match(/^\s*(\w+)(\s+\=\s*(\S+))?(\s+(\S+))?\s*$/);
    if (match) {
        var path = match[3];
        var fullName = match[5];
        if (!fullName) {
            if (path && path[0] != "'") {
                fullName = path;
                path = null;
            }
        }
        return new tokens.Require(this.getCtx(), match[1], path, fullName);
    } else {
        this.error(new tokenizationErrors.InvalidRequireCommand(this.getCtx()));
        return tokens.InvalidToken;
    }
};

Tokenizer.prototype.parseTemplateCommand = function(command) {
    match = command.match(/^\s*(\w+)(\s+(\S+))?\s*$/);
    if (match) {
        return new tokens.Template(this.getCtx(), match[1], match[3]);
    } else {
        this.error(new tokenizationErrors.InvalidTemplateCommand(this.getCtx()));
        return tokens.InvalidToken;
    }
};

Tokenizer.prototype.parseInheritsCommand = function(command) {
    match = command.match(/^\s*(\w+)(\s+(\S+))?\s*$/);
    if (match) {
        return new tokens.Inherits(this.getCtx(), match[1], match[3]);
    } else {
        this.error(new tokenizationErrors.InvalidInheritsCommand(this.getCtx()));
        return tokens.InvalidToken;
    }
};
