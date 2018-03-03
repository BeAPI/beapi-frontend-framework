const gulp = require('gulp')
const concat = require('gulp-concat')
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

gulp.task('livingcss', function () {
  return gulp.src('../dist/assets/app.css')
    .pipe(livingcss('',
      {
        template: './template.hbs',
        preprocess: function (context, template, Handlebars) {
          context.title = 'Be API Frontend Framework'
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
    .pipe(gulp.dest('./html/'))
})

gulp.task('sass', function () {
  gulp.src(['css/livingcss.scss'])
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(concat('livingcss.min.css'))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./css'))
})

gulp.task('default', ['livingcss', 'sass'])

gulp.task('watch', function () {
  gulp.watch('./css/*.scss', ['sass'])
})