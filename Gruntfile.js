/**
 * Created by jinliang on 3/19/17.
 */
module.exports = function (grunt) {
    //project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mocha_istanbul: {
            coverage_unit_test: {
                src: [
                    'unit_test/user_test.js',
                    'unit_test/status_test.js',
                    'unit_test/announcement_test.js',
                    'unit_test/message_test.js',
                    'unit_test/privateMessage_test.js',
                ], // a folder works nicely
                options: {
                    reporter: 'spec',
                    captureFile: 'coverage_unit_test.txt',
                    mochaOptions: ['--ui', 'tdd'] // any extra options for mocha
                }
            },
            coverage_integration_test: {
                src: [
                    'integration_test/api_user.js',
                    'integration_test/api_status.js',
                    'integration_test/api_announcement.js',
                    'integration_test/api_message.js',
                    'integration_test/api_privateMessage.js'
                ], // a folder works nicely
                options: {
                    reporter: 'spec',
                    captureFile: 'coverage_integration_test.txt',
                    mochaOptions: ['--ui', 'tdd'] // any extra options for mocha
                }
            }
        },
        mochaTest:{
            local:{
                options:{
                    reporter: 'spec',
                    captureFile: 'unit_test/test_report/testResults.txt',
                    quiet: false,
                    clearRequireCache: false,
                    ui: 'tdd'
                },
                src:['unit_test/**/tests.js']
            },
            user_test:{
                options:{
                    reporter: 'spec',
                    captureFile: 'unit_test/test_report/testUserResults.txt',
                    quiet: false,
                    clearRequireCache: false,
                    ui: 'tdd'
                },
                src:['unit_test/**/user_test.js']
            },
            status_test:{
                options:{
                    reporter: 'spec',
                    captureFile: 'unit_test/test_report/testStatusResults.txt',
                    quiet: false,
                    clearRequireCache: false,
                    ui: 'tdd'
                },
                src:['unit_test/**/status_test.js']
            },
            announcement_test:{
                options:{
                    reporter: 'spec',
                    captureFile: 'unit_test/test_report/testAnnouncementResults.txt',
                    quiet: false,
                    clearRequireCache: false,
                    ui: 'tdd'
                },
                src:['unit_test/**/announcement_test.js']
            },
            message_test:{
                options:{
                    reporter: 'spec',
                    captureFile: 'unit_test/test_report/testMessageResults.txt',
                    quiet: false,
                    clearRequireCache: false,
                    ui: 'tdd'
                },
                src:['unit_test/**/message_test.js']
            },
            privateMessage_test:{
                options:{
                    reporter: 'spec',
                    captureFile: 'unit_test/test_report/testPrivateMessageResults.txt',
                    quiet: false,
                    clearRequireCache: false,
                    ui: 'tdd'
                },
                src:['unit_test/**/privateMessage_test.js']
            },
            api_test:{
                options:{
                    reporter: 'spec',
                    captureFile: 'integration_test/test_report/api_test_result.txt',
                    quite: false,
                    clearRequireCache: false,
                    ui: 'tdd'
                },
                src:['integration_test/**/api_test.js']
            },
            shippable:{
                options:{
                    reporter: 'mocha-junit-reporter',
                    reporterOptions:{

                    },
                    ui:'tdd'
                },
                src: ['test/**/table_message.js']
            }


        }

    });
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    //Test
    grunt.registerTask('api_test',['mochaTest:api_test']);
    grunt.registerTask('allInOne',['mochaTest: tests']);
    grunt.registerTask('all',['mochaTest:user_test', 'mochaTest:status_test', 'mochaTest:announcement_test', 'mochaTest:message_test', 'mochaTest:privateMessage_test']);
    grunt.registerTask('user_test',['mochaTest:user_test']);
    grunt.registerTask('status_test',['mochaTest:status_test']);
    grunt.registerTask('announcement_test',['mochaTest:announcement_test']);
    grunt.registerTask('message_test',['mochaTest:message_test']);
    grunt.registerTask('privateMessage_test',['mochaTest:privateMessage_test']);

    //Shippable
    grunt.registerTask('shippable', ['mochaTest:shippable', 'mocha_istanbul']);

    //Coverage
    grunt.registerTask('coverage', ['mocha_istanbul:coverage_unit_test','mocha_istanbul:coverage_integration_test']);


};