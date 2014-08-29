/*Load all plugin define in package.json*/
var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins(),
	less = require('gulp-less'),
	sass = require('gulp-sass'),
	neat = require('node-neat').includePaths,
	path = require('path'),
	minifyCSS = require('gulp-minify-css'),
	livereload = require('gulp-livereload');

/* Move bower_components to assets */
gulp.task('bower-scripts', function () {
	return gulp.src(['assets/bower_components/**/*.js', '!assets/bower_components/{jquery,jquery/**}'])
		.pipe(gulp.dest('assets/js/vendor'));
});
gulp.task('bower-styles', function () {
	return gulp.src(['assets/bower_components/**/*.css', 'assets/bower_components/**/*.scss'])
		.pipe(gulp.dest('assets/css/vendor'));
});

/*JS task*/
gulp.task('dev-vendor-js', function () {
	return gulp.src(['assets/js/vendor/*.js', 'assets/js/vendor/**/*.js', '!assets/js/vendor/*.min.js', '!assets/js/vendor/*-min.js', '!assets/js/vendor/**/*-min.js', '!assets/js/vendor/{jquery,jquery/**}'])
		.pipe(plugins.concat('scripts.dev.js'))
		.pipe(gulp.dest('assets/js'));
});

gulp.task('dist-all-js', function () {
	return gulp.src(['assets/js/vendor/*.js', 'assets/js/vendor/**/*.js', '!assets/js/vendor/*.min.js', '!assets/js/vendor/*-min.js', '!assets/js/vendor/**/*-min.js', '!assets/js/vendor/{jquery,jquery/**}', 'assets/js/scripts-domready.js'])
		.pipe(plugins.jshint())
		.pipe(plugins.uglify())
		.pipe(plugins.concat('scripts.min.js'))
		.pipe(gulp.dest('assets/js/'));
});

gulp.task('dev-check-js', function () {
	return gulp.src('assets/js/scripts-domready.js')
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
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
gulp.task('default', function() {
	gulp.watch('assets/js/*.js', ['bower-scripts','bower-styles','dev-vendor-js', 'dev-check-js']);
	gulp.watch(['assets/css/*.scss', 'assets/css/**/*.scss'], ['dev-sass']);
	livereload.listen();
	gulp.watch('assets/css/**').on('change', livereload.changed);
});