const a = require('./util')

export const assetService = {
  getQueue
}

function getQueue () {
  return fetch('/api/asset/queue', a.authGet()).then(response => a.handleJsonResponse(response))
}
