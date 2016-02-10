var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	minifycss = require('gulp-minify-css'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	del = require('del');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "../public/"
		}
	});
});

gulp.task('bs-reload', function() {
	browserSync.reload();
});

gulp.task('images', function() {
	gulp.src(['src/images/**/*'])
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('../public/assets/images/'));
});

gulp.task('clear_styles', function () {
	return del('../public/assets/styles/**/*');
});

gulp.task('styles', function() {
	gulp.src(['src/styles/main.sass'])
		.pipe(plumber({
			errorHandler: function(error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(sass())
		.pipe(concat('bundle.css'))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifycss())
		.pipe(gulp.dest('../public/assets/styles/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('scripts', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(plumber({
			errorHandler: function(error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(concat('main.js'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('../public/assets/scripts/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('../public/assets/fonts/'));
});

gulp.task('libs', function() {
	return gulp.src('src/libs/**/*')
		.pipe(gulp.dest('../public/assets/libs/'));
});

gulp.task('html', function() {
	return gulp.src('*.html')
		.pipe(gulp.dest('../public/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// gulp.task('clean', function () {
// 	return del('');
// });

gulp.task('build', ['html','fonts','styles','images','libs','scripts'], function () {
	console.log('BUILD COMPLETE!');
});

gulp.task('default', ['build','browser-sync'], function() {
	gulp.watch("src/styles/**/*.*", ['styles']);
	gulp.watch("src/scripts/**/*.js", ['scripts']);
	gulp.watch("*.html", ['html']);
});