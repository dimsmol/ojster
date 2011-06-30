
var Tokenizer = require('./tokenizer');
var Generator = require('./generator');

var CompilationFailed = function(errors, tooManyErrors) {
	this.errors = errors;
	this.tooManyErrors = tooManyErrors;
};
CompilationFailed.prototype.toString = function(src) {
	var preparedErrors = (src == null ? this.errors : this.errors.map(function(v) {return v.toString(src);}));
    result = preparedErrors.join('\n');
	if (this.tooManyErrors) {
		result += '\nToo many errors, compilation stopped';
	}
	return result + '\n';
};

var compile = function(src, options) {
    options = options || {};

	var maxErrors = (options.maxErrors === undefined ? 20 : options.maxErrors);

    var tokenizerClass = options.tokenizer && options.tokenizer.tokenizerClass || Tokenizer;
    var generatorClass = options.generator && options.generator.generatorClass || Generator;

    var errors = [];

    var tokenizer = new tokenizerClass(src, options.tokenizer, errors);
    var generator = new generatorClass(options.generator, errors);

	var exceptionIfTooManyErrors = function() {
		if (maxErrors != null && errors.length >= maxErrors) {
			throw new CompilationFailed(errors, true);
		}
	};

    while(true) {
        var token = tokenizer.getNextToken();
		exceptionIfTooManyErrors();
        if (!token) {
            break;
        }
        generator.applyToken(token);
		exceptionIfTooManyErrors();
    }

	if (errors.length != 0) {
		throw new CompilationFailed(errors);
	}

	return {
		// someday we'll add here warnings... maybe
		result: generator.getResult()
	};
};

module.exports = {
	CompilationFailed: CompilationFailed,
	compile: compile
};
