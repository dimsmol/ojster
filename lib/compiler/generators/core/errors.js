"use strict";
var inherits = require('util').inherits;
var mt = require('marked_types');
var strTools = require('../../../tools/str');
var CompilationError = require('../../errors').CompilationError;


var GenerationError = function (ctx) {
	CompilationError.call(this, ctx);
};
inherits(GenerationError, CompilationError);
mt.mark(GenerationError, ':GenerationError');

GenerationError.prototype.name = 'GenerationError';

GenerationError.prototype.getMessageInternal = function () {
	return 'Generic generation error';
};


var TemplateTokenNotFound = function () {
	GenerationError.call(this, null);
};
inherits(TemplateTokenNotFound, GenerationError);
mt.mark(TemplateTokenNotFound, ':TemplateTokenNotFound');

TemplateTokenNotFound.prototype.name = 'TemplateTokenNotFound';

TemplateTokenNotFound.prototype.getMessageInternal = function () {
	return 'Template token not found';
};


var InheritsTokenNotFound = function (ctx) {
	GenerationError.call(this, ctx);
};
inherits(InheritsTokenNotFound, GenerationError);
mt.mark(InheritsTokenNotFound, ':InheritsTokenNotFound');

InheritsTokenNotFound.prototype.name = 'InheritsTokenNotFound';

InheritsTokenNotFound.prototype.getMessageInternal = function () {
	var result = 'Inherits token not found';
	if (this.ctx != null) {
		result += ' (must be defined earlier)';
	}

	return result;
};


var DuplicateInheritsToken = function (ctx) {
	GenerationError.call(this, ctx);
};
inherits(DuplicateInheritsToken, GenerationError);
mt.mark(DuplicateInheritsToken, ':DuplicateInheritsToken');

DuplicateInheritsToken.prototype.name = 'DuplicateInheritsToken';

DuplicateInheritsToken.prototype.getMessageInternal = function () {
	return 'Duplicate inherits token within template';
};


var IncorrectCodeMarkupWithinFunction = function (ctx) {
	GenerationError.call(this, ctx);
};
inherits(IncorrectCodeMarkupWithinFunction, GenerationError);
mt.mark(IncorrectCodeMarkupWithinFunction, ':IncorrectCodeMarkupWithinFunction');

IncorrectCodeMarkupWithinFunction.prototype.name = 'IncorrectCodeMarkupWithinFunction';

IncorrectCodeMarkupWithinFunction.prototype.getMessageInternal = function () {
	return 'Code fragment must be placed without any special markup within function';
};


var TokenMustBePlaced = function (token, position, enclosure) {
	GenerationError.call(this, token.ctx);

	this.token = token;
	this.position = position;
	this.enclosure = enclosure;
};
inherits(TokenMustBePlaced, GenerationError);
mt.mark(TokenMustBePlaced, ':TokenMustBePlaced');

TokenMustBePlaced.prototype.name = 'TokenMustBePlaced';

TokenMustBePlaced.prototype.getMessageInternal = function () {
	return [
		'This token must be placed ',
		this.position,' ', this.enclosure
	].join('');
};


var TokenMustBeWithin = function (token, enclosure) {
	TokenMustBePlaced.call(this, token, 'within', enclosure);
};
inherits(TokenMustBeWithin, TokenMustBePlaced);
mt.mark(TokenMustBeWithin, ':TokenMustBeWithin');
TokenMustBeWithin.prototype.name = 'TokenMustBeWithin';


var TokenMustBeBeyond = function (token, enclosure) {
	TokenMustBePlaced.call(this, token, 'beyond', enclosure);
};
inherits(TokenMustBeBeyond, TokenMustBePlaced);
mt.mark(TokenMustBeBeyond, ':TokenMustBeBeyond');
TokenMustBeBeyond.prototype.name = 'TokenMustBeBeyond';


var TokenMustBeWithinTemplate = function (token) {
	TokenMustBeWithin.call(this, token, 'template');
};
inherits(TokenMustBeWithinTemplate, TokenMustBeWithin);
mt.mark(TokenMustBeWithinTemplate, ':TokenMustBeWithinTemplate');
TokenMustBeWithinTemplate.prototype.name = 'TokenMustBeWithinTemplate';


var TokenMustBeBeyondTemplate = function (token) {
	TokenMustBeBeyond.call(this, token, 'template');
};
inherits(TokenMustBeBeyondTemplate, TokenMustBeBeyond);
mt.mark(TokenMustBeBeyondTemplate, ':TokenMustBeBeyondTemplate');
TokenMustBeBeyondTemplate.prototype.name = 'TokenMustBeBeyondTemplate';


var TokenMustBeBeyondFunction = function (token) {
	TokenMustBeBeyond.call(this, token, 'function');
};
inherits(TokenMustBeBeyondFunction, TokenMustBeBeyond);
mt.mark(TokenMustBeBeyondFunction, ':TokenMustBeBeyondFunction');
TokenMustBeBeyondFunction.prototype.name = 'TokenMustBeBeyondFunction';


var TokenMustBeWithinBlock = function (token) {
	TokenMustBeWithin.call(this, token, 'block');
};
inherits(TokenMustBeWithinBlock, TokenMustBeWithin);
mt.mark(TokenMustBeWithinBlock, ':TokenMustBeWithinBlock');
TokenMustBeWithinBlock.prototype.name = 'TokenMustBeWithinBlock';


var TokenMustBeBeyondBlock = function (token) {
	TokenMustBeBeyond.call(this, token, 'block');
};
inherits(TokenMustBeBeyondBlock, TokenMustBeBeyond);
mt.mark(TokenMustBeBeyondBlock, ':TokenMustBeBeyondBlock');
TokenMustBeBeyondBlock.prototype.name = 'TokenMustBeBeyondBlock';


var DuplicateBlockName = function (ctx, blockName) {
	GenerationError.call(this, ctx);
	this.blockName = blockName;
};
inherits(DuplicateBlockName, GenerationError);
mt.mark(DuplicateBlockName, ':DuplicateBlockName');

DuplicateBlockName.prototype.name = 'DuplicateBlockName';

DuplicateBlockName.prototype.getMessageInternal = function () {
	return ['Duplicate block name "', this.blockName, '" within template'].join('');
};


var ClosedWithoutOpenning = function (ctx, entity, opt_name) {
	GenerationError.call(this, ctx);
	this.entity = entity;
	this.name = opt_name;
};
inherits(ClosedWithoutOpenning, GenerationError);
mt.mark(ClosedWithoutOpenning, ':ClosedWithoutOpenning');

ClosedWithoutOpenning.prototype.name = 'ClosedWithoutOpenning';

ClosedWithoutOpenning.prototype.getMessageInternal = function () {
	var msgItems = [strTools.capFirst(this.entity)];
	if (this.name) {
		msgItems.push(' "', this.name, '"');
	}
	msgItems.push(' closed without openning');

	return msgItems.join('');
};


var FunctionClosedWithoutOpenning = function (ctx, opt_name) {
	ClosedWithoutOpenning.call(this, ctx, 'function', opt_name);
};
inherits(FunctionClosedWithoutOpenning, ClosedWithoutOpenning);
mt.mark(FunctionClosedWithoutOpenning, ':FunctionClosedWithoutOpenning');
FunctionClosedWithoutOpenning.prototype.name = 'FunctionClosedWithoutOpenning';


var BlockClosedWithoutOpenning = function (ctx, opt_name) {
	ClosedWithoutOpenning.call(this, ctx, 'block', opt_name);
};
inherits(BlockClosedWithoutOpenning, ClosedWithoutOpenning);
mt.mark(BlockClosedWithoutOpenning, ':BlockClosedWithoutOpenning');
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
