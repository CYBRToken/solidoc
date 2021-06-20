const nodeHelper = require('../helpers/node-helper')

const getBaseContract = (contracts, superId) => {
  for (const i in contracts) {
    const contract = contracts[i]
    const result = nodeHelper.findNodeById(contract.ast.nodes, superId)

    if (result.id === superId) {
      return contract
    }
  }
}

const build = (node, contracts) => {
  if (!node) {
    return ''
  }

  const builder = []
  builder.push('⤾ ')
  builder.push('overrides ')

  const superId = node.superFunction || 0

  if (superId === 0) {
    return ''
  }

  const baseContract = getBaseContract(contracts, superId)
  builder.push(`[${baseContract.contractName}.${node.name}](${baseContract.contractName}.md#${node.name.toLowerCase()})`)

  return builder.join('')
}

module.exports = { build }
