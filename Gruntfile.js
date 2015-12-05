module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        footer: "main();"
      },
      dist: {
        src: [ 'src/init.js', 'src/*.js' ],
        dest: 'main.js'
      }
    },
    watch: {
      scripts: {
        files: ['src/*.js', 'resources/*'],
        tasks: ['concat', 'jade']
      }
    },
    jade: require('./config/jade.js')
  });

  grunt.registerTask('default', ['concat', 'jade']);
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
};
