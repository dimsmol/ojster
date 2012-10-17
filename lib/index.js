"use strict";
var compile = require('./compiler').compile;
var compilePath = require('./fs').compile;
var generators = require('./compiler/generators');
var Template = require('./template');
var send = require('./rendering/send');
var extension = require('./extension');


module.exports = {
	compile: compile,
	compilePath: compilePath,
	generators: generators,
	Template: Template,
	send: send,
	extension: extension,
	registerExtension: extension.boundRegister,
	withExtension: extension.boundWithExtension
};
