module.exports = function(grunt) {

    grunt.initConfig({
        distDir: 'dist/',
        jsDir: 'public/javascripts/',
        jsDistDir: 'dist/javascripts/',
        cssDir: 'public/stylesheets/',
        cssDistDir: 'dist/stylesheets/',
        fontDistDir: 'dist/fonts/',
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [{
                    src: 'bower_components/bootstrap/dist/js/*',
                    dest: '<%=jsDistDir%>'
                }, {
                    src: 'bower_components/bootstrap/dist/css/*',
                    dest: '<%=cssDistDir%>'
                }, {
                    src: 'bower_components/bootstrap/dist/fonts/*',
                    dest: '<%=fontDistDir%>'
                }]
            }
        },
        concat: {
            js: {
                options: {
                    separator: ';'
                },
                src: ['<%=jsDir%>*.js'],
                dest: '<%=jsDistDir%><%= pkg.name %>.js'
            },
            css: {
                src: ['<%=cssDir%>*.css', 'bower_components/bootstrap/dist/css/*.css'],
                dest: '<%=cssDistDir%><%= pkg.name %>.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%=grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%=jsDistDir%><%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
        cssmin: {
            add_banner: {
                options: {
                    banner: '/*! <%= pkg.name %> <%=grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    '<%=cssDistDir%><%= pkg.name %>.min.css': ['<%= concat.css.dest %>']
                }
            }
        },
        express: {
            options: {
                // Override defaults here
                debug: false
            },
            dev: {
                options: {
                    script: 'bin/www'
                }
            },
            prod: {
                options: {
                    script: 'bin/www',
                    node_env: 'production'
                }
            },
            test: {
                options: {
                    script: 'bin/www'
                }
            }
        },
        watch: {
            files: ['<%=jsDir%>*.js', '<%=cssDir%>*.css'],
            tasks: [
                'copy',
                'concat',
                'uglify',
                'cssmin',
                'jshint'
            ]
        },
        imagemin: {
            options: {
                cache: false
            },

            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/'
                }]
            }
        },
        jshint: {
            all: ['Gruntfile.js',
                'routes/*.js',
                'lib/*.js',
                'app.js',
                'test/**/*.js',
                'models/*.js'
            ]
        },

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', [
        'copy',
        'concat',
        'uglify',
        'cssmin',
        'imagemin',
        'jshint',
        'express:dev',
        'watch'
    ]);

    grunt.registerTask('server', ['express:dev', 'watch']);

};