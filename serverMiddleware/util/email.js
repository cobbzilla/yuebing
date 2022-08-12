const fs = require('fs')
const nodemailer = require('nodemailer')
const Handlebars = require('handlebars')
const nuxt = require('../../nuxt.config').default
const locale = require('../../shared/locale')

const EMAIL_CONFIG = nuxt.privateRuntimeConfig.email
const EMAIL_ENABLED = !!EMAIL_CONFIG.host

const TEMPLATE_VERIFY_EMAIL = 'verifyEmail'
const TEMPLATE_NAMES = [TEMPLATE_VERIFY_EMAIL]

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

const MAIL_SENDER = EMAIL_CONFIG.host
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

async function sendEmail (to, locale, template, params) {
  if (!EMAIL_ENABLED) {
    console.log(`sendEmail(${to}, ${locale}, ${template}): email not enabled, not sending`)
    return
  }
  console.log(`sendEmail(${to}, ${locale}, ${template}) starting`)

  const compiled = COMPILED_TEMPLATES[locale] && COMPILED_TEMPLATES[locale][template]
    ? COMPILED_TEMPLATES[locale][template]
    : null
  if (!compiled) {
    throw new TypeError(`sendEmail(${to}, ${locale}, ${template}): compiled templates not found for locale/template`)
  }

  // inject config into params
  const ctx = Object.assign({}, params, { config: nuxt.publicRuntimeConfig })
  await MAIL_SENDER.sendMail({
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

export {
  TEMPLATE_VERIFY_EMAIL,
  sendEmail
}
