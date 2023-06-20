const cookie = require('cookie')
const { MobilettoNotFoundError } = require('mobiletto-lite')
const { MobilettoOrmValidationError } = require('mobiletto-orm-typedef')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const shasum = require('shasum')
const redis = require('../../util/redis')
const c = require('../../../shared')
const auth = require('../../../shared/auth')
const u = require('../../../shared/type/userType')
const valid = require('../../../shared/type/validation')
const api = require('../../util/api')
const email = require('../../util/email')
const { YBModel } = require('../../model/morm/ybModel')
const { queryParamValue } = require('../../util/api')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const BCRYPT_ROUNDS = system.privateConfig.encryption.bcryptRounds

const USER_SERVER_TYPEDEF = u.USER_TYPEDEF.extend({
  fields: {
    password: {
      normalize: val => bcrypt.hashSync(val, bcrypt.genSaltSync(BCRYPT_ROUNDS))
    }
  }
})

const userDb = new YBModel(USER_SERVER_TYPEDEF)

userDb.preUpdate = async (proposed, user) => {
  // merge proposed changes into user object, using stringify/parse to remove explicitly 'undefined' props, set mtime
  const update = Object.assign({}, user, JSON.parse(JSON.stringify(proposed)))
  // never store a plaintext password
  if (update.password) {
    delete update.password
  }
  // never store the 'admin' property -- we always call isAdmin to check if a user is admin
  if (update.admin) {
    delete update.admin
  }
  if (update.session) {
    // don't persist session
    delete update.session
  }
  update.username = user.username // don't allow any username changes for now
}

export { userDb }
