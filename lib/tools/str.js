"use strict";
var charCount = function (str, ch) {
	return str.split(ch).length - 1;
};

var repeat = function (str, count) {
	var result = null;
	if (str != null) {
		if (count === 0) {
			result = '';
		}
		else if (count == 1) {
			result = str;
		}
		else {
			result = (new Array(count + 1)).join(str);
		}
	}
	return result;
};

var padLeft = function (str, len, padChar) {
	var result = null;
	if (str != null) {
		if (padChar == null) {
			padChar = ' ';
		}

		str = '' + str;
		if (str.length >= len) {
			result = str;
		}
		else {
			result = repeat(padChar, len - str.length) + str;
		}
	}
	return result;
};

var indexOfAny = function (str, subStrs, fromPos) {
	var result = -1;

	for (var i=0, l=subStrs.length; i < l; i++) {
		var index = str.indexOf(subStrs[i], fromPos);
		if (index != -1 && (result == -1 || index < result)) {
			result = index;
		}
	}

	return result;
};

var lastIndexOfAny = function (str, subStrs, fromPos) {
	var result = -1;

	for (var i=0, l=subStrs.length; i < l; i++) {
		var index = str.lastIndexOf(subStrs[i], fromPos);
		if (index > result) {
			result = index;
		}
	}

	return result;
};

var capFirst = function (str) {
	if (!str) {
		return str;
	}

	return str[0].toUpperCase() + str.substring(1);
};

var underscoreToCamelCase = function (name) {
	var items = name.split('_');

	if (items.length == 1) {
		return name;
	}

	for(var i=0, l=items.length; i < l; i++) {
		items[i] = capFirst(items[i]);
	}

	return items.join('');
};

var camelCaseToUnderscore = function (name) {
	var items = [];
	var i, l, last = 0;

	for(i=0, l=name.length; i<l; i++) {
		if (i > 0 && name[i].toUpperCase() == name[i]) {
			items.push(name.substring(last, i));
			last = i;
		}
	}

	items.push(name.substring(last));

	if (items.length == 1) {
		return name.toLowerCase();
	}

	for(i=0, l=items.length; i < l; i++) {
		items[i] = items[i].toLowerCase();
	}

	return items.join('');
};

var jsStringEscape = function (str) {
	return str
		.replace(/\\/g, '\\\\')
		.replace(/\'/g, "\\'")
		.replace(/\r/g, '\\r')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t');
};


module.exports = {
	charCount: charCount,
	padLeft: padLeft,
	repeat: repeat,
	indexOfAny: indexOfAny,
	lastIndexOfAny: lastIndexOfAny,
	capFirst: capFirst,
	underscoreToCamelCase: underscoreToCamelCase,
	camelCaseToUnderscore: camelCaseToUnderscore,
	jsStringEscape: jsStringEscape
};
