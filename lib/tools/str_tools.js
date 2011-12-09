function padLeft(str, len, padChar) {
	if (str == null) {
		return null;
	}

	if (padChar == null) {
		padChar = ' ';
	}

	str = str + '';
	if (str.length >= len) {
		return str;
	}

	return repeat(padChar, len - str.length) + str;
}

function repeat(str, count) {
	if (str == null) {
		return null;
	}
	if (count == 0) {
		return '';
	}
	if (count == 1) {
		return str;
	}
	return (new Array(count + 1)).join(str);
}

function indexOfAny(str, subStrs, fromPos) {
	var result = -1;
	for (var i=0, l=subStrs.length; i < l; i++) {
		var index = str.indexOf(subStrs[i], fromPos);
		if (index != -1 && (result == -1 || index < result)) {
			result = index;
		}
	}
	return result;
}

function lastIndexOfAny(str, subStrs, fromPos) {
	var result = -1;
	for (var i=0, l=subStrs.length; i < l; i++) {
		var index = str.lastIndexOf(subStrs[i], fromPos);
		if (index > result) {
			result = index;
		}
	}
	return result;
}

function capFirst(str) {
	if (!str) {
		return str;
	}
	return str[0].toUpperCase() + str.substring(1);
}

function underscoreToCamelCase(name) {
	var items = name.split('_');
	if (items.length == 1) {
		return name;
	}
	for(var i=0, l=items.length; i < l; i++) {
		items[i] = capFirst(items[i]);
	}
	return items.join('');
}

function camelCaseToUnderscore(name) {
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
}

function jsStringEscape(str) {
	return str.replace(/\\/g, '\\\\')
			  .replace(/\'/g, "\\'")
			  .replace(/\r/g, '\\r')
			  .replace(/\n/g, '\\n')
			  .replace(/\t/g, '\\t');
};

function errorToStr(err) {
	if (err instanceof Error) {
		return err.stack;
	}

	return err+'';
}

module.exports = {
	padLeft: padLeft,
	repeat: repeat,
	indexOfAny: indexOfAny,
	lastIndexOfAny: lastIndexOfAny,
	capFirst: capFirst,
	underscoreToCamelCase: underscoreToCamelCase,
	camelCaseToUnderscore: camelCaseToUnderscore,
	jsStringEscape: jsStringEscape,
	errorToStr: errorToStr
};
