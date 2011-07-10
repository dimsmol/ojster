
/*

TODO

- use defaultsOptions for each option to expose defaults

optimize:
- pre-concat sequential string constants
- reuse already defined requires in inherits if there are any ?

*/

var Block = require('./block');
var Buffer = require('./buffer');
var tokens = require('../tokenizer/tokens');
var generationErrors = require('./generation_errors');

var strTools = require('../../tools/str_tools');
var objectTools = require('../../tools/object_tools');

var Generator = function(options, errors) {
    options = options || {};

    this.needCompactFragmentWhitespaces =
        options.compactFragmentWhitespaces === undefined ? true : options.compactFragmentWhitespaces;

    this.defaultTemplateBase = options.defaultTemplateBase || 'Template';
    this.defaultTemplateBasePath = options.defaultTemplateBasePath || "'ojster/template'";
    this.defaultTemplateBaseSubObject = options.defaultTemplateBaseSubObject || null;
    this.defaultTemplateBaseFullName = options.defaultTemplateBaseFullName || 'ojster.Template';

    this.inheritsAlias = options.inheritsAlias || 'inherits';
    this.inheritsPath = options.inheritsPath || "'util'";
    this.inheritsSubObject = options.inheritsSubObject || 'inherits';
    this.inheritsFullName = options.inheritsFullName || 'goog.inherits';

    this.indentStr = options.indentStr || '\t';
    this.appendFunctionStr = options.appendFunctionStr || 'this.append';
    this.escapeFunctionStr = options.escapeFunctionStr || 'this.escape';

    this.blockFunctionNamePrefixStr = options.blockFunctionNamePrefixStr || 'appendBlock';

	this.blockLocals = options.blockLocals || Generator.defaultOptions.blockLocals;

    this.nonBlockFragmentsAreCode =
        options.nonBlockFragmentsAreCode === undefined ? true : options.nonBlockFragmentsAreCode;

    if (options.appendLineNumbers !== undefined && !options.appendLineNumbers) {
        this.appendLineNumbersFor = {};
    } else {
        this.appendLineNumbersFor = objectTools.extend({
            require: false,
            template: false,
            inherits: false,
            block: true,
            blockClose: true,
            blockCall: false,
            fragment: false,
            expression: true,
            sequenceClose: true,
            sequenceCloseBeforeBlockClose: false,
            oneLineCodeFragment: false
        }, options.appendLineNumbersFor);
    }

    this.errors = errors;

    this.templateName = null;
    this.templateNamespace = null;
    this.templateBase = null;

    this.stack = [];
    this.currentBuffer = null;

    this.blockStack = [];
    this.currentBlock = null;

    this.requireInheritsBuffer = null;
    this.requireTemplateBaseBuffer = null;
    this.definitionBuffer = null;
    this.definitionCtx = null;

    this.templateInfoSet = false;
    this.inheritsAdded = false;
	this.renderAdded = false;
	this.usedBlockNames = {};

    this.requirements = [];

    this.initStack();
};

module.exports = Generator;

Generator.errors = generationErrors;

Generator.defaultOptions = {
	blockLocals: 'var d = this.data, vars = this.vars;'
};

Generator.prototype.error = function(err) {
    this.errors.push(err);
};

Generator.prototype.initStack = function() {
    this.requireInheritsBuffer = this.appendBuffer();
    this.requireTemplateBaseBuffer = this.appendBuffer();
};

Generator.prototype.applyToken = function(token) {
    token.generatorAction(this);
};

Generator.prototype.appendRequire = function(ctx, alias, path, fullName) {
	if (this.currentBlock) {
		this.error(new generationErrors.RequireWithinBlock(ctx));
		return;
	}

    resolvedPath = this.resolvePath(alias, path, fullName);
    resolvedFullName = this.resolveFullName(alias, path, fullName);

    this.appendRequireTo(this, ctx, alias, resolvedPath, null, resolvedFullName);
    this.requirements.push([alias, resolvedPath, resolvedFullName]);
};

Generator.prototype.resolvePath = function(alias, path, fullName) {
    if (!path) {
        if (!fullName) {
            return "'" + alias + "'";
        }
        path = this.getPathFromFullName(fullName);
    }
    return path;
};

Generator.prototype.resolveFullName = function(alias, path, fullName) {
    return null;
};

Generator.prototype.appendRequireTo = function(buffer, ctx, alias, path, subObject, fullName) {
    buffer.append(
        'var ', alias, ' = require(', path, ')'
    );
    if (subObject) {
        buffer.append(
            '.', subObject
        );
    }
    buffer.append(';');

    if (ctx && this.appendLineNumbersFor.require) {
        this.appendLineNumberTo(buffer, ctx);
    }
};

Generator.prototype.appendInheritsRequire = function() {
    this.requireInheritsBuffer.append('\n');
    this.appendRequireTo(this.requireInheritsBuffer, null,
        this.inheritsAlias,
        this.inheritsPath,
        this.inheritsSubObject,
        this.inheritsFullName
    );
    this.requireInheritsBuffer.append('\n');
};

Generator.prototype.appendTemplateBaseRequire = function() {
    this.requireTemplateBaseBuffer.append('\n');
    this.appendRequireTo(this.requireTemplateBaseBuffer, null,
        this.defaultTemplateBase,
        this.defaultTemplateBasePath,
        null,
        this.defaultTemplateBaseFullName
    );
    this.requireTemplateBaseBuffer.append('\n');
};

Generator.prototype.setTemplateInfo = function(ctx, templateName, templateNamespace) {
	if (this.currentBlock) {
		this.error(new generationErrors.TemplateInfoWithinBlock(ctx));
		return;
	}
	if (this.templateInfoSet) {
		this.error(new generationErrors.DuplicateTemplateInfo(ctx));
		return;
	}

    this.templateName = templateName;
    this.templateNamespace = templateNamespace;
    this.appendDefinitionBuffer();
    this.definitionCtx = ctx;

	this.templateInfoSet = true;
};

Generator.prototype.appendDefinitionBuffer = function() {
    this.definitionBuffer = this.appendBuffer();
};

Generator.prototype.setInheritanceInfo = function(ctx, templateBase) {
	if (this.currentBlock) {
		this.error(new generationErrors.InheritanceInfoWithinBlock(ctx));
		return;
	}
	if (this.inheritsAdded) {
		this.error(new generationErrors.DuplicateInheritanceInfo(ctx));
		return;
	}

    this.templateBase = templateBase;
    this.appendInheritsRequire();
    this.appendInheritsTo(this, ctx);
    this.inheritsAdded = true;

	// need it just after "inherits"
	this.appendRenderTo(this);
	this.renderAdded = true;
};

Generator.prototype.appendDefaultInherits = function() {
    this.appendInheritsRequire();
    this.appendTemplateBaseRequire();
    this.definitionBuffer.append('\n');
    this.appendInheritsTo(this.definitionBuffer);
};

Generator.prototype.appendFragment = function(ctx, fragment) {
    if (!fragment) {
        return;
    }

    if (!this.currentBlock) {
        if (this.nonBlockFragmentsAreCode) {
            this.appendCodeFragment(ctx, fragment, true);
            return;
        }

        if (!fragment.match(/\S/)) {
            return;
        }

		this.error(new generationErrors.FragmentBeyondBlock(ctx));
		return;
    }

    if (this.needCompactFragmentWhitespaces) {
        fragment = this.compactFragmentWhitespaces(fragment);
    }

    this.appendToSequence("'", strTools.jsStringEscape(fragment), "'");

    this.lastSequenceCtx = this.appendLineNumbersFor.fragment ? ctx : null;
};

Generator.prototype.appendExpression = function(ctx, expression, toBeEscaped) {
	if (!this.currentBlock) {
		this.error(new generationErrors.ExpressionBeyondBlock(ctx));
		return;
	}

    if (expression.search(/[\r\n]/) == -1) {
        expression = expression.trim();
    }

    if (toBeEscaped) {
        this.appendToSequence(this.escapeFunctionStr, '(', expression, ')');
    } else {
        this.appendToSequence(expression);
    }

    this.lastSequenceCtx = this.appendLineNumbersFor.expression ? ctx : null;
};

Generator.prototype.appendCodeFragment = function(ctx, code, fragmentAsCode) {
    if (this.currentBlock && !code.match(/\S/)) {
        return;
    }

    var buffer;
    if (this.currentBlock) {
        this.closeSequenceIfNeed(ctx);
        buffer = this.currentBlock;
    } else {
        buffer = this;
    }

    var oneLineInstruction = (!fragmentAsCode && code.search(/[\r\n]/) == -1);
    if (oneLineInstruction) {
        code = code.trim();
        if (this.currentBlock) {
            buffer.append('\n', this.indentStr);
        }
    }

    buffer.append(code);

    if (this.currentBlock) {
        if (oneLineInstruction) {
            if (ctx && this.appendLineNumbersFor.oneLineCodeFragment) {
                this.appendLineNumberTo(buffer, ctx);
            }
            buffer.append('\n');
        }
        buffer.append('\n');
    }

};

Generator.prototype.openBlock = function(ctx, blockName, closeImmediately) {
	if (blockName in this.usedBlockNames) {
		this.error(new generationErrors.DuplicateBlockName(ctx, blockName));
		return;
	}

    var buffer = this.createBuffer();
    var block = new Block(blockName, buffer);

    if (this.currentBlock) {
        this.appendCallBlock(ctx, block);
    }

    this.blockStack.push(block);
    this.currentBlock = block;

    this.appendToStack(block);

    this.appendBlockDefinitionStart(ctx);

    if (closeImmediately) {
        this.closeBlock(null, blockName);
    }

	this.usedBlockNames[blockName] = true;
};

Generator.prototype.closeBlock = function(ctx, blockName) {
	if (this.currentBlock == null || blockName != null && this.currentBlock.name != blockName) {
		this.error(new generationErrors.BlockOpeningMissed(ctx, blockName));
		return;
	}

    this.closeSequenceIfNeed(this.appendLineNumbersFor.sequenceCloseBeforeBlockClose ? ctx : null);
    this.appendBlockDefinitionEnd(ctx);

    this.blockStack.pop();
    this.currentBlock = this.blockStack[this.blockStack.length - 1];
};

Generator.prototype.appendToSequence = function() {
    this.openSequenceOrSeparateIfNeed();
    this.currentBlock.append.apply(this.currentBlock, arguments);
    this.currentBlock.sequenceEmpty = false;
};

Generator.prototype.appendCallBlock = function(ctx, block) {
    this.closeSequenceIfNeed(ctx);
    this.currentBlock.append(this.indentStr, 'this.', this.getBlockFunctionName(block), '();');

    if (ctx && this.appendLineNumbersFor.blockCall) {
        this.appendLineNumberTo(this.currentBlock, ctx);
    }

    this.currentBlock.append('\n');
};

Generator.prototype.append = function() {
    if (this.currentBuffer == null) {
        this.currentBuffer = this.appendBuffer();
    }
    this.currentBuffer.append.apply(this.currentBuffer, arguments);
};

Generator.prototype.appendMissing = function() {
    this.appendDefinition();

    if (!this.inheritsAdded) {
        this.appendDefaultInherits();
    }

	if (!this.renderAdded) {
		this.appendRenderTo(this.definitionBuffer);
	}

    this.appendExports();
};

Generator.prototype.getResult = function() {
    this.appendMissing();
    this.append('\n'); // trailing \n

    var result = [];

    for (var i=0, l=this.stack.length; i<l; i++) {
        var item = this.stack[i];
        result.push(item.getValue());
    }

    return result.join('');
};

Generator.prototype.openSequenceOrSeparateIfNeed = function() {
    if (!this.currentBlock.sequenceOpened) {
        this.openSequence();
        this.currentBlock.sequenceOpened = true;
        this.currentBlock.sequenceEmpty = true;
    } else if (!this.currentBlock.sequenceEmpty) {
        this.separateSequence();
    }
};

Generator.prototype.closeSequenceIfNeed = function(ctx) {
    if (this.currentBlock.sequenceOpened) {
        this.closeSequence(ctx);
        this.currentBlock.sequenceOpened = false;
    }
};

Generator.prototype.appendDefinition = function() {
    this.definitionBuffer.append(
        'var ', this.templateName, ' = function() {'
    );

    if (this.definitionCtx && this.appendLineNumbersFor.template) {
        this.appendLineNumberTo(this.definitionBuffer, this.definitionCtx);
    }

    this.definitionBuffer.append(
        '\n',
        this.indentStr
    );
    this.appendSuperClassConstructorCall();
    this.definitionBuffer.append(
        '\n};'
    );
};

Generator.prototype.appendSuperClassConstructorCall = function() {
    this.definitionBuffer.append(
        this.getTemplateBaseName(), '.apply(this, arguments);'
    );
};

Generator.prototype.appendInheritsTo = function(buffer, ctx) {
    buffer.append(
        this.inheritsAlias, '(', this.templateName, ', ', this.getTemplateBaseName(), ');'
    );

    if (ctx && this.appendLineNumbersFor.inherits) {
        this.appendLineNumberTo(buffer, ctx);
    }
};

Generator.prototype.appendRenderTo = function(buffer) {
    buffer.append(
        '\n\n',
		this.templateName, '.render = function() {\n',
		this.indentStr, 'var instance = new ', this.templateName, '();\n',
		this.indentStr, 'instance.init.apply(this, arguments);\n',
		this.indentStr, 'return instance.render();\n};'
    );
};

Generator.prototype.appendExports = function() {
    this.append(
        '\nmodule.exports = ', this.templateName, ';'
    );
};

Generator.prototype.openSequence = function() {
    this.currentBlock.append(
        this.indentStr, this.appendFunctionStr, '(\n',
        this.indentStr, this.indentStr
    );
};

Generator.prototype.separateSequence = function() {
    this.currentBlock.append(',');

    if (this.lastSequenceCtx) {
        this.appendLineNumberTo(this.currentBlock, this.lastSequenceCtx);
    }

    this.currentBlock.append(
        '\n',
        this.indentStr, this.indentStr
    );
};

Generator.prototype.closeSequence = function(ctx) {
    if (this.lastSequenceCtx) {
        this.appendLineNumberTo(this.currentBlock, this.lastSequenceCtx);
    }

    this.currentBlock.append(
        '\n',
        this.indentStr, ');'
    );

    if (ctx && this.appendLineNumbersFor.sequenceClose) {
        this.appendLineNumberTo(this.currentBlock, ctx);
    }

    this.currentBlock.append('\n');
};

Generator.prototype.appendBlockDefinitionStart = function(ctx) {
    if (this.blockStack.length > 1) {
        this.currentBlock.append('\n\n');
    }
    this.currentBlock.append(
        this.templateName, '.prototype.', this.getBlockFunctionName(this.currentBlock),
        ' = function() {'
    );

    if (ctx && this.appendLineNumbersFor.block) {
        this.appendLineNumberTo(this.currentBlock, ctx);
    }

    this.currentBlock.append('\n');

	this.appendBlockLocals();
};

Generator.prototype.appendBlockLocals = function() {
	if (this.blockLocals) {
		this.currentBlock.append(this.indentStr);
    	this.currentBlock.append(this.blockLocals);
	    this.currentBlock.append('\n\n');
	}
};

Generator.prototype.appendBlockDefinitionEnd = function(ctx) {
    this.currentBlock.append('};');

    if (ctx && this.appendLineNumbersFor.blockClose) {
        this.appendLineNumberTo(this.currentBlock, ctx);
    }
};

Generator.prototype.getTemplateBaseName = function() {
    return this.templateBase ? this.templateBase : this.defaultTemplateBase;
};

Generator.prototype.getBlockFunctionName = function(block) {
    return this.blockFunctionNamePrefixStr + strTools.capFirst(block.name);
};

Generator.prototype.createBuffer = function() {
    return new Buffer();
};

Generator.prototype.appendToStack = function(obj) {
    this.stack.push(obj);
    this.currentBuffer = null;
};

Generator.prototype.appendBuffer = function() {
    var buffer = this.createBuffer();
    this.appendToStack(buffer);
    return buffer;
};

Generator.prototype.appendLineNumberTo = function(buffer, ctx) {
    buffer.append(' // @', ctx.lineNumber, ':', ctx.linePos);
};

Generator.prototype.compactFragmentWhitespaces = function(fragment) {
    return fragment
                   .replace(/\s*^\s*</gm, '<')
                   .replace(/>\s*^\s*/gm, '>')
                   .replace(/\s*[\r\n]\s*/g, ' ')
                   .replace(/(^\s+)|(\s+$)/g, ' ');
};

Generator.prototype.getPathFromFullName = function(fullName) {
    var items = fullName.split('.');

    for(var i=0, l=items.length; i < l; i++) {
        items[i] = strTools.camelCaseToUnderscore(items[i]);
    }

    return "'" + items.join('/') + "'";
};