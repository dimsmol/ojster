var baseOptions = require('../../generator/options');
var createExtendedClone = require('../../../tools/object_tools').createExtendedClone;

var options = createExtendedClone(baseOptions, {
	useScope: false,

	inherits: {
		alias: 'goog.inherits',
		fullName: 'goog.inherits'
	},

	css: {
		useGoogGetCssName: true,
		googGetCssNameFuncStr: 'goog.getCssName'
	}
});


module.exports = options;
