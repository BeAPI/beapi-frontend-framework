const livingcss = require('gulp-livingcss')
const sass = require('gulp-sass')
const minifyCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')

const autoprefixerOptions = {
  browsers: ['last 2 versions', 'ie >= 9', 'Firefox ESR']
}
const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
}

module.exports = function (gulp, plugins) {
  return function () {
    gulp.src(['assets/css/style.css'])
      .pipe(livingcss('',
        {
          template: './livingcss/template.hbs',
          preprocess: function (context, template, Handlebars) {
            context.title = 'Be API Frontend Framework',
            Handlebars.registerPartial('icons', '{{icons}}')
          },
          sortOrder: [
            {
              index: ['Typography', 'Colors', 'Icons']
            },
            {
              components: ['Buttons', 'Form', 'Messages']
            },
            {
              patterns: ['Header', 'Footer', 'Menu', 'Searchform', 'Entries']
            },
            {
              pages: []
            }
          ]
        }
      ))
      .pipe(gulp.dest('./livingcss/html'))

    gulp.src(['livingcss/css/livingcss.scss'])
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(plugins.concat('livingcss.min.css'))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./livingcss/css'))
  }
}