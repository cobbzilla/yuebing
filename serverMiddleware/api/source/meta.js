const api = require('../../util/api')
const u = require('../../user/userUtil')
const manifest = require('../../asset/manifest')
const src = require('../../source/sourceUtil')

export default {
  path: '/api/source/meta',
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const { source, pth } = await src.extractSourceAndPathAndConnect(req.url)
    if (!source || !pth) { return api.notFound() }
    const meta = await manifest.deriveMetadata(source, pth)
    console.log(`>>>>> API: Meta ${req.url}, source=${source.name}, prefix = ${pth} -- returning meta=${JSON.stringify(meta)}`)
    return api.okJson(res, meta)
  }
}
