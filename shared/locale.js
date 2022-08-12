/* eslint-disable curly,no-prototype-builtins,no-extend-native,dot-notation */
const safeEval = require('safe-eval')
const nuxt = require('../nuxt.config').default

const DEFAULT_LOCALE = nuxt.publicRuntimeConfig.defaultLocale || 'en_US'

const SUPPORTED_LOCALES = nuxt.publicRuntimeConfig.locales

const LOCALIZED_MESSAGES = {}

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
    console.warn(`evalInContext: Error evaluating "${string}"`, error)
    return ''
  }
}

String.prototype.parseMessage = function (ctx) {
  const evaluated = this
    ? '' + this.replace(/{{\s*[\w-.]+\s*}}/g, (match) => {
      const expression = match.slice(2, -2)
      return evalInContext(ctx, expression)
    })
    : ''
  return evaluated
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

function registerMessages (locale, messages) {
  LOCALIZED_MESSAGES[locale] = new Proxy(Object.assign({}, messages), messageNotFoundHandler)
}

// register locale strings
for (const locale of SUPPORTED_LOCALES) {
  registerMessages(locale, require(`./messages/${locale}`).default)
}

function localeMessages (locale) {
  return locale ? LOCALIZED_MESSAGES[locale] : LOCALIZED_MESSAGES[DEFAULT_LOCALE]
}

function localeMessagesForUser (user) {
  if (user && user.locale && LOCALIZED_MESSAGES[user.locale]) {
    return LOCALIZED_MESSAGES[user.locale]
  }
  if (user) {
    user.locale = DEFAULT_LOCALE
  }
  return LOCALIZED_MESSAGES[DEFAULT_LOCALE]
}

function localesList (user) {
  const messages = localeMessagesForUser(user)
  return SUPPORTED_LOCALES.map((loc) => {
    const localeDescription = messages['locale_' + loc]
    const description = (user && user.locale && loc === user.locale) || ((!user || !user.locale) && loc === DEFAULT_LOCALE)
      ? localeDescription
      : `${localeMessages(loc)['locale_' + loc]} (${localeDescription})`
    return {
      name: loc,
      value: description
    }
  })
}

function fieldErrorMessage (field, error, messages) {
  return messages['error_field_' + error].parseMessage({ field: messages['label_' + field] })
}

export {
  DEFAULT_LOCALE, SUPPORTED_LOCALES,
  localesList, localeMessages, localeMessagesForUser,
  fieldErrorMessage
}
