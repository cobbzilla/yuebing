const m = require('../../../shared/media')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const manifest = require('../../asset/manifest')
const s = require('../../../shared/source')
const src = require('../../source/sourceUtil')

export default {
  path: '/api/source/list',
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    try {
      const { sourceName, pth } = s.extractSourceAndPath(req.url)
      if (!sourceName) { return api.okJson(res, []) }
      const sources = []
      if (sourceName === '@') {
        const sourceObjects = await src.listSourcesWithoutSelf({ pageSize: 1000 })
        sources.push(...sourceObjects.list.map(src => src.name))
      } else {
        sources.push(sourceName)
      }
      console.log(`>>>>> API: Listing ${req.url}, source=${sourceName}, prefix=${pth}`)
      const promises = {}
      for (const sc of sources) {
        promises[sc] = src.connect(sc).then(api => api.list(pth))
      }
      const results = []
      for (const sc of Object.keys(promises)) {
        const objects = await promises[sc]
        results.push(...objects.map((obj) => { obj.source = sc; return obj }))
      }
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        if (result.mediaType && result.mediaType !== m.UNKNOWN_MEDIA_TYPE) {
          result.meta = await manifest.deriveMetadata(sourceName, result.name)
        }
      }
      return api.okJson(res, results)
    } catch (e) {
      return api.serverError(res, 'error listing')
    }
  }
}
