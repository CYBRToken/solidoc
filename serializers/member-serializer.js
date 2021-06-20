const nodeHelper = require('../helpers/node-helper')
const memberBuilder = require('../builders/member-builder')

const serialize = (contract, template, _contracts) => {
  const nodes = nodeHelper.getMembers(contract)

  if (!nodes || !nodes.length) {
    return template.replace('{{Members}}', '')
  }

  template = template.replace('{{Members}}', memberBuilder.build(nodes))
  return template
}

module.exports = { serialize }
