/* eslint-disable curly,no-prototype-builtins,no-extend-native,dot-notation */
// @ts-ignore
import { safeEval } from 'safe-eval'
import { MESSAGES, isUnknownMessage } from "~/utils/messages";

const runtimeConfig = useRuntimeConfig()
export const DEFAULT_LOCALE : string = runtimeConfig.public.defaultLocale || 'en'

export const SUPPORTED_LOCALES = runtimeConfig.public.locales

const evalInContext = (ctx : Record<string, any>, string : string) : string => {
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

export const parseMessage = (msg : string, ctx : Record<string, any>) : string =>
    msg
        ? '' + msg.replace(/{{[^}]+}}/g, (match) => {
        const expression = match.slice(2, -2)
        return evalInContext(ctx, expression)
    })
        : ''

export const parseDateMessage = (msg : string, millis : number | string | Date, messages : Record<string, string>) : string => {
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
    return msg
        ? '' + msg.replace(/{{\w+?}}/g, (match) => {
        const expression = match.slice(2, -2)
        return evalInContext(context, expression)
    })
        : ''
}
export const localesForUser = (user : any, browserLocale : string | null = null, anonLocale : string | null = null) : string[] => {
    const locales : string[] = []
    if (user && user.locale && !locales.includes(user.locale)) {
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

export const localesList = (user : any, browserLocale : string | null, anonLocale : string | null) : Record<string, string>[] => {
    const messages = findFirstLocaleMatch(localesForUser(user, browserLocale, anonLocale))
    return SUPPORTED_LOCALES.map((loc : string) => {
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

const findFirstLocaleMatch = (locales : string[]) : Record<string, string> => {
    for (const loc of locales) {
        if (typeof MESSAGES[loc] !== 'undefined') {
            // console.log(`findFirstLocaleMatch(${JSON.stringify(locales)}) returning MESSAGES[${loc}]`)
            return MESSAGES[loc]
        }
    }
    // console.log(`findFirstLocaleMatch(${JSON.stringify(locales)}) returning DEFAULT_LOCALE [${DEFAULT_LOCALE}]`)
    return MESSAGES[DEFAULT_LOCALE]
}

export const userLocale = (user : any, browserLocale : string | null, anonLocale : string | null) : Record<string, string> => {
    const locales = localesForUser(user, browserLocale, anonLocale)
    const match = findFirstLocaleMatch(locales)
    return {
        name: match.id,
        description: match['locale_' + match.id]
    }
}

export const localeMessagesForUser = (user : any, browserLocale : string | null, anonLocale : string | null) : Record<string, string> => {
    const locales = localesForUser(user, browserLocale, anonLocale)
    const match = findFirstLocaleMatch(locales)
    // console.log(`localeMessagesForUser(user=${user ? user.locale : null}, browser=${browserLocale}, anon=${anonLocale}} RETURNING: ${match.id || 'default'}`)
    return match || MESSAGES[DEFAULT_LOCALE]
}

export const fieldErrorMessage = (field : any, error : any, messages : Record<string, string>, labelPrefixes : string | string[] = ['label_']) => {
    let fieldObject = null
    if (typeof (field) === 'object') {
        fieldObject = field
        field = field.name
    }
    if (typeof (labelPrefixes) === 'string') {
        labelPrefixes = [labelPrefixes]
    }
    const fieldMessage = fieldObject && fieldObject.label && !isUnknownMessage(messages[fieldObject.label])
        ? messages[fieldObject.label]
        : findMessage(field, messages, labelPrefixes)
    if (Array.isArray(error)) {
        let message = ''
        for (const e of error) {
            if (message.length > 0) { message += ', ' }
            message += parseMessage(messages['error_field_' + e], { field: fieldMessage })
        }
        return message
    } else {
        return parseMessage(messages['error_field_' + error], { field: fieldMessage })
    }
}

export const findMessage = (key : string, messages : Record<string, string>, labelPrefixes  : string | string[] = ['label_']) : string => {
    if (typeof (labelPrefixes) === 'string') {
        labelPrefixes = [labelPrefixes]
    }
    if (!Array.isArray(labelPrefixes)) {
        throw new TypeError(`findMessage: unexpected type for labelPrefixes param, expected a string or array. typeof(labelPrefixes)=${typeof (labelPrefixes)}, Array.isArray(labelPrefixes)=${Array.isArray(labelPrefixes)}`)
    }
    for (const prefix of labelPrefixes) {
        const msgKey = prefix + key
        const msg = messages[msgKey]
        if (!isUnknownMessage(msg)) {
            return msg
        }
    }
    // It's unknown by all prefixes, punt and return the first message as an unknown message
    return messages[labelPrefixes[0] + key]
}

export const localeLang = (locale : string) : string => locale.includes('_') ? locale.substring(0, locale.indexOf('_')) : locale

export const localeEmoji = (locale : string) : string | undefined => MESSAGES[locale] && MESSAGES[locale].emoji ? MESSAGES[locale].emoji : undefined

let STOP_WORDS : string[] | null = null
export const stopWords = () : string[] => {
    if (STOP_WORDS !== null) {
        return STOP_WORDS
    }
    const stops : string[] = []
    for (const locale of SUPPORTED_LOCALES) {
        if (MESSAGES[locale] && MESSAGES[locale].search_stop_words && !isUnknownMessage(MESSAGES[locale].search_stop_words)) {
            stops.push(...MESSAGES[locale].search_stop_words.split(','))
        }
    }
    STOP_WORDS = [...new Set(stops)]
    return STOP_WORDS
}
