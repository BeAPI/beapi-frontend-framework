/*Load all plugin define in package.json*/
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

function getTask(task) {
	return require('./assets/tasks/' + task)(gulp, plugins);
}

//Scripts
gulp.task('js', ['js-lint'], getTask('js-dist'));
gulp.task('js-dist', getTask('js-dist'));
gulp.task('js-lint', getTask('js-lint'));

//Styles
gulp.task('sass', getTask('sass'));
gulp.task('critical-css', getTask('critical-css'));

//Iconfont
//use this task for ie8 and minus projects
gulp.task('iconfont', getTask('iconfont'));
//Svg icon
gulp.task('svgicons', getTask('svg-icons'));

//Favicon
gulp.task('favicon', getTask('favicon'));

//Image Minification
gulp.task('imagemin', getTask('imagemin'));

//Local dev
gulp.task('browser-sync', ['server'], getTask('browser-sync'));
gulp.task('server', getTask('server'));
gulp.task('bs-reload', getTask('bs-reload'));


// On default task, just compile on demand
gulp.task('default', ['js', 'sass', 'svgicons'], function() {
	gulp.watch('assets/js/src/*.js', [ 'js' ]);
	gulp.watch('assets/js/vendor/*.js', [ 'js-vendor', 'js' ]);
	gulp.watch(['assets/css/*.scss', 'assets/css/**/*.scss'], ['sass']);
	gulp.watch(['assets/img/icons/*.svg'], ['svgicons', 'sass']);
});
// Browser sync with local setup.
gulp.task('serve', ['browser-sync', 'server', 'bs-reload', 'js', 'sass', 'svgicons'], function() {
	gulp.watch('assets/js/src/*.js', [ 'js' ]);
	gulp.watch('assets/js/vendor/*.js', [ 'js-vendor', 'js' ]);
	gulp.watch(['assets/css/*.scss', 'assets/css/**/*.scss'], ['sass']);
	gulp.watch(['assets/img/icons/*.svg'], ['svgicons', 'sass']);
	gulp.watch(['html/**/*.php', 'assets/css/style.css', 'assets/js/scripts.min.js'], ['bs-reload']);
});