const enumerable = require('linq')

const getConstructorNode = (contract) => {
  let constructorNode = enumerable.from(contract.ast.nodes).where(function (x) {
    return x.isConstructor
  }).firstOrDefault()

  if (constructorNode) {
    return constructorNode
  }

  for (const i in contract.ast.nodes) {
    const node = contract.ast.nodes[i]

    constructorNode = enumerable.from(node.nodes).where(function (x) {
      return x.isConstructor
    }).firstOrDefault()

    if (constructorNode) {
      return constructorNode
    }
  }

  return {}
}

module.exports = {
  getConstructorNode
}
