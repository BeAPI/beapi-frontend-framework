var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');
var rename = require('gulp-rename');
var cheerio = require('gulp-cheerio');
var ext_replace = require('gulp-ext-replace');

module.exports = function (gulp, plugins) {
    return function () {
        gulp.src('assets/img/icons/*.svg')
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
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
                $('svg').attr('style',  'position: absolute; width: 0; height: 0; overflow: hidden;');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(gulp.dest('assets/icons'))
        .pipe(gulp.dest('livingcss/partials'))

        gulp.src('livingcss/partials/icons.svg')
            .pipe(ext_replace('.hbs'))
            .pipe(gulp.dest('livingcss/partials'))
    };
};