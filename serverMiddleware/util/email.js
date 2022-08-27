const fs = require('fs')
const shasum = require('shasum')
const nodemailer = require('nodemailer')
const Handlebars = require('handlebars')
const redis = require('../util/redis')
const locale = require('../../shared/locale')
const system = require('./config').SYSTEM

const emailEnabled = () => system.publicConfig.emailEnabled && !!system.privateConfig.email.host

const CACHED_CONFIG = {
  sender: null,
  config: null,
  getConfig () {
    if (!emailEnabled()) { return null }
    if (this.config === null) { this.config = system.privateConfig.email }
    return this.config
  },
  flush () {
    console.log('CACHED_CONFIG.flush called')
    this.config = null
  }
}

// reload the email configuration when it changes
for (const field of Object.keys(system.privateConfig.email)) {
  if (field !== 'configurable') {
    system.registerConfigUpdateHandler(`privateConfig_email_${field}`, CACHED_CONFIG.flush)
  }
}

const TEMPLATE_VERIFY_EMAIL = 'verifyEmail'
const TEMPLATE_RESET_PASSWORD = 'resetPassword'
const TEMPLATE_INVITATION = 'invitation'
const TEMPLATE_NAMES = [TEMPLATE_VERIFY_EMAIL, TEMPLATE_RESET_PASSWORD, TEMPLATE_INVITATION]

const SUBJECT_TEMPLATE = 'subject.txt.hbs'
const MESSAGE_TXT_TEMPLATE = 'message.txt.hbs'
const MESSAGE_HTML_TEMPLATE = 'message.html.hbs'
const TEMPLATE_FILES = [SUBJECT_TEMPLATE, MESSAGE_TXT_TEMPLATE, MESSAGE_HTML_TEMPLATE]

const COMPILED_TEMPLATES = {}

// compile templates
for (const templateName of TEMPLATE_NAMES) {
  for (const loc of locale.SUPPORTED_LOCALES) {
    compileTemplates(loc, templateName)
  }
}
// register helpers
Handlebars.registerHelper('urlEscape', (src) => {
  return new Handlebars.SafeString(encodeURIComponent(src))
})

function compileTemplates (locale, template) {
  if (COMPILED_TEMPLATES[locale] && COMPILED_TEMPLATES[locale][template]) {
    return
  }
  const templatePrefix = `${process.cwd()}/serverMiddleware/templates/email/${locale}/${template}`
  for (const templateFile of TEMPLATE_FILES) {
    fs.readFile(`${templatePrefix}/${templateFile}`, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        throw err
      } else {
        if (!COMPILED_TEMPLATES[locale]) {
          COMPILED_TEMPLATES[locale] = {}
        }
        if (!COMPILED_TEMPLATES[locale][template]) {
          COMPILED_TEMPLATES[locale][template] = {}
        }
      }
      COMPILED_TEMPLATES[locale][template][templateFile] = Handlebars.compile(data)
    })
  }
}

const mailSender = () => {
  if (!emailEnabled()) { return null }
  const cfg = CACHED_CONFIG.getConfig()
  if (CACHED_CONFIG.sender === null) {
    CACHED_CONFIG.sender = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: {
        user: cfg.user || '',
        pass: cfg.password || ''
      },
      tls: {
        ciphers: 'SSLv3'
      }
    })
  }
  return CACHED_CONFIG.sender
}

const fromEmail = () => CACHED_CONFIG.getConfig().fromEmail

const MAIL_SENDING_LIMITS = {}

// max 1 new invitation per week
MAIL_SENDING_LIMITS[TEMPLATE_INVITATION] = { count: 1, period: 1000 * 60 * 60 * 24 * 7 }

// max 10 verify/reset attempts per day
MAIL_SENDING_LIMITS[TEMPLATE_RESET_PASSWORD] = { count: 10, period: 1000 * 60 * 60 * 24 }
MAIL_SENDING_LIMITS[TEMPLATE_VERIFY_EMAIL] = { count: 10, period: 1000 * 60 * 60 * 24 }

function redisRecipientPrefix (to, template) {
  return 'mlimit_' + shasum(to + ' ! ' + template)
}

// adapted from https://stackoverflow.com/a/27724419
function EmailRateLimitExceededError (limit) {
  this.message = `Rate limit exceeded: ${JSON.stringify(limit)}`
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
}

async function sendEmail (to, locale, template, params) {
  if (!emailEnabled()) {
    console.log(`sendEmail(${to}, ${locale}, ${template}): email not enabled, not sending`)
    return
  }
  // what is our limit for sending these types of messages?
  const limit = MAIL_SENDING_LIMITS[template]
  const redisPrefix = redisRecipientPrefix(to, template)
  const sendReceipts = await redis.findMatchingKeys(redisPrefix + '*')
  if (sendReceipts && sendReceipts.length >= limit.count) {
    throw new EmailRateLimitExceededError(limit)
  }
  console.log(`sendEmail(${to}, ${locale}, ${template}) starting`)

  const compiled = COMPILED_TEMPLATES[locale] && COMPILED_TEMPLATES[locale][template]
    ? COMPILED_TEMPLATES[locale][template]
    : null
  if (!compiled) {
    throw new TypeError(`sendEmail(${to}, ${locale}, ${template}): compiled templates not found for locale/template`)
  }

  // inject config into params
  const ctx = Object.assign({}, params, { config: system.publicConfig })

  // record attempt to send mail -- limit is enforced above
  await redis.set(redisPrefix + '_' + Date.now(), '' + Date.now(), limit.period)

  // send the mail!
  mailSender().sendMail({
    from: fromEmail(), // sender address
    to,
    subject: compiled[SUBJECT_TEMPLATE](ctx),
    text: compiled[MESSAGE_TXT_TEMPLATE](ctx),
    html: compiled[MESSAGE_HTML_TEMPLATE](ctx)
  }, (err, result) => {
    if (err) {
      console.log(`sendMail: error sending mail: ${err}`)
    } else if (result) {
      console.log(`sendMail: sent mail: ${JSON.stringify(result)}`)
    }
  })
}

module.exports = {
  TEMPLATE_VERIFY_EMAIL,
  TEMPLATE_RESET_PASSWORD,
  TEMPLATE_INVITATION,
  sendEmail
}
