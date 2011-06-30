
var compiler = require('./compiler');

module.exports = {
    compile: compiler.compile,
	compile_path: require('./fs').compile,
	generators: require('./compiler/generators')
};
