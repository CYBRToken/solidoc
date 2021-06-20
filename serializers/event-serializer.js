
const nodeHelper = require('../helpers/node-helper')
const eventBuilder = require('../builders/event-builder')

const serialize = (contract, template, _contracts) => {
  const builder = []

  const nodes = nodeHelper.getEvents(contract)

  if (!nodes || !nodes.length) {
    return template.replace('{{Events}}', '')
  }

  builder.push(eventBuilder.build(nodes))

  template = template.replace('{{Events}}', builder.join(''))

  return template
}

module.exports = { serialize }
