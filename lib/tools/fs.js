
var async = require('async');
var fs = require('fs');
var path = require('path');

function getPathSeparator() {
	var p = path.join('x', 'x');
	return p.substring(1, p.length - 1);
};
var pathSeparator = getPathSeparator();

module.exports.pathIsDir = function(path) {
	if (path == null)
	{
		return false;
	}

	return path.substr(path.length - pathSeparator.length) == pathSeparator;
};

module.exports.mkpath = function(dirPath, mode, callback) {
	if (typeof mode === 'function')
	{
		callback = mode;
		mode = null;
	}

	if (mode == null)
	{
		mode = 0x1ff ^ process.umask();
	}

	var pathsToCreate = [];
	var currentDirPath = path.resolve(dirPath);

	async.series([
		function collectPaths(next) {
			fs.lstat(currentDirPath, function(err, stats) {
				if (err)
				{
					if (err.code == 'ENOENT')
					{
						pathsToCreate.push(currentDirPath);
						currentDirPath = path.dirname(currentDirPath);
						collectPaths(next);
					}
					else
					{
						next(err);
					}
				}
				else
				{
					if (stats.isDirectory())
					{
						next(); // collected
					}
					else
					{
						next(new Error('Unable to create directory at ' + currentDirName));
					}
				}
			});
		},
		function createPaths(next) {
			var dirPath = pathsToCreate.pop();
			if (dirPath)
			{
				fs.mkdir(dirPath, mode, function(err) {
					if (!err)
					{
						createPaths(next);
					}
					else
					{
						next(err);
					}
				});
			}
			else
			{
				next();
			}
		}
	],
		// finish
		function(err) {
			if (callback) {
				callback(err);
			}
		}
	);
};
