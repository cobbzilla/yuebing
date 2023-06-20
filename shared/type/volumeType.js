const { MobilettoOrmTypeDef } = require('mobiletto-orm-typedef')
const { isSelfVolume, DEFAULT_ENCRYPTION_ALGO } = require('../index')
const valid = require('./validation')

const VOLUME_MOUNT_SOURCE = 'source'
const VOLUME_MOUNT_DESTINATION = 'destination'

const LOCAL_FIELDS = {
  key: {
    type: 'string',
    label: 'label_volumeType_local_field_key',
    required: true,
    min: 2,
    max: 1024,
    regex: valid.REGEX_VALIDATORS.local_path,
    updatable: false
  },
  mode: {
    type: 'string',
    label: 'label_volumeType_local_field_mode',
    default: '0700',
    min: 4,
    max: 4,
    regex: valid.REGEX_VALIDATORS.file_mode
  }
}

const S3_FIELDS = {
  key: {
    type: 'string',
    label: 'label_volumeType_s3_field_key',
    required: true,
    min: 20,
    max: 20,
    regex: valid.REGEX_VALIDATORS.aws_key,
    updatable: false
  },
  secret: {
    type: 'string',
    label: 'label_volumeType_s3_field_secret',
    required: true,
    min: 40,
    max: 40,
    regex: valid.REGEX_VALIDATORS.aws_secret,
    updatable: false
  },
  bucket: {
    type: 'string',
    label: 'label_volumeType_s3_field_bucket',
    required: true,
    min: 3,
    max: 63,
    regex: valid.REGEX_VALIDATORS.s3_bucket,
    updatable: false
  },
  region: {
    type: 'string',
    label: 'label_volumeType_s3_field_region',
    items: [
      'us-east-2', 'us-east-1', 'us-west-1', 'us-west-2', 'af-south-1',
      'ap-east-1', 'ap-south-2', 'ap-southeast-3', 'ap-southeast-4', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1',
      'ca-central-1', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-south-1', 'eu-west-3', 'eu-south-2', 'eu-north-1', 'eu-central-2',
      'me-south-1', 'me-central-1', 'sa-east-1'
    ].map((r) => {
      return { value: r, label: r, rawLabel: true }
    }),
    default: 'us-east-1',
    updatable: false
  },
  prefix: {
    type: 'string',
    label: 'label_volumeType_s3_field_prefix',
    default: '',
    updatable: false
  },
  delimiter: {
    type: 'string',
    label: 'label_volumeType_s3_field_delimiter',
    default: '/',
    min: 1,
    max: 1,
    updatable: false
  }
}

const B2_FIELDS = {
  key: {
    type: 'string',
    label: 'label_volumeType_b2_field_key',
    required: true,
    min: 10,
    max: 50,
    regex: valid.REGEX_VALIDATORS.raw_hex,
    updatable: false
  },
  secret: {
    type: 'string',
    label: 'label_volumeType_b2_field_secret',
    required: true,
    min: 10,
    max: 50,
    updatable: false
  },
  bucket: {
    type: 'string',
    label: 'label_volumeType_b2_field_bucket',
    required: true,
    min: 6,
    max: 63,
    regex: valid.REGEX_VALIDATORS.b2_bucket,
    updatable: false
  },
  partSize: {
    type: 'number',
    label: 'label_volumeType_b2_field_partSize',
    minValue: 5000000,
    maxValue: 2000000000,
    normalize: v => Math.floor(v)
  },
  prefix: {
    type: 'string',
    label: 'label_volumeType_b2_field_prefix',
    default: '',
    updatable: false
  },
  delimiter: {
    type: 'string',
    label: 'label_volumeType_b2_field_delimiter',
    default: '/',
    min: 1,
    max: 1,
    updatable: false
  }
}

const VOL_TYPE_LOCAL = 'local'
const VOL_TYPE_S3 = 's3'
const VOL_TYPE_B2 = 'b2'

const VOLUME_TYPES = {}
VOLUME_TYPES[VOL_TYPE_LOCAL] = LOCAL_FIELDS
VOLUME_TYPES[VOL_TYPE_S3] = S3_FIELDS
VOLUME_TYPES[VOL_TYPE_B2] = B2_FIELDS

const VOLUME_TYPEDEF = new MobilettoOrmTypeDef({
  typeName: 'volume',
  tableFields: ['name', 'type', 'mount', 'system', 'ctime', 'mtime'],
  fields: {
    name: {
      type: 'string',
      primary: true,
      min: 3,
      max: 100
    },
    mount: {
      type: 'string',
      required: true,
      items: [
        { value: VOLUME_MOUNT_SOURCE, label: 'admin_label_volume_mount_source' },
        { value: VOLUME_MOUNT_DESTINATION, label: 'admin_label_volume_mount_destination' }
      ],
      updatable: false
    },
    readOnly: {
      type: 'boolean',
      control: 'hidden',
      updatable: false
    },
    system: {
      type: 'boolean',
      default: false
    },
    type: {
      type: 'string',
      items: Object.keys(VOLUME_TYPES).map((type) => {
        return { value: type, label: `label_volumeType_${type}` }
      }),
      required: true,
      updatable: false
    },
    local: {
      when: v => v.type === VOL_TYPE_LOCAL,
      fields: LOCAL_FIELDS
    },
    s3: {
      when: v => v.type === VOL_TYPE_S3,
      fields: S3_FIELDS
    },
    b2: {
      when: v => v.type === VOL_TYPE_B2,
      fields: B2_FIELDS
    },
    cacheSize: {
      type: 'number',
      minValue: 0,
      max_value: 10000000,
      default: 100
    },
    encryptionEnable: {
      type: 'boolean',
      default: false
    },
    encryption: {
      when: v => v.encryptionEnable === true,
      fields: {
        encryptionKey: {
          type: 'string',
          required: true,
          min: 16,
          max: 1024,
          updatable: false
        },
        encryptionIV: {
          type: 'string',
          min: 16,
          max: 1024,
          updatable: false
        },
        encryptionAlgo: {
          type: 'string',
          items: [{ value: DEFAULT_ENCRYPTION_ALGO, rawLabel: true }],
          default: DEFAULT_ENCRYPTION_ALGO,
          updatable: false
        }
      }
    }
  }
})

const setCryptoConfig = (config) => {
  if (config && config.crypto && Array.isArray(config.crypto) &&
    VOLUME_TYPEDEF &&
    VOLUME_TYPEDEF.fields &&
    VOLUME_TYPEDEF.fields.encryption &&
    VOLUME_TYPEDEF.fields.encryption.fields &&
    VOLUME_TYPEDEF.fields.encryption.fields.encryptionAlgo &&
    VOLUME_TYPEDEF.fields.encryption.fields.encryptionAlgo.items &&
    VOLUME_TYPEDEF.fields.encryption.fields.encryptionAlgo.items.length <= 1
  ) {
    const algo = VOLUME_TYPEDEF.fields.encryption.fields.encryptionAlgo
    const items = algo.items
    items.splice(0, items.length)
    items.push(...config.crypto.map((c) => {
      return { value: c.name, label: c.name, rawLabel: true, info: c.info }
    }))
    algo.values.splice(0, algo.values.length)
    algo.values.push(...items.map(a => a.value))
    algo.labels.splice(0, algo.labels.length)
    algo.labels.push(...items.map(a => a.label))
  }
}

const filterSources = volumes => volumes ? volumes.filter(v => v.mount === VOLUME_MOUNT_SOURCE) : []
const isDestinationVolume = v => v.mount === VOLUME_MOUNT_DESTINATION || isSelfVolume(v)
const filterDestinations = volumes => volumes ? volumes.filter(isDestinationVolume) : []

function volumeTypeConfig (volumeType) {
  return volumeType in VOLUME_TYPES ? VOLUME_TYPES[volumeType] : VOLUME_TYPES[VOL_TYPE_LOCAL]
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
  sortVolumesByField,
  extractVolumeAndPath,
  VOLUME_MOUNT_SOURCE, VOLUME_MOUNT_DESTINATION,
  VOLUME_TYPEDEF, VOLUME_TYPES, setCryptoConfig,
  filterSources, filterDestinations
}
