module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			build: {
				files: {
						'assets/js/scripts-domready.min.js': ['assets/js/scripts-domready.js'],
						'assets/js/vendor.min.js': ['assets/js/vendor/*.js']
				}
			}
		},

		watch: {
			html: {
				files: ['assets/js/scripts-domready.js','assets/js/vendor/*.js'],
				tasks: ['uglify']
			}
		}
	});

	grunt.registerTask('default', []);

};