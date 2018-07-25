var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoPrefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');


// sass task
gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoPrefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

// scripts task
gulp.task('scripts', function() {
    return gulp.src('app/js/**/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('app/es5'))
});

// image minification
gulp.task('images', function() {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

// fonts task
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

// clean distribution
gulp.task('clean:dist', function() {
    return del.sync('dist');
});

// clean image cache
gulp.task('cache:clear', function(callback) {
    return cache.clearAll(callback)
});

// useref task
gulp.task('useref', function() {
    return gulp.src('app/*.html')
    .pipe(useref())
    // minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
    //minifies if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// serve
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

// watch
gulp.task('watch', ['serve', 'sass', 'scripts'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// build
gulp.task('build', function(callback) {
    runSequence('clean:dist',
    ['sass', 'scripts', 'useref', 'images', 'fonts'],
    callback  
    )  
});

// default
gulp.task('default', function(callback) {
    runSequence(['sass', 'scripts', 'serve', 'watch'],
    callback
    )
});