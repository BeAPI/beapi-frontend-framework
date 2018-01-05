const svgstore = require('gulp-svgstore')
const svgmin = require('gulp-svgmin')
const path = require('path')
const rename = require('gulp-rename')
const cheerio = require('gulp-cheerio')

module.exports = function (gulp, plugins) {
  return function () {
    gulp.src('assets/img/icons/*.svg')
      .pipe(rename({prefix: 'icon-'}))
      .pipe(svgmin(function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative))
        return {
          plugins: [{
            cleanupIDs: {
              prefix: prefix + '-',
              minify: true
            }
          }]
        }
      }))
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(cheerio({
        run: function ($) {
          $('svg').attr('style', 'position: absolute; width: 0; height: 0; overflow: hidden;')
        },
        parserOptions: { xmlMode: true }
      }))
      .pipe(gulp.dest('assets/icons'))
  }
}