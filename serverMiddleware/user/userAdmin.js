const sharedUser = require('../../shared/type/userType')
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

async function deleteUser (usernameOrEmail) {
  let found = await u.userRepository.safeFindById(usernameOrEmail)
  if (!found) {
    found = await u.userRepository.safeFindBy('email', usernameOrEmail)
    if (!found) {
      return null
    }
  }
  await u.userRepository.remove(found.id, found)
  if (system.deleteUserHandlers) {
    for (const handlerName of Object.keys(system.deleteUserHandlers)) {
      await system.deleteUserHandlers[handlerName](user)
    }
  }
  return found
}

export { findUsers, deleteUser }
