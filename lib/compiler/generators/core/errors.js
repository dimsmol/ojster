"use strict";
var inherits = require('util').inherits;
var strTools = require('../../../tools/str');
var CompilationError = require('../../errors').CompilationError;


var GenerationError = function(ctx) {
	CompilationError.call(this, ctx);
};
inherits(GenerationError, CompilationError);

GenerationError.prototype.name = 'GenerationError';

GenerationError.prototype.getMessageInternal = function() {
	return 'Generic generation error';
};


var TemplateTokenNotFound = function() {
	GenerationError.call(this, null);
};
inherits(TemplateTokenNotFound, GenerationError);

TemplateTokenNotFound.prototype.name = 'TemplateTokenNotFound';

TemplateTokenNotFound.prototype.getMessageInternal = function() {
	return 'Template token not found';
};


var InheritsTokenNotFound = function(ctx) {
	GenerationError.call(this, ctx);
};
inherits(InheritsTokenNotFound, GenerationError);

InheritsTokenNotFound.prototype.name = 'InheritsTokenNotFound';

InheritsTokenNotFound.prototype.getMessageInternal = function() {
	var result = 'Inherits token not found';
	if (this.ctx != null) {
		result += ' (must be defined earlier)';
	}

	return result;
};


var DuplicateInheritsToken = function(ctx) {
	GenerationError.call(this, ctx);
};
inherits(DuplicateInheritsToken, GenerationError);

DuplicateInheritsToken.prototype.name = 'DuplicateInheritsToken';

DuplicateInheritsToken.prototype.getMessageInternal = function() {
	return 'Duplicate inherits token within template';
};


var IncorrectCodeMarkupWithinFunction = function(ctx) {
	GenerationError.call(this, ctx);
};
inherits(IncorrectCodeMarkupWithinFunction, GenerationError);

IncorrectCodeMarkupWithinFunction.prototype.name = 'IncorrectCodeMarkupWithinFunction';

IncorrectCodeMarkupWithinFunction.prototype.getMessageInternal = function() {
	return 'Code fragment must be placed without any special markup within function';
};


var TokenMustBePlaced = function(token, position, enclosure) {
	GenerationError.call(this, token.ctx);

	this.token = token;
	this.position = position;
	this.enclosure = enclosure;
};
inherits(TokenMustBePlaced, GenerationError);

TokenMustBePlaced.prototype.name = 'TokenMustBePlaced';

TokenMustBePlaced.prototype.getMessageInternal = function() {
	return [
		'This token must be placed ',
		this.position,' ', this.enclosure
	].join('');
};


var TokenMustBeWithin = function(token, enclosure) {
	TokenMustBePlaced.call(this, token, 'within', enclosure);
};
inherits(TokenMustBeWithin, TokenMustBePlaced);
TokenMustBeWithin.prototype.name = 'TokenMustBeWithin';


var TokenMustBeBeyond = function(token, enclosure) {
	TokenMustBePlaced.call(this, token, 'beyond', enclosure);
};
inherits(TokenMustBeBeyond, TokenMustBePlaced);
TokenMustBeBeyond.prototype.name = 'TokenMustBeBeyond';


var TokenMustBeWithinTemplate = function(token) {
	TokenMustBeWithin.call(this, token, 'template');
};
inherits(TokenMustBeWithinTemplate, TokenMustBeWithin);
TokenMustBeWithinTemplate.prototype.name = 'TokenMustBeWithinTemplate';


var TokenMustBeBeyondTemplate = function(token) {
	TokenMustBeBeyond.call(this, token, 'template');
};
inherits(TokenMustBeBeyondTemplate, TokenMustBeBeyond);
TokenMustBeBeyondTemplate.prototype.name = 'TokenMustBeBeyondTemplate';


var TokenMustBeBeyondFunction = function(token) {
	TokenMustBeBeyond.call(this, token, 'function');
};
inherits(TokenMustBeBeyondFunction, TokenMustBeBeyond);
TokenMustBeBeyondFunction.prototype.name = 'TokenMustBeBeyondFunction';


var TokenMustBeWithinBlock = function(token) {
	TokenMustBeWithin.call(this, token, 'block');
};
inherits(TokenMustBeWithinBlock, TokenMustBeWithin);
TokenMustBeWithinBlock.prototype.name = 'TokenMustBeWithinBlock';


var TokenMustBeBeyondBlock = function(token) {
	TokenMustBeBeyond.call(this, token, 'block');
};
inherits(TokenMustBeBeyondBlock, TokenMustBeBeyond);
TokenMustBeBeyondBlock.prototype.name = 'TokenMustBeBeyondBlock';


var DuplicateBlockName = function(ctx, blockName) {
	GenerationError.call(this, ctx);
	this.blockName = blockName;
};
inherits(DuplicateBlockName, GenerationError);

DuplicateBlockName.prototype.name = 'DuplicateBlockName';

DuplicateBlockName.prototype.getMessageInternal = function() {
	return ['Duplicate block name "', this.blockName, '" within template'].join('');
};


var ClosedWithoutOpenning = function(ctx, entity, opt_name) {
	GenerationError.call(this, ctx);
	this.entity = entity;
	this.name = opt_name;
};
inherits(ClosedWithoutOpenning, GenerationError);

ClosedWithoutOpenning.prototype.name = 'ClosedWithoutOpenning';

ClosedWithoutOpenning.prototype.getMessageInternal = function() {
	var msgItems = [strTools.capFirst(this.entity)];
	if (this.name) {
		msgItems.push(' "', this.name, '"');
	}
	msgItems.push(' closed without openning');

	return msgItems.join('');
};


var FunctionClosedWithoutOpenning = function(ctx, opt_name) {
	ClosedWithoutOpenning.call(this, ctx, 'function', opt_name);
};
inherits(FunctionClosedWithoutOpenning, ClosedWithoutOpenning);
FunctionClosedWithoutOpenning.prototype.name = 'FunctionClosedWithoutOpenning';


var BlockClosedWithoutOpenning = function(ctx, opt_name) {
	ClosedWithoutOpenning.call(this, ctx, 'block', opt_name);
};
inherits(BlockClosedWithoutOpenning, ClosedWithoutOpenning);
BlockClosedWithoutOpenning.prototype.name = 'BlockClosedWithoutOpenning';


module.exports = {
	GenerationError: GenerationError,

	TemplateTokenNotFound: TemplateTokenNotFound,

	InheritsTokenNotFound: InheritsTokenNotFound,
	DuplicateInheritsToken: DuplicateInheritsToken,

	IncorrectCodeMarkupWithinFunction: IncorrectCodeMarkupWithinFunction,

	TokenMustBeWithinTemplate: TokenMustBeWithinTemplate,
	TokenMustBeBeyondTemplate: TokenMustBeBeyondTemplate,

	TokenMustBeBeyondFunction: TokenMustBeBeyondFunction,

	FunctionClosedWithoutOpenning: FunctionClosedWithoutOpenning,

	TokenMustBeWithinBlock: TokenMustBeWithinBlock,
	TokenMustBeBeyondBlock: TokenMustBeBeyondBlock,

	BlockClosedWithoutOpenning: BlockClosedWithoutOpenning,
	DuplicateBlockName: DuplicateBlockName
};
