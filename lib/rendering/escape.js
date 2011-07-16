
module.exports.escape = function(str) {
	return (str+'').replace(/&/g, '&amp;')
   			       .replace(/</g, '&lt;')
			       .replace(/>/g, '&gt;')
			       .replace(/"/g, '&quot;');
};
