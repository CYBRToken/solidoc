const enumerable = require('linq')
const nodeHelper = require('./node')

const findNodeById = (contract, id) => {
  return nodeHelper.findNodeById(contract.ast.nodes, id)
}

const findNodeByIdMultipleContracts = (contracts, id) => {
  for (const i in contracts) {
    const contract = contracts[i]

    const node = findNodeById(contract, id)
    if (node.id && node.id === id) {
      return node
    }
  }

  return {}
}

const findOverriddenNodesByIdMultiple = (nodes, ids) => {
  let result = []

  for (const i in nodes) {
    const node = nodes[i]

    if (ids.indexOf(node.superFunction) >= 0) {
      result.push(node)
    }

    if (node.nodes && node.nodes.length) {
      result = result.concat(findOverriddenNodesByIdMultiple(node.nodes, ids))
    }
  }

  return result
}

const findOverriddenNodesById = (contracts, id) => {
  const result = []

  const tree = getOverriddenFunctions(contracts, id)
  for (const i in contracts) {
    const contract = contracts[i]

    if (!contract.ast) {
      continue
    }

    const found = findOverriddenNodesByIdMultiple(contract.ast.nodes, tree)

    for (const i in found) {
      const node = found[i]

      result.push({
        contract: contract,
        node: node
      })
    }
  }

  return result
}

const getBaseContracts = (contract) => {
  const node = enumerable.from(contract.ast.nodes).where(function (x) {
    return x.baseContracts && x.baseContracts.length
  }).firstOrDefault()

  if (node) {
    return node.baseContracts
  }

  return {}
}

const getContractNode = (contract) => {
  const contractNode = enumerable.from(contract.ast.nodes).where(function (x) {
    return x.nodeType === 'ContractDefinition'
  }).firstOrDefault()

  if (contractNode) {
    return contractNode
  }

  const nodes = enumerable.from(contract.ast.nodes).where(function (x) {
    return x.nodes
  }).toArray()

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]

    if (node.nodeType === 'ContractDefinition') {
      return node
    }
  }

  return {}
}

const getMembers = (contract) => {
  const members = []
  const nodes = enumerable.from(contract.ast.nodes).where(function (x) {
    return x.nodeType === 'ContractDefinition'
  }).toArray()

  for (const i in nodes) {
    for (const j in nodes[i].nodes) {
      const member = nodes[i].nodes[j]
      if (member.nodeType === 'VariableDeclaration') {
        members.push(member)
      }
    }
  }

  return members
}

const getOverriddenFunctions = (contracts, superId) => {
  let references = [superId]

  for (const i in contracts) {
    const contract = contracts[i]

    if (!contract.ast || !contract.ast.nodes) {
      continue
    }

    for (const j in contract.ast.nodes) {
      const node = contract.ast.nodes[j]

      if (node.superFunction === superId) {
        references.push(node.id)
        references = references.concat(getOverriddenFunctions(contracts, node.id))
      }

      if (node.nodes && node.nodes.length) {
        for (const k in node.nodes) {
          const child = node.nodes[k]
          if (child.superFunction === superId) {
            references.push(child.id)
            references = references.concat(getOverriddenFunctions(contracts, child.id))
          }
        }
      }
    }
  }

  return references
}

module.exports = {
  findNodeById,
  findNodeByIdMultipleContracts,
  findOverriddenNodesByIdMultiple,
  findOverriddenNodesById,
  getBaseContracts,
  getContractNode,
  getMembers,
  getOverriddenFunctions
}
