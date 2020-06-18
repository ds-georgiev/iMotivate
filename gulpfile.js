var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    rtlcss = require('gulp-rtlcss'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    debug = require('gulp-debug'),
    concat = require('gulp-concat'),
    svgSprite = require('gulp-svg-sprite'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify-es').default;
var postcss = require('gulp-postcss');
var svgConfig = {
    mode: {
        symbol: {
            inline: true,
            prefix: ".svg %s-svg"
        }
    },
    shape: {
        id: {
            generator: function(name, file) {
                var svg_id = 'svg-' + name;
                return svg_id.replace(/\.[^/.]+$/, "");
            }
        }
    }
};
var onError = function(err) {
    console.log('An error occurred:', gutil.colors.magenta(err.message));
    gutil.beep();
};
// css
gulp.task('css-lib', function() {
    gulp.src(['./app/css/lib/*.css'])
        .pipe(cleanCSS())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./public/styles/'))
});
// Scss
gulp.task('scss', function() {
    // var plugins = [
    //     autoprefixer()
    // ];
    return gulp.src('./app/scss/*.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(concat('global.css'))
        .pipe(gulp.dest('./public/styles/'))
        .pipe(rtlcss()) // Convert to RTL
        .pipe(rename({ basename: 'rtl' })) // Rename to rtl.css
        .pipe(gulp.dest('./public/styles/')); // Output RTL stylesheets (rtl.css)
});

//JS Lib
gulp.task('js-lib', function() {
    return gulp.src(['./app/js/lib/*.js'])
        .pipe(concat('vendor.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

//Javascript
gulp.task('js', function() {
    return gulp.src(['./app/js/*.js'])
        .pipe(concat('app.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

// Images
gulp.task('images', function() {
    return gulp.src('./app/images/**/*')
        .pipe(plumber({ errorHandler: onError }))
        // .pipe(imagemin())
        .pipe(gulp.dest('./public/images'));
});

gulp.task('svg', function() {
    gulp.src('./app/svg/*.svg')
        .pipe(svgSprite(svgConfig))
        .pipe(gulp.dest('./public/svg'));
});
// Watch
gulp.task('watch', function() {
    gulp.watch('./app/scss/**/*.scss', gulp.series('scss'));
    gulp.watch('./app/css/lib/**/*.css',  gulp.series('css-lib'));
    gulp.watch('./app/js/**/*.js',  gulp.series('js'));
    gulp.watch('./app/js/lib/**/*.js',  gulp.series('js-lib'));
    gulp.watch('./app/images/src/*',  gulp.series('images'));
    gulp.watch('./app/svg/*',  gulp.series('svg'));
});
// Fonts
gulp.task('fonts', function() {
    gulp.src('./app/fonts/**/*')
        .pipe(gulp.dest('./public/fonts'));
});
gulp.task('build', gulp.parallel('svg', 'scss', 'images', 'css-lib', 'js-lib', 'js', 'fonts'));
gulp.task('default', gulp.parallel('build', 'watch'));