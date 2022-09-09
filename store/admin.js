import { adminService } from '@/services/adminService'

export const state = () => ({
  queue: [],
  loadingQueue: false,
  loadingQueueError: null,

  migratingData: false,
  dataMigrationResults: null,
  dataMigrationError: null,

  findingUsers: false,
  userList: null,
  totalUserCount: null,
  findUsersError: null,

  deletingUser: false,
  deleteUserSuccess: null,
  deleteUserError: null,

  findingSources: false,
  sourceList: null,
  totalSourceCount: null,
  sourceListError: null,

  addingSource: false,
  addSourceSuccess: null,
  addSourceError: null,

  scanningSources: {},
  scanSourceSuccess: {},
  scanSourceError: {},

  scanningPaths: {},
  scanPathSuccess: {},
  scanPathError: {},

  indexingSources: {},
  indexingStartSuccess: {},
  indexingStartError: {},

  indexingPaths: {},
  indexPathSuccess: {},
  indexPathError: {},

  deletingPaths: {},
  deletePathSuccess: {},
  deletePathError: {},

  indexingInfo: {},
  indexingInfoSuccess: {},
  indexingInfoError: {},

  deletingSource: false,
  deleteSourceSuccess: null,
  deleteSourceError: null,

  loadingSiteConfig: false,
  siteConfig: null,
  siteConfigError: null,

  updatingSiteConfig: false,
  updateSiteSuccess: null,
  siteConfigUpdateError: null,

  sendingBuildRequest: false,
  buildRequestSuccess: null,
  sendingBuildRequestError: null
})

export const actions = {
  fetchQueue ({ commit }) {
    commit('fetchQueueRequest')
    adminService
      .getQueue()
      .then(
        queue => commit('fetchQueueSuccess', queue),
        error => commit('fetchQueueFailure', error)
      )
  },

  migrate ({ commit }, { migration }) {
    commit('migrateRequest')
    adminService
      .migrate(migration)
      .then(
        results => commit('migrateSuccess', { results }),
        error => commit('migrateFailure', error)
      )
  },

  findUsers ({ commit }, { query }) {
    commit('findUsersRequest', { query })
    adminService.findUsers(query)
      .then(
        (results) => { commit('findUsersSuccess', { results }) },
        (error) => { commit('findUsersFailure', { error }) }
      )
  },

  deleteUser ({ commit }, { email }) {
    commit('deleteUserRequest', { email })
    adminService.deleteUser(email)
      .then(
        (ok) => { commit('deleteUserSuccess', { ok, email }) },
        (error) => { commit('deleteUserFailure', { error }) }
      )
  },

  findSources ({ commit }, { query }) {
    commit('findSourcesRequest', { query })
    adminService.findSources(query)
      .then(
        (results) => { commit('findSourcesSuccess', { results }) },
        (error) => { commit('findSourcesFailure', { error }) }
      )
  },

  addSource ({ commit }, { src }) {
    commit('addSourceRequest', { src })
    adminService.addSource(src)
      .then(
        (ok) => { commit('addSourceSuccess', { ok, src }) },
        (error) => { commit('addSourceFailure', { error }) }
      )
  },

  scanSource ({ commit }, { scanConfig }) {
    commit('scanSourceRequest', { scanConfig })
    adminService.scanSource(scanConfig)
      .then(
        (ok) => { commit('scanSourceSuccess', { ok, scanConfig }) },
        (error) => { commit('scanSourceFailure', { scanConfig, error }) }
      )
  },

  indexSource ({ commit }, { src }) {
    commit('indexSourceRequest', { src })
    adminService.indexSource(src)
      .then(
        (ok) => { commit('indexSourceSuccess', { ok, src }) },
        (error) => { commit('indexSourceFailure', { src, error }) }
      )
  },

  scanPath ({ commit }, { scanConfig }) {
    commit('scanPathRequest', { scanConfig })
    adminService.scanPath(scanConfig)
      .then(
        (ok) => { commit('scanPathSuccess', { ok, scanConfig }) },
        (error) => { commit('scanPathFailure', { scanConfig, error }) }
      )
  },

  indexPath ({ commit }, { sourceAndPath }) {
    commit('indexPathRequest', { sourceAndPath })
    adminService.indexPath(sourceAndPath)
      .then(
        (ok) => { commit('indexPathSuccess', { ok, sourceAndPath }) },
        (error) => { commit('indexPathFailure', { sourceAndPath, error }) }
      )
  },

  deletePath ({ commit }, { sourceAndPath }) {
    commit('deletePathRequest', { sourceAndPath })
    adminService.deletePath(sourceAndPath)
      .then(
        (ok) => { commit('deletePathSuccess', { ok, sourceAndPath }) },
        (error) => { commit('deletePathFailure', { sourceAndPath, error }) }
      )
  },

  indexInfo ({ commit }, { src }) {
    commit('indexInfoRequest', { src })
    adminService.indexInfo(src)
      .then(
        (info) => { commit('indexInfoSuccess', { info, src }) },
        (error) => { commit('indexInfoFailure', { src, error }) }
      )
  },

  deleteSource ({ commit }, { src }) {
    commit('deleteSourceRequest', { src })
    adminService.deleteSource(src)
      .then(
        (ok) => { commit('deleteSourceSuccess', { ok, src }) },
        (error) => { commit('deleteSourceFailure', { error }) }
      )
  },

  loadSiteConfig ({ commit }) {
    commit('loadSiteConfigRequest')
    adminService.loadSiteConfig()
      .then(
        (config) => { commit('loadSiteConfigSuccess', { config }) },
        (error) => { commit('loadSiteConfigFailure', { error }) }
      )
  },

  updateSiteConfig ({ commit }, { config }) {
    commit('updateSiteConfigRequest', { config })
    adminService.updateSiteConfig(config)
      .then(
        (cfg) => { commit('updateSiteConfigSuccess', { config: cfg }) },
        (error) => { commit('updateSiteConfigFailure', { error }) }
      )
  },

  buildSearchIndex ({ commit }) {
    commit('buildSearchIndexRequest')
    adminService.buildSearchIndex()
      .then(
        (cfg) => { commit('buildSearchIndexSuccess', { config: cfg }) },
        (error) => { commit('buildSearchIndexFailure', { error }) }
      )
  }
}

export const mutations = {
  fetchQueueRequest (state) {
    state.loadingQueue = true
  },
  fetchQueueSuccess (state, queue) {
    state.queue.splice(0, state.queue.length)
    state.queue.push(...queue)
    state.loadingQueueError = null
    state.loadingQueue = false
  },
  fetchQueueFailure (state, error) {
    state.loadingQueue = false
    state.loadingQueueError = error
  },

  migrateRequest (state) {
    state.migratingData = true
  },
  migrateSuccess (state, { results }) {
    state.dataMigrationResults = results
    state.dataMigrationError = null
    state.migratingData = false
  },
  migrateFailure (state, error) {
    console.log(`migrateFailure: got error: ${JSON.stringify(error)}`)
    state.migratingData = false
    state.dataMigrationError = error
  },

  findUsersRequest (state, { query }) {
    state.findingUsers = true
  },
  findUsersSuccess (state, { results }) {
    state.userList = results.list
    state.totalUserCount = results.total
    state.findingUsers = false
    state.findUsersError = null
  },
  findUsersFailure (state, { error }) {
    state.findingUsers = false
    state.findUsersError = error
  },

  deleteUserRequest (state, { email }) {
    state.deletingUser = true
  },
  deleteUserSuccess (state, { ok, email }) {
    state.deletingUser = false
    state.deleteUserSuccess = ok || true
    state.deleteUserError = null
    const newList = state.userList.filter(u => u.email !== email)
    state.userList.splice(0, state.userList.length)
    state.userList.push(...newList)
  },
  deleteUserFailure (state, { error }) {
    state.deletingUser = false
    state.deleteUserError = error
  },

  findSourcesRequest (state, { query }) {
    state.findingSources = true
  },
  findSourcesSuccess (state, { results }) {
    state.sourceList = results.list
    state.totalSourceCount = results.total
    state.findingSources = false
    state.findSourcesError = null
  },
  findSourcesFailure (state, { error }) {
    state.findingSources = false
    state.findSourcesError = error
  },

  addSourceRequest (state, { src }) {
    state.addingSource = true
  },
  addSourceSuccess (state, { ok, src }) {
    state.addingSource = false
    state.addSourceSuccess = ok || true
    state.addSourceError = null
    state.sourceList.push(src)
  },
  addSourceFailure (state, { error }) {
    state.addingSource = false
    state.addSourceError = error
  },

  scanSourceRequest (state, { scanConfig }) {
    const src = scanConfig.source
    const update = {}
    update[src] = true
    state.scanningSources = Object.assign({}, state.scanningSources, update)
  },
  scanSourceSuccess (state, { ok, scanConfig }) {
    const src = scanConfig.source
    const update = {}
    update[src] = false
    state.scanningSources = Object.assign({}, state.scanningSources, update)
    update[src] = ok || true
    state.scanSourceSuccess = Object.assign({}, state.scanSourceSuccess, update)
    update[src] = null
    state.scanSourceError = Object.assign({}, state.scanSourceError, update)
  },
  scanSourceFailure (state, { scanConfig, error }) {
    const src = scanConfig.source
    const update = {}
    update[src] = false
    state.scanningSources = Object.assign({}, state.scanningSources, update)
    update[src] = false
    state.scanSourceSuccess = Object.assign({}, state.scanSourceSuccess, update)
    update[src] = error
    state.scanSourceError = Object.assign({}, state.scanSourceError, update)
  },

  scanPathRequest (state, { scanConfig }) {
    const sourceAndPath = scanConfig.sourceAndPath
    const update = {}
    update[sourceAndPath] = true
    state.scanningPaths = Object.assign({}, state.scanningPaths, update)
  },
  scanPathSuccess (state, { ok, scanConfig }) {
    const sourceAndPath = scanConfig.sourceAndPath
    const update = {}
    update[sourceAndPath] = false
    state.scanningPaths = Object.assign({}, state.scanningPaths, update)
    update[sourceAndPath] = ok || true
    state.scanPathSuccess = Object.assign({}, state.scanPathSuccess, update)
    update[sourceAndPath] = null
    state.scanPathError = Object.assign({}, state.scanPathError, update)
  },
  scanPathFailure (state, { scanConfig, error }) {
    const sourceAndPath = scanConfig.sourceAndPath
    const update = {}
    update[sourceAndPath] = false
    state.scanningPaths = Object.assign({}, state.scanningPaths, update)
    update[sourceAndPath] = false
    state.scanPathSuccess = Object.assign({}, state.scanPathSuccess, update)
    update[sourceAndPath] = error
    state.scanPathError = Object.assign({}, state.scanPathError, update)
  },

  indexSourceRequest (state, { src }) {
    const update = {}
    update[src] = true
    state.indexingSources = Object.assign({}, state.indexingSources, update)
  },
  indexSourceSuccess (state, { ok, src }) {
    const update = {}
    update[src] = false
    state.indexingSources = Object.assign({}, state.indexingSources, update)
    update[src] = ok || true
    state.indexingStartSuccess = Object.assign({}, state.indexingStartSuccess, update)
    update[src] = null
    state.indexingStartError = Object.assign({}, state.indexingStartError, update)
  },
  indexSourceFailure (state, { src, error }) {
    const update = {}
    update[src] = false
    state.indexingSources = Object.assign({}, state.indexingSources, update)
    update[src] = null
    state.indexingStartSuccess = Object.assign({}, state.indexingStartSuccess, update)
    update[src] = error
    state.scanSourceError = Object.assign({}, state.scanSourceError, update)
  },

  indexPathRequest (state, { sourceAndPath }) {
    const update = {}
    update[sourceAndPath] = true
    state.indexingPaths = Object.assign({}, state.indexingPaths, update)
  },
  indexPathSuccess (state, { ok, sourceAndPath }) {
    const update = {}
    update[sourceAndPath] = false
    state.indexingPaths = Object.assign({}, state.indexingPaths, update)
    update[sourceAndPath] = ok || true
    state.indexPathSuccess = Object.assign({}, state.indexPathSuccess, update)
    update[sourceAndPath] = null
    state.indexPathError = Object.assign({}, state.indexPathError, update)
  },
  indexPathFailure (state, { sourceAndPath, error }) {
    const update = {}
    update[sourceAndPath] = false
    state.indexingPaths = Object.assign({}, state.indexingPaths, update)
    update[sourceAndPath] = null
    state.indexPathSuccess = Object.assign({}, state.indexPathSuccess, update)
    update[sourceAndPath] = error
    state.indexPathError = Object.assign({}, state.indexPathError, update)
  },

  deletePathRequest (state, { sourceAndPath }) {
    const update = {}
    update[sourceAndPath] = true
    state.deletingPaths = Object.assign({}, state.deletingPaths, update)
  },
  deletePathSuccess (state, { ok, sourceAndPath }) {
    const update = {}
    update[sourceAndPath] = false
    state.deletingPaths = Object.assign({}, state.deletingPaths, update)
    update[sourceAndPath] = ok || true
    state.deletePathSuccess = Object.assign({}, state.deletePathSuccess, update)
    update[sourceAndPath] = null
    state.deletePathError = Object.assign({}, state.deletePathError, update)
  },
  deletePathFailure (state, { sourceAndPath, error }) {
    const update = {}
    update[sourceAndPath] = false
    state.deletingPaths = Object.assign({}, state.deletingPaths, update)
    update[sourceAndPath] = null
    state.deletePathSuccess = Object.assign({}, state.deletePathSuccess, update)
    update[sourceAndPath] = error
    state.deletePathError = Object.assign({}, state.deletePathError, update)
  },

  indexInfoRequest (state, { src }) {},
  indexInfoSuccess (state, { info, src }) {
    const update = {}
    update[src] = info
    state.indexingInfo = Object.assign({}, state.indexingInfo, update)
    update[src] = true
    state.indexingInfoSuccess = Object.assign({}, state.indexingInfoSuccess, update)
    update[src] = null
    state.indexingInfoError = Object.assign({}, state.indexingInfoError, update)
  },
  indexInfoFailure (state, { src, error }) {
    const update = {}
    update[src] = null
    state.indexingInfo = Object.assign({}, state.indexingInfo, update)
    update[src] = null
    state.indexingInfoSuccess = Object.assign({}, state.indexingInfoSuccess, update)
    update[src] = error
    state.indexingInfoError = Object.assign({}, state.indexingInfoError, update)
  },

  deleteSourceRequest (state, { src }) {
    state.deletingSource = true
  },
  deleteSourceSuccess (state, { ok, src }) {
    state.deletingSource = false
    state.deleteSourceSuccess = ok || true
    state.deleteSourceError = null
    const newList = state.sourceList.filter(s => s.name !== src)
    state.sourceList.splice(0, state.sourceList.length)
    state.sourceList.push(...newList)
  },
  deleteSourceFailure (state, { error }) {
    state.deletingSource = false
    state.deleteSourceError = error
  },

  loadSiteConfigRequest (state) {
    state.loadingSiteConfig = true
  },
  loadSiteConfigSuccess (state, { config }) {
    state.loadingSiteConfig = false
    state.siteConfig = config
    state.siteConfigError = null
  },
  loadSiteConfigFailure (state, { error }) {
    state.loadingSiteConfig = false
    state.siteConfigError = error
  },

  updateSiteConfigRequest (state, { config }) {
    state.updateSiteSuccess = false
    state.updatingSiteConfig = true
  },
  updateSiteConfigSuccess (state, { config }) {
    state.updateSiteSuccess = true
    state.updatingSiteConfig = false
    state.siteConfig = config
    state.siteConfigUpdateError = null
  },
  updateSiteConfigFailure (state, { error }) {
    state.updateSiteSuccess = false
    state.updatingSiteConfig = false
    state.siteConfigUpdateError = error
  },

  buildSearchIndexRequest (state) {
    state.sendingBuildRequest = true
    state.sendingBuildRequestError = null
    state.buildRequestSuccess = null
  },
  buildSearchIndexSuccess (state) {
    state.sendingBuildRequest = false
    state.buildRequestSuccess = true
  },
  buildSearchIndexFailure (state, { error }) {
    state.sendingBuildRequest = false
    state.buildRequestSuccess = false
    state.sendingBuildRequestError = error
  }
}
