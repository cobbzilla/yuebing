const { ALL_SOURCES } = require('./index')

const SOURCE_TYPES = {
  local: {
    baseDir: {
      rules: 'required|max:1024'
    },
    mode: {
      default: '0700',
      rules: 'max:4',
      regex: /[01][0-7]{3}/
    }
  },
  s3: {
    key: {
      rules: 'required|min:10|max:50'
    },
    secret: {
      rules: 'required|min:10|max:100'
    },
    bucket: {
      rules: 'required|min:2|max:63'
    },
    region: {
      rules: 'required|min:5|max:20',
      default: 'us-east-1'
    },
    prefix: {
      default: ''
    },
    delimiter: {
      default: '/',
      rules: 'min:1|max:1'
    }
  }
}

function sourceTypeConfig (sourceType) {
  return SOURCE_TYPES[sourceType]
}

const SOURCE_TYPE_LABEL_PREFIX = 'label_sourceType_'

function localizedSourceConfigLabelPrefix (sourceType) {
  return SOURCE_TYPE_LABEL_PREFIX + sourceType + '_field_'
}

function localizedSourceConfigLabel (sourceType, field) {
  return localizedSourceConfigLabelPrefix(sourceType) + field
}

function localizedSourceTypes (messages) {
  return Object.keys(SOURCE_TYPES).map((f) => { return { name: f, message: messages[SOURCE_TYPE_LABEL_PREFIX + f] } })
}

const SOURCE_SORT = {
  name: (s1, s2) => s1.name && s2.name && s1.name < s2.name
}

function sortByField (array, field, ascending) {
  return ascending ? array.sort(SOURCE_SORT[field]) : array.sort(SOURCE_SORT[field]).reverse()
}

function extractSourceAndPath (from) {
  if (from.replaceAll('/', '') === ALL_SOURCES) {
    return { sourceName: ALL_SOURCES, pth: '' }
  }
  const p = from.startsWith('/') ? from.substring(1) : from
  const slash = p.indexOf('/')
  const hasSlash = slash !== -1 && slash !== p.length
  const sourceName = hasSlash ? p.substring(0, slash) : p
  const pth = hasSlash ? p.substring(slash + 1) : ''
  return { sourceName, pth }
}

export {
  sourceTypeConfig, localizedSourceTypes,
  localizedSourceConfigLabelPrefix, localizedSourceConfigLabel, sortByField,
  extractSourceAndPath
}
