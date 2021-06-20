const documentationHelper = require('../helpers/documentation-helper')
const nodeHelper = require('../helpers/node-helper')
const constructorBuilder = require('../builders/constructor-builder')
const i18n = require('../i18n')
const util = require('util')
const path = require('path')
const relative = require('path').relative

const getTitle = (contract) => {
  const contractNode = nodeHelper.getContractNode(contract)
  const documentation = contractNode.documentation
  const contractTitle = documentationHelper.get(documentation, 'title')

  let title = `${contract.contractName}.sol`

  if (contractTitle) {
    title = `${contractTitle.replace('\r\n', '\n')} (${contract.contractName}.sol)`
  }

  return title
}

const getAbi = (contract) => {
  const builder = []
  builder.push('## ')
  builder.push(i18n.translate('ABI'))
  builder.push('\n\n')
  builder.push('```json\n')
  builder.push(JSON.stringify(contract.abi, null, 2))
  builder.push('\n```')

  return builder.join('')
}

const getContractPath = (contract) => {
  const sourcePath = contract.sourcePath
  const relation = relative(global.config.outputPath, global.config.pathToRoot)
  const file = sourcePath.replace(global.config.pathToRoot, '')
  const link = `[${file.replace(/^\/|\/$/g, '')}](${path.join(relation, file)})`

  return util.format(i18n.translate('ViewSource'), link)
}

const getAnchors = (contracts) => {
  const anchors = []

  for (const i in contracts) {
    const contract = contracts[i]

    const anchor = `* [${contract.contractName}](${contract.contractName}.md)`
    anchors.push(anchor)
  }

  return anchors
}

const getInheritancePath = (contract) => {
  const dependencyList = []
  const dependencies = nodeHelper.getBaseContracts(contract)

  for (const i in dependencies) {
    const dependency = dependencies[i]
    dependencyList.push(`[${dependency.baseName.name}](${dependency.baseName.name}.md)`)
  }

  if (dependencyList && dependencyList.length) {
    return `**${util.format(i18n.translate('Extends'), dependencyList.join(', '))}**`
  }

  return ''
}

const getImplementation = (contract, contracts) => {
  const implementationList = []
  const implementations = nodeHelper.getImplementations(contract, contracts)

  for (const i in implementations) {
    const implementation = implementations[i]

    implementationList.push(`[${implementation.contractName}](${implementation.contractName}.md)`)
  }

  if (implementationList && implementationList.length) {
    return `**${util.format(i18n.translate('DerivedContracts'), implementationList.join(', '))}**`
  }

  return ''
}

const serialize = (contract, template, contracts) => {
  const contractNode = nodeHelper.getContractNode(contract)
  const documentation = contractNode.documentation
  const notice = documentationHelper.getNotice(documentation)

  template = template.replace('{{ContractName}}', contract.contractName)
  template = template.replace('{{ContractPath}}', getContractPath(contract))
  template = template.replace('{{ContractTitle}}', getTitle(contract))
  template = template.replace('{{ContractDescription}}', notice)
  template = template.replace('{{ContractInheritancePath}}', getInheritancePath(contract))
  template = template.replace('{{ContractImplementations}}', getImplementation(contract, contracts))

  template = template.replace('{{AllContractsAnchor}}', getAnchors(contracts).join('\n'))
  template = template.replace('{{ABI}}', getAbi(contract))

  return constructorBuilder.build(contract, template)
}

module.exports = { serialize }
