var concat = require('gulp-concat-sourcemap'),
	sass = require('gulp-sass'),
	bourbon = require('node-bourbon'),
	path = require('path'),
	minifyCSS = require('gulp-clean-css'),
	pxtorem = require('gulp-pxtorem'),
	pxtoremOptions = require('./sass-options'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

console.log(bourbon)

module.exports = function (gulp, plugins) {
	return function () {

		gulp.src('assets/css/style.scss')
				.pipe(sass({
					includePaths: bourbon.includePaths
				}).on('error', sass.logError))
				.pipe(plugins.concat('style.dev.css'))
				.pipe(pxtorem(pxtoremOptions))
				.pipe(gulp.dest('./assets/css'))
				.pipe(browserSync.reload({stream:true}));
	};
};