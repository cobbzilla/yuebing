
function okJson (res, obj) {
  res.statusCode = 200
  res.contentType = 'application/json'
  res.end(JSON.stringify(obj))
  return null
}

function forbidden (res) {
  res.statusCode = 403
  res.end()
  return null
}

function notFound (res, message = null) {
  res.statusCode = 404
  if (message) {
    res.end(message)
  } else {
    res.end()
  }
  return null
}

function serverError (res, message) {
  res.statusCode = 500
  res.end(message)
  return null
}

function badRequest (res, message) {
  res.statusCode = 400
  res.end(message)
  return null
}

function validationFailed (res, errors) {
  res.statusCode = 422
  res.end(JSON.stringify(errors))
  return null
}

export {
  okJson, forbidden, notFound, serverError, badRequest, validationFailed
}
