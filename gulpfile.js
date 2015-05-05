/*Load all plugin define in package.json*/
var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins(),
	sass = require('gulp-sass'),
	neat = require('node-neat').includePaths,
	path = require('path'),
	minifyCSS = require('gulp-minify-css'),
	concat = require('gulp-concat-sourcemap'),
	iconfont = require('gulp-iconfont'),
	consolidate = require('gulp-consolidate'),
	pxtorem = require('gulp-pxtorem'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

var pxtoremOptions = {
	replace: false,
	prop_white_list: ['font', 'font-size', 'line-height', 'letter-spacing', 'margin', 'padding', 'border', 'border-top', 'border-left', 'border-bottom', 'border-right', 'border-radius', 'width', 'height', 'top', 'left', 'bottom', 'right']
};

/*Set server*/
gulp.task('browser-sync', function() {
	browserSync({
		proxy: "http://localhost"
	});
});

// Reload all Browsers
gulp.task('bs-reload', function () {
	browserSync.reload();
});

/*Icon font task*/
gulp.task('iconfont', function(){
	gulp.src(['assets/img/icons/*.svg'])
		.pipe(iconfont({
			fontName: 'bea_icons',
			normalize: true,
			fontHeight: 1001
		}))
		.on('codepoints', function(codepoints, options) {
			gulp.src('assets/css/vendor/_icons.scss')
				.pipe(consolidate('lodash', {
					glyphs: codepoints,
					fontName: 'bea_icons',
					fontPath: '../../assets/fonts/',
					className: 'icon'
				}))
				.pipe(gulp.dest('./assets/css/components'));
			})
			.pipe(gulp.dest('./assets/fonts'));
});

/*JS task*/
gulp.task('dev-vendor-js', function () {
	return gulp.src(['assets/js/vendor/*.min.js', 'assets/js/vendor/*-min.js', 'assets/js/vendor/**/*-min.js', 'assets/js/vendor/**/*.min.js', '!assets/js/vendor/{jquery,jquery/**}'])
		.pipe(plugins.concat('vendor.min.js'))
		.pipe(gulp.dest('assets/js'));
});

gulp.task('dist-all-js', function () {
	// Make a vendor
	gulp.src(['assets/js/vendor/*.min.js', 'assets/js/vendor/*-min.js', 'assets/js/vendor/**/*-min.js', 'assets/js/vendor/**/*.min.js', '!assets/js/vendor/{jquery,jquery/**}'])
		.pipe(plugins.concat('vendor.min.js'))
		.pipe(gulp.dest('assets/js'));

	// Make the rest
	return gulp.src(['assets/js/vendor.min.js', 'assets/js/src/*.js'])
		.pipe(plugins.uglify())
		.pipe(concat('scripts.min.js', { sourceRoot : '../../' }))
		.pipe(gulp.dest('assets/js/'));
});

gulp.task('dev-check-js', function () {
	// Concat the vendor and the src
	return gulp.src( [ 'assets/js/vendor.min.js', 'assets/js/src/*.js'])
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.uglify())
		.pipe(concat('scripts.min.js', { sourceRoot : '../../' }))
		.pipe(gulp.dest('assets/js/'));
});

/* SASS Task */
gulp.task('dev-sass', function () {
	gulp.src('assets/css/style.scss')
		.pipe(sass({
			includePaths: ['dev-sass'].concat(neat)
		}))
		.pipe(plugins.concat('style.dev.css'))
		.pipe(pxtorem(pxtoremOptions))
		.pipe(gulp.dest('./assets/css'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('dist-sass', function () {
	gulp.src('assets/css/style.scss')
		.pipe(sass({
			includePaths: ['dist-sass'].concat(neat)
		}))
		.pipe(plugins.concat('style.min.css'))
		.pipe(pxtorem(pxtoremOptions))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./assets/css'));
});
// On default task, just compile on demand
gulp.task('default', function() {
	gulp.watch('assets/js/src/*.js', [ 'dev-check-js']);
	gulp.watch('assets/js/vendor/*.js', [ 'dev-vendor-js']);
	gulp.watch(['assets/css/*.scss', 'assets/css/**/*.scss'], ['dev-sass']);
	gulp.watch(['assets/img/icons/*.svg'], ['iconfont', 'dev-sass']);
});
// Browser sync with local setup. Work with wamp
gulp.task('serve', ['browser-sync'], function() {
	gulp.watch('assets/js/src/*.js', [ 'dev-check-js']);
	gulp.watch('assets/js/vendor/*.js', [ 'dev-vendor-js']);
	gulp.watch(['assets/css/*.scss', 'assets/css/**/*.scss'], ['dev-sass']);
	gulp.watch(['assets/img/icons/*.svg'], ['iconfont', 'dev-sass']);
	gulp.watch("html/*.php", ['bs-reload']);
});