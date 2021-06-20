const fs = require('fs')

const removePrevious = (contents) => {
  return contents.replace(/\[comment\]: #solidoc \(Start\).*\[comment\]: #solidoc \(End\)/gms, '{{{doc}}}')
}

const insertRoot = (contents, replacable) => {
  const toReplace = `[comment]: #solidoc (Start)\n${replacable}\n[comment]: #solidoc (End)`
  return contents.replace(/{{{doc}}}/g, toReplace)
}

const set = (replacable, readmeFile) => {
  if (!fs.existsSync(readmeFile)) {
    return
  }

  let contents = fs.readFileSync(readmeFile).toString()

  contents = removePrevious(contents)
  contents = insertRoot(contents, replacable)
  fs.writeFileSync(readmeFile, contents)
}

module.exports = { set }
