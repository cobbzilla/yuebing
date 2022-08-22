const fs = require('fs')
const shasum = require('shasum')
const nodemailer = require('nodemailer')
const Handlebars = require('handlebars')
const redis = require('../util/redis')
const locale = require('../../shared/locale')
const system = require('./config').SYSTEM

const EMAIL_CONFIG = system.privateConfig.email
const EMAIL_ENABLED = EMAIL_CONFIG.host

const TEMPLATE_VERIFY_EMAIL = 'verifyEmail'
const TEMPLATE_RESET_PASSWORD = 'resetPassword'
const TEMPLATE_INVITATION = 'invitation'
const TEMPLATE_NAMES = [TEMPLATE_VERIFY_EMAIL, TEMPLATE_RESET_PASSWORD, TEMPLATE_INVITATION]

const SUBJECT_TEMPLATE = 'subject.txt.hbs'
const MESSAGE_TXT_TEMPLATE = 'message.txt.hbs'
const MESSAGE_HTML_TEMPLATE = 'message.html.hbs'
const TEMPLATE_FILES = [SUBJECT_TEMPLATE, MESSAGE_TXT_TEMPLATE, MESSAGE_HTML_TEMPLATE]

const COMPILED_TEMPLATES = {}

if (EMAIL_ENABLED) {
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
}

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

const MAIL_SENDER = EMAIL_ENABLED
  ? nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port || 587,
    secure: EMAIL_CONFIG.secure, // true for 465, false for other ports
    auth: {
      user: EMAIL_CONFIG.user || '',
      pass: EMAIL_CONFIG.password || ''
    },
    tls: {
      ciphers: 'SSLv3'
    }
  })
  : null

const MAIL_FROM = EMAIL_CONFIG.fromEmail
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
  if (!EMAIL_ENABLED) {
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
  MAIL_SENDER.sendMail({
    from: MAIL_FROM, // sender address
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
