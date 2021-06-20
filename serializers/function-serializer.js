const nodeHelper = require('../helpers/node-helper')
const enumerable = require('linq')
const templateHelper = require('../helpers/template-helper')
const documentationHelper = require('../helpers/documentation-helper')
const codeBuilder = require('../builders/function-code-builder')
const superBuilder = require('../builders/super-builder')
const referenceBuilder = require('../builders/function-reference-builder')
const argumentBuilder = require('../builders/argument-builder')
const i18n = require('../i18n')

const cleaned = (template) => {
  template = template.replace('{{FunctionTitle}}', '')
  template = template.replace('{{FunctionList}}', '')
  template = template.replace('{{AllFunctions}}', '')

  return template
}

const serialize = (contract, template, contracts) => {
  const allFunctions = nodeHelper.getFunctions(contract)

  const functionNodes = enumerable.from(allFunctions).where((x) => {
    return !x.isConstructor
  }).toArray()

  if (!functionNodes || !functionNodes.length) {
    return cleaned(template)
  }

  const definitionList = []
  const functionList = enumerable.from(functionNodes).select((x) => {
    const parameters = x.parameters.parameters || []
    const parameterList = []

    for (const i in parameters) {
      const parameter = parameters[i]
      const argumentName = parameter.name
      const dataType = parameter.typeDescriptions.typeString.replace('contract ', '')
      parameterList.push(`${dataType} ${argumentName}`)
    }

    return `- [${x.name}(${parameterList.join(', ')})](#${x.name.toLowerCase()})`
  }).toArray()

  template = template.replace('{{FunctionTitle}}', i18n.translate('Functions'))

  for (const i in functionNodes) {
    const node = functionNodes[i]

    let functionTemplate = templateHelper.FunctionTemplate
    const description = documentationHelper.getNotice(node.documentation)
    const functionCode = codeBuilder.build(node)
    const base = superBuilder.build(node, contracts)
    const references = referenceBuilder.build(node, contracts)
    const parameters = (node.parameters || {}).parameters
    const args = argumentBuilder.build(node.documentation, parameters)

    functionTemplate = functionTemplate.replace('{{FunctionName}}', node.name)
    functionTemplate = functionTemplate.replace('{{FQFunctionName}}', `${contract.contractName}.${node.name}`)
    functionTemplate = functionTemplate.replace('{{FunctionNameHeading}}', `### ${node.name}`)
    functionTemplate = functionTemplate.replace('{{Super}}', base)
    functionTemplate = functionTemplate.replace('{{References}}', references)
    functionTemplate = functionTemplate.replace('{{FunctionDescription}}', description)
    functionTemplate = functionTemplate.replace('{{FunctionCode}}', functionCode)
    functionTemplate = functionTemplate.replace('{{FunctionArguments}}', args)

    functionTemplate = functionTemplate.replace('{{TableHeader}}', parameters ? templateHelper.TableHeaderTemplate : '')
    functionTemplate = functionTemplate.replace('{{FunctionArgumentsHeading}}', parameters ? `**${i18n.translate('Arguments')}**` : '')

    definitionList.push(functionTemplate)
  }

  template = template.replace('{{FunctionList}}', functionList.join('\n'))
  template = template.replace('{{AllFunctions}}', definitionList.join('\n'))

  return template
}

module.exports = { serialize }
