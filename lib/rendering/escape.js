"use strict";
var escape = function(str) {
	var result = null;

	if (str != null) {
		result = (''+str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	return result;
};


module.exports = escape;
