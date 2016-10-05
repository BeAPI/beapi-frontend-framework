var concat = require('gulp-concat-sourcemap');
//var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

module.exports = function (gulp, plugins) {
	var b = browserify({
		entries: './assets/js/scripts.js'
	});

	return function () {
		// Make the rest
		b.bundle()
			.pipe(source('scripts.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(concat('scripts.min.js', { sourceRoot : '../../' }))
			.pipe(gulp.dest('assets/js/'));
	}
};
