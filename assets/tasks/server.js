var php = require('gulp-connect-php');

module.exports = function(gulp, plugins) {
	return function() {
		php.server({ base: '.', port: 9090, keepalive: true});
	};
};
