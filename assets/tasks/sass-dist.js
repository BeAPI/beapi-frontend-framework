var sourcemaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	path = require('path'),
	minifyCSS = require('gulp-clean-css'),
	pxtorem = require('gulp-pxtorem'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

var autoprefixerOptions = {
	browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
}

var pxtoremOptions = {
	replace: false,
	prop_white_list: ['font', 'font-size', 'line-height', 'letter-spacing', 'margin', 'padding', 'border', 'border-top', 'border-left', 'border-bottom', 'border-right', 'border-radius', 'width', 'height', 'top', 'left', 'bottom', 'right']
}

module.exports = function (gulp, plugins) {
	return function () {
		gulp.src(['assets/css/style.scss', 'assets/css/components/*.scss', 'assets/css/patterns/*.scss', 'assets/css/pages/*.scss'])
			.pipe(sourcemaps.init())
			.pipe(sass(sassOptions).on('error', sass.logError))
			.pipe(sourcemaps.write())
			.pipe(autoprefixer(autoprefixerOptions))
			.pipe(minifyCSS())
			.pipe(pxtorem(pxtoremOptions))
			.pipe(gulp.dest('./assets/css'));
	};
};