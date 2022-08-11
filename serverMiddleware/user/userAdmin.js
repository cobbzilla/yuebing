const crypt = require('../util/crypt')
const s3util = require('../s3/s3util')
const u = require('./userUtil')

function migrateUser (userKey, oldKey, oldIV) {
  // read object from old user store, decrypt with old key
  s3util.readDestTextObject(userKey).then((text) => {
    const user = JSON.parse(crypt.decrypt(text, oldKey, oldIV))
    if (user.email) {
      // write to default store with default key
      const Key = u.userKey(user.email)
      const Body = crypt.encrypt(JSON.stringify(user))
      return s3util.destPut({ Key, Body }, `migrateUser: error writing new user to ${Key}`)
    } else {
      console.log(`migrateUser(${userKey}): no email found in user object: ${JSON.stringify(user)}`)
    }
  })
}

async function migrateUsers (oldKey, oldIV) {
  if (!oldKey) {
    throw new TypeError('migrateUsers: oldKey and oldIV are required')
  }
  const normKey = crypt.normalizeKey(oldKey)
  const normIV = crypt.normalizeIV(oldIV, normKey)

  // list users from old user store
  const objectList = await s3util.listDest('/' + u.userStorePrefix(oldKey))
  if (objectList) {
    return await Promise.all(objectList.map(obj => migrateUser(obj.name, normKey, normIV)))
  }
}

export { migrateUsers }
