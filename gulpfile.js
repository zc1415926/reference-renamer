/**
 * Created by zc1415926 on 2017/5/15.
 */
let gulp = require('gulp');
let gulpWebpack = require('gulp-webpack');
let gulpUtil = require('gulp-util');
let useref = require('gulp-useref');
let webpack = require('webpack');

var webpackStream = require('webpack-stream');
let babel = require("gulp-babel");

let es2015 = require("babel-preset-es2015");
let react = require("babel-preset-react");
let electronConnect = require('electron-connect').server.create({path: './build', logLevel: 0});

let config = {
    path: {
        htmlSrcPath: 'src/app/index.html',
        htmlDestDir: 'build/app/',
        jsxSrcDir: 'src/app/',
        jsxDestDir: 'build/app/'
    }
};

gulp.task('copy-files', function () {
    gulp.src('package.json')
        .pipe(gulp.dest('build'));

    gulp.src('src/main.js')
        .pipe(gulp.dest('build'));

    gulp.src('src/app/index.html')
        .pipe(gulp.dest('build/app'));
});

gulp.task('copy-files-useref', function () {
    gulp.src('package.json')
        .pipe(gulp.dest('build'));

    gulp.src('src/main.js')
        .pipe(useref())
        .pipe(gulp.dest('build'));

    gulp.src('src/app/index.html')
        .pipe(useref())
        .pipe(gulp.dest('build/app'));
});

gulp.task('build-react', function () {
    gulp.src('src/app/**/*.jsx')
        .pipe(babel({presets: [es2015, react]}))
        .pipe(gulp.dest('temp/app'))
        .pipe(webpackStream({
            output:{filename: 'bundle.js'},
            stats:{colors:true},
        }, webpack))

        .pipe(gulp.dest('build/app'));
});

gulp.task('copyHtml', function () {
    gulp.src(config.path.htmlSrcPath)
        .pipe(gulp.dest(config.path.htmlDestDir));
});

gulp.task('watchWithConnect', function () {
    electronConnect.start();

    gulp.watch('src/app' + '**/*.jsx', ['build-react']);
    gulp.watch('src/app/index.html', ['copyHtml']);
    gulp.watch('src/main.js', function () {
        gulp.src('src/main.js')
            .pipe(gulp.dest('build'));
    });

    gulp.watch('build/app' + '/**/*', function () {
        electronConnect.reload();
        gulpUtil.log('Electron reloaded');
    });
    gulp.watch('build/main.js', function () {
        electronConnect.restart();
        gulpUtil.log('Electron restarted');
    });

    //Cann't stop watch. Gulp is just running as a never ending process
});

// gulp.watch cann't watch new files,
// using Ctrl + R for reload manually.
var release = require('./build.windows');
gulp.task('release', function () {
    return release.build();
});

gulp.task('build', ['copy-files', 'build-react']);
gulp.task('build-useref', ['copy-files-useref', 'build-react']);
gulp.task('run', ['watchWithConnect']);
gulp.task('default', ['copy-files', 'build-react', 'watchWithConnect']);