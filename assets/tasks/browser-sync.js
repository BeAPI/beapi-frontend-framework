var browserSync = require('browser-sync');

module.exports = function(gulp, plugins) {
	return function() {
		browserSync({
			proxy: '127.0.0.1:9090',
			port: 9090,
			open: true,
			notify: false
		});
	};
};
