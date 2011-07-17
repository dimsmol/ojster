// Content below is autogenerated by ojster template engine
// usually there is no reason to edit it manually

goog.provide('ojster.example.templates.Person');

goog.require('ojster.example.page');
goog.require('ojster.example.templates.Base');
goog.require('ojster.example.templates.Hobbies');

ojster.example.templates.Person = function() {
	ojster.example.templates.Base.apply(this, arguments);
};
goog.inherits(ojster.example.templates.Person, ojster.example.templates.Base);


// usually code is enclosed into such a "tag"
ojster.example.templates.Person.twistScore = function (value) {
    return value * 5 / 3;
};


// but beyond blocks code can be inserted just plain
ojster.example.templates.Person.prototype.calculateScore = function(person) {
    return ojster.example.templates.Person.twistScore(person.score);
};

ojster.example.templates.Person.prototype.renderBlockMain = function() { // @20:1
	var self = this;
	var d = this.data, vars = this.vars;

    // TODO bad example, need 'init' function instead
    vars.score = this.calculateScore(d); // vars is right place for template-level variables
    ojster.example.templates.Base.prototype.renderBlockMain();

	return this;
}; // @26:1

// code could be here too, almost anywhere

ojster.example.templates.Person.prototype.renderBlockTitle = function() { // @30:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'Person #',
		self.escape(d.id) // @30:29
	);
	return this;
}; // @30:40

ojster.example.templates.Person.prototype.renderBlockScript = function() { // @32:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<', // @33:1
		'script> // seems like jslint tries to check code within \'script\' tags even if it\'s part of string constant, so avoid it\n(function() {\n    // TODO good for node, but bad for goog\n    var settings = ',
		JSON.stringify(ctx.pageSettings), // @36:20
		'; // inserting JSON unescaped\n    ojster.example.page.initPage(settings);\n})();</script>'
	);
	return this;
}; // @40:1

ojster.example.templates.Person.prototype.renderBlockContent = function() { // @42:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<div>Hello, '
	); // @43:17
	self.renderBlockFullName();
	self.writer.write(
		'!</div><div>Your score: ',
		self.escape(vars.score), // @44:22
		'</div><div>Your skills, '
	); // @45:23

	this.renderBlockFullName();

	self.writer.write(
		':</div>'
	); // @46:5

	this.renderBlockSkills();


	if (d.events && d.events.length) {

	self.writer.write(
		'<div>Your events:</div>'
	); // @49:9

	d.events.forEach(function(event) {

	self.renderBlockBeforeEvent();
	self.writer.write(
		'<div>',
		self.escape(event.Name), // @51:18
		'</div>'
	); // @52:13

	self.renderBlockAfterEvent(); // 'self' alias of 'this' can be used when needed


	});


	}


	// checking whitespaces compaction:

	self.writer.write(
		'-', // @57:5
		' ',
		'-' // @57:14
	); // @59:5

    this.writer.write('<div>this.writer.write() can be ', 'used at any moment', '</div>');
    this.write('<div>this.write() is the same, but a little bit less effective', ' (designed primary to use in chains, see below)</div>');

    var Hobbies = ojster.example.templates.Hobbies; // just an alias

    // how to render other template in place:
    new Hobbies(this.ctx, d, this).render(); // NOTE third argument makes redirects rendering to our template writer
    

	// possible but less effective:

	self.writer.write(
		new Hobbies(this.ctx, d).render.done() // @69:5
	); // @71:5

    var Snippets = ojster.example.templates.Snippets;

    // how to render block of other template in place:
    new Snippets(this.ctx, d.email, this).renderBlockEmail();

    // rendering chains can be used:
    new Snippets(this.ctx, d.about, this).renderBlockShort().write(' -> ').renderBlockHidden();
    

	// possible but less effective:

	self.writer.write(
		new Snippets(this.ctx, d.email).renderBlockEmail().done(), // @81:5
		ojster.template(Hobbies, this.ctx, d.about).renderBlockShort().write(' -> ').renderBlockHidden().done() // @82:5
	);
	return this;
}; // @83:1

ojster.example.templates.Person.prototype.renderBlockFullName = function() { // @43:17
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		self.escape(d.firstName), // @43:40
		' ',
		self.escape(d.lastName) // @43:59
	);
	return this;
}; // @43:76

ojster.example.templates.Person.prototype.renderBlockBeforeEvent = function() { // @50:13
	var self = this;
	var d = this.data, vars = this.vars;
	return this;
};

ojster.example.templates.Person.prototype.renderBlockSkills = function() { // @85:1
	var self = this;
	var d = this.data, vars = this.vars;

    if (vars.areSkillsRendered) {
        return this; // must return 'this' object if do return manually
    }

    vars.areSkillsRendered = true;

    if (!d.skills) {
        return this.renderBlockNoSkills();
    }

    for (var i=0, l=d.skills.length; i < l; i++) {
        var skill = skills[i];

	self.writer.write(
		'<div>',
		self.escape(skill.name), // @100:14
		': ',
		self.escape(skill.value), // @100:33
		'</div>'
	); // @101:1

    }

	return this;
}; // @104:1

ojster.example.templates.Person.prototype.renderBlockNoSkills = function() { // @106:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'You have no skills :('
	);
	return this;
}; // @108:1

ojster.example.templates.Person.prototype.renderBlockAfterEvent = function() { // @110:1
	var self = this;
	var d = this.data, vars = this.vars;
	return this;
};

