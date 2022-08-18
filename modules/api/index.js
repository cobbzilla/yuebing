// This module exists to load the serverMiddleware when nuxt app is starting
// This avoids loading the serverMiddleware during 'nuxt build' which causes
// a nasty build warning message
// See: https://github.com/nuxt/nuxt.js/issues/5669#issuecomment-491241150
// noinspection JSUnresolvedFunction

module.exports = function (moduleOptions) {
  // Add middleware only with `nuxt dev` or `nuxt start`
  if (this.options.dev || this.options._start) {
    this.addServerMiddleware('~/serverMiddleware/api/user/authenticate')
    this.addServerMiddleware('~/serverMiddleware/api/user/register')
    this.addServerMiddleware('~/serverMiddleware/api/user/verify')
    this.addServerMiddleware('~/serverMiddleware/api/user/requestPasswordReset')
    this.addServerMiddleware('~/serverMiddleware/api/user/update')
    this.addServerMiddleware('~/serverMiddleware/api/user/headers')
    this.addServerMiddleware('~/serverMiddleware/api/user/inviteFriends')
    this.addServerMiddleware('~/serverMiddleware/api/s3/list')
    this.addServerMiddleware('~/serverMiddleware/api/s3/scan')
    this.addServerMiddleware('~/serverMiddleware/api/s3/meta')
    this.addServerMiddleware('~/serverMiddleware/api/s3/mediainfo')
    this.addServerMiddleware('~/serverMiddleware/api/s3/thumbnail')
    this.addServerMiddleware('~/serverMiddleware/api/s3/stream')
    this.addServerMiddleware('~/serverMiddleware/api/admin/sources')
    this.addServerMiddleware('~/serverMiddleware/api/admin/users')
    this.addServerMiddleware('~/serverMiddleware/api/admin/deleteUser')
    this.addServerMiddleware('~/serverMiddleware/api/admin/migrateUsers')
    this.addServerMiddleware('~/serverMiddleware/api/admin/queue')
  }
}
