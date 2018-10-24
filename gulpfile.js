const gulp = require('gulp');
const concat = require('gulp-concat');
const nodeSass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const pugTemplate = require('gulp-pug');


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
				.pipe(autoprefixer({
					browsers: ['last 2 versions'],
					cascade: false
				}))
				.pipe(cleanCSS({
        			level: 2
        		}))
				.pipe(gulp.dest('./build/css'))
				.pipe(browserSync.stream());
}

function pug() {
	return gulp
				.src('./src/pug/*.pug')
				.pipe(pugTemplate({
					pretty: true
				}))
				.pipe(gulp.dest('./build/'));
}

function watch() {
	browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
	gulp.watch('./src/sass/**/*.scss', sass);
	gulp.watch('./src/pug/**/*.pug', pug);
	gulp.watch('./build/*.html', browserSync.reload);
}

function clean() {
	return del(['build/*']);
}

gulp.task('sass', sass);
gulp.task('pug', pug);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
									gulp.parallel(sass, pug)
								));
gulp.task('dev', gulp.series('build', 'watch'));

