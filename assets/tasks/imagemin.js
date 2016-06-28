var imagemin = require('gulp-imagemin');

module.exports = function (gulp, plugins) {
	return function () {
		gulp.src(['assets/img/*'])
			.pipe(imagemin())
			.pipe(gulp.dest('./assets/img'))
	};
};