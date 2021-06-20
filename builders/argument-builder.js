const helper = require('../helpers/documentation-helper')

const build = (node, params) => {
  if (!params || !params.length) {
    return ''
  }

  const builder = []

  for (const i in params) {
    const parameter = params[i]
    builder.push('| ')
    builder.push(parameter.name)
    builder.push(' | ')
    builder.push(parameter.typeDescriptions.typeString.replace('contract ', ''))
    builder.push(' | ')
    const doc = helper.get(node, 'param ' + parameter.name)
    builder.push(doc)
    builder.push(' | ')
    builder.push('\n')
  }

  return builder.join('')
}

module.exports = { build }
