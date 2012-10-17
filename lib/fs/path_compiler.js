"use strict";
var inherits = require('util').inherits;
var async = require('async');
var fs = require('fs');
var path = require('path');
var ErrorBase = require('nerr').ErrorBase;
var CompilationFailed = require('../compiler').CompilationFailed;
var fileCompiler = require('./file_compiler');
var fsTools = require('../tools/fs');
var strTools = require('../tools/str');

/*

TODO

- do not create dst dirs if no templates within
- make dot-files skipping an option (now skips all dot-started files and dirs)

*/

var PathCompilationFailed = function(fileCompilationFailures, tooManyFailures) {
	ErrorBase.call(this);

	this.fileCompilationFailures = fileCompilationFailures;
	this.tooManyFailures = tooManyFailures;
};
inherits(PathCompilationFailed, ErrorBase);

PathCompilationFailed.prototype.name = 'PathCompilationFailed';

PathCompilationFailed.prototype.getMessage = function() {
	var resultItems = [];

	for (var i=0, l=this.fileCompilationFailures.length; i < l; i++) {
		var item = this.fileCompilationFailures[i];
		resultItems.push([
			'File "', item.path, '":\n', item.failure
		].join(''));
	}

	if (this.tooManyFailures) {
		resultItems.push('Too many failures, path compilation stopped\n');
	}

	return resultItems.join('\n\n');
};


var compile = function(srcPath, dstPath, options, callback) {
	var maxFileCompilationFailures = (options == null || options.maxFileCompilationFailures === undefined ? 5 : options.maxFileCompilationFailures);
	var silent = (options != null && options.silent);

	var fileCompilationFailures = [];
	var filesTotal = 0;

	var needStop = false;
	var stopError = null;
	var handleError = function(filePath, err) {
		if (!silent) {
			console.error(['File "', filePath, '" compilation failed:\n', err.stack].join(''));
		}
		needStop = true;
		stopError = err;
	};
	var compilationAborted = false;

	var compileFile = function(filePath, dstFilePath, callback) {
		filesTotal += 1;
		fileCompiler.compile(filePath, dstFilePath, options, function(err) {
			if (err != null) {
				if (err instanceof CompilationFailed) {
					fileCompilationFailures.push({
						path: filePath,
						failure: err
					});
					if (fileCompilationFailures.length >= maxFileCompilationFailures) {
						if (!silent) {
							console.error('Too many failures, path compilation aborted');
						}
						needStop = true;
						compilationAborted = true;
					}
				}
				else {
					handleError(filePath, err);
				}
			}
			callback();
		});
	};

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
					handleError(currentPath, err);
				}
				else {
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
		}
		else if (task.getStat) {
			currentPath = path.join(srcPath, task.relativePath);
			fs.lstat(currentPath, function(err, stat) {
				if (err) {
					handleError(currentPath, err);
				}
				else {
					if (stat.isDirectory()) {
						// one more path to process
						if (dstPath != null) {
							// ensure dst dir exists
							var dirPath = path.join(dstPath, task.relativePath);
							fsTools.mkpath(dirPath, function(err) {
								if (err) {
									handleError(dirPath, err);
								}
								else {
									q.push({
										processPath: true,
										relativePath: task.relativePath
									});
								}
								done();
							});
							return;
						}
						else {
							q.push({
								processPath: true,
								relativePath: task.relativePath
							});
						}
					}
					else if (path.extname(currentPath) == '.ojst') {
						// it's a template, compile it
						var dstFilePath = null;
						var createDstPath = false;
						if (dstPath != null) {
							if (task.relativePath == null) {
								// single file compilation
								// dst can be a directory or a file path this case
								// and target dir can be not present
								createDstPath = true;
								if (fsTools.pathIsDir(dstPath)) {
									// it's dir for sure
									dstFilePath = fileCompiler.getDefaultDstPath(currentPath, dstPath, options.ext);
								}
								else {
									fs.lstat(dstPath, function(err, stats) {
										dstFilePath = dstPath; // assuming file, will correct later if need

										if (err && err.code != 'ENOENT') {
											handleError(dstPath, err);
										}
										else {
											if (err == null && stats.isDirectory()) {
												// it's a dir!
												dstFilePath = fileCompiler.getDefaultDstPath(currentPath, dstPath, options.ext);
												createDstPath = false; // dir exists for sure
											}

											q.push({
												compile: true,
												createDstPath: createDstPath,
												filePath: currentPath,
												dstFilePath: dstFilePath
											});
										}
										done();
									});
									return;
								}
							}
							else {
								dstFilePath = fileCompiler.getDefaultDstPath(currentPath, path.join(dstPath, task.previousRelativePath), options.ext);
							}
						}
						q.push({
							compile: true,
							createDstPath: createDstPath,
							filePath: currentPath,
							dstFilePath: dstFilePath
						});
					}
				}
				done();
			});
		}
		else if (task.compile) {
			if (task.createDstPath) {
				var dirPath = path.dirname(task.dstFilePath);
				fsTools.mkpath(dirPath, function(err) {
					if (err) {
						handleError(dirPath, err);
					}
					else {
						compileFile(task.filePath, task.dstFilePath, done);
					}
				});
			}
			else {
				compileFile(task.filePath, task.dstFilePath, done);
			}
		}
	}, 5);
	q.drain = function() {
		if (!silent) {
			if (stopError != null) {
				console.log('Compilation failed');
			}
			else {
				var items;

				if (fileCompilationFailures.length === 0) {
					items = ['Done, ', filesTotal, ' files total'];
				}
				else {
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
			}
			else {
				callback(stopError);
			}
		}
	};

	q.push({
		getStat: true
	});
};


module.exports = {
	PathCompilationFailed: PathCompilationFailed,
	compile: compile
};
