
const path = require('path')
const fs = require('fs-extra')

const getResource = () => {
  function getPath () {
    const language = global.config.language || 'en'
    const file = path.join(__dirname, 'i18n', `${language}.json`)
    const override = path.join(process.cwd(), '.solidoc', 'i18n', `${language}.json`)

    if (fs.existsSync(override)) {
      return override
    };

    return file
  }
  const file = getPath()

  if (fs.existsSync(file)) {
    const resource = require(file)
    return resource
  }

  return undefined
}

const translate = (key) => {
  const resource = getResource()
  const entry = resource[key]
  return entry || key
}

module.exports = {
  getResource,
  translate
}
