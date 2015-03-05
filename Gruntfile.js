'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('serve', ['shell:runServer']);

  grunt.initConfig({
    wiredep: {
      app: {
        src: 'views/index.ejs'
      }
    },
    jshint: {
    options: {
        jshintrc: '.jshintrc'
    },	
    all: ['app.js','bin/www', 'public/javascripts/*.js', 'sockets/*.js']
  },
  shell: {
        options: {
            stderr: false
        },
        runServer: {
            command: 'DEBUG=chat-io:*  ./bin/www'
        }
    } 


  });
};
