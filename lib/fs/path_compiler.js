
var async = require('async');
var fs = require('fs');
var path = require('path');

var CompilationFailed = require('../compiler').CompilationFailed;
var fileCompiler = require('./file_compiler');
var fsTools = require('../tools/fs_tools');
var strTools = require('../tools/str_tools');

/*

TODO

- single file compilation support

- do not create dst dirs if no templates within
- make dot-files skipping an option (now skips all dot-started files and dirs)

*/

var PathCompilationFailed = function(fileCompilationFailures, tooManyFailures) {
	this.fileCompilationFailures = fileCompilationFailures;
	this.tooManyFailures = tooManyFailures;
};
PathCompilationFailed.prototype.toString = function() {
	var resultItems = [];
	for (var i=0, l=this.fileCompilationFailures.length; i < l; i++) {
		var item = this.fileCompilationFailures[i];
		resultItems.push(['File "', item.path, '":\n', item.failure].join(''));
	}
	if (this.tooManyFailures) {
		resultItems.push('Too many failures, path compilation stopped\n');
	}
    return resultItems.join('\n\n');
};

var compile = function(srcPath, dstPath, options, callback) {
	var maxFileCompilationFailures = (options == null || options.maxFileCompilationFailures === undefined ? 5 : options.maxFileCompilationFailures);
	var silently = (options != null && options.silently);

	var fileCompilationFailures = [];
	var filesTotal = 0;

	var needStop = false;
	var stopError = null;
	var handleError = function(err) {
		needStop = true;
		stopError = err;
	};
	var compilationAborted = false;

	var q = async.queue(function(task, done) {
		if (needStop) {
			done();
			return;
		}

		var currentPath;

		if (task.processPath) {
			currentPath = path.join(srcPath, task.relativePath);
			fs.readdir(currentPath, function(err, items) {
				if (err) {
					handleError(err);
				} else {
					// need to stat each item to decide what to do with it
			        for (var i=0, l=items.length; i < l; i++) {
						if (items[i][0] != '.') { // skipping dot-files
							q.push({
								getStat: true,
								relativePath: path.join(task.relativePath, items[i]),
								previousRelativePath: task.relativePath
							});
						}
			        }
				}
				done();
			});
		} else if (task.getStat) {
			currentPath = path.join(srcPath, task.relativePath);
			fs.lstat(currentPath, function(err, stat) {
				var delayedAction = false;
				if (err) {
					handleError(err);
					done();
				} else {
					if (stat.isDirectory()) {
						// one more path to process
						if (dstPath != null) {
							// ensure dst dir exists
							delayedAction = true;
							fsTools.mkpath(path.join(dstPath, task.relativePath), function(err) {
								if (err) {
									handleError(err);
								} else {
									q.push({
										processPath: true,
										relativePath: task.relativePath
									});
								}
								done();
							});
						} else {
							q.push({
								processPath: true,
								relativePath: task.relativePath
							});
						}
		            } else if (path.extname(currentPath) == '.ojst') {
						// it's a template, compile it
						var dstFilePath = null;
						if (dstPath != null) {
							if (task.relativePath == null) {
								if(path.exists(dstPath) && fs.statSync().isDirectory()) { // Assuming it's a directory
									dstFilePath = path.join(dstPath, path.basename(currentName, '.ojst') + '.js');
								}
								else { // It's a file
									dstFilePath = currentPath;
								}								
							} else {
								dstFilePath = fileCompiler.getDefaultDstPath(currentPath, path.join(dstPath, task.previousRelativePath));
							}
						}
		                q.push({
							compile: true,
							filePath: currentPath,
							dstFilePath: dstFilePath
						});
		            }
				}
				if (!delayedAction) {
					done();
				}
			});
		} else if (task.compile) {
			filesTotal += 1;
		    fileCompiler.compile(task.filePath, task.dstFilePath, options, function(err) {
				if (err != null) {
					if (err instanceof CompilationFailed) {
						fileCompilationFailures.push({
							path: task.filePath,
							failure: err
						});
						if (fileCompilationFailures.length >= maxFileCompilationFailures) {
							if (!silently) {
								console.error('Too many failures, path compilation aborted');
							}
							needStop = true;
							compilationAborted = true;
						}
					} else {
						handleError(err);
					}
				}
				done();
		    });
		}
	}, 5);
	q.drain = function() {
		if (!silently) {
			if (stopError != null) {
				console.error(strTools.errorToStr(stopError));
				console.log('Compilation failed');
			} else {
				if (fileCompilationFailures.length == 0) {
					items = ['Done, ', filesTotal, ' files total'];
				} else {
					items = [filesTotal, ' files total', ', ', fileCompilationFailures.length, ' failed'];
				}
				console.log(items.join(''));
			}
		}
		if (stopError == null && fileCompilationFailures.length > 0) {
			stopError = new PathCompilationFailed(fileCompilationFailures, compilationAborted);
		}
		if (callback) {
			if (stopError == null) {
				callback(null, {
					filesTotal: filesTotal
					// here can be any other statistics
				});
			} else {
				callback(stopError);
			}
		}
	};

	q.push({
		getStat: true
	});
};

function handleError(err, callback) {
    if (err) {
        if (callback) {
            callback(err);
        }
        return true;
    }
    return false;
}

module.exports = {
	PathCompilationFailed: PathCompilationFailed,
	compile: compile
};
