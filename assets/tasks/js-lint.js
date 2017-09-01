module.exports = function (gulp, plugins) {
    return function () {
        // Concat the vendor and the src
        gulp.src( ['assets/js/src/*.js'] )
            .pipe(plugins.eslint())
            .pipe(plugins.eslint.format());
  };
};