var baseOptions = require('../core/options');
var optionTools = require('../../../tools/options');

var options = optionTools.createUpdated(baseOptions, {
	useScope: false,

	inherits: {
		alias: 'goog.inherits',
		fullName: 'goog.inherits'
	},

	css: {
		getCssNameFuncStr: 'goog.getCssName',
		getCssNameFuncIsGlobal: true
	}
});


module.exports = options;
