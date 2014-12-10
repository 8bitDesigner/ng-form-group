var gulp = require('gulp')
  , coffee = require('gulp-coffee')
  , ngAnnotate = require('gulp-ng-annotate')
  , uglify = require('gulp-uglify')
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

gulp.task('minified', function() {
  return gulp.src(files)
         .pipe(coffee())
         .pipe(ngAnnotate())
         .pipe(uglify())
         .pipe(concat('index.min.js'))
         .pipe(gulp.dest('.'))
})

gulp.task('default', ['build', 'minified'])

