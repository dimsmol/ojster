
var async = require('async');
var constants = require('constants');
var fs = require('fs');
var path = require('path');

module.exports.mkpath = function(dirPath, mode, callback) {
    // TODO resolve ~

	if (typeof mode === 'function') {
        callback = mode;
        mode = null;
    }

    if (mode == null) {
        mode = 0x1ff ^ process.umask();
    }

    var pathsToCreate = [];
	var currentDirPath = path.resolve(dirPath);

	async.series([
		function collectPaths(next) {
			fs.lstat(currentDirPath, function(err, stats) {
	            if (err) {
	                if (err.errno === constants.ENOENT) {
	                    pathsToCreate.push(currentDirPath);
						currentDirPath = path.dirname(currentDirPath);
	                    collectPaths(next);
	                } else {
	                    next(err);
	                }
	            } else {
					if (stats.isDirectory()) {
						next(); // collected
		            } else {
	                    next(new Error('Unable to create directory at ' + currentDirName));
		            }
				}
			});
		},
		function createPaths(next) {
	        var dirPath = pathsToCreate.pop();
	        if (dirPath) {
	            fs.mkdir(dirPath, mode, function(err) {
	                if (!err) {
	                    createPaths(next);
	                } else {
	                    next(err);
	                }
	            });
	        } else {
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