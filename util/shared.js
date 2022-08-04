
const FILE_TYPE = 'file'
const DIRECTORY_TYPE = 'dir'
const UNKNOWN_MEDIA_TYPE = 'binary'

function hasMediaType (obj) {
  return obj.type && obj.type === 'file' &&
    obj.mediaType && obj.mediaType !== UNKNOWN_MEDIA_TYPE && obj.mediaType !== DIRECTORY_TYPE
}

function isDirectory (obj) {
  return obj.type && obj.type === DIRECTORY_TYPE
}

function isViewable (obj) {
  return obj.meta && obj.meta.status && obj.meta.status.ready
}

export {
  hasMediaType, isDirectory, isViewable,
  FILE_TYPE, DIRECTORY_TYPE, UNKNOWN_MEDIA_TYPE
}
