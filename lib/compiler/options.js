var Tokenizer = require('./tokenizer');
var NodeGenerator = require('./generators/node/generator');

var options = {
	tabSize: 4,
	maxErrors: 20,

	tokenizer: {
		tokenizerClass: Tokenizer
	},

	generator: {
		generatorClass: NodeGenerator
	}
};


module.exports = options;
