module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/index.coffee',
      'src/has-feedback.coffee',
      'src/form-group.coffee',
      'tests/has-feedback.coffee',
      'tests/form-group.coffee'
    ],
    preprocessors: {
      'src/*.coffee': 'coffee',
      'tests/*.coffee': 'coffee'
    },
    port: 8080,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    singleRun: true
  })
}
