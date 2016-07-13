var favicons = require('gulp-favicons'),
gutil = require("gulp-util");

module.exports = function(gulp, plugins) {
	return function() {
		gulp.src("assets/img/favicons/favicon_src.png").pipe(favicons({
				appName: "BFF",
				appDescription: "BFF starter theme",
				developerName: "Be API",
				developerURL: "http://beapi.fr",
				background: "#ffffff",
				path: "assets/img/favicons/",
				url: "http://beapi.fr",
				display: "standalone",
				orientation: "portrait",
				version: 1.0,
				logging: false,
				online: false,
				html: "index.html",
				pipeHTML: true,
				replace: true,
				icons: {
					android: true, // Create Android homescreen icon. `boolean`
					appleIcon: true, // Create Apple touch icons. `boolean`
					appleStartup: false, // Create Apple startup images. `boolean`
					coast: false, // Create Opera Coast icon. `boolean`
					favicons: true, // Create regular favicons. `boolean`
					firefox: true, // Create Firefox OS icons. `boolean`
					opengraph: true, // Create Facebook OpenGraph. `boolean`
					windows: true, // Create Windows 8 tiles. `boolean`
					yandex: false // Create Yandex browser icon. `boolean`
				}
			}))
			.on("error", gutil.log)
			.pipe(gulp.dest("./assets/img/favicons/"));
	};

};
