var inherits = require('util').inherits;

var tokens = require('../tokens');
var errors = require('../errors');


var CommandParser = function(ctx, commandName, commandStr) {
	this.ctx = ctx;
	this.commandName = commandName;
	this.commandStr = commandStr;
};

CommandParser.prototype.getInvalidSyntaxToken = function() {
	return new tokens.InvalidToken(new errors.InvalidCommandSyntax(this.ctx, this.commandName));
};

CommandParser.prototype.parse = function() {
	var match = this.commandStr.match(this.commandRegExp);

	if (match)
	{
		return this.parseMatched(match);
	}
	else
	{
		return this.getInvalidSyntaxToken();
	}
};

CommandParser.prototype.parseMatched = function(match) {
	throw new Exception('Not implemented');
};


var identifierRegExp = '[\\w$]+'; // TODO need more correct

var aliasRegExp = identifierRegExp;
var pathRegExp = '\\\'('+identifierRegExp+'|\\.{1,2})(\\/('+identifierRegExp+'|\\.{1,2}))*\\\'';
var dotSeparatedNamesRegExp = identifierRegExp+'(\\.'+identifierRegExp+')*';
var subpathRegExp = dotSeparatedNamesRegExp;
var fullNameRegExp = dotSeparatedNamesRegExp;
var subNameRegExp = dotSeparatedNamesRegExp;


module.exports = {
	CommandParser: CommandParser,
	regExps: {
		identifier: identifierRegExp,
		alias: aliasRegExp,
		dotSeparatedNames: dotSeparatedNamesRegExp,

		path: pathRegExp,
		subpath: subpathRegExp,

		fullName: fullNameRegExp,
		subName: subNameRegExp
	}
};
