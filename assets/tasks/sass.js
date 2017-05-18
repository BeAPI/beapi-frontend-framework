var sourcemaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	path = require('path'),
	minifyCSS = require('gulp-clean-css'),
	pxtorem = require('gulp-pxtorem'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

var autoprefixerOptions = {
	browsers: ['last 2 versions', 'ie >= 9', 'Firefox ESR']
};

var sassOptions = {
	includePaths: [
		'./node_modules/bourbon/app/assets/stylesheets/',
		'./node_modules/susy/sass'
	],
	errLogToConsole: true,
	outputStyle: 'expanded'
}

var pxtoremOptions = {
	replace: false,
	prop_white_list: ['font', 'font-size', 'line-height', 'letter-spacing', 'margin', 'padding', 'border', 'border-top', 'border-left', 'border-bottom', 'border-right', 'border-radius', 'width', 'height', 'top', 'left', 'bottom', 'right']
}

module.exports = function (gulp, plugins) {
	return function () {
		//developpement css with sourcemapping
		gulp.src(['assets/css/**/*.scss'])
			.pipe(sourcemaps.init({identityMap:true, debug: true}))
				.pipe(sass(sassOptions).on('error', sass.logError))
				.pipe(autoprefixer())
				.pipe(minifyCSS())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./assets/css'));
		//production css with px to rem conversion
		gulp.src(['assets/css/style.scss'])
			.pipe(sass(sassOptions).on('error', sass.logError))
			.pipe(plugins.concat('style.min.css'))
			.pipe(autoprefixer())
			.pipe(minifyCSS())
			.pipe(pxtorem(pxtoremOptions))
			.pipe(gulp.dest('./assets/css'));
	};
};