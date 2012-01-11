var isDict = function(obj) {
	return typeof obj === 'object';
};

var createExtendedClone = function(src, ext) {
	// TODO more correct implementation
	var result = {};
	var k;

	if (ext != null)
	{
		for(k in ext)
		{
			srcV = src[k];
			extV = ext[k];

			if (isDict(srcV) && isDict(extV))
			{
				result[k] = createExtendedClone(srcV, extV);
			}
			else
			{
				result[k] = extV;
			}
		}
	}

	for(k in src)
	{
		if (!(k in result))
		{
			result[k] = src[k];
		}
	}

	return result;
};

var extend = function(target, obj) {
	// TODO more correct implementation
	if (obj != null)
	{
		for(var k in obj)
		{
			targetV = target[k];
			v = obj[k];

			if (isDict(targetV) && isDict(v))
			{
				extend(targetV, v);
			}
			else
			{
				target[k] = v;
			}
		}
	}

	return target;
};

module.exports = {
	isDict: isDict,
	createExtendedClone: createExtendedClone,
	extend: extend
};
