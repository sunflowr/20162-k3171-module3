module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ["base.js", "jq-helpers.js", "audio.js", "compatibility.js"],
        dest: 'kattegat-client.js',
      },
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat']);
}