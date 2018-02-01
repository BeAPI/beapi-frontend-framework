/* Load all plugin define in package.json */
var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()

function getTask (task) {
  return require('./tasks/' + task)(gulp, plugins)
}

// Styles
gulp.task('critical-css', getTask('critical-css'))

// Favicon
gulp.task('favicon', getTask('favicon'))

// Image Minification
gulp.task('imagemin', getTask('imagemin'))
