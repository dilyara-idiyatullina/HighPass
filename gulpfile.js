const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const gulpif = require('gulp-if');
const argv = require('yargs').argv;

const clean = () => {
    return del(['dist'])
}

const fonts = () => {
    return src('src/fonts/**')
        .pipe(dest('dist/fonts'))
}

const styles = () => {
    return src([
        'src/css/styles.css',
        'src/css/normalize.css'
    ])
        .pipe(gulpif(!argv.prod, sourcemaps.init()))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(gulpif(argv.prod, cleanCSS({
            level: 2,
        })))
        .pipe(gulpif(!argv.prod, sourcemaps.write()))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
}

const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const svgSprites = () => {
    return src('src/img/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg',
                }
            }
        }))
        .pipe(dest('dist/img'))
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
    })
}

const images = () => {
    return src([
        'src/img/**/*.jpg',
        'src/img/**/*.jpeg',
        'src/img/**/*.png',
        'src/img/*.svg',
    ])
        .pipe(image())
        .pipe(dest('dist/img'))
}

const scripts = () => {
    return src('src/js/**/*.js')
        .pipe(gulpif(!argv.prod, sourcemaps.init()))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulpif(argv.prod, uglify().on('error', notify.onError())))
        .pipe(gulpif(!argv.prod, sourcemaps.write()))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
}

watch('src/**/*.html', htmlMinify);
watch('src/css/**/*.css', styles);
watch('src/img/svg/**/*.svg', svgSprites);
watch('src/img/**/*.jpg', images);
watch('src/img/**/*.jpeg', images);
watch('src/img/**/*.png', images);
watch('src/img/*.svg', images);
watch('src/js/**/*.js', scripts);
watch('src/fonts/**', fonts)

exports.styles = styles;
exports.htmlMinify = htmlMinify;
exports.scripts = scripts;
exports.default = series(clean, fonts, htmlMinify, scripts, styles, images, svgSprites, watchFiles);
