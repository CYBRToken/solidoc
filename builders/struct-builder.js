const enumerable = require('linq')

const build = (node) => {
  if (!node) {
    return ''
  }

  const builder = []

  builder.push(`### ${node.name}`)
  builder.push('\n')
  builder.push('\n')
  builder.push('```js')
  builder.push('\n')
  builder.push(`struct ${node.name} {`)
  builder.push('\n')

  const members = enumerable.from(node.members).select((x) => {
    return ` ${x.typeDescriptions.typeString} ${x.name}`
  }).toArray()

  builder.push(members.join(',' + '\n'))

  builder.push('\n')

  builder.push('}')
  builder.push('\n')
  builder.push('```')
  builder.push('\n')
  builder.push('\n')

  return builder.join('')
}

module.exports = { build }
