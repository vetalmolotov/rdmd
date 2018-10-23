const gulp = require('gulp');
const concat = require('gulp-concat');
var nodeSass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();


nodeSass.compiler = require('node-sass');

const scssFiles = [
	'./node_modules/normalize.css/normalize.css',
	'./src/sass/**/*.scss'
];

function sass() {
	return gulp
				.src(scssFiles)
        		.pipe(nodeSass.sync().on('error', nodeSass.logError))
        		.pipe(concat('styles.css'))
				.pipe(cleanCSS({
        			level: 2
        		}))
				.pipe(gulp.dest('./build/css'))
				.pipe(browserSync.stream());
}

function watch() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
	gulp.watch('./src/sass/**/*.scss', sass);
	gulp.watch('./**/*.html', browserSync.reload);
}

function clean() {
	return del(['build/*']);
}

//gulp.task('sass', sass);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, sass));
gulp.task('dev', gulp.series('build', 'watch'));

