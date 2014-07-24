/*global module, require, grunt, console*/
module.exports = function (grunt) {

    // show elapsed time at the end
    require('time-grunt')(grunt);

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg : grunt.file.readJSON("package.json"),

        //automatic version control
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'upstream',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/<%= pkg.version %>/*',
                        '!dist/.git*'
                    ]
                }]
            },
            app : '.tmp'
        },

        uglify: {
            dist : {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {}
            },
            app : {
                options: {
                    mangle: false,
                    compress: false
                },
                files: {}
            }
        },

        concurrent: {
            options: {
                limit: 8
            },
            dist : {}
        },

        neuter: {
            options: {
                basePath : 'lib'
            },
            dist: {
                src: 'lib/utils.js',
                dest: 'dist/<%= pkg.version %>.utils.js'
            },

            app: {
                src: 'lib/utils.js',
                dest: 'dist/<%= pkg.version %>.utils.js'
            }
        }
    });


    grunt.registerTask('test', [
        'clean:test',
        'concurrent:test',
        'clean:tesst'
    ]);


    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'uglify:dist'
    ]);

    /*
     Generate a Release (also creates a build);
     */
    grunt.registerTask('release', 'Creates and Publishes a Versioned Release. Arg is target.',
        function (target) {

            var shouldBump = !!target;

            if (!shouldBump) {
                grunt.log.warn('[WARNING] grunt:release – No arguments provided. Version will not be bumped.');
            }

            if (shouldBump && !~['patch', 'major', 'minor', 'prerelease', 'git'].indexOf(target)) {
                grunt.log.error('[ERROR] grunt:release – "' + target + '" is not a valid semver target for to bump.');
                return false;
            }

            if (shouldBump) {
                grunt.task.run(['bump-only:' + target]);
            }

            grunt.task.run([
                'clean:dist',
                'concurrent:dist',
                'uglify:dist',
                'bump-commit'
            ]);

        }
        );

};
