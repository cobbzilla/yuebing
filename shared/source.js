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
      rules: 'required|max:50'
    },
    secret: {
      rules: 'required|max:100'
    },
    bucket: {
      rules: 'required|min:2|max:63'
    },
    region: {
      default: 'required|us-east-1'
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
  const slash = from.indexOf('/')
  const hasSlash = slash !== -1 && slash !== from.length
  const sourceName = hasSlash ? from(0, slash) : from
  const path = hasSlash ? from(slash + 1) : ''
  return { sourceName, prefix: path }
}

export {
  sourceTypeConfig, localizedSourceTypes,
  localizedSourceConfigLabelPrefix, localizedSourceConfigLabel, sortByField,
  extractSourceAndPath
}
