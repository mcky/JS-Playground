var gulp = require('gulp')
	,browserSync = require('browser-sync')


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./app/"
        }
    })
})

gulp.task('browserSync', function () {
    return gulp.src("./app/**/*.{html,css,js}")
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch("./app/**/*.{html,css,js}", ['browserSync']);
});
