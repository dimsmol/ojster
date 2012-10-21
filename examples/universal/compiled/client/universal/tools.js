// Content below is autogenerated by ojster template engine
// usually there is no reason to edit it manually
(function (root, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['../../../../lib'], factory);
	} else {
		// Browser globals
		root.ojster = factory(root.ojster);
	}
}(this, function (ojster) {
"use strict";
 // normally here will be just 'ojster'

var SomeTool = function(opt_data, opt_ctx, opt_writer) {
	ojster.Template.call(this, opt_data, opt_ctx, opt_writer);
};
inherits(SomeTool, ojster.Template);
SomeTool.prototype.renderBlockMain = function() { // @5:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<div>Some tool</div>'
	);
}; // @7:1

var SomeOtherTool = function(opt_data, opt_ctx, opt_writer) {
	ojster.Template.call(this, opt_data, opt_ctx, opt_writer);
};
inherits(SomeOtherTool, ojster.Template);
SomeOtherTool.prototype.renderBlockMain = function() { // @11:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<div>Other tool</div>'
	);
}; // @13:1

return = {
	SomeTool: SomeTool,
	SomeOtherTool: SomeOtherTool
};

}));