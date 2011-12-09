// Content below is autogenerated by ojster template engine
// usually there is no reason to edit it manually

goog.provide('ojster.example.templates.Base');

// goog-only templates do not need aliases
goog.require('ojster');
goog.require('ojster.example.templates.Tools.SomeTool');

/**
 * @param {Object=} opt_data
 * @param {Object=} opt_ctx
 * @param {Object=} opt_writer
 * @constructor
 * @extends {ojster.Template}
 */
ojster.example.templates.Base = function(opt_data, opt_ctx, opt_writer) {
	goog.base(this, opt_data, opt_ctx, opt_writer);
};
goog.inherits(ojster.example.templates.Base, ojster.Template);


// never define variables and functions outside of blocks because they will be global
// but you can use fully qualified name to store something

ojster.example.templates.Base.myValue = 5;
ojster.example.templates.Base.twistScore = function(value) {
	return value * 5 / 3;
};


ojster.example.templates.Base.prototype.renderBlockMain = function() { // @18:1
	var self = this;
	var d = this.data, vars = this.vars;

		// within blocks you can freely define variables and functions
		// they will be bound by generated method scope
		var tmp = ojster.Template.prototype;

		function f() {
			return 'f';
		}

		// you have no automatically defined aliases, but here you can use your own
		var Base = ojster.example.templates.Base;
		// they will be visible within block

	new ojster.example.templates.Tools.SomeTool(d).renderTo(self); // @33:5
}; // @34:1

