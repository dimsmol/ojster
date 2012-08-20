"use strict";
var send = function(res, template) {
	res.send(template.render());
};


module.exports = send;
