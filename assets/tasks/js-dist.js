var concat = require('gulp-concat-sourcemap');
module.exports = function (gulp, plugins) {
	return function () {
		gulp.src(['assets/js/vendor.min.js', 'assets/js/src/*.js'])
			.pipe(plugins.uglify())
			.pipe(concat('scripts.min.js', { sourceRoot : '../../' }))
			.pipe(gulp.dest('assets/js/'));
  };
};