const serialize = (_contract, template, _contracts) => {
  const now = new Date()

  template = template.replace('{{Time}}', now.toTimeString())
  template = template.replace('{{Date}}', now.toISOString())
  template = template.replace('{{CurrentDirectory}}', process.env.PWD)

  return template
}

module.exports = { serialize }
