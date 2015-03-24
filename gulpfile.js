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
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

/*Set server*/
gulp.task('browser-sync', function() {
	browserSync({
		host: "192.168.1.36",
		//proxy: "http://dev_domain/wp-content/themes/theme_name/html/"
		proxy: "http://localhost/base-theme-beapi/html/"
	});
});

// Reload all Browsers
gulp.task('bs-reload', function () {
	browserSync.reload();
});

/*Icon font task*/
gulp.task('iconfont', function(){
	gulp.src(['assets/img/icons/*.svg'])
		.pipe(iconfont({ fontName: 'bea_icons' }))
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
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('dist-sass', function () {
	gulp.src('assets/css/style.scss')
		.pipe(sass({
			includePaths: ['dist-sass'].concat(neat)
		}))
		.pipe(plugins.concat('style.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./assets/css'));
});
// On default task, just compile on demand
gulp.task('default', ['browser-sync'], function() {
	gulp.watch('assets/js/src/*.js', [ 'dev-check-js']);
	gulp.watch('assets/js/vendor/*.js', [ 'dev-vendor-js']);
	gulp.watch(['assets/css/*.scss', 'assets/css/**/*.scss'], ['dev-sass']);
	gulp.watch(['assets/img/icons/*.svg'], ['iconfont', 'dev-sass']);
	gulp.watch("html/*.php", ['bs-reload']);
});