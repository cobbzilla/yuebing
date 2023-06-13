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
  const allUsers = await u.userRepository.findAll()
  return q.search(allUsers, query, searchMatches, sharedUser.sortByField)
}

async function deleteUser (user) {
  const found = await u.userRepository.findById(user.username)
  if (found) {
    await u.userRepository.remove(user.username, found.version)
  }
  if (system.deleteUserHandlers) {
    for (const handlerName of Object.keys(system.deleteUserHandlers)) {
      await system.deleteUserHandlers[handlerName](user)
    }
  }
}

export { findUsers, deleteUser }
