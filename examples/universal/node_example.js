var Person = require('./compiled/node/person');
var fs = require('fs');
var path = require('path');

var ctx = {
	pageSettings: {a: 'a', b: 'b'}
};
var data = {
	firstName: 'Sam',
	lastName: 'Smith',
	score: 8,
	skills: [
		{name: 'a', value: 15},
		{name: 'b', value: 16}
	]
};

var rendered = new Person(data, ctx).render();

fs.writeFileSync(path.join(__dirname, 'rendered', 'person.html'), rendered);
