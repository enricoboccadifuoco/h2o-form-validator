module.exports = function(grunt) {

    'use stricts';

    // Configurable paths for the application
    var appConfig = {
        source: 'src',
        dist: 'dist',
    };

    grunt.initConfig({

        config: appConfig,

        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['build'],
            },
        },

        // Empties folders to start fresh
        clean: {
            build: {
                files: [{
                    dot: true,
                    src: [
                        'dist/*'
                    ]
                }]
            },
        },

        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: '*.js',
                dest: 'dist/',
                flatten: true,
                filter: 'isFile',
            },
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= config.source %>/**/*.js',
                ]
            },
        },

        uglify: {
            build: {
                files: [{
                    expand: true,
                    src: ['dist/*.js'],
                    ext: '.min.js'
                }]
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Your grunt tasks
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean', 'jshint', 'copy', 'uglify']);
};
