var baseOptions = require('../core/options');
var optionTools = require('../../../tools/options');

var options = optionTools.createUpdated(baseOptions, {
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
