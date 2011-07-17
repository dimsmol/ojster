
var inherits = require('util').inherits;

var Generator = require('../generator');
var strTools = require('../../tools/str_tools');

/*

TODO

- allow require subObjects, it's simple enough when using with goog.scope, and possible even without it

*/

var GoogGenerator = function(options) {
    this.provideBuffer = null;

    Generator.apply(this, arguments);

    options = options || {};
	this.useScope = !!options.useScope;
    this.inheritsAlias = options.inheritsAlias || 'goog.inherits';
};
inherits(GoogGenerator, Generator);

module.exports = GoogGenerator;

GoogGenerator.prototype.initStack = function() {
	this.appendIntro();
    this.provideBuffer = this.appendBuffer();
    this.requireInheritsBuffer = this.appendBuffer();
};

GoogGenerator.prototype.appendDefinitionBuffer = function() {
	if (this.useScope) {
	    this.appendOpenScope();
	}
    Generator.prototype.appendDefinitionBuffer.call(this);
};

GoogGenerator.prototype.resolvePath = function(alias, path, fullName) {
    return null;
};

GoogGenerator.prototype.resolveFullName = function(alias, path, fullName) {
    if (!fullName) {
        if (!path) {
            return alias;
        }
        fullName = this.getFullNameFromPath(path);
    }
    return fullName;
};

GoogGenerator.prototype.appendRequireTo = function(buffer, ctx, alias, path, subObject, fullName) {
	if (subObject) {
		this.error(new GoogGenerator.errors.SubObjectNotSupported(ctx));
	}

    buffer.append(
        "goog.require('", fullName, "');"
    );

    if (ctx && this.appendLineNumbersFor.require) {
        this.appendLineNumberTo(buffer, ctx);
    }
};

GoogGenerator.prototype.appendInheritsRequire = function() {
};

GoogGenerator.prototype.appendMissing = function() {
	if (!this.templateInfoSet) {
		if (!this.templateInfoMissedErrorReported) {
			this.error(new generationErrors.TemplateInfoMissed());
			this.templateInfoMissedErrorReported = true;
		}
		return;
	}

    this.appendProvide();
    Generator.prototype.appendMissing.call(this);
	if (this.useScope) {
	    this.appendCloseScope();
	}
};

GoogGenerator.prototype.appendDefinition = function() {
	if (!this.templateInfoSet) {
		if (!this.templateInfoMissedErrorReported) {
			this.error(new generationErrors.TemplateInfoMissed(ctx));
			this.templateInfoMissedErrorReported = true;
		}
		return;
	}

	if (this.useScope) {
	    this.appendRequireAliases();
	}
    this.definitionBuffer.append(
        this.templateFullName,
        ' = function() {'
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
	if (this.useScope) { // aliasing template name
	    this.definitionBuffer.append(
	        '\nvar ', this.templateName, ' = ',
	        this.templateFullName, ';'
	    );
	}
};

GoogGenerator.prototype.appendProvide = function() {
    this.provideBuffer.append(
        "\ngoog.provide('",
        this.templateFullName,
        "');\n\n"
    );
};

GoogGenerator.prototype.appendOpenScope = function() {
    this.append(
        'goog.scope(function() {\n\n'
    );
};

GoogGenerator.prototype.appendCloseScope = function() {
    this.append(
        '\n}); // goog.scope'
    );
};

GoogGenerator.prototype.appendRequireAliases = function() {
    var added = false;
    if (!this.inheritsAdded) {
        this.appendRequireAlias(this.templateBase, this.templateBaseFullName);
        added = true;
    }
    for(var i=0, l=this.requirements.length; i<l; i++) {
        var requirement = this.requirements[i];
        var fullName = requirement[2];
        if (fullName.indexOf('.') != -1) {
            this.appendRequireAlias(requirement[0], fullName);
            added = true;
        }
    }
    if (added) {
        this.definitionBuffer.append('\n');
    }
};

GoogGenerator.prototype.appendRequireAlias = function(alias, fullName) {
    this.definitionBuffer.append(
        'var ', alias, ' = ', fullName, ';\n'
    );
};

GoogGenerator.prototype.appendExports = function() {
};

GoogGenerator.prototype.getTemplateFullName = function() {
	if (this.templateNamespace) {
	    return this.templateNamespace + '.' + this.templateName;
	}
	return this.templateName;
};

GoogGenerator.prototype.getTemplateBaseFullName = function() {
	if (this.templateBaseNamespace) {
		return this.templateBaseNamespace + '.' + this.templateBase;
	}
	return this.templateBase;
};

GoogGenerator.prototype.getFullNameFromPath = function(path) {
    // TODO better implementation, taking in account current path
    var str = path.replace(/[\'\"]/g, '');
    var match = str.match(/^(\.{0,2}\/)+(.+)$/);
    if (match) {
        str = match[2];
    }
    str = str.replace(/\/+/g, '.');
    var items = str.split('.');

    for(var i=0, l=items.length; i < l; i++) {
        items[i] = strTools.underscoreToCamelCase(items[i]);
    }

    return items.join('.');
};

var GoogGenerationError = function() {
	GenerationError.apply(this, arguments);
};
inherits(GoogGenerationError, Generator.errors.GenerationError);

var SubObjectNotSupported = function(ctx) {
    GenerationError.call(this, ctx,
        'Subobjects for "require" are not supported by GoogGenerator');
};
inherits(SubObjectNotSupported, GoogGenerationError);

GoogGenerator.errors = {
	GoogGenerationError: GoogGenerationError,
	SubObjectNotSupported: SubObjectNotSupported
};
