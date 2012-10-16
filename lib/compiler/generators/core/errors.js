"use strict";
var inherits = require('util').inherits;
var strTools = require('../../../tools/str');
var CompilationError = require('../../errors').CompilationError;


var GenerationError = function(ctx) {
	CompilationError.call(this, ctx);
};
inherits(GenerationError, CompilationError);

GenerationError.prototype.getMessageInternal = function() {
	return 'Generic generation error';
};


var TemplateTokenNotFound = function() {
	GenerationError.call(this, null);
};
inherits(TemplateTokenNotFound, GenerationError);

TemplateTokenNotFound.prototype.getMessageInternal = function() {
	return 'Template token not found';
};


var InheritsTokenNotFound = function(ctx) {
	GenerationError.call(this, ctx);
};
inherits(InheritsTokenNotFound, GenerationError);

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

DuplicateInheritsToken.prototype.getMessageInternal = function() {
	return 'Duplicate inherits token within template';
};


var IncorrectCodeMarkupWithinFunction = function(ctx) {
	GenerationError.call(this, ctx);
};
inherits(IncorrectCodeMarkupWithinFunction, GenerationError);

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


var TokenMustBeBeyond = function(token, enclosure) {
	TokenMustBePlaced.call(this, token, 'beyond', enclosure);
};
inherits(TokenMustBeBeyond, TokenMustBePlaced);


var TokenMustBeWithinTemplate = function(token) {
	TokenMustBeWithin.call(this, token, 'template');
};
inherits(TokenMustBeWithinTemplate, TokenMustBeWithin);


var TokenMustBeBeyondTemplate = function(token) {
	TokenMustBeBeyond.call(this, token, 'template');
};
inherits(TokenMustBeBeyondTemplate, TokenMustBeBeyond);


var TokenMustBeBeyondFunction = function(token) {
	TokenMustBeBeyond.call(this, token, 'function');
};
inherits(TokenMustBeBeyondFunction, TokenMustBeBeyond);


var TokenMustBeWithinBlock = function(token) {
	TokenMustBeWithin.call(this, token, 'block');
};
inherits(TokenMustBeWithinBlock, TokenMustBeWithin);


var TokenMustBeBeyondBlock = function(token) {
	TokenMustBeBeyond.call(this, token, 'block');
};
inherits(TokenMustBeBeyondBlock, TokenMustBeBeyond);


var DuplicateBlockName = function(ctx, blockName) {
	GenerationError.call(this, ctx);
	this.blockName = blockName;
};
inherits(DuplicateBlockName, GenerationError);

DuplicateBlockName.prototype.getMessageInternal = function() {
	return ['Duplicate block name "', this.blockName, '" within template'].join('');
};


var ClosedWithoutOpenning = function(ctx, entity, opt_name) {
	GenerationError.call(this, ctx);
	this.entity = entity;
	this.name = opt_name;
};
inherits(ClosedWithoutOpenning, GenerationError);

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


var BlockClosedWithoutOpenning = function(ctx, opt_name) {
	ClosedWithoutOpenning.call(this, ctx, 'block', opt_name);
};
inherits(BlockClosedWithoutOpenning, ClosedWithoutOpenning);


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
