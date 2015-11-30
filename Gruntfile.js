module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [ 'src/init.js', 'src/*.js' ],
        dest: 'main.js'
      }
    },
    coffee: {
      options: {
        bare: true
      },
      glob_to_multiple: {
        expand: true,
        flatten: true,
        src: ['spec/*.coffee'],
        dest: 'spec/out',
        ext: '.js'
      }
    },
    watch: {
      scripts: {
        files: ['src/*.js', 'resources/*'],
        tasks: ['concat', 'jade']
      }
    },
    jade: require('./config/jade.js'),
    jasmine: {
      src: 'src/**/*.js',
      options: {
        specs: "spec/out/**/*.js"
      }
    }
  });

  grunt.registerTask('default', ['concat', 'jade']);
  grunt.registerTask('test', ['coffee', 'jasmine']);
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

};
