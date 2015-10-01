/**
 * Compiles SASS files into CSS.
 *
 * ---------------------------------------------------------------
 *
 * Files like `assets/styles/base.scss` are compiled.
 * This allows you to control the ordering yourself, i.e. import your
 * dependencies, mixins, variables, resets, etc. before other stylesheets)
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-less
 */
module.exports = function(grunt) {

	grunt.config.set('compass', {
		dev: {
			options: {
				imagesDir: 'assets/images',
				httpImagesPath: '/images',
				generatedImagesDir: 'assets/images/sprites',
				httpGeneratedImagesPath: '/images/sprites',
				sassDir: 'assets/styles',
        			cssDir: '.tmp/public/styles',
				watch: false,
      				outputStyle: 'nested' //Set your prefered style for development here.
    			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
};
