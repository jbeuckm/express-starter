
var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;

const jasmine = require('gulp-jasmine');


/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['server.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', function() {
  gulp.run('server')

  gulp.watch(['./*.js', './**/*.js'], function() {
    gulp.run('test');
    gulp.run('server');
  });
  
  // Need to watch for sass changes too? Just add another watch call!
  // no more messing around with grunt-concurrent or the like. Gulp is
  // async by default.
});



gulp.task('test', () =>
    gulp.src('spec/*.js')
        // gulp-jasmine works on filepaths so you can't have any plugins before it 
        .pipe(jasmine())
);

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
});
