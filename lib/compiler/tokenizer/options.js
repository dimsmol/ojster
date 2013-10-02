"use strict";
var options = {
	tabSize: 4,

	marks: {
		instruction: {
			start: '<%',
			end: '%>'
		},

		comment: {
			start: '/*',
			end: '*/'
		},

		command: ' @',

		expression: {
			unescaped: '-',
			escaped: '='
		}
	}
};


module.exports = options;
