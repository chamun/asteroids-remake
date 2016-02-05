module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: require('./config/concat'),
    connect: require('./config/connect'),
    watch: require('./config/watch'),
    jade: require('./config/jade')
  });

  grunt.registerTask('default', ['concat', 'jade']);
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-connect');
};
