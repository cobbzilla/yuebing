const api = require('../../util/api')
const { requireLoggedInUser } = require('../../user/userUtil')
const vol = require('../../volume/volumeUtil')
const scan = require('../../volume/scan')
const system = require('../../util/config').SYSTEM
const logger = system.logger

scan.initAutoscan(system.privateConfig.autoscan)

export default {
  path: '/api/source/scan',
  async handler (req, res) {
    const user = await requireLoggedInUser(req, res)
    if (!user || !user.admin) {
      return api.forbidden(res)
    }
    const { volume, pth } = await vol.extractVolumeAndPathAndConnect(req.url.replaceAll('//', '/'))
    if (!volume || !pth) { return api.notFound() }
    logger.info(`>>>>> API: Scanning ${req.url}, volume=${volume.name}, prefix = ${pth}`)
    const transforms = await scan.scan(volume, pth)
    return api.okJson(res, transforms)
  }
}
