"use strict";
var fs = require('fs');
var compiler = require('./compiler');


var Extension = function () {
};

// INFO got from https://github.com/joyent/node/blob/master/lib/module.js
Extension.prototype.stripBOM = function (content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

Extension.prototype.withExtension = function (func, opt_options) {
	var old = require.extensions['.ojst'];
	this.register(opt_options);
	func();
	if (!old) {
		delete require.extensions['.ojst'];
	}
	else {
		require.extensions['.ojst'] = old;
	}
};

Extension.prototype.register = function (opt_options) {
	var options = opt_options || {};
	var self = this;
	require.extensions['.ojst'] = function(module, filename) {
		var content = fs.readFileSync(filename, 'utf8');
		var compilationInfo;

		try {
			compilationInfo = compiler.compile(content, options);
		}
		catch (exc) {
			var err = exc;
			if (err instanceof compiler.CompilationFailed) {
				err.setSrc(filename, content, options.tabSize);
			}
			else {
				err.message = filename + ': ' + err.message;
			}
			throw err;
		}

		module._compile(self.stripBOM(compilationInfo.result), filename);
	};
};

var extension = new Extension();
extension.Extension = Extension;

extension.boundWithExtension = function (func, opt_options) {
	extension.withExtension(func, opt_options);
};

extension.boundRegister = function (opt_options) {
	extension.register(opt_options);
};


module.exports = extension;
