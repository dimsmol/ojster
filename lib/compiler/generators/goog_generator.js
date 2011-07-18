
var inherits = require('util').inherits;

var Generator = require('../generator');
var strTools = require('../../tools/str_tools');


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

GoogGenerator.prototype.appendRequireTo = function(buffer, ctx, alias, path, subpath, fullName) {
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
        this.templateNameToUse,
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
	        '\nvar ', this.templateAlias, ' = ',
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
    for(var i=0, l=this.requirements.length; i<l; i++) {
        var requirement = this.requirements[i];
        var fullName = requirement.fullName;
        if (fullName.indexOf('.') != -1) {
            this.appendRequireAlias(requirement.alias, fullName);
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

GoogGenerator.prototype.getTemplateNameToUse = function() {
	return this.templateFullName;
};

GoogGenerator.prototype.getTemplateBaseNameToUse = function() {
	return this.templateBaseFullName;
};
