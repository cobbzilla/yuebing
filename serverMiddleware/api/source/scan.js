const api = require('../../util/api')
const u = require('../../user/userUtil')
const src = require('../../source/sourceUtil')
const scan = require('../../source/scan')
const system = require('../../util/config').SYSTEM

scan.initAutoscan(system.privateConfig.autoscan)

export default {
  path: '/api/source/scan',
  async handler (req, res) {
    const user = await u.requireLoggedInUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const { source, pth } = await src.extractSourceAndPathAndConnect(req.url)
    if (!source || !pth) { return api.notFound() }
    console.log(`>>>>> API: Scanning ${req.url}, source=${source.name}, prefix = ${pth}`)
    const transforms = await scan.scan(source, pth)
    return api.okJson(res, transforms)
  }
}
