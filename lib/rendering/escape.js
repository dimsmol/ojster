module.exports = function(str) {
	if (str == null) {
		return str;
	}
	return (str+'').replace(/&/g, '&amp;')
   				   .replace(/</g, '&lt;')
				   .replace(/>/g, '&gt;')
				   .replace(/"/g, '&quot;');
};
