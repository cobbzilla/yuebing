import { userService } from '@/services/userService'

const langParser = require('accept-language-parser')
const loc = require('@/shared/locale')

export const state = () => ({
  fetchingHeaders: false,
  browserHeaders: null,
  browserHeaderError: null,
  browserLocale: null,
  publicConfig: null,
  loadingPublicConfig: false,
  loadingPublicConfigError: null
})

export const actions = {
  fetchBrowserHeaders ({ commit }) {
    commit('browserHeadersRequest')
    userService.browserHeaders()
      .then(
        (headers) => {
          commit('browserHeadersSuccess', { headers })
        },
        (error) => {
          commit('browserHeadersFailure', { error })
        }
      )
  },

  loadPublicConfig ({ commit }) {
    commit('loadPublicConfigRequest')
    userService.loadPublicConfig()
      .then(
        (config) => { commit('loadPublicConfigSuccess', { config }) },
        (error) => { commit('loadPublicConfigFailure', { error }) }
      )
  }
}

function detectLocale (langHeader) {
  const languages = langParser.parse(langHeader)
  for (const lang of languages) {
    const exactMatch = loc.SUPPORTED_LOCALES.find(locale => locale === lang.code + '_' + lang.region)
    if (exactMatch) {
      return exactMatch
    }
    const langMatch = loc.SUPPORTED_LOCALES.find(locale => locale && locale.includes('_') && locale.startsWith(lang.code + '_'))
    if (langMatch) {
      return langMatch
    }
  }
  return loc.DEFAULT_LOCALE
}

export const mutations = {
  browserHeadersRequest (state) {
    state.fetchingHeaders = true
  },
  browserHeadersSuccess (state, { headers }) {
    state.fetchingHeaders = false
    state.browserHeaderError = null
    state.browserHeaders = headers
    state.browserLocale = detectLocale(headers['accept-language'])
  },
  browserHeadersFailure (state, { error }) {
    state.fetchingHeaders = false
    state.userStatus = { verifyError: error }
  },

  loadPublicConfigRequest (state) {
    state.loadingPublicConfig = true
    state.invitationError = null
  },
  loadPublicConfigSuccess (state, { config }) {
    state.publicConfig = config
    state.loadingPublicConfig = false
    state.loadingPublicConfigError = null
  },
  loadPublicConfigFailure (state, { error }) {
    state.loadingPublicConfig = false
    state.loadingPublicConfigError = error
  }
}
