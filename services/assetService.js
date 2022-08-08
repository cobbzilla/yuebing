const a = require('./util')

export const assetService = {
  getQueue
}

function getQueue () {
  return fetch('/asset/queue', a.GET).then(response => a.handleJsonResponse(response))
}
