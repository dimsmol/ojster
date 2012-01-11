goog.provide('ojster');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');


/**
 * @constructor
 */
ojster.StringWriter = function() {
	this.buff = [];
};

ojster.StringWriter.prototype.write = function() {
	this.buff.push.apply(this.buff, arguments);
};

/**
 * @return {string}
 */
ojster.StringWriter.prototype.done = function() {
	return this.buff.join('');
};

ojster.DefaultWriterClass = ojster.StringWriter;


/**
 * @param {Object=} opt_data
 * @param {Object=} opt_ctx
 * @param {Object=} opt_writer
 * @constructor
 */
ojster.Template = function(opt_data, opt_ctx, opt_writer) {
	/** @type {Object} */
	this.data = opt_data || null;
	/** @type {Object} */
	this.ctx = opt_ctx || null;
	/** @type {Object} */
	this.writer = opt_writer || null;
	/** @type {!Object} */
	this.vars = {};
	/** @type {?string} */
	this.baseCssName = null;

	this.init();
};

ojster.Template.prototype.init = function() {
};

/**
 * @param {function(ojster.Template)} props
 */
ojster.Template.prototype.setup = function(setupFunc) {
	setupFunc(this);
	return this;
};

/**
 * @return {?string}
 */
ojster.Template.prototype.getBaseCssName = function(setupFunc) {
	return this.baseCssName;
};

/**
 * @param {?string} baseCssName
 */
Template.prototype.setBaseCssName = function(baseCssName) {
	this.baseCssName = baseCssName;
};

/**
 * @param {string} str
 * @return {string}
 */
ojster.Template.prototype.escape = function(str) {
	return ojster.escape(str);
};

/**
 * @return {string}
 */
ojster.Template.prototype.render = function() {
	// ensure we have a writer
	if (this.writer == null)
	{
		this.writer = new ojster.DefaultWriterClass();
	}

	// render
	this.renderBlockMain();
	return this.writer.done();
};

/**
 * @param {ojster.Template} template
 */
ojster.Template.prototype.renderTo = function(template) {
	this.writer = template.writer;
	this.renderBlockMain();
};

ojster.Template.prototype.renderBlockMain = function() {
	throw new Error('Not implemented');
};


// functions

/**
 * @param {string} str
 * @return {string}
 */
ojster.escape = function(str) {
	if (str == null)
	{
		return str;
	}

	return (str+'').replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};

/**
 * @param {Element} element
 * @param {ojster.Template} template
 * @return {Element}
 */
ojster.fillElement = function(element, template) {
	element.innerHTML = template.render();
	return element;
};

/**
 * @param {ojster.Template} template
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {Element}
 */
ojster.createElement = function(template, opt_domHelper) {
	/** @type {goog.dom.DomHelper} */
	var dom = opt_domHelper || goog.dom.getDomHelper();
	/** @type {Element} */
	var wrapper = dom.createElement(goog.dom.TagName.DIV);
	wrapper.innerHTML = template.render();

	if (wrapper.childNodes.length == 1)
	{
		/** @type {Element} */
		var firstChild = wrapper.firstChild;

		if (firstChild.nodeType == goog.dom.NodeType.ELEMENT)
		{
			return firstChild;
		}
	}

	return wrapper;
};

/**
 * @param {ojster.Template} template
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {Node}
 */
ojster.createFragment = function(template, opt_domHelper) {
	var dom = opt_domHelper || goog.dom.getDomHelper();
	return dom.htmlToDocumentFragment(template.render());
};
