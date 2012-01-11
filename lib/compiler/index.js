var Tokenizer = require('./tokenizer');
var Generator = require('./generator');

var GenerationError = require('./generator/errors').GenerationError;


var CompilationFailed = function(errors, tooManyErrors) {
	this.errors = errors;
	this.tooManyErrors = tooManyErrors;
};
CompilationFailed.prototype.toString = function(src, tabSize) {
	var preparedErrors = (src == null ? this.errors : this.errors.map(function(v) {return v.toString(src, tabSize);}));
	result = preparedErrors.join('\n');
	if (this.tooManyErrors) {
		result += '\nToo many errors, compilation stopped';
	}
	return result + '\n';
};

var compile = function(src, options) {
	options = options || {};
	options.tokenizer = options.tokenizer || {};
	options.tokenizer.tabSize = options.tabSize;

	var maxErrors = (options.maxErrors === undefined ? 20 : options.maxErrors);

	var tokenizerClass = options.tokenizer && options.tokenizer.tokenizerClass || Tokenizer;
	var generatorClass = options.generator && options.generator.generatorClass || Generator;

	var errors = [];

	var tokenizer = new tokenizerClass(src, options.tokenizer);
	var generator = new generatorClass(options.generator, errors);

	while(true) {
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

			if (needStop || maxErrors != null && errors.length >= maxErrors) {
				break;
			}
		}
	}

	if (errors.length == 0) {
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

	if (errors.length != 0) {
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
