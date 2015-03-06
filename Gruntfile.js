'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  //grunt.loadNpmTasks('grunt-node-inspector');

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
    },



concurrent: {
  dev: {
    tasks: ['nodemon', 'node-inspector', 'watch'],
    options: {
      logConcurrentOutput: true
    }
  }
},
nodemon: {
  dev: {
    script: './server.js',
    options: {
      nodeArgs: ['--debug'],
      env: {
        PORT: '3000'
      },
      // omit this property if you aren't serving HTML files and 
      // don't want to open a browser tab on start
      callback: function (nodemon) {
        nodemon.on('log', function (event) {
          console.log(event.colour);
        });

        // opens browser on initial server start
        nodemon.on('config:update', function () {
          // Delay before server listens on port
          setTimeout(function() {
            require('open')('http://localhost:3000');
          }, 2000);
        });

        // refreshes browser when server reboots
        nodemon.on('restart', function () {
          // Delay before server listens on port
          setTimeout(function() {
            require('fs').writeFileSync('.rebooted', 'rebooted');
          }, 1000);
        });
      }
    }
  }
},
watch: {
  scripts: {
    files: ['**/*.js'],
    tasks: ['jshint'],
    options: {
      spawn: false,
      livereload: true,
      interval: 5000
    },
  },
},


'node-inspector': {
  custom: {
    options: {
      'web-port': 1337,
      'web-host': 'localhost',
      'debug-port': 5857,
      'save-live-edit': true,
      'no-preload': true,
      'stack-trace-limit': 4,
      'hidden': ['node_modules']
    }
  }
}


});

}

