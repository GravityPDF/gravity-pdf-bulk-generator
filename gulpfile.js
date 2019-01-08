var gulp = require('gulp'),
  wpPot = require('gulp-wp-pot')

/* Generate the latest language files */
gulp.task('language', function () {
  return gulp.src(['src/**/*.php', '*.php'])
    .pipe(wpPot({
      domain: 'gravity-pdf-bulk-generator',
      package: 'Gravity PDF Bulk Generator'
    }))
    .pipe(gulp.dest('languages/gravity-pdf-bulk-generator.pot'))
})

gulp.task('default', ['language'])