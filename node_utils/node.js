const findNodeById = (nodes, id) => {
  for (const i in nodes) {
    const node = nodes[i]

    if (node.id && node.id === id) {
      return node
    }

    if (node.nodes && node.nodes.length) {
      return this.findNodeById(node.nodes, id)
    }
  }

  return {}
}

const findOverriddenNodesByIds = (nodes, supers) => {
  let overriddenNodes = []

  for (const i in nodes) {
    const node = nodes[i]

    if (node.superFunction && supers.indexOf(node.superFunction) >= 0) {
      overriddenNodes.push(node)
    }

    if (node.nodes && node.nodes.length) {
      overriddenNodes = overriddenNodes.concat(this.findOverriddenNodesByIds(node.nodes, supers))
    }
  }

  return overriddenNodes
}

module.exports = {
  findNodeById,
  findOverriddenNodesByIds
}
