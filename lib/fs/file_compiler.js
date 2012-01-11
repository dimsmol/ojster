var async = require('async');
var fs = require('fs');
var path = require('path');

var compiler = require('../compiler');


var getDefaultDstPath = function(srcPath, dstDir) {
	if (dstDir == null)
	{
		dstDir = path.dirname(srcPath);
	}
	return path.join(dstDir, path.basename(srcPath, '.ojst') + '.js');
};

var compile = function(srcPath, dstPath, options, callback) {
	options = options || {};
	options.tabSize = options.tabSize === undefined ? 4 : options.tabSize;

	if (dstPath == null)
	{
		dstPath = getDefaultDstPath(srcPath);
	}

	async.waterfall([
		// read and compile
		function(next) {
			fs.readFile(srcPath, 'utf8', function (err, src) {
				if (err)
				{
					next(err);
				}
				else
				{
					var compilationInfo;
					try
					{
						compilationInfo = compiler.compile(src, options);
					}
					catch(exc)
					{
						if (!options.silently && exc instanceof compiler.CompilationFailed)
						{
							console.error(['Template "', srcPath, '" compilation failed:\n', exc.toString(src, options.tabSize)].join(''));
						}

						next(exc);
						return;
					}

					next(null, dstPath, compilationInfo.result);
				}
			});
		},
		// write
		fs.writeFile
	],
		// finish
		function(err) {
			if (callback)
			{
				callback(err);
			}
		}
	);
};

module.exports = {
	getDefaultDstPath: getDefaultDstPath,
	compile: compile
};
