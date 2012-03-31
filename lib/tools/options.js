var createUpdated = function(options, update) {
	return createExtendedClone(options, update);
};

// WARN actually creates clone
var cloneWithDefaults = function(options, defaultOptions) {
	return createExtendedClone(defaultOptions, options);
};

var isDict = function(obj) {
	return obj != null && obj.constructor === Object;
};

// WARN very naive implementation
var createExtendedClone = function(src, ext) {
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


module.exports = {
	createUpdated: createUpdated,
	cloneWithDefaults: cloneWithDefaults
};
