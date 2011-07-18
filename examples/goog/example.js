goog.provide('ojster.example');

goog.require('ojster');
goog.require('ojster.example.templates.Base');

ojster.example.renderTemplate = function() {
	var Base = ojster.example.templates.Base;

	var ctx = {}, data = {};

	var rendered = new Base().render();

	var element = ojster.createElement(new Base(data, ctx));
	var fragment = ojster.createFragment(new Base(data));
	ojster.fillElement(element, new Base());
};
