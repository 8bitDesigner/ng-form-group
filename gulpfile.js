var gulp = require('gulp')
  , coffee = require('gulp-coffee')
  , concat = require('gulp-concat')

var files = [
  "src/index.coffee",
  "src/form-group.coffee",
  "src/has-feedback.coffee"
]

gulp.task('build', function() {
  return gulp.src(files)
         .pipe(coffee())
         .pipe(concat('index.js'))
         .pipe(gulp.dest('.'))
})

gulp.task('default', ['build'])

