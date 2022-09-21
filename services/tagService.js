const a = require('./util')

export const tagService = {
  fetchTagWeights,
  fetchTags,
  addTags,
  removeTags
}

function fetchTagWeights () {
  return fetch('/api/user/tags', a.authGet()).then(response => a.handleJsonResponse(response))
}

function fetchTags (sourceAndPath) {
  return sourceAndPath
    ? fetch(`/api/user/tags/${sourceAndPath}`, a.authGet()).then(response => a.handleJsonResponse(response))
    : Promise.resolve([])
}

function addTags (sourceAndPath, tags) {
  if (sourceAndPath && tags && tags.length > 0) {
    return fetch(`/api/user/tags/${sourceAndPath}`, a.authPostJson(tags)).then(a.handleJsonResponse)
  } else {
    return Promise.resolve({})
  }
}

function removeTags (sourceAndPath, tags) {
  if (sourceAndPath && tags && tags.length > 0) {
    return fetch(`/api/user/tags/${sourceAndPath}/${btoa(Array.isArray(tags) ? tags.join(',') : tags)}`, a.authDelete()).then(a.handleJsonResponse)
  } else {
    return Promise.resolve({})
  }
}
