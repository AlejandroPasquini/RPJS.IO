'use strict';
var db= require('./models/users')();
var path= require('path');
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  //grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  //grunt.loadNpmTasks('grunt-node-inspector');
  
  grunt.registerTask('default', ['wiredep', 'jshint']);
  grunt.registerTask('server', ['shell:runServer']);
  grunt.registerTask('serve', ['concurrent']);

  grunt.initConfig({
    
    wiredep: {
      app: {
        src: ['views/layout/main.html']
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
     options: {
      livereload: true,
      interval: 3000
    },
  scripts: {
    files: ['**/*.js'],
    tasks: ['jshint']
  },
    css: {
    files: './public/**/*.css'
  },

     html: {
    files: './views/**/*.html'
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

  grunt.registerTask('dbseed', 'seed the database', function() {
    grunt.task.run('adduser:admin:admin@example.com:secret:true');
    grunt.task.run('adduser:bob:bob@example.com:secret:false');
  });

  grunt.registerTask('adduser', 'add a user to the database', function(usr, emailaddress, pass, adm) {
    // convert adm string to bool
    adm = (adm === "true");

    var user = new db({ username: usr
            , email: emailaddress
            , password: pass
            , admin: adm });
    
    // save call is async, put grunt into async mode to work
    var done = this.async();

    user.save(function(err) {
      if(err) {
        console.log('Error: ' + err);
        done(false);
      } else {
        console.log('saved user: ' + user.username);
        done();
      }
    });
  });

  grunt.registerTask('dbdrop', 'drop the database', function() {

var users =  db; 
    var done = this.async();

users.remove({},function(err,users){
    done();

})


  });


}

