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

	gulp.watch(['./app/js/**/*.js'], ['scripts'])
	gulp.watch("./app/**/*.{html,css}").on('change', reload)
})

var bundler = browserify({
	entries:      ['./app/js/app.js'],
	cache:        {},
	packageCache: {},
	fullPaths:    true
})
var watcher = watchify(bundler)

gulp.task('scripts', function() {
	watcher
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./app/js'))
		.pipe(reload({stream: true}))
})

gulp.task('default', ['scripts', 'serve'])
