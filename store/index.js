import { userService } from '@/services/userService'
import { sourceService } from '@/services/sourceService'

const langParser = require('accept-language-parser')
const { SUPPORTED_LOCALES, DEFAULT_LOCALE } = require('@/shared/locale')

export const state = () => ({
  fetchingHeaders: false,
  browserHeaders: null,
  browserHeaderError: null,
  browserLocale: null,
  publicConfig: null,
  loadingPublicConfig: false,
  loadingPublicConfigError: null,
  searchQuery: null,
  searching: null,
  searchResults: null,
  searchIndexesBuilding: null,
  searchError: null
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
  },

  searchContent ({ commit }, { query }) {
    commit('searchContentRequest', { query })
    sourceService.searchContent(query)
      .then(
        (results) => { commit('searchContentSuccess', { results }) },
        (error) => { commit('searchContentFailure', { error }) }
      )
  }
}

function detectLocale (langHeader) {
  const languages = langParser.parse(langHeader)
  for (const lang of languages) {
    const exactMatch = SUPPORTED_LOCALES.find(locale => locale === lang.code + (lang.region ? '_' + lang.region : ''))
    if (exactMatch) {
      return exactMatch
    }
    const langMatch = SUPPORTED_LOCALES.find(locale => locale && locale.includes('_') && locale.startsWith(lang.code + '_'))
    if (langMatch) {
      return langMatch
    }
  }
  return DEFAULT_LOCALE
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
  },

  searchContentRequest (state, { query }) {
    state.searching = true
    state.searchQuery = query
    state.searchError = null
  },
  searchContentSuccess (state, { results }) {
    state.searching = false
    state.searchResults = Object.assign({}, results)
    if (results.stillBuilding && results.stillBuilding.length > 0) {
      state.searchIndexesBuilding = results.stillBuilding
    } else {
      state.searchIndexesBuilding = null
    }

  },
  searchContentFailure (state, { error }) {
    state.searching = false
    state.searchError = error
  }
}
