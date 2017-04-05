module.exports = function (grunt) {

    grunt.initConfig({
        watch:{
            jade:{
                files: ['views/**'],
                options:{
                    livereload: true
                }
            },
            js: {
                files:['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                //tasks:['jshint'],
                options:{
                    livereload: true
                }
            }
        },

        nodemon: {
            dev:{
                script:'app.js',
                options: {
                    args: [],
                    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
                    ext: 'js',
                    watch: ['./'],
                    nodeArgs: ['--debug'],
                    delay: 1000,
                    env:{
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },

        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }

    });

    //监视文件的增删改活动，并自动执行定义好的任务
    grunt.loadNpmTasks('grunt-contrib-watch')

    //监视入口文件app.js的改动，自动重起app.js服务
    grunt.loadNpmTasks('grunt-nodemon')

    //管理慢任务，比如某些模块的编译，能优化构建的时间，并可用来跑多个阻塞的任务，例如watch和nodemon任务
    grunt.loadNpmTasks('grunt-concurrent')

    //设置不会因语法错误而中断整个服务
    grunt.option('force', true)

    //注册一个任务
    grunt.registerTask('default', ['concurrent'])

}