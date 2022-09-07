const sharedUser = require('../../shared/user')
const m = require('../../shared/media')
const q = require('../util/query')
const system = require('../util/config').SYSTEM
const u = require('./userUtil')

function searchMatches (user, searchTerms) {
  return (user.email && user.email.includes(searchTerms)) ||
    (user.firstName && user.firstName.includes(searchTerms)) ||
    (user.lastName && user.lastName.includes(searchTerms))
}

async function findUsers (query) {
  const objectList = await system.api.list(u.USERS_PREFIX)
  const allUsers = []
  for (const object of objectList) {
    if (object.type === m.FILE_TYPE) {
      allUsers.push(JSON.parse(await system.api.readFile(object.name)))
    }
  }
  return q.search(allUsers, query, searchMatches, sharedUser.sortByField)
}

async function deleteUser (user) {
  await system.api.remove(u.emailKey(user.email))
  await system.api.remove(u.userKey(user.username))
  if (system.deleteUserHandlers) {
    for (const handlerName of Object.keys(system.deleteUserHandlers)) {
      system.deleteUserHandlers[handlerName](user)
    }
  }
}

export { findUsers, deleteUser }
