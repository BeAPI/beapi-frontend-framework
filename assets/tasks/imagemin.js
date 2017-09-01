var imagemin = require('gulp-imagemin');

module.exports = function (gulp, plugins) {
	return function () {
		//Specify each imgs folders
		gulp.src(['assets/img/bg-sample/*'])
			.pipe(imagemin())
			.pipe(gulp.dest('./assets/img/bg-sample'))

		gulp.src(['assets/img/icons/*'])
			.pipe(imagemin())
			.pipe(gulp.dest('./assets/img/icons'))
	};
};