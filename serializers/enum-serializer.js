
const nodeHelper = require('../helpers/node-helper')
const enumBuilder = require('../builders/enum-builder')
const i18n = require('../i18n')

const serialize = (contract, template, _contracts) => {
  const builder = []

  const nodes = nodeHelper.getEnumerators(contract)

  if (!nodes || !nodes.length) {
    return template.replace('{{Enumerators}}', '')
  }

  builder.push(`**${i18n.translate('Enums')}**`)
  builder.push('\n')

  for (const i in nodes) {
    const node = nodes[i]
    builder.push(enumBuilder.build(node))
  }

  template = template.replace('{{Enumerators}}', builder.join(''))

  return template
}

module.exports = { serialize }
