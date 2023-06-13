const { isSelfVolume } = require('./index')

const VOLUME_TYPES = {
  local: {
    key: {
      rules: 'required|min:2|max:1024|local_path'
    },
    mode: {
      default: '0700',
      rules: 'min:4|max:4|file_mode'
    }
  },
  s3: {
    key: {
      rules: 'required|min:20|max:20|aws_key'
    },
    secret: {
      rules: 'required|min:40|max:40|aws_secret'
    },
    bucket: {
      rules: 'required|min:3|max:63|s3_bucket'
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
  },
  b2: {
    key: {
      rules: 'required|raw_hex|min:10|max:50'
    },
    secret: {
      rules: 'required|min:10|max:50'
    },
    bucket: {
      rules: 'required|min:6|max:63|b2_bucket'
    },
    partSize: {
      rules: 'integer|min_value:5000000|max_value:2000000000',
      default: null
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

const VOLUME_NAME_VALIDATION = {
  required: true,
  volume: true,
  min: 3,
  max: 100,
  checkOnUpdate: false
}

const VOLUME_VALIDATIONS = {
  type: {
    required: true,
    regex: new RegExp(`^(${Object.keys(VOLUME_TYPES).join('|')})$`)
  },
  name: VOLUME_NAME_VALIDATION,
  cacheSize: {
    required: true,
    integer: true,
    min_value: 0,
    max_value: 10000000
  },
  encryptionKey: {
    required: true,
    min: 16,
    max: 1024
  },
  encryptionIV: {
    min: 16,
    max: 1024
  }
}

const VOLUME_MOUNT_SOURCE = 'source'
const VOLUME_MOUNT_DESTINATION = 'destination'

const filterSources = volumes => volumes ? volumes.filter(v => v.mount === VOLUME_MOUNT_SOURCE) : []
const isDestinationVolume = v => v.mount === VOLUME_MOUNT_DESTINATION || isSelfVolume(v)
const filterDestinations = volumes => volumes ? volumes.filter(isDestinationVolume) : []
const filterSyncDestinations = volumes => volumes ? volumes.filter(isDestinationVolume).filter(v => !!v.sync) : []

function volumeTypeConfig (volumeType) {
  return volumeType in VOLUME_TYPES ? VOLUME_TYPES[volumeType] : null
}

const VOLUME_TYPE_LABEL_PREFIX = 'label_volumeType_'

function localizedVolumeConfigLabelPrefix (volumeType) {
  return VOLUME_TYPE_LABEL_PREFIX + volumeType + '_field_'
}

function localizedVolumeConfigLabel (volumeType, field) {
  return localizedVolumeConfigLabelPrefix(volumeType) + field
}

function localizedVolumeTypes (messages) {
  return Object.keys(VOLUME_TYPES).map((f) => { return { name: f, message: messages[VOLUME_TYPE_LABEL_PREFIX + f] } })
}

const VOLUME_SORT = {
  name: (s1, s2) => s1.name && s2.name && s1.name < s2.name
}

function sortVolumesByField (array, field, ascending) {
  return ascending ? array.sort(VOLUME_SORT[field]) : array.sort(VOLUME_SORT[field]).reverse()
}

const LIBRARY_SORT = {
  source: (s1, s2) => s1.source && s2.source && s1.source < s2.source,
  destination: (s1, s2) => s1.destination && s2.destination && s1.destination < s2.destination
}

function sortLibrariesByField (array, field, ascending) {
  return ascending ? array.sort(LIBRARY_SORT[field]) : array.sort(LIBRARY_SORT[field]).reverse()
}

function extractVolumeAndPath (from) {
  const p = from.startsWith('/') ? from.substring(1) : from
  const slash = p.indexOf('/')
  const hasSlash = slash !== -1 && slash !== p.length
  const volume = hasSlash ? p.substring(0, slash) : p
  const pth = hasSlash ? p.substring(slash + 1) : ''
  return { volume, pth }
}

export {
  volumeTypeConfig, localizedVolumeTypes,
  localizedVolumeConfigLabelPrefix, localizedVolumeConfigLabel,
  sortVolumesByField, sortLibrariesByField,
  extractVolumeAndPath,
  VOLUME_MOUNT_SOURCE, VOLUME_MOUNT_DESTINATION, VOLUME_VALIDATIONS,
  filterSources, filterDestinations, filterSyncDestinations
}
