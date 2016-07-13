module.exports = function (gulp, plugins) {
	return function () {
		/* SASS Task */
		gulp.task('dev-sass', function () {
			return gulp.src('assets/css/style.scss')
				.pipe(sass({
					includePaths: require('node-bourbon').includePaths
				}).on('error', sass.logError))
				.pipe(plugins.concat('style.dev.css'))
				.pipe(pxtorem(pxtoremOptions))
				.pipe(gulp.dest('./assets/css'))
				.pipe(browserSync.reload({stream:true}));
		});

		gulp.task('dist-sass', function () {
			return gulp.src('assets/css/style.scss')
				.pipe(sass({
					includePaths: require('node-bourbon').includePaths
				}).on('error', sass.logError))
				.pipe(plugins.concat('style.min.css'))
				.pipe(minifyCSS())
				.pipe(pxtorem(pxtoremOptions))
				.pipe(gulp.dest('./assets/css'));
		});
	};
};