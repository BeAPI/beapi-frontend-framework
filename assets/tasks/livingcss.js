const livingcss = require('gulp-livingcss');

module.exports = function (gulp, plugins) {
  return function () {
    gulp.src(['assets/css/style.css'])
    .pipe(livingcss('',
      {
        template: './livingcss/template.hbs',
        preprocess: function(context, template, Handlebars) {
          context.title = 'Be API Frontend Framework';
        }
      }
    ))
    .pipe(gulp.dest('./livingcss'))
  };
};