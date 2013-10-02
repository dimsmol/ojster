// Content below is autogenerated by ojster template engine
// usually there is no reason to edit it manually
goog.provide('ojster.example.templates.Person');

goog.require('ojster.example.templates.Base');
goog.require('ojster.example.templates.Hobbies');

/* comment @4:1 */

goog.require('ojster.example.templates.Tools.SomeTool');
goog.require('ojster.example.templates.Tools.SomeOtherTool');

goog.scope(function () {
"use strict";

var Base = ojster.example.templates.Base;
var Hobbies = ojster.example.templates.Hobbies;
var SomeTool = ojster.example.templates.Tools.SomeTool;
var SomeOtherTool = ojster.example.templates.Tools.SomeOtherTool;

/**
 * @param {Object=} opt_data
 * @param {Object=} opt_ctx
 * @param {Object=} opt_writer
 * @constructor
 * @extends {Base}
 */
ojster.example.templates.Person = function (opt_data, opt_ctx, opt_writer) {
	goog.base(this, opt_data, opt_ctx, opt_writer);
};
var Person = ojster.example.templates.Person;
goog.inherits(Person, Base);

Person.prototype.init = function () { // @14:1
	var self = this;
	var d = this.data, vars = this.vars;
	goog.base(this, 'init');

	this.baseCssName = 'basecss';
	vars.score = this.calculateScore(d); // vars is right place for template-level variables
};


// here is assumed that template will be compiled with goog.scope enabled
// some of features used will provide non-working code if goog.scope is not enabled
// i.g. function definition outside of block and using aliases

// fully qualified names cannot be used here, because node does not understand them



// usually code is enclosed into such a "tag"
function twistScore(value) {
	return value * 5 / 3;
}


// but beyond blocks code can be inserted just plain
Person.prototype.calculateScore = function(person) {
	return twistScore(person.score);
};

// code could be here too, almost anywhere

Person.prototype.renderBlockTitle = function () { // @41:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'Person #',
		self.escape(d.id) // @41:29
	);
}; // @41:40

Person.prototype.renderBlockScript = function () { // @43:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<script>'
	); // @45:1

	// seems like jslint tries to check code within 'script' tags even if it's part of string constant, so avoid it

	self.writer.write(
		'(function() {\n\t// TODO good for node, but bad for goog\n\tvar settings = ',
		JSON.stringify(this.ctx.pageSettings), // @48:20
		'; // inserting JSON unescaped\n\tojster.example.page.initPage(settings);\n})();</script>'
	);
}; // @52:1

Person.prototype.renderBlockContent = function () { // @54:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<span class="',
		self.baseCssName, // @55:18
		'">base css</span><br /><span class="',
		goog.getCssName('abc'), // @56:18
		'">\'abc\'</span><br /><span class="',
		goog.getCssName(d.css, 'abc'), // @57:18
		'">d.css with \'abc\'</span><br /><span class="',
		goog.getCssName(/** @type {string} */ (self.baseCssName), 'abc'), // @58:18
		'">base with \'abc\'</span><br /><br /><span>A</span><span>B</span>',
		' ',
		'<span>C</span><br />'
	); // @63:5
	self.renderBlockEcho('Hey there!'); // @63:5
	self.writer.write(
		'<div>Hello, '
	); // @64:17
	self.renderBlockFullName(); // @64:17
	self.writer.write(
		'!</div><div>Your score: ',
		self.escape(vars.score), // @65:22
		'</div>'
	); // @65:45

	/* comment @65:45 */

	self.writer.write(
		'<div>Your skills:</div>'
	); // @69:5
	self.renderBlockSkills(); // @69:5

	if (d.events && d.events.length) {

	self.writer.write(
		'<div>Your events:</div>'
	); // @72:9

	d.events.forEach(function(event) {

	self.renderBlockBeforeEvent(); // @73:13
	self.writer.write(
		'<div>',
		self.escape(event.Name), // @74:18
		'</div>'
	); // @75:13
	self.renderBlockAfterEvent(); // @75:13

	});


	}


	// checking whitespaces compaction:

	self.writer.write(
		'<div>-', // @80:5
		' ',
		'-</div>' // @80:19
	); // @82:5
	new Hobbies(d, this.ctx).renderTo(self); // @82:5
	new SomeTool(d).setup(function () { var d = this.data, vars = this.vars;
		this.baseCssName = 'basecss1';
	}).renderTo(self); // @84:5
	new SomeOtherTool({
			parentData: d,
			someMoreData: 5
		}).renderTo(self); // @87:5
}; // @91:1

Person.prototype.renderBlockFullName = function () { // @64:17
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		self.escape(d.firstName), // @64:40
		' ',
		self.escape(d.lastName) // @64:59
	);
}; // @64:76

Person.prototype.renderBlockBeforeEvent = function () { // @73:13
	var self = this;
	var d = this.data, vars = this.vars;
};

Person.prototype.renderBlockEcho = function (msg) { // @93:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		self.escape(msg) // @94:5
	);
}; // @95:1

Person.prototype.renderBlockSkills = function () { // @97:1
	var self = this;
	var d = this.data, vars = this.vars;

	if (vars.areSkillsRendered) {
		return;
	}

	vars.areSkillsRendered = true;

	if (!d.skills) {
		this.renderBlockNoSkills();
		return;
	}

	for (var i=0, l=d.skills.length; i < l; i++) {
		var skill = d.skills[i];

	self.renderBlockParametrized(i, l, skill); // @113:9
	self.writer.write(
		'<div>',
		self.escape(skill.name), // @116:14
		': ',
		self.escape(skill.value), // @116:33
		'</div>'
	); // @117:1

	}

}; // @120:1

Person.prototype.renderBlockParametrized = function (i, l, skill) { // @113:9
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<div>',
		self.escape(i + 1), // @114:18
		' of ',
		self.escape(l), // @114:34
		' is &quot;',
		self.escape(skill.name), // @114:52
		'&quot;</div>'
	);
}; // @115:9

Person.prototype.renderBlockNoSkills = function () { // @122:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<div>You have no skills :(</div>'
	);
}; // @124:1

Person.prototype.renderBlockAfterEvent = function () { // @126:1
	var self = this;
	var d = this.data, vars = this.vars;
};

Person.prototype.testFunc = function () { // @128:1
	var self = this;
	var d = this.data, vars = this.vars;

	/* comment @129:5 */
	return 'testValue';
}; // @133:1

Person.prototype.renderBlockTest1 = function () { // @135:1
	var self = this;
	var d = this.data, vars = this.vars;

	// base call example

	goog.base(this, 'renderBlockTest1'); // @137:5
}; // @138:1

Person.prototype.renderBlockTest2 = function (a) { // @140:1
	var self = this;
	var d = this.data, vars = this.vars;

	// parametrized base call example

	goog.base(this, 'renderBlockTest2', a, 1); // @142:5
}; // @143:1

}); // goog.scope
