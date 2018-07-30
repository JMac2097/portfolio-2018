var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var pump = require('pump');
var htmlmin = require('gulp-htmlmin')
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var autoPrefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

// paths
var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcSASS: 'src/styles/**/*.scss',
    srcJS: 'src/scripts/**/*.js',
    srcIMAGES: 'src/images/**/*.+(png|jpg|gif|svg)',

    tmp: 'tmp/',
    tmpHTML: 'tmp//**/*.html',
    tmpCSS: 'tmp/styles/**/*.css',
    tmpJS: 'tmp/scripts/**/*.js',
    tmpIMAGES: 'tmp/images/**/*.+(png|jpg|gif|svg)',
};
//  destination variables
var dest = {
    tmp: 'tmp/',
    tmpCSS: 'tmp/styles/',
    tmpJS: 'tmp/scripts/',
    tmpIMAGES: 'tmp/images/',

    dist: 'dist/',
    distCSS: 'dist/styles/',
    distJS: 'dist/scripts/',
    distIMAGES: 'dist/images/'
};

// html task
gulp.task('html', function() {
    gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.tmp));
});

// sass task
gulp.task('sass', function() {
    return gulp.src(paths.srcSASS)
    .pipe(sourcemaps.init())
    .pipe(sass({
        style: 'compressed',
        errLogToConsole: false,
        onError: function(err) {
            return notify().write(err);
        }
    }))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(dest.tmpCSS))
    .pipe(browserSync.stream());
});

// scripts task
gulp.task('scripts', function() {
    return gulp.src(paths.srcJS)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest(dest.tmpJS));
});

// image minification
gulp.task('images', function() {
    return gulp.src(paths.srcIMAGES)
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest(dest.tmpIMAGES));
});

// serve
gulp.task('serve',['html', 'sass', 'scripts', 'images'], function() {
    browserSync.init({
        server: {
            baseDir: paths.tmp
        },
    })
    gulp.watch(paths.srcSASS, ['sass']);
    gulp.watch(paths.srcSASS).on('change', browserSync.reload);
    gulp.watch(paths.srcHTML, ['html']);
    gulp.watch(paths.srcHTML).on('change', browserSync.reload);
    gulp.watch(paths.srcJS, ['scripts']);
    gulp.watch(paths.srcJS).on('change', browserSync.reload);
});


gulp.task('default', ['serve']);

// Production tasks
gulp.task('prod:css', function() {
    return gulp.src(paths.tmpCSS)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoPrefixer())
    .pipe(gulp.dest(dest.distCSS));
});

gulp.task('prod:js', function(callback) {
    pump([
        gulp.src(paths.tmpJS),
        uglify(),
        gulp.dest(dest.distJS)
        ],
    callback
    );
});

gulp.task('prod:html', function() {
    return gulp.src(paths.tmpHTML)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dest.dist));
});

gulp.task('prod:images', function() {
    return gulp.src(paths.tmpIMAGES)
    .pipe(gulp.dest(dest.distIMAGES));
});

// clean image cache
gulp.task('cache:clear', function(callback) {
    return cache.clearAll(callback);
});

// clean distribution
gulp.task('dist:clean', function() {
    return del.sync(dest.dist);
});

gulp.task('prod', ['dist:clean', 'prod:html', 'prod:css', 'prod:images', 'prod:js']);

// === Notes ==============================================================================

// Maybe some templating options
// Deal with multiple html files better -- again partials here
// Better image compression?
// Better error handling