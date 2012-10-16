"use strict";
var fs = require('fs');
var compiler = require('./compiler');

// INFO got from https://github.com/joyent/node/blob/master/lib/module.js
function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

var register = function (opt_options) {
	var options = opt_options || {};
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

		module._compile(stripBOM(compilationInfo.result), filename);
	};
};

module.exports = {
	register: register
};
