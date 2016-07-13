var concat = require('gulp-concat-sourcemap');
module.exports = function (gulp, plugins) {
	return function () {
		gulp.src(['assets/js/vendor/*.js'])
			.pipe(plugins.concat('vendor.min.js'))
			.pipe(gulp.dest('assets/js'));
  };
};