var concat = require('gulp-concat-sourcemap');
module.exports = function (gulp, plugins) {
	return function () {
		// Concat the vendor and the src
		gulp.src( ['assets/js/src/*.js'] )
			.pipe(plugins.jshint())
			.pipe(plugins.jshint.reporter('default'));
  };
};