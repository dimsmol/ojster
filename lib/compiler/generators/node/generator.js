"use strict";
var inherits = require('util').inherits;
var RequireToken = require('../../tokenizer/tokens/require');
var CoreGenerator = require('../core/generator');


var Generator = function(options) {
	CoreGenerator.call(this, options);
};
inherits(Generator, CoreGenerator);

// lifecycle

Generator.prototype.onStart = function() {
	this.appendRequireInherits();
};

Generator.prototype.onEnd = function() {
	this.appendExports();
};

// utility append

Generator.prototype.appendRequireInherits = function() {
	var buffer = this.buffer;

	buffer.push('\n');
	var token = new RequireToken(
		null,
		this.options.inherits.alias,
		this.options.inherits.path,
		this.options.inherits.subpath,
		this.options.inherits.fullName,
		this.options.inherits.subname
	);
	this.appendRequire(token);
	buffer.push('\n');
};

Generator.prototype.appendExports = function() {
	if (this.templates.length == 1)
	{
		this.buffer.push(
			'\nmodule.exports = ', this.templates[0].nameToUse, ';'
		);
	}
	else
	{
		this.buffer.push('\nmodule.exports = {\n');
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
		this.buffer.push('\n};');
	}
};


module.exports = Generator;
