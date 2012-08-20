"use strict";
var fileCompiler = require('./file_compiler');
var pathCompiler = require('./path_compiler');


module.exports = {
	fileCompiler: fileCompiler,
	pathCompiler: pathCompiler,
	compile: pathCompiler.compile
};
