const a = require('./util')

export const assetService = {
  getQueue
}

function getQueue () {
  return fetch('/api/asset/queue', a.GET).then(response => a.handleJsonResponse(response))
}
