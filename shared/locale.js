/* eslint-disable curly,no-prototype-builtins,no-extend-native,dot-notation */
const safeEval = require('safe-eval')
const nuxt = require('../nuxt.config').default

const DEFAULT_LOCALE = nuxt.publicRuntimeConfig.defaultLocale || 'en'

const SUPPORTED_LOCALES = nuxt.publicRuntimeConfig.locales

function unknownMessage (msg) { return '???' + msg }

const messageNotFoundHandler = {
  get (target, name) {
    if (typeof name === 'undefined') return unknownMessage('undefined')
    if (name === null) return unknownMessage('null')
    if (name === '') return unknownMessage('empty')
    const checkExists = name.toString().startsWith('!')
    const index = checkExists ? name.toString().substring(1) : name
    if (target.hasOwnProperty(index)) return checkExists ? true : target[index]
    const altName = index.toString().replace(/\./g, '_')
    if (target.hasOwnProperty(altName)) return checkExists ? true : target[altName]
    return checkExists ? false : unknownMessage(name.toString())
  }
}

function evalInContext (ctx, string) {
  const context = { ctx }
  try {
    return safeEval('ctx.' + string.trim(), context)
  } catch (error) {
    try {
      return safeEval(string.trim(), ctx)
    } catch (errorWithoutThis) {
      console.warn(`evalInContext: Error evaluating "${string}": ${error} and then ${errorWithoutThis}`)
      return ''
    }
  }
}

String.prototype.parseMessage = function (ctx) {
  return this
    ? '' + this.replace(/{{[^}]+}}/g, (match) => {
      const expression = match.slice(2, -2)
      return evalInContext(ctx, expression)
    })
    : ''
}

String.prototype.parseDateMessage = function (millis, messages) {
  if (typeof millis === 'undefined' || millis === null || millis === 0) return messages.label_date_undefined
  const date = new Date(millis)
  const context = {
    YYYY: date.getFullYear(),
    YY: (date.getFullYear() % 100 < 10 ? '0' + (date.getFullYear() % 100) : (date.getFullYear() % 100)),
    MMMM: messages['label_date_month_' + date.getMonth()],
    MMM: messages['label_date_month_short_' + date.getMonth()],
    MM: date.getMonth() < 10 ? '0' + messages['label_date_month_number_' + date.getMonth()] : messages['label_date_month_number_' + date.getMonth()],
    M: messages['label_date_month_number_' + date.getMonth()],
    EEE: messages['label_date_day_' + date.getDay()],
    E: messages['label_date_day_short_' + date.getDay()],
    dd: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
    d: date.getDate(),
    H: date.getHours(),
    h: (date.getHours() > 12 ? date.getHours() - 12 : date.getHours() === 0 ? 12 : date.getHours()),
    A: (date.getHours() >= 12 ? messages['label_date_day_half_pm'].toUpperCase() : messages['label_date_day_half_am']).toUpperCase(),
    a: (date.getHours() >= 12 ? messages['label_date_day_half_pm'].toLowerCase() : messages['label_date_day_half_am']).toLowerCase(),
    m: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
    s: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  }
  return this
    ? '' + this.replace(/{{\w+?}}/g, (match) => {
      const expression = match.slice(2, -2)
      return evalInContext(context, expression)
    })
    : ''
}

const MESSAGES = {}

function registerMessages (locale, messages) {
  MESSAGES[locale] = new Proxy(Object.assign({}, messages), messageNotFoundHandler)
}

// register locale strings
for (const locale of SUPPORTED_LOCALES) {
  registerMessages(locale, require(`./messages/${locale}_messages.json`).default)
}

function localesForUser (user, browserLocale = null, anonLocale) {
  const locales = []
  if (user && user.locale && locales.includes(user.locale)) {
    locales.push(user.locale)
  }
  if (anonLocale && !locales.includes(anonLocale)) {
    locales.push(anonLocale)
  } else {
    const stored = localStorage.getItem('anon_locale')
    if (stored && !locales.includes(stored)) {
      locales.push(stored)
    }
  }

  if (browserLocale && !locales.includes(browserLocale)) {
    locales.push(browserLocale)
  }
  if (!locales.includes(DEFAULT_LOCALE)) {
    locales.push(DEFAULT_LOCALE)
  }
  // console.log(`localesForUser returning: ${JSON.stringify(locales)}`)
  return locales
}

function localesList (locales) {
  const messages = findFirstLocaleMatch(locales)
  return SUPPORTED_LOCALES.map((loc) => {
    const localeDescription = messages['locale_' + loc]
    const description = MESSAGES[loc] && MESSAGES[loc]['locale_' + loc]
      ? `${MESSAGES[loc]['locale_' + loc]} (${localeDescription})`
      : localeDescription
    return {
      name: loc,
      value: description
    }
  })
}

function findFirstLocaleMatch (locales) {
  for (const loc of locales) {
    if (typeof MESSAGES[loc] !== 'undefined') {
      // console.log(`findFirstLocaleMatch(${JSON.stringify(locales)}) returning MESSAGES[${loc}]`)
      return MESSAGES[loc]
    }
  }
  // console.log(`findFirstLocaleMatch(${JSON.stringify(locales)}) returning DEFAULT_LOCALE [${DEFAULT_LOCALE}]`)
  return MESSAGES[DEFAULT_LOCALE]
}

const localeMessagesForUser = (user, browserLocale, anonLocale) => {
  const locales = localesForUser(user, browserLocale, anonLocale)
  const match = findFirstLocaleMatch(locales)
  return match || new Proxy(MESSAGES[DEFAULT_LOCALE], messageNotFoundHandler)
}

function fieldErrorMessage (field, error, messages, labelPrefix = 'label_') {
  if (Array.isArray(error)) {
    let message = ''
    for (const e of error) {
      if (message.length > 0) { message += ', ' }
      message += messages['error_field_' + e].parseMessage({ field: messages[labelPrefix + field] })
    }
    return message
  } else {
    return messages['error_field_' + error].parseMessage({ field: messages[labelPrefix + field] })
  }
}

const localeLang = locale => locale.includes('_') ? locale.substring(0, locale.indexOf('_')) : locale

const localeEmoji = locale => MESSAGES[locale] && MESSAGES[locale].emoji ? MESSAGES[locale].emoji : undefined

module.exports = {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  messageNotFoundHandler,
  localesForUser,
  localeMessagesForUser,
  localeLang,
  localesList,
  fieldErrorMessage,
  localeEmoji
}
