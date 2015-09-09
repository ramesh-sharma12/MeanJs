/// <reference path='typings/tsd.d.ts' />

import gulp = require("gulp");
//import inject = require('gulp-inject');
import less = require('gulp-less');
import plumber = require('gulp-plumber');
import sourcemaps = require('gulp-sourcemaps');
import tsc = require('gulp-typescript');
import watch = require('gulp-watch');
import del = require('del');
import fs = require('fs');
import path = require('path');
import join = path.join;
import runSequence = require('run-sequence');
import express = require('express');
import serveStatic = require('serve-static');
import openResource = require('open');
import nodemon = require('gulp-nodemon');

var tinylr = require('tiny-lr')(),
    connectLivereload = require('connect-livereload'),
    shell = require('gulp-shell'),
    inject = require('gulp-inject'),
    template = require('gulp-template'),
    Builder = require('systemjs-builder'),
    liveServer = require('gulp-live-server');

// --------------
// Configuration.
var APP_BASE = '/';

var config = {
    PATH: {
        dest: {
            all: 'dist',
            dev: {
                base: 'dist/dev',
                all: 'dist/dev/app',
                lib: 'dist/dev/app/lib',
                css: 'dist/dev/app/css',
                ng2: 'dist/dev/app/lib/angular2.js',
                router: 'dist/dev/app/lib/router.js',
                server: 'dist/dev/server',
                views: 'dist/dev/server/views'
            }
        },
        src: {
            // Order is quite important here for the HTML tag injection.
            lib: [
                './node_modules/angular2/node_modules/traceur/bin/traceur-runtime.js',
                './node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.js',
                //'./node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.js.map',
                './node_modules/reflect-metadata/Reflect.js',
                //'./node_modules/reflect-metadata/Reflect.js.map',
                './node_modules/systemjs/dist/system.src.js',
                './node_modules/angular2/node_modules/zone.js/dist/zone.js',
                './node_modules/es6-promise/dist/es6-promise',
                './node_modules/jquery/dist/jquery.js',
                //'./node_modules/jquery/dist/jquery.js.map',
                './node_modules/bootstrap/dist/js/bootstrap.js',
                './node_modules/bootstrap/dist/css/bootstrap.css'//,
                //'./node_modules/bootstrap/dist/css/bootstrap.css.map'
            ]
        }
    },

    PORT: 3000,
    LIVE_RELOAD_PORT: 4002,

    ng2Builder: new Builder({
        paths: {
            'angular2/*': 'node_modules/angular2/es6/dev/*.js',
            rx: 'node_modules/angular2/node_modules/rx/dist/rx.js'
        },
        meta: {
            rx: {
                format: 'cjs'
            }
        }
    }),    

    HTMLMinifierOpts: { conditionals: true },

    tsProject: tsc.createProject('tsconfig.json', {
        typescript: require('typescript')
    })
};

var utils = {
    getVersion: function ()
    {
        //var pkg = JSON.parse(fs.readFileSync('package.json'));
        return '1.0.0';//pkg.version;
    },

    transformPath: function (env)
    {
        var v = '?v=' + this.getVersion();
        return function (filepath)
        {
            var filename = filepath.replace('/' + config.PATH.dest[env].all, '') + v;
            arguments[0] = join(APP_BASE, filename);
            return inject.transform.apply(inject.transform, arguments);
        };
    },

    notifyLiveReload: function (e)
    {
        var fileName = e.path;
        tinylr.changed({
            body: {
                files: [fileName]
            }
        });
    },

    injectableDevAssetsRef: function ()
    {
        var src = config.PATH.src.lib.map(function (path)
        {
            return join(config.PATH.dest.dev.lib, path.split('/').pop());
        });

        src.push(config.PATH.dest.dev.ng2,
            config.PATH.dest.dev.router,
            join(config.PATH.dest.dev.all, '**/*.css'));

        return src;
    },

    templateLocals: function ()
    {
        return {
            VERSION: this.getVersion(),
            APP_BASE: APP_BASE
        }
    },

    serveSPA: function (env)
    {
        var app;
        app = express().use(APP_BASE,
            connectLivereload({ port: config.LIVE_RELOAD_PORT }),
            serveStatic(join(__dirname, config.PATH.dest[env].all)));

        app.all(APP_BASE + '*', function (req, res, next)
        {
            res.sendFile(join(__dirname, config.PATH.dest[env].all, 'index.html'));
        });

        app.listen(config.PORT, function ()
        {
            openResource('http://localhost:' + config.PORT + APP_BASE);
        });
    }
};

// --------------
// Clean.

gulp.task('clean', function (done)
{
    del(config.PATH.dest.all, done);
});


// --------------
// Build dev.

gulp.task('build.ng2', function ()
{
    config.ng2Builder.build('angular2/router', config.PATH.dest.dev.router, {});
    return config.ng2Builder.build('angular2/angular2', config.PATH.dest.dev.ng2, {});
});


gulp.task('build.lib', ['build.ng2'], function ()
{
    return gulp.src(config.PATH.src.lib)
        .pipe(gulp.dest(config.PATH.dest.dev.lib));
});

gulp.task('build.client.js', function ()
{
    var result = gulp.src([
        './app/**/**/*.ts',
        './app/**/*.ts'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsc(config.tsProject));

    return result.js
        .pipe(sourcemaps.write())
        .pipe(template(utils.templateLocals()))
        .pipe(gulp.dest(config.PATH.dest.dev.all));
});

gulp.task('build.server.js', function ()
{
    var result = gulp.src(['./server/**/*.ts'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsc(config.tsProject));

    return result.js
        .pipe(sourcemaps.write())
        .pipe(template(utils.templateLocals()))
        .pipe(gulp.dest(config.PATH.dest.dev.server));
});

gulp.task('build.js', function ()
{
    var result = gulp.src(['./*.ts'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(tsc(config.tsProject));

    return result.js
        .pipe(sourcemaps.write())
        .pipe(template(utils.templateLocals()))
        .pipe(gulp.dest(config.PATH.dest.dev.base));
});
gulp.task('build.less', function ()
{
    return gulp.src('./app/less/*.less')
        .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
    }))
        .pipe(gulp.dest(config.PATH.dest.dev.css));
});

gulp.task('build.components', ['build.client.js'], function ()
{
    return gulp.src(['./app/**/**/*.html'])
        .pipe(gulp.dest(config.PATH.dest.dev.all));
});

gulp.task('build.index', function ()
{
    var target = gulp.src(utils.injectableDevAssetsRef(), { read: false });
    return gulp.src('./server/views/index.html')
        .pipe(inject(target, { transform: utils.transformPath('dev') }))
        .pipe(template(utils.templateLocals()))
        .pipe(gulp.dest(config.PATH.dest.dev.base));
});

//gulp.task('build.index', function ()
//{
//    var target = gulp.src(utils.injectableDevAssetsRef(), { read: false });
//    return gulp.src('./server/views/index.html')
//        .pipe(inject(target, {
//            starttag: "<head>",
//            endtag: "</head>",
//            transform: (filepath, file, i, length) =>
//            {
//                console.log(file);

//                var filename = filepath.replace('/' + config.PATH.dest.dev.all, '');
//                var srcPath = join(APP_BASE, filename);

//                if (srcPath.indexOf('.css') !== -1)
//                {
//                    return '<link rel="stylesheet" href="' + srcPath + '" >';
//                }
//                else
//                {
//                    return "<script src='" + srcPath + "'></script>";
//                }
//            }
//        }))
//        .pipe(template(utils.templateLocals()))
//        .pipe(gulp.dest(config.PATH.dest.dev.base));
//});

gulp.task('build.server', function (done)
{
    runSequence('build.js', 'build.server.js', done);
});

gulp.task('build.assets', function (done)
{
    runSequence('build.components', 'build.less', done);
});


gulp.task('build.app', function (done)
{
    runSequence('build.assets', 'build.index', done);
});

gulp.task('build', function (done)
{
    runSequence('build.lib', 'build.server', 'build.app', done);
});

// Livereload.

gulp.task('livereload', function ()
{
    tinylr.listen(config.LIVE_RELOAD_PORT);
});

// demon

//gulp.task('demon', function () {
//    nodemon({
//        script: config.PATH.dest.dev.base + '/start.js',
//        ext: 'js html css',
//        verbose: true,
//        env: { 'NODE_ENV': 'development' },
//        tasks: ['clean', 'build', 'livereload'],
//        ignore: ['./gulpFile.ts',
//            './run.sh',
//            './start',
//            './start.ts',
//            './typings',
//            './tests',
//            './node_modules/'
//        ]
//    });

//});

gulp.task('server', function ()
{

    var server = liveServer.new(config.PATH.dest.dev.base + '/start.js');
    server.start();

    gulp.watch(config.PATH.dest.dev.all, function (file)
    {
        server.notify.apply(server, [file]);
    });

    gulp.watch(config.PATH.dest.dev.base + '/start.js', server.start.bind(server));

});

gulp.task('watch', function (cb)
{
    watch(['gulpFile.ts'], function (e)
    {
        runSequence('clean', 'build', function ()
        {
            utils.notifyLiveReload(e);
        });
    });
    watch(['./app/less/**'], function (e)
    {
        runSequence('build.less', function ()
        {
            utils.notifyLiveReload(e);
        });
    });
    watch(['./app/*.ts', './app/components/**', './app/services/*.ts'], function (e)
    {
        runSequence('build.components', function ()
        {
            utils.notifyLiveReload(e);
        });
    });

    watch(['./server/*.ts', './server/**'], function (e)
    {
        runSequence('build.server', function ()
        {
            utils.notifyLiveReload(e);
        });
    });
});

//gulp.task('debug', function () {
//    gulp.src(['./start.js', config.PATH.dest.dev.server + "/**"])
//        .pipe(nodeInspector({
//        debugPort: 3000,
//        webHost: '0.0.0.0',
//        webPort: 8080,
//        saveLiveEdit: false,
//        preload: true,
//        inject: true,
//        hidden: ["node_modules/"],
//        stackTraceLimit: 50,
//        sslKey: '',
//        sslCert: ''
//    }));
//});
// --------------

// Test.

// To be implemented.

// --------------
// Serve dev.
gulp.task('default', ['server', 'watch']);

gulp.task('serve', ['clean', 'build', 'livereload'], function (e)
{
    runSequence('default', function ()
    {
        utils.notifyLiveReload(e);
    });
    utils.serveSPA('dev');
});

gulp.task('start', ['clean', 'build', 'livereload'], function (e)
{
    runSequence('default', function ()
    {
        utils.notifyLiveReload(e);
    });
})