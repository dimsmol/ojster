
var inherits = require('util').inherits;
var CompilationError = require('../errors').CompilationError;

var GenerationError = function() {
	CompilationError.apply(this, arguments);
};
inherits(GenerationError, CompilationError);

var DuplicateBlockName = function(ctx, blockName) {
	GenerationError.call(this, ctx,
		['Block name "', blockName, '" already used'].join(''));
};
inherits(DuplicateBlockName, GenerationError);

var BlockOpeningMissed = function(ctx, blockName) {
	var msg = (blockName == null ? 'Block opening is missed or mismatched' : ['Block "', blockName,'" opening is missed or mismatched'].join(''));
	GenerationError.call(this, ctx,
		msg);
};
inherits(BlockOpeningMissed, GenerationError);

var FragmentBeyondBlock = function(ctx) {
	GenerationError.call(this, ctx,
		'Fragment must be placed within block');
};
inherits(FragmentBeyondBlock, GenerationError);

var ExpressionBeyondBlock = function(ctx) {
	GenerationError.call(this, ctx,
		'Expression must be placed within block');
};
inherits(ExpressionBeyondBlock, GenerationError);

var CssNameBeyondBlock = function(ctx) {
	GenerationError.call(this, ctx,
		'Css name resolution must be placed within block');
};
inherits(CssNameBeyondBlock, GenerationError);

var BlockCallBeyondBlock = function(ctx) {
	GenerationError.call(this, ctx,
		'Block call must be placed within block');
};
inherits(BlockCallBeyondBlock, GenerationError);

var TemplateInsertionBeyondBlock = function(ctx) {
	GenerationError.call(this, ctx,
		'Template insertion must be placed within block');
};
inherits(TemplateInsertionBeyondBlock, GenerationError);

var RequireWithinBlock = function(ctx) {
	GenerationError.call(this, ctx,
		'Require cannot be placed within block');
};
inherits(RequireWithinBlock, GenerationError);

var SetInitializerWithinBlock = function(ctx) {
	GenerationError.call(this, ctx,
		'Set instruction cannot be placed within block');
};
inherits(SetInitializerWithinBlock, GenerationError);

var TemplateInfoMissed = function(ctx) {
	var msg = 'Template description is missed';

	if (ctx != null)
	{
		msg += ' (must be defined earlier)';
	}

	GenerationError.call(this, ctx, msg);
};
inherits(TemplateInfoMissed, GenerationError);

var TemplateInfoWithinBlock = function(ctx) {
	GenerationError.call(this, ctx,
		'Template description cannot be placed within block');
};
inherits(TemplateInfoWithinBlock, GenerationError);

var DuplicateTemplateInfo = function(ctx) {
	GenerationError.call(this, ctx,
		'Template description duplicated');
};
inherits(DuplicateTemplateInfo, GenerationError);

var InheritanceInfoMissed = function(ctx) {
	var msg = 'Inheritance description is missed';

	if (ctx != null)
	{
		msg += ' (must be defined earlier)';
	}

	GenerationError.call(this, ctx, msg);
};
inherits(InheritanceInfoMissed, GenerationError);

var InheritanceInfoWithinBlock = function(ctx) {
	GenerationError.call(this, ctx,
		'Inheritance description cannot be placed within block');
};
inherits(InheritanceInfoWithinBlock, GenerationError);

var DuplicateInheritanceInfo = function(ctx) {
	GenerationError.call(this, ctx,
		'Inheritance description duplicated');
};
inherits(DuplicateInheritanceInfo, GenerationError);

module.exports = {
	GenerationError: GenerationError,
	DuplicateBlockName: DuplicateBlockName,
	BlockOpeningMissed: BlockOpeningMissed,
	FragmentBeyondBlock: FragmentBeyondBlock,
	ExpressionBeyondBlock: ExpressionBeyondBlock,
	CssNameBeyondBlock: CssNameBeyondBlock,
	BlockCallBeyondBlock: BlockCallBeyondBlock,
	TemplateInsertionBeyondBlock: TemplateInsertionBeyondBlock,
	RequireWithinBlock: RequireWithinBlock,
	SetInitializerWithinBlock: SetInitializerWithinBlock,
	TemplateInfoMissed: TemplateInfoMissed,
	TemplateInfoWithinBlock: TemplateInfoWithinBlock,
	DuplicateTemplateInfo: DuplicateTemplateInfo,
	InheritanceInfoMissed: InheritanceInfoMissed,
	InheritanceInfoWithinBlock: InheritanceInfoWithinBlock,
	DuplicateInheritanceInfo: DuplicateInheritanceInfo
};
