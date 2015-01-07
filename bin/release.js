var semver = require('semver')
  , fs = require('fs')
  , path = require('path')
  , exec = require('child_process').exec
  , version = semver.inc(process.env.npm_package_version, process.argv[2])
  , bowerPath = path.join(process.cwd(), 'bower.json')
  , npmPath = path.join(process.cwd(), 'package.json')

function updateJson(path, version) {
  var file = require(path)
  file.version = version
  fs.writeFileSync(path, JSON.stringify(file, null, 2))
}

// Update and write updated JSON files
updateJson(bowerPath, version)
updateJson(npmPath, version)

// This is a terrible shell script
exec([
  'echo "## Building project"',
  'echo ""',
  'gulp',
  'git add index.js',
  'git add index.min.js',
  'echo ""',
  'echo "## Tagging"',
  'echo ""',
  'git add '+bowerPath,
  'git add '+npmPath,
  'git commit -m"v'+version+'"',
  'git tag v'+version
].join(' && '), function(err, stdout, stderr) {
  console.log(stdout)
  console.error(stderr)

  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log('## All done!')
    console.log('Run `git push && git push --tags` to commit release v'+version)
    console.log('')
  }
})

