// noinspection JSUnresolvedFunction
// This module exists to load the serverMiddleware when nuxt app is starting
// This avoids loading the serverMiddleware during 'nuxt build' which causes
// a nasty build warning message
// See: https://github.com/nuxt/nuxt.js/issues/5669#issuecomment-491241150

const system = require('../../serverMiddleware/util/config').SYSTEM

module.exports = async function (moduleOptions) {
  // Add middleware only with `nuxt dev` or `nuxt start`
  if (this.options.dev || this.options._start) {
    await system.connect()
    this.addServerMiddleware('~/serverMiddleware/filters/lang')
    this.addServerMiddleware('~/serverMiddleware/filters/cookie')
    this.addServerMiddleware('~/serverMiddleware/api/user/config')
    this.addServerMiddleware('~/serverMiddleware/api/user/authenticate')
    this.addServerMiddleware('~/serverMiddleware/api/user/register')
    this.addServerMiddleware('~/serverMiddleware/api/user/logout')
    this.addServerMiddleware('~/serverMiddleware/api/user/verify')
    this.addServerMiddleware('~/serverMiddleware/api/user/requestPasswordReset')
    this.addServerMiddleware('~/serverMiddleware/api/user/update')
    this.addServerMiddleware('~/serverMiddleware/api/user/headers')
    this.addServerMiddleware('~/serverMiddleware/api/user/inviteFriends')
    this.addServerMiddleware('~/serverMiddleware/api/user/comments')
    this.addServerMiddleware('~/serverMiddleware/api/source/list')
    this.addServerMiddleware('~/serverMiddleware/api/source/scan')
    this.addServerMiddleware('~/serverMiddleware/api/source/meta')
    this.addServerMiddleware('~/serverMiddleware/api/source/mediainfo')
    this.addServerMiddleware('~/serverMiddleware/api/source/thumbnail')
    this.addServerMiddleware('~/serverMiddleware/api/source/stream')
    this.addServerMiddleware('~/serverMiddleware/api/admin/config')
    this.addServerMiddleware('~/serverMiddleware/api/admin/sources')
    this.addServerMiddleware('~/serverMiddleware/api/admin/users')
    this.addServerMiddleware('~/serverMiddleware/api/admin/deleteUser')
    this.addServerMiddleware('~/serverMiddleware/api/admin/migrate')
    this.addServerMiddleware('~/serverMiddleware/api/admin/queue')
  }
}
