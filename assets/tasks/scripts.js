module.exports = function (gulp, plugins) {
	return function () {
		/*JS task*/
		gulp.task('dev-vendor-js', function () {
			return gulp.src(['assets/js/vendor/*.js'])
				.pipe(plugins.concat('vendor.min.js'))
				.pipe(gulp.dest('assets/js'));
		});

		gulp.task('dev-check-js', function () {
			// Concat the vendor and the src
			return gulp.src( ['assets/js/src/*.js'] )
				.pipe(plugins.jshint())
				.pipe(plugins.jshint.reporter('default'));
		});

		gulp.task('dist-all-js', function () {
			// Make a vendor
			return gulp.src(['assets/js/vendor/*.js'])
				.pipe(plugins.concat('vendor.min.js'))
				.pipe(gulp.dest('assets/js'));

			// Make the rest
			return gulp.src(['assets/js/vendor.min.js', 'assets/js/src/*.js'])
				.pipe(plugins.uglify())
				.pipe(concat('scripts.min.js', { sourceRoot : '../../' }))
				.pipe(gulp.dest('assets/js/'));
		});
  };
};