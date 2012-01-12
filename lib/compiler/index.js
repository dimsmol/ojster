var optionTools = require('../tools/options');

var TokenizationError = require('./tokenizer/errors').TokenizationError;
var GenerationError = require('./generators/core/errors').GenerationError;

var defaultOptions = require('./options');


var CompilationFailed = function(errors, tooManyErrors) {
	this.errors = errors;
	this.tooManyErrors = tooManyErrors;
};
CompilationFailed.prototype.toString = function(src, tabSize) {
	var preparedErrors;

	if (src == null)
	{
		preparedErrors = this.errors;
	}
	else
	{
		preparedErrors = this.errors.map(function(v) {
			return v.toString(src, tabSize);
		});
	}

	result = preparedErrors.join('\n');

	if (this.tooManyErrors)
	{
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

	while(true)
	{
		try
		{
			var token = tokenizer.getNextToken();
			if (token == null) // we are done
			{
				break;
			}

			generator.onToken(token);
		}
		catch(err)
		{
			var needStop = false;

			if (err instanceof TokenizationError)
			{
				// continue if we can
				if (!err.canContinue)
				{
					needStop = true;
				}
			}
			else if (err instanceof GenerationError)
			{
				// it's ok, continue
			}
			else
			{
				throw err;
			}

			errors.push(err);

			if (needStop || options.maxErrors != null && errors.length >= options.maxErrors)
			{
				break;
			}
		}
	}

	if (errors.length == 0)
	{
		try
		{
			result = generator.getResult();
		}
		catch(err)
		{
			if (err instanceof GenerationError)
			{
				errors.push(err);
			}
			else
			{
				throw err;
			}
		}
	}

	if (errors.length != 0)
	{
		throw new CompilationFailed(errors);
	}

	return {
		// someday we'll add here warnings... maybe
		result: result
	};
};

module.exports = {
	CompilationFailed: CompilationFailed,
	compile: compile
};
