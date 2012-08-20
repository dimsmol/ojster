"use strict";
var Person = require('./compiled/node/person');
var fs = require('fs');
var path = require('path');


var ctx = {
	pageSettings: {a: 'a', b: 'b'}
};
var data = {
	css: 'xyz',
	id: 12345,
	firstName: 'Sam',
	lastName: 'Smith',
	score: 8,
	skills: [
		{name: 'a', value: 15},
		{name: 'b', value: 16}
	]
};

var template = new Person(data, ctx);
template.setBaseCssName('basecss');
var rendered = template.render();

fs.writeFileSync(path.join(__dirname, 'rendered', 'person.html'), rendered);
