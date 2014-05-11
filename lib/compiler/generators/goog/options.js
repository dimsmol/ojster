"use strict";
var ops = require('ops');
var baseOptions = require('../core/options');


var options = ops.cloneWithDefaults({
	useScope: false,
	useOldBaseCall: false,

	inherits: {
		alias: 'goog.inherits',
		fullName: 'goog.inherits'
	},

	writerClass: 'ojster.StringWriter',

	css: {
		getCssNameFuncStr: 'goog.getCssName',
		getCssNameFuncIsGlobal: true,
		baseCssNamePropUseTypeHint: true
	}
}, baseOptions);


module.exports = options;
