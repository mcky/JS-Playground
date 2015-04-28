var gulp = require('gulp')
	, browserSync = require('browser-sync')
	, browserify = require('browserify')
	, watchify = require('watchify')
	, source = require('vinyl-source-stream')
	, buffer = require('vinyl-buffer')
	, reload = browserSync.reload


gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir: "./app/"
		}
	})

	gulp.watch(['./app/src/js/**/*.js'], ['scripts'])
	gulp.watch(['./app/src/css/style.css'], ['css'])
	gulp.watch('./app/**/*.{html,css}').on('change', reload)
})

gulp.task('css', function() {
	return gulp.src('./app/src/css/style.css')
		.pipe(gulp.dest('./app/public/css'))
		.pipe(reload({stream: true}))
})

var bundler = browserify({
	entries:      ['./app/src/js/app.js'],
	cache:        {},
	packageCache: {},
	fullPaths:    true
})
var watcher = watchify(bundler)

gulp.task('scripts', function() {
	watcher
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./app/public/js'))
		.pipe(reload({stream: true}))
})

gulp.task('default', ['scripts', 'serve'])
