const md5 = require('md5')

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
  userSortFields, localizedUserSortFields, sortByField, gravatarEmailHash, gravatarEmailUrl
}
