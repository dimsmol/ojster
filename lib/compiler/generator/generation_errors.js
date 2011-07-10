
var inherits = require('util').inherits;
var CompilationError = require('../compilation_errors').CompilationError;

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

var RequireWithinBlock = function(ctx) {
    GenerationError.call(this, ctx,
        'Require cannot be placed within block');
};
inherits(RequireWithinBlock, GenerationError);

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
	BlockOpeningMissed: BlockOpeningMissed
};