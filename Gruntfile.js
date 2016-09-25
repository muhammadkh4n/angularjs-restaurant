/**
 * Created by muhammadkh4n on 4/6/16.
 */

'use strict';

module.exports = function (grunt) {

    // Time it takes to do all tasks
    require('time-grunt')(grunt);

    // Auto load grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    //config
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Code check to make sure there are no mistakes and is up to par with style.
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'app/scripts/{,*/}*.js'
                ]
            }
        },

        useminPrepare: {
            html: 'app/menu.html',
            options: {
                dest: 'dist'
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            // dist config is provided by usemin
            dist: {}
        },

        uglify: {
            // dist from usemin
            dist: {}
        },

        cssmin: {
            dist: {}
        },

        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            release: {
                // filerev:release hashes(md5) all assets (images, js and css )
                // in dist directory
                files: [{
                    src: [
                        'dist/scripts/*.js',
                        'dist/styles/*.css'
                    ]
                }]
            }
        },

        usemin: {
            html: ['dist/*.html'],
            css: ['dist/styles/*.css'],
            options: {
                assetsDirs: ['dist', 'dist/styles']
            }
        },

        // Copy all source files to dist folder.
        copy: {
            dist: {
                cwd: 'app',
                src: ['**', '!styles/**/*.css', '!scripts/**/*.js'],
                dest: 'dist',
                expand: true
            },
            fonts: {
                files: [
                    {
                        // For bootstrap fonts
                        expand: true,
                        dor: true,
                        cwd: 'bower_components/bootstrap/dist',
                        src: ['fonts/*.*'],
                        dest: 'dist'
                    }, {
                        // for font awesome
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/font-awesome',
                        src: ['fonts/*.*'],
                        dest: 'dist'
                    }
                ]
            }
        },

        // Clean and build/rebuild all files in the dist folder
        clean: {
            build: {
                src: ['dist/']
            }
        },

        watch: {
            options: {
                livereload: true
            },
            copy: {
                files: ['app/**', '!app/**/*.css', '!app/**/*.js'],
                tasks: ['build']
            },
            scripts: {
                files: ['app/scripts/app.js.bak'],
                tasks: ['build']
            },
            styles: {
                files: ['app/styles/mystyles.css'],
                tasks: ['build']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'app/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729
            },
            dist: {
                options: {
                    open: true,
                    base: {
                        path: 'dist',
                        options: {
                            index: 'menu.html',
                            maxAge: 300000
                        }
                    }
                }
            }
        }

    });

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('serve', ['build', 'connect:dist', 'watch']);

    grunt.registerTask('default', ['build']);

};