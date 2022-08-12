const sharedUser = require('../../shared/user')
const m = require('../../shared/media')
const crypt = require('../util/crypt')
const s3util = require('../s3/s3util')
const u = require('./userUtil')

const DEFAULT_PAGE_SIZE = 20
const MAX_SEARCH_TERMS_LENGTH = 200

function searchMatches (user, searchTerms) {
  return (user.email && user.email.includes(searchTerms)) ||
    (user.firstName && user.firstName.includes(searchTerms)) ||
    (user.lastName && user.lastName.includes(searchTerms))
}

async function findUsers (query) {
  const objectList = await s3util.listDest('/' + u.userStorePrefix())
  const allUsers = []
  for (const object of objectList) {
    if (object.type === m.FILE_TYPE) {
      allUsers.push(JSON.parse(crypt.decrypt(await s3util.readDestTextObject(object.name))))
    }
  }
  if (query.searchTerms) {
    if (typeof query.searchTerms !== 'string') {
      query.searchTerms = ''
    } else {
      while (query.searchTerms.length > MAX_SEARCH_TERMS_LENGTH) {
        // chop words off the end until it's short enough
        const lastSpace = query.searchTerms.lastIndexOf(' ')
        query.searchTerms = lastSpace === -1 ? '' : query.searchTerms.substring(0, lastSpace)
      }
    }
  }

  const userList = (query.searchTerms && query.searchTerms.trim().length > 0)
    ? allUsers.filter(u => searchMatches(u, query.searchTerms))
    : allUsers

  if (query.sort) {
    const ascending = !query.sort.order.toLowerCase().startsWith('des')
    sharedUser.sortByField(userList, query.sort.field, ascending)
  }

  const pageNumber = query.pageNumber || 1
  const pageSize = query.pageSize || DEFAULT_PAGE_SIZE
  const rawStart = (pageNumber - 1) * pageSize
  const startIndex = (userList.length >= rawStart) ? rawStart : Math.max(userList.length - pageSize, 0)
  const endIndex = (startIndex + pageSize < userList.length) ? startIndex + pageSize : userList.length

  return {
    list: userList.slice(startIndex, endIndex),
    total: allUsers.length
  }
}

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

function deleteUser (email) {
  return s3util.deleteDestObject('/' + u.userKey(email))
}

export { findUsers, migrateUsers, deleteUser }
