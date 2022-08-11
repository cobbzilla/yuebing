const a = require('./util')

export const adminService = {
  getQueue, migrateUsers
}

function getQueue () {
  return fetch('/api/admin/queue', a.authGet()).then(response => a.handleJsonResponse(response))
}

function migrateUsers (oldKey, oldIV) {
  return fetch('/api/admin/migrateUsers', a.authPostJson({ oldKey, oldIV })).then(response => a.handleJsonResponse(response))
}
