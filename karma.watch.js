var existingConfig = require("./karma.conf.js")

module.exports = function(config) {
  existingConfig(config)
  config.set({
    autoWatch: true,
    singleRun: false
  })
}
