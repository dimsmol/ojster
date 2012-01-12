var inherits = require('util').inherits;

var strTools = require('../../../tools/str');

var CompilationError = require('../../errors').CompilationError;


var GenerationError = function(ctx) {
	CompilationError.call(this, ctx);
};
inherits(GenerationError, CompilationError);

GenerationError.prototype.getMessage = function() {
	return 'Generic generation error';
};


var TemplateTokenNotFound = function() {
	GenerationError.call(this, null);
};
inherits(TemplateTokenNotFound, GenerationError);

TemplateTokenNotFound.prototype.getMessage = function() {
	return 'Template token not found';
};


var InheritsTokenNotFound = function(ctx) {
	GenerationError.call(this, ctx);
};
inherits(InheritsTokenNotFound, GenerationError);

InheritsTokenNotFound.prototype.getMessage = function() {
	var result = 'Inherits token not found';
	if (this.ctx != null)
	{
		result += ' (must be defined earlier)';
	}

	return result;
};


var DuplicateInheritsToken = function(ctx) {
	GenerationError.call(this, ctx);
};
inherits(DuplicateInheritsToken, GenerationError);

DuplicateInheritsToken.prototype.getMessage = function() {
	return 'Duplicate inherits token within template';
};


var TokenMustBePlaced = function(token, position, enclosure) {
	this.token = token;
	this.position = position;
	this.enclosure = enclosure;
	GenerationError.call(this, token.ctx);
};
inherits(TokenMustBePlaced, GenerationError);

TokenMustBePlaced.prototype.getMessage = function() {
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


var TokenMustBeWithinBlock = function(token) {
	TokenMustBeWithin.call(this, token, 'block');
};
inherits(TokenMustBeWithinBlock, TokenMustBeWithin);


var TokenMustBeBeyondBlock = function(token) {
	TokenMustBeBeyond.call(this, token, 'block');
};
inherits(TokenMustBeWithinBlock, TokenMustBeBeyond);


var DuplicateBlockName = function(ctx, blockName) {
	this.blockName = blockName;
	GenerationError.call(this, ctx);
};
inherits(DuplicateBlockName, GenerationError);

DuplicateBlockName.prototype.getMessage = function() {
	return ['Duplicate block name "', this.blockName, '" within template'].join('');
};


var BlockClosedWithoutOpenning = function(ctx, opt_blockName) {
	this.blockName = opt_blockName;
	GenerationError.call(this, ctx);
};
inherits(BlockClosedWithoutOpenning, GenerationError);

BlockClosedWithoutOpenning.prototype.getMessage = function() {
	var msgItems = ['Attempt to close block '];

	if (this.blockName)
	{
		msgItems.push('"', this.blockName, '" ');
	}

	msgItems.push('which is not open');

	return msgItems.join('');
};


module.exports = {
	GenerationError: GenerationError,

	TemplateTokenNotFound: TemplateTokenNotFound,

	InheritsTokenNotFound: InheritsTokenNotFound,
	DuplicateInheritsToken: DuplicateInheritsToken,

	TokenMustBeWithinTemplate: TokenMustBeWithinTemplate,
	TokenMustBeBeyondTemplate: TokenMustBeBeyondTemplate,

	TokenMustBeWithinBlock: TokenMustBeWithinBlock,
	TokenMustBeBeyondBlock: TokenMustBeBeyondBlock,

	BlockClosedWithoutOpenning: BlockClosedWithoutOpenning,
	DuplicateBlockName: DuplicateBlockName
};
