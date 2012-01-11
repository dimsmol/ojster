var Tokenizer = require('./tokenizer');
var Generator = require('./generators/node/generator');

var options = {
	tabSize: 4,
	maxErrors: 20,

	tokenizer: {
		tokenizerClass: Tokenizer
	},

	generator: {
		generatorClass: Generator
	}
};


module.exports = options;
