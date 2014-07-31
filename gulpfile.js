/*Load all plugin define in package.json*/
var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins(),
	less = require('gulp-less'),
	path = require('path'),
	minifyCSS = require('gulp-minify-css');

/*JS task*/
gulp.task('js', function () {
	return gulp.src(['assets/js/vendor/*.min.js', 'assets/js/vendor/*-min.js', 'assets/js/vendor/**/*-min.js'])
		.pipe(plugins.concat('scripts.dev.js'))
		.pipe(gulp.dest('assets/js'));
});

gulp.task('js-prod', function () {
	return gulp.src(['assets/js/vendor/*.min.js', 'assets/js/vendor/*-min.js', 'assets/js/vendor/**/*-min.js', 'assets/js/scripts-domready.js'])
		.pipe(plugins.jshint())
		.pipe(plugins.uglify())
		.pipe(plugins.concat('scripts.min.js'))
		.pipe(gulp.dest('assets/js/'));
});

gulp.task('js-check', function () {
	return gulp.src('assets/js/scripts-domready.js')
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(gulp.dest('assets/js/'));
});

/* LESS tasks */
gulp.task('less', function () {
	gulp.src('assets/css/style.less')
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(plugins.concat('style.dev.css'))
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('less-prod', function () {
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
	gulp.watch('assets/js/*.js', ['js', 'js-check']);
	gulp.watch(['assets/css/*.less', 'assets/css/**/*.less'], ['less']);
});