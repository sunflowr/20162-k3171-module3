// Generated on 2016-10-05 using generator-kattegat 0.1.8
'use strict';
// var moment = require('moment'),
var _ = require("lodash")
 
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};
 
module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('bowerInstall', 'install client-side JS', function() {
    var exec = require('child_process').exec;
    var cb = this.async();
    exec('bower install', {}, function(err, stdout, stderr) {
        console.log(stdout);
        cb();
    });
  });

  grunt.registerTask('bowerUpdate', 'update client-side JS', function() {
    var exec = require('child_process').exec;
    var cb = this.async();
    exec('bower update', {}, function(err, stdout, stderr) {
        console.log(stdout);
        cb();
    });
  });

  grunt.registerTask('samples', 'downloads samples', function() {
    var exec = require('child_process').exec;
    var cb = this.async();
    exec('cd public && git clone https://github.com/ClintH/dia-samples.git', {}, function(err, stdout, stderr) {
        console.log(stdout);
        cb();
    });
  });

  grunt.registerTask('samplesUpdate', 'updates samples', function() {
    var exec = require('child_process').exec;
    var cb = this.async();
    exec('cd public/dia-samples && git reset --hard HEAD && git pull', {}, function(err, stdout, stderr) {
        console.log(stdout);
        cb();
    });
  });

  grunt.registerTask('kattegatUpdate', 'updates kattegat', function() {
    var exec = require('child_process').exec;
    var cb = this.async();
    exec('npm update kattegat', {}, function(err, stdout, stderr) {
        console.log(stdout);
        cb();
    });
  });

  grunt.initConfig({
    clean: ['bower_components/bower_libs.js', 'bower_components/libraries.js'],
    bower_concat: {
      all: {
        mainFiles: {
          'WeakMap' : [ '../weakmap.js'],
          'jsfeat': ['build/jsfeat-min.js']
        },
        exclude: ['TouchEmulator', 'pure', 'jsfeat', 'leaflet-dist', 'smoothie', 'geolib', 'flot'],
        dest: 'bower_components/bower_libs.js',
        callback: function(mainFiles, component) {
          return _.map(mainFiles, function(filepath) {
            // Use minified files is available
            var min = filepath.replace(/\.js$/, '.min.js');
            return grunt.file.exists(min) ? min : filepath;
          });
        }
      }
    },
    concat: {
      all: {
        src: ['bower_components/*.js'],
        dest: 'bower_components/libraries.js'
      }
    },
  });
 
 grunt.registerTask('default', ['clean', 'bowerInstall', 'bower_concat', "concat", "samples"]);
 grunt.registerTask('build', ['default']);
 grunt.registerTask('update', ['clean', 'bowerUpdate', 'bowerInstall', 'bower_concat', "concat", "samplesUpdate", "kattegatUpdate"]);
};