"use strict";
var inherits = require('util').inherits;
var ErrorBase = require('nerr').ErrorBase;
var CompilationError = require('./errors').CompilationError;
var optionTools = require('../tools/options');

var TokenizationError = require('./tokenizer/errors').TokenizationError;
var GenerationError = require('./generators/core/errors').GenerationError;

var defaultOptions = require('./options');


var CompilationFailed = function(errors, tooManyErrors) {
	ErrorBase.call(this);

	this.errors = errors;
	this.tooManyErrors = tooManyErrors;

	this.filename = null;
	this.src = null;
	this.tabSize = null;
};
inherits(CompilationFailed, ErrorBase);

CompilationFailed.prototype.setSrc = function(opt_filename, opt_src, opt_tabSize) {
	this.filename = opt_filename;
	this.src = opt_src;
	this.tabSize = opt_tabSize;
};

CompilationFailed.prototype.getMessage = function(opt_filename, opt_src, opt_tabSize) {
	var filename = opt_filename || this.filename;
	var src = opt_src || this.src;
	var tabSize = (opt_tabSize == null ? this.tabSize : opt_tabSize);
	var preparedErrors = this.errors.map(function(v) {
		return v.getMessage(src, tabSize);
	});

	var result = preparedErrors.join('\n');
	if (filename) {
		result = ['File "', filename, '" compilation failed:\n', result].join('');
	}
	if (this.tooManyErrors) {
		result += '\nToo many errors, compilation stopped';
	}

	return result + '\n';
};


var compile = function(src, options) {
	options = optionTools.cloneWithDefaults(options, defaultOptions);
	options.tokenizer.tabSize = options.tabSize;

	var errors = [];

	var tokenizer = new options.tokenizer.tokenizerClass(src, options.tokenizer);
	var generator = new options.generator.generatorClass(options.generator);

	while(true) {
		try {
			var token = tokenizer.getNextToken();
			if (token == null) { // we are done
				break;
			}
			generator.onToken(token);
		}
		catch(err) {
			var needStop = false;

			if (err instanceof TokenizationError) {
				// continue if we can
				if (!err.canContinue) {
					needStop = true;
				}
			}
			else if (!(err instanceof GenerationError)) { // ignore generation errors here
				throw err;
			}

			errors.push(err);

			if (needStop || options.maxErrors != null && errors.length >= options.maxErrors) {
				break;
			}
		}
	}

	var result = null;
	if (errors.length === 0) {
		try {
			result = generator.getResult();
		}
		catch(err) {
			if (err instanceof GenerationError) {
				errors.push(err);
			}
			else {
				throw err;
			}
		}
	}

	if (errors.length !== 0) {
		throw new CompilationFailed(errors);
	}

	return {
		// someday we'll add here warnings... maybe
		result: result
	};
};

compile.CompilationFailed = CompilationFailed;


module.exports = compile;
