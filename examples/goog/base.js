// Content below is autogenerated by ojster template engine
// usually there is no reason to edit it manually

goog.provide('ojster.example.Base');

goog.require('ojster.Template');

ojster.example.Base = function() {
	ojster.Template.apply(this, arguments);
};
goog.inherits(ojster.example.Base, ojster.Template);

ojster.example.Base.prototype.renderBlockMain = function() { // @6:1
	var self = this;
	var d = this.data, vars = this.vars;
	self.writer.write(
		'<!DOCTYPE HTML><html><head>'
	); // @10:1
	self.renderBlockMeta();
	self.writer.write(
		'<title>'
	); // @11:8
	self.renderBlockTitle();
	self.writer.write(
		'</title>'
	); // @12:1
	self.renderBlockCss();
	self.renderBlockScript();
	self.writer.write(
		'</head><body>'
	); // @15:7
	self.renderBlockContent();
	self.writer.write(
		'</body></html>'
	);
	return this;
}; // @17:1

ojster.example.Base.prototype.renderBlockMeta = function() { // @10:1
	var self = this;
	var d = this.data, vars = this.vars;
	return this;
};

ojster.example.Base.prototype.renderBlockTitle = function() { // @11:8
	var self = this;
	var d = this.data, vars = this.vars;
	return this;
};

ojster.example.Base.prototype.renderBlockCss = function() { // @12:1
	var self = this;
	var d = this.data, vars = this.vars;
	return this;
};

ojster.example.Base.prototype.renderBlockScript = function() { // @13:1
	var self = this;
	var d = this.data, vars = this.vars;
	return this;
};

ojster.example.Base.prototype.renderBlockContent = function() { // @15:7
	var self = this;
	var d = this.data, vars = this.vars;
	return this;
};

