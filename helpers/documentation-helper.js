const getText = (x) => typeof (x) === 'object' ? x.text : x || ''

const get = (contents, key) => {
  const text = getText(contents)

  const members = text.split('@')

  for (const i in members) {
    const entry = members[i]

    if (entry.startsWith(key)) {
      return entry.substr(key.length, entry.length - key.length).trim()
    }
  }

  return ''
}

const getNotice = (contents) => {
  const title = get(contents, 'notice')
  return title || get(contents, 'dev')
}

module.exports = { get, getNotice }
