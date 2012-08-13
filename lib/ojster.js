var compiler = require('./compiler');

module.exports = {
	compile: compiler.compile,
	compilePath: require('./fs').compile,
	generators: require('./compiler/generators'),
	Template: require('./template'),
	send: require('./rendering/send')
};
