(function (root, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Browser globals
		root.ojster = factory();
	}
}(this, function () {
"use strict";

var StringWriter = function() {
	this.buff = [];
};

StringWriter.prototype.write = function() {
	this.buff.push.apply(this.buff, arguments);
};

StringWriter.prototype.done = function() {
	return this.buff.join('');
};


var Template = function(opt_data, opt_ctx, opt_writer) {
	this.data = opt_data || null;
	this.ctx = opt_ctx || null;
	this.writer = opt_writer || null;
	this.vars = {};
	this.baseCssName = null;

	this.init();
};

Template.prototype.init = function() {
};

Template.prototype.setup = function(setupFunc) {
	setupFunc.call(this);
	return this;
};

Template.prototype.getBaseCssName = function(setupFunc) {
	return this.baseCssName;
};

Template.prototype.setBaseCssName = function(baseCssName) {
	this.baseCssName = baseCssName;
};

Template.prototype.escape = function(str) {
	return Template.escape(str);
};

Template.prototype.createWriter = function() {
	return new StringWriter();
};

Template.prototype.render = function() {
	// ensure we have a writer
	if (this.writer == null) {
		this.writer = this.createWriter();
	}

	// render
	this.renderBlockMain();
	return this.writer.done();
};

Template.prototype.renderTo = function(template) {
	this.writer = template.writer;
	this.renderBlockMain();
};

Template.prototype.renderBlockMain = function() {
	throw new Error('Not implemented');
};


// functions

var ampRe = /&/g;
var ltRe = /</g;
var gtRe = />/g;
var dqRe = /"/g;
var needEscRe = /[&<>"]/;

var escape = function(str, opt_isLikelyToContainHtmlChars) {
	if (str != null) {
		if (opt_isLikelyToContainHtmlChars) {
			str = (str+'')
				.replace(ampRe, '&amp;')
				.replace(ltRe, '&lt;')
				.replace(gtRe, '&gt;')
				.replace(dqRe, '&quot;');
		} else if (needEscRe.test(str)) {
			if (str.indexOf('&') != -1) {
				str = str.replace(ampRe, '&amp;');
			}
			if (str.indexOf('<') != -1) {
				str = str.replace(ltRe, '&lt;');
			}
			if (str.indexOf('>') != -1) {
				str = str.replace(gtRe, '&gt;');
			}
			if (str.indexOf('"') != -1) {
				str = str.replace(dqRe, '&quot;');
			}
		}
	}
	return str;
};

var fillElement = function(element, template) {
	element.innerHTML = template.render();
	return element;
};

var createElement = function(template) {
	var wrapper = document.createElement('div');
	wrapper.innerHTML = (template.constructor === String ? template : template.render());

	if (wrapper.childNodes.length == 1) {
		var firstChild = wrapper.firstChild;

		if (firstChild.nodeType == 1) { // Element
			return firstChild;
		}
	}

	return wrapper;
};

var createFragment = function(template, opt_skipIeWorkaround) {
	var htmlString = (template.constructor === String ? template : template.render());
	var tempDiv = document.createElement('div');
	if (!opt_skipIeWorkaround) {
		tempDiv.innerHTML = '<br>' + htmlString;
		tempDiv.removeChild(tempDiv.firstChild);
	} else {
		tempDiv.innerHTML = htmlString;
	}
	if (tempDiv.childNodes.length == 1) {
		return tempDiv.removeChild(tempDiv.firstChild);
	} else {
		var fragment = document.createDocumentFragment();
		while (tempDiv.firstChild) {
			fragment.appendChild(tempDiv.firstChild);
		}
		return fragment;
	}
};

return {
	StringWriter: StringWriter,
	Template: Template,
	escape: escape,
	fillElement: fillElement,
	createElement: createElement,
	createFragment: createFragment
};

}));
