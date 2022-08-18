const api = require('../../util/api')
const u = require('../../user/userUtil')
const source = require('../../source/sourceUtil')

async function handleQuery (res, query) {
  return api.okJson(res, await source.listSources(query))
}

function handleAdd (res, source) {
  console.log(`handleAdd -- would add source: ${JSON.stringify(source, null, 2)}`)
  return Promise.resolve({})
}

export default {
  path: '/api/admin/sources',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const handler = req.method === 'POST'
      ? handleQuery
      : req.method === 'PUT'
        ? handleAdd
        : null
    if (!handler) {
      return api.serverError(res, 'POST is for queries and PUT is for creation, no other HTTP methods supported at this endpoint')
    }
    req.on('data', async data => await handler(res, JSON.parse(data.toString())))
  }
}
