const md5 = require('md5')
const { MobilettoOrmTypeDef } = require('mobiletto-orm-typedef')
const nuxt = require('../../nuxt.config').default
const valid = require('./validation')

const USER_TYPEDEF = new MobilettoOrmTypeDef({
  typeName: 'account',
  fields: {
    username: {
      type: 'string',
      required: true,
      min: 2,
      max: 100,
      regex: valid.REGEX_VALIDATORS.username,
      normalize: v => v.toLowerCase(),
      updatable: false,
      tabIndex: 1
    },
    email: {
      type: 'string',
      required: true,
      min: 2,
      max: 100,
      regex: valid.REGEX_VALIDATORS.email,
      normalize: v => v.toLowerCase(),
      updatable: false,
      tabIndex: 2,
      index: true
    },
    password: {
      type: 'string',
      required: true,
      min: 8,
      max: 100,
      tabIndex: 3
    },
    firstName: {
      type: 'string',
      required: false,
      min: 2,
      max: 100,
      tabIndex: 4
    },
    lastName: {
      type: 'string',
      required: false,
      min: 2,
      max: 100,
      tabIndex: 5
    },
    locale: {
      type: 'string',
      items: nuxt.publicRuntimeConfig.locales.map((loc) => {
        return { value: loc, label: `locale_${loc}` }
      }),
      required: true,
      tabIndex: 6
    },
    flags: {
      type: 'array',
      values: ['flag_welcome_email', 'flag_can_comment', 'flag_can_tag', 'flag_can_edit_metadata', 'flag_can_set_thumbnail'],
      default: ['flag_welcome_email', 'flag_can_comment', 'flag_can_tag'],
      control: 'multi',
      tabIndex: 7
    },
    verified: {
      type: 'number',
      control: 'label',
      render: 'datetime',
      tabIndex: 8
    }
  }
})

// hide id field in UI (username becomes the id)
USER_TYPEDEF.fields.id.control = 'hidden'
USER_TYPEDEF.fields.id.redact = false

const USER_SORT = {
  email: (u1, u2) => u1.email && u2.email && u1.email < u2.email,
  firstName: (u1, u2) => u1.firstName && u2.firstName && u1.firstName < u2.firstName,
  lastName: (u1, u2) => u1.lastName && u2.lastName && u1.lastName < u2.lastName,
  locale: (u1, u2) => u1.locale && u2.locale && u1.locale < u2.locale,
  ctime: (u1, u2) => u1.ctime && u2.ctime && u1.ctime < u2.ctime,
  mtime: (u1, u2) => u1.mtime && u2.mtime && u1.mtime < u2.mtime
}

const userSortFields = () => Object.keys(USER_SORT)

const localizedUserSortFields = messages =>
  userSortFields().map((f) => { return { name: f, message: messages['label_' + f] } })

const sortByField = (array, field, ascending) =>
  ascending ? array.sort(USER_SORT[field]) : array.sort(USER_SORT[field]).reverse()

const GRAVATAR_RATING_LEVEL = 'r'
const GRAVATAR_DEFAULT_IMAGE = 'retro'

const gravatarEmailHash = email => email ? md5(email.trim().toLowerCase()) : null
const gravatarEmailUrl = email => email ? `https://www.gravatar.com/avatar/${gravatarEmailHash(email)}?d=${encodeURIComponent(GRAVATAR_DEFAULT_IMAGE)}&r=${GRAVATAR_RATING_LEVEL}` : null

export {
  USER_TYPEDEF, userSortFields, localizedUserSortFields, sortByField, gravatarEmailHash, gravatarEmailUrl
}
