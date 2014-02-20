module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			build: {
				files: {
						'assets/js/scripts-domready.min.js': ['assets/js/scripts-domready.js']
				}
			}
		},

		watch: {
			html: {
				files: ['assets/js/scripts-domready.js'],
				tasks: ['uglify']
			}
		}
	});

	grunt.registerTask('default', []);

};