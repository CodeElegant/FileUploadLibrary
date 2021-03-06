'use strict';

const gulp = require('gulp');
const ejs = require('gulp-minify-ejs');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const del = require('del');
const git = require('gulp-git');
// const babel = require('gulp-babel');

sass.compiler = require('node-sass');

gulp.task('git-add', (done) => {
    gulp.src('./public/**/*')
        .pipe(git.add({
            quiet: true
        }));
        done();
});

gulp.task('minify-ejs', (done) => {
    gulp.src('src/views/*.ejs')
        .pipe(ejs())
        .pipe(gulp.dest('public/views'));
        done();
});

gulp.task('minify-es6', (done) => {
    gulp.src('src/javascripts/*.js')
        .pipe(terser({
            ecma: 12,
            mangle: false
        }))
        .pipe(gulp.dest('public/javascripts'));
        done();
});

gulp.task('compile-sass', (done) => {
    gulp.src('src/css/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('public/css'));
        done();
});

gulp.task('clean', () => {
    return del([
        'css/main.css',
    ]);
});

gulp.task('watch', () => {
    gulp.watch('src/css/*.scss', gulp.series('compile-sass'));
    gulp.watch('src/views/*.ejs', gulp.series('minify-ejs'));
    // gulp.watch('src/javascripts/main.js', gulp.series('minify-es6'));
    gulp.watch('./public/**/*', gulp.series('git-add'));
});

gulp.task('default', gulp.parallel(
        // 'git-add',
        // 'minify-ejs',
        // 'compile-sass',
        // 'minify-es6'
        'watch'
    )
);