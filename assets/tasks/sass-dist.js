var concat = require('gulp-concat-sourcemap'),
	sass = require('gulp-sass'),
	path = require('path'),
	minifyCSS = require('gulp-clean-css'),
	pxtorem = require('gulp-pxtorem'),
	pxtoremOptions = require('./sass-options'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

module.exports = function (gulp, plugins) {
	return function () {
		gulp.src('assets/css/style.scss')
				.pipe(sass({
					includePaths: require('node-bourbon').with('../node_modules')
				}).on('error', sass.logError))
				.pipe(plugins.concat('style.min.css'))
				.pipe(minifyCSS())
				.pipe(pxtorem(pxtoremOptions))
				.pipe(gulp.dest('./assets/css'));
	};
};