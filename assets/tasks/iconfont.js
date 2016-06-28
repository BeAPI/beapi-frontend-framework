var iconfont = require('gulp-iconfont');
var iconfontCSS = require('gulp-iconfont-css');

var fontName = 'bea_icons';

module.exports = function (gulp, plugins) {
	return function () {
		console.log(iconfontCSS);
		gulp.src('assets/img/icons/*.svg')
			.pipe(iconfontCSS({
				fontName: fontName,
				path: 'assets/css/vendor/_icons.scss',
				targetPath: '../css/components/_icons.scss',
				fontPath: '#{$fonts-url}/',
				cssClass: 'icon'
			}))
			.pipe(iconfont({
				fontName: fontName
			}))
			.pipe(gulp.dest('./assets/fonts'));
	};
};