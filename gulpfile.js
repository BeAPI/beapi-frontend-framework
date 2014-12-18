/*Load all plugin define in package.json*/
var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins(),
	less = require('gulp-less'),
	path = require('path'),
	minifyCSS = require('gulp-minify-css'),
	concat = require('gulp-concat-sourcemap'),
	livereload = require('gulp-livereload');

/*JS task*/
gulp.task('dev-vendor-js', function () {
	return gulp.src(['assets/js/vendor/*.min.js', 'assets/js/vendor/*-min.js', 'assets/js/vendor/**/*-min.js'])
		.pipe(plugins.concat('vendor.min.js'))
		.pipe(gulp.dest('assets/js'));
});

gulp.task('dist-all-js', function () {
	// Make a vendor
	gulp.src(['assets/js/vendor/*.min.js', 'assets/js/vendor/*-min.js', 'assets/js/vendor/**/*-min.js'])
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

/* LESS tasks */
gulp.task('dev-less', function () {
	gulp.src('assets/css/style.less')
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(plugins.concat('style.dev.css'))
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('dist-less', function () {
	gulp.src('assets/css/style.less')
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(plugins.concat('style.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./assets/css'));
});

// On default task, just compile on demand
gulp.task('default', function() {
	gulp.watch('assets/js/src/*.js', [ 'dev-check-js']);
	gulp.watch('assets/js/vendor/*.js', [ 'dev-vendor-js']);
	gulp.watch(['assets/css/*.less', 'assets/css/**/*.less'], ['dev-less']);
	livereload.listen();
	gulp.watch('assets/css/**').on('change', livereload.changed);
});