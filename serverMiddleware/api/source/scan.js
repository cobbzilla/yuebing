const api = require('../../util/api')
const { requireLoggedInUser } = require('../../user/userUtil')
const src = require('../../source/sourceUtil')
const scan = require('../../source/scan')
const { uploadPendingAssets } = require('../../asset/upload')
const system = require('../../util/config').SYSTEM
const logger = system.logger

scan.initAutoscan(system.privateConfig.autoscan)
uploadPendingAssets()

export default {
  path: '/api/source/scan',
  async handler (req, res) {
    const user = await requireLoggedInUser(req, res)
    if (!user || !user.admin) {
      return api.forbidden(res)
    }
    const { source, pth } = await src.extractSourceAndPathAndConnect(req.url)
    if (!source || !pth) { return api.notFound() }
    logger.info(`>>>>> API: Scanning ${req.url}, source=${source.name}, prefix = ${pth}`)
    const transforms = await scan.scan(source, pth)
    return api.okJson(res, transforms)
  }
}
