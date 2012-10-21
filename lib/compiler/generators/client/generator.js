"use strict";
var inherits = require('util').inherits;
var CoreGenerator = require('../core/generator');


var Generator = function(options) {
	CoreGenerator.call(this, options);
	this.definitionBuffer = null;
};
inherits(Generator, CoreGenerator);

// lifecycle

Generator.prototype.onStart = function() {
	this.definitionBuffer = this.reserveBuffer();
	this.appendUseStrict();
};

Generator.prototype.onEnd = function() {
	this.appendDefinition();
	this.appendExports();
	this.appendDefinitionEnd();
};

// template level tokens

Generator.prototype.onTemplateToken = function(token) {
	this.appendRequireAliases();
	Generator.super_.prototype.onTemplateToken.call(this, token);
};

// append for tokens

Generator.prototype.appendRequire = function(token) {
};

// utility append

Generator.prototype.appendDefinition = function() {
	var indentStr = this.options.indentStr;
	var i, l;
	this.definitionBuffer.push(
		'(function (root, factory) {\n',
		indentStr, '"use strict";\n',
		indentStr, "if (typeof define === 'function' && define.amd) {\n",
		indentStr, indentStr, '// AMD. Register as an anonymous module.\n',
		indentStr, indentStr, 'define(['
	);
	if (this.requirements.length > 0) {
		this.definitionBuffer.push('\n');
		for(i = 0, l = this.requirements.length; i < l; i++) {
			if (i > 0) {
				this.definitionBuffer.push(',\n');
			}
			this.definitionBuffer.push(
				indentStr, indentStr, indentStr, this.requirements[i].path
			);
		}
		this.definitionBuffer.push('\n', indentStr, indentStr);
	}
	this.definitionBuffer.push(
		'], factory);\n',
		indentStr, '} else {\n',
		indentStr, indentStr, '// Browser globals\n',
		indentStr, indentStr, 'root.ojster = factory('
	);
	if (this.requirements.length > 0) {
		this.definitionBuffer.push('\n');
		for(i = 0, l = this.requirements.length; i < l; i++) {
			if (i > 0) {
				this.definitionBuffer.push(',\n');
			}
			this.definitionBuffer.push(
				indentStr, indentStr, indentStr, 'root.', this.requirements[i].fullName
			);
		}
		this.definitionBuffer.push('\n', indentStr, indentStr);
	}
	this.definitionBuffer.push(
		');\n',
		indentStr, '}\n',
		'}(this, function ('
	);
	if (this.requirements.length > 0) {
		this.definitionBuffer.push('\n');
		for(i = 0, l = this.requirements.length; i < l; i++) {
			if (i > 0) {
				this.definitionBuffer.push(',\n');
			}
			this.definitionBuffer.push(
				indentStr, this.requirements[i].alias
			);
		}
		this.definitionBuffer.push('\n');
	}
	this.definitionBuffer.push(
		') {\n'
	);
};

Generator.prototype.appendRequireAliases = function() {
	var added = false;

	for(var i = 0, l = this.requirements.length; i < l; i++) {
		var requirement = this.requirements[i];
		var fullName = requirement.fullName;
		var subname = requirement.subname;

		if (subname || fullName && fullName.indexOf('.') != -1) {
			this.appendRequireAlias(requirement.alias, fullName, subname);
			added = true;
		}
	}

	if (added) {
		this.buffer.push('\n');
	}
};

Generator.prototype.appendRequireAlias = function(alias, fullName, subname) {
	this.buffer.push(
		'var ', alias, ' = ', fullName
	);
	if (subname) {
		this.buffer.push('.', subname);
	}
	this.buffer.push(';\n');
};

Generator.prototype.appendExports = function() {
	if (this.templates.length == 1) {
		this.buffer.push(
			'\nreturn ', this.templates[0].nameToUse, ';\n'
		);
	}
	else
	{
		this.buffer.push('\nreturn = {\n');
		for (var i = 0; i < this.templates.length; i++)
		{
			var template = this.templates[i];
			var prefix = (i > 0 ? ',\n' : '');
			this.buffer.push(
				prefix,
				this.options.indentStr,
				template.name, ': ', template.nameToUse
			);
		}
		this.buffer.push('\n};\n');
	}
};

Generator.prototype.appendDefinitionEnd = function() {
	this.buffer.push('\n}));\n');
};


module.exports = Generator;
