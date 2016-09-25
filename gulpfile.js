
var gulp = require('gulp'),
    minifycss = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del'),
    //inject = require('gulp-inject'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('jshint', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('default', ['clean'], function () {
    gulp.start('usemin', 'imagemin', 'copyFonts');
});

gulp.task('usemin', ['jshint'], function () {
    return gulp.src('./app/**/*.html')
        .pipe(usemin({
            css: [minifycss(), rev()],
            js: [ngAnnotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function () {
    return del(['dist/images']), gulp.src('app/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

//gulp.task('inject', ['usemin'], function () {
//    var target = gulp.src(['!app/menu.html', 'app/*.html']);
//    var src = gulp.src(['**/*.js', '**/*.css'], {
//        cwd: __dirname + '/dist/',
//        read: false
//    });
//
//    return target.pipe(inject(src, {addRootSlash: false}))
//        .pipe(gulp.dest('dist/'));
//});

gulp.task('copyFonts', ['clean'], function () {
    gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eoff,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eoff,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);

    gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('browser-sync', ['default'], function () {
    var files = [
        'app/**/*.html',
        'app/styles/**/*.css',
        'app/images/**/*.png',
        'app/scripts/**/*.js',
        'dist/**/*'
    ];

    browserSync.init(files, {
        server: {
            baseDir: 'dist',
            index: 'index.html'
        }
    });

    gulp.watch(['dist/**']).on('change', browserSync.reload);

});
