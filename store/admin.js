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

  updatingEditorFlag: false,
  updateEditorFlagSuccess: null,
  updateEditorFlagError: null,

  findingVolumes: false,
  volumeList: null,
  totalVolumeCount: null,
  volumeListError: null,

  addingVolume: false,
  addVolumeSuccess: null,
  addVolumeError: null,

  scanningVolumes: {},
  scanVolumeSuccess: {},
  scanVolumeError: {},

  scanningPaths: {},
  scanPathSuccess: {},
  scanPathError: {},

  indexingVolumes: {},
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

  deletingVolume: false,
  deleteVolumeSuccess: null,
  deleteVolumeError: null,

  findingLibraries: false,
  libraryList: null,
  totalLibraryCount: null,
  libraryListError: null,

  addingLibrary: false,
  addLibrarySuccess: null,
  addLibraryError: null,

  deletingLibrary: false,
  deleteLibrarySuccess: null,
  deleteLibraryError: null,

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

  setEditor ({ commit }, { email, editor }) {
    commit('setEditorRequest', { email, editor })
    adminService.setEditor(email, editor)
      .then(
        (user) => { commit('setEditorSuccess', { user }) },
        (error) => { commit('setEditorFailure', { error }) }
      )
  },

  findVolumes ({ commit }, { query }) {
    commit('findVolumesRequest', { query })
    adminService.findVolumes(query)
      .then(
        (results) => { commit('findVolumesSuccess', { results }) },
        (error) => { commit('findVolumesFailure', { error }) }
      )
  },

  addVolume ({ commit }, { volume }) {
    commit('addVolumeRequest', { volume })
    adminService.addVolume(volume)
      .then(
        (ok) => { commit('addVolumeSuccess', { ok, volume }) },
        (error) => { commit('addVolumeFailure', { error }) }
      )
  },

  scanVolume ({ commit }, { scanConfig }) {
    commit('scanVolumeRequest', { scanConfig })
    adminService.scanVolume(scanConfig)
      .then(
        (ok) => { commit('scanVolumeSuccess', { ok, scanConfig }) },
        (error) => { commit('scanVolumeFailure', { scanConfig, error }) }
      )
  },

  indexVolume ({ commit }, { volume }) {
    commit('indexVolumeRequest', { volume })
    adminService.indexVolume(volume)
      .then(
        (ok) => { commit('indexVolumeSuccess', { ok, volume }) },
        (error) => { commit('indexVolumeFailure', { volume, error }) }
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

  indexPath ({ commit }, { volumeAndPath }) {
    commit('indexPathRequest', { volumeAndPath })
    adminService.indexPath(volumeAndPath)
      .then(
        (ok) => { commit('indexPathSuccess', { ok, volumeAndPath }) },
        (error) => { commit('indexPathFailure', { volumeAndPath, error }) }
      )
  },

  deletePath ({ commit }, { volumeAndPath }) {
    commit('deletePathRequest', { volumeAndPath })
    adminService.deletePath(volumeAndPath)
      .then(
        (ok) => { commit('deletePathSuccess', { ok, volumeAndPath }) },
        (error) => { commit('deletePathFailure', { volumeAndPath, error }) }
      )
  },

  indexInfo ({ commit }, { volume }) {
    commit('indexInfoRequest', { volume })
    adminService.indexInfo(volume)
      .then(
        (info) => { commit('indexInfoSuccess', { info, volume }) },
        (error) => { commit('indexInfoFailure', { volume, error }) }
      )
  },

  deleteVolume ({ commit }, { volume }) {
    commit('deleteVolumeRequest', { volume })
    adminService.deleteVolume(volume)
      .then(
        (ok) => { commit('deleteVolumeSuccess', { ok, volume }) },
        (error) => { commit('deleteVolumeFailure', { error }) }
      )
  },

  findLibraries ({ commit }, { query }) {
    commit('findLibrariesRequest', { query })
    adminService.findLibraries(query)
      .then(
        (results) => { commit('findLibrariesSuccess', { results }) },
        (error) => { commit('findLibrariesFailure', { error }) }
      )
  },

  addLibrary ({ commit }, { library }) {
    commit('addLibraryRequest', { library })
    adminService.addLibrary(library)
      .then(
        (ok) => { commit('addLibrarySuccess', { ok, library }) },
        (error) => { commit('addLibraryFailure', { error }) }
      )
  },

  deleteLibrary ({ commit }, { library }) {
    commit('deleteLibraryRequest', { library })
    adminService.deleteLibrary(library)
      .then(
        (ok) => { commit('deleteLibrarySuccess', { ok, library }) },
        (error) => { commit('deleteLibraryFailure', { error }) }
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

  setEditorRequest (state, { email, editor }) {
    state.updatingEditorFlag = true
  },
  setEditorSuccess (state, { user }) {
    state.updatingEditorFlag = false
    state.updateEditorFlagSuccess = user || true
    state.updateEditorFlagError = null
    const newList = state.userList.map(u => u.email === user.email ? user : u)
    state.userList.splice(0, state.userList.length)
    state.userList.push(...newList)
  },
  setEditorFailure (state, { error }) {
    state.updatingEditorFlag = false
    state.updateEditorFlagError = error
  },

  findVolumesRequest (state, { query }) {
    state.findingVolumes = true
  },
  findVolumesSuccess (state, { results }) {
    state.volumeList = results.list
    state.totalVolumeCount = results.total
    state.findingVolumes = false
    state.findVolumesError = null
  },
  findVolumesFailure (state, { error }) {
    state.findingVolumes = false
    state.findVolumesError = error
  },

  addVolumeRequest (state, { volume }) {
    state.addingVolume = true
  },
  addVolumeSuccess (state, { ok, volume }) {
    state.addingVolume = false
    state.addVolumeSuccess = ok || true
    state.addVolumeError = null
    state.volumeList.push(volume)
  },
  addVolumeFailure (state, { error }) {
    state.addingVolume = false
    state.addVolumeError = error
  },

  scanVolumeRequest (state, { scanConfig }) {
    const volume = scanConfig.volume
    const update = {}
    update[volume] = true
    state.scanningVolumes = Object.assign({}, state.scanningVolumes, update)
  },
  scanVolumeSuccess (state, { ok, scanConfig }) {
    const volume = scanConfig.volume
    const update = {}
    update[volume] = false
    state.scanningVolumes = Object.assign({}, state.scanningVolumes, update)
    update[volume] = ok || true
    state.scanVolumeSuccess = Object.assign({}, state.scanVolumeSuccess, update)
    update[volume] = null
    state.scanVolumeError = Object.assign({}, state.scanVolumeError, update)
  },
  scanVolumeFailure (state, { scanConfig, error }) {
    const volume = scanConfig.volume
    const update = {}
    update[volume] = false
    state.scanningVolumes = Object.assign({}, state.scanningVolumes, update)
    update[volume] = false
    state.scanVolumeSuccess = Object.assign({}, state.scanVolumeSuccess, update)
    update[volume] = error
    state.scanVolumeError = Object.assign({}, state.scanVolumeError, update)
  },

  scanPathRequest (state, { scanConfig }) {
    const volumeAndPath = scanConfig.volumeAndPath
    const update = {}
    update[volumeAndPath] = true
    state.scanningPaths = Object.assign({}, state.scanningPaths, update)
  },
  scanPathSuccess (state, { ok, scanConfig }) {
    const volumeAndPath = scanConfig.volumeAndPath
    const update = {}
    update[volumeAndPath] = false
    state.scanningPaths = Object.assign({}, state.scanningPaths, update)
    update[volumeAndPath] = ok || true
    state.scanPathSuccess = Object.assign({}, state.scanPathSuccess, update)
    update[volumeAndPath] = null
    state.scanPathError = Object.assign({}, state.scanPathError, update)
  },
  scanPathFailure (state, { scanConfig, error }) {
    const volumeAndPath = scanConfig.volumeAndPath
    const update = {}
    update[volumeAndPath] = false
    state.scanningPaths = Object.assign({}, state.scanningPaths, update)
    update[volumeAndPath] = false
    state.scanPathSuccess = Object.assign({}, state.scanPathSuccess, update)
    update[volumeAndPath] = error
    state.scanPathError = Object.assign({}, state.scanPathError, update)
  },

  indexVolumeRequest (state, { volume }) {
    const update = {}
    update[volume] = true
    state.indexingVolumes = Object.assign({}, state.indexingVolumes, update)
  },
  indexVolumeSuccess (state, { ok, volume }) {
    const update = {}
    update[volume] = false
    state.indexingVolumes = Object.assign({}, state.indexingVolumes, update)
    update[volume] = ok || true
    state.indexingStartSuccess = Object.assign({}, state.indexingStartSuccess, update)
    update[volume] = null
    state.indexingStartError = Object.assign({}, state.indexingStartError, update)
  },
  indexVolumeFailure (state, { volume, error }) {
    const update = {}
    update[volume] = false
    state.indexingVolumes = Object.assign({}, state.indexingVolumes, update)
    update[volume] = null
    state.indexingStartSuccess = Object.assign({}, state.indexingStartSuccess, update)
    update[volume] = error
    state.scanVolumeError = Object.assign({}, state.scanVolumeError, update)
  },

  indexPathRequest (state, { volumeAndPath }) {
    const update = {}
    update[volumeAndPath] = true
    state.indexingPaths = Object.assign({}, state.indexingPaths, update)
  },
  indexPathSuccess (state, { ok, volumeAndPath }) {
    const update = {}
    update[volumeAndPath] = false
    state.indexingPaths = Object.assign({}, state.indexingPaths, update)
    update[volumeAndPath] = ok || true
    state.indexPathSuccess = Object.assign({}, state.indexPathSuccess, update)
    update[volumeAndPath] = null
    state.indexPathError = Object.assign({}, state.indexPathError, update)
  },
  indexPathFailure (state, { volumeAndPath, error }) {
    const update = {}
    update[volumeAndPath] = false
    state.indexingPaths = Object.assign({}, state.indexingPaths, update)
    update[volumeAndPath] = null
    state.indexPathSuccess = Object.assign({}, state.indexPathSuccess, update)
    update[volumeAndPath] = error
    state.indexPathError = Object.assign({}, state.indexPathError, update)
  },

  deletePathRequest (state, { volumeAndPath }) {
    const update = {}
    update[volumeAndPath] = true
    state.deletingPaths = Object.assign({}, state.deletingPaths, update)
  },
  deletePathSuccess (state, { ok, volumeAndPath }) {
    const update = {}
    update[volumeAndPath] = false
    state.deletingPaths = Object.assign({}, state.deletingPaths, update)
    update[volumeAndPath] = ok || true
    state.deletePathSuccess = Object.assign({}, state.deletePathSuccess, update)
    update[volumeAndPath] = null
    state.deletePathError = Object.assign({}, state.deletePathError, update)
  },
  deletePathFailure (state, { volumeAndPath, error }) {
    const update = {}
    update[volumeAndPath] = false
    state.deletingPaths = Object.assign({}, state.deletingPaths, update)
    update[volumeAndPath] = null
    state.deletePathSuccess = Object.assign({}, state.deletePathSuccess, update)
    update[volumeAndPath] = error
    state.deletePathError = Object.assign({}, state.deletePathError, update)
  },

  indexInfoRequest (state, { volume }) {},
  indexInfoSuccess (state, { info, volume }) {
    const update = {}
    update[volume] = info
    state.indexingInfo = Object.assign({}, state.indexingInfo, update)
    update[volume] = true
    state.indexingInfoSuccess = Object.assign({}, state.indexingInfoSuccess, update)
    update[volume] = null
    state.indexingInfoError = Object.assign({}, state.indexingInfoError, update)
  },
  indexInfoFailure (state, { volume, error }) {
    const update = {}
    update[volume] = null
    state.indexingInfo = Object.assign({}, state.indexingInfo, update)
    update[volume] = null
    state.indexingInfoSuccess = Object.assign({}, state.indexingInfoSuccess, update)
    update[volume] = error
    state.indexingInfoError = Object.assign({}, state.indexingInfoError, update)
  },

  deleteVolumeRequest (state, { volume }) {
    state.deletingVolume = true
  },
  deleteVolumeSuccess (state, { ok, volume }) {
    state.deletingVolume = false
    state.deleteVolumeSuccess = ok || true
    state.deleteVolumeError = null
    const newList = state.volumeList.filter(s => s.name !== volume)
    state.volumeList.splice(0, state.volumeList.length)
    state.volumeList.push(...newList)
  },
  deleteVolumeFailure (state, { error }) {
    state.deletingVolume = false
    state.deleteVolumeError = error
  },

  findLibrariesRequest (state, { query }) {
    state.findingLibraries = true
  },
  findLibrariesSuccess (state, { results }) {
    state.libraryList = results.list
    state.totalLibraryCount = results.total
    state.findingLibraries = false
    state.findLibrariesError = null
  },
  findLibrariesFailure (state, { error }) {
    state.findingLibraries = false
    state.findLibrariesError = error
  },

  addLibraryRequest (state, { library }) {
    state.addingLibrary = true
  },
  addLibrarySuccess (state, { ok, library }) {
    state.addingLibrary = false
    state.addLibrarySuccess = ok || true
    state.addLibraryError = null
    state.libraryList.push(library)
  },
  addLibraryFailure (state, { error }) {
    state.addingLibrary = false
    state.addLibraryError = error
  },

  deleteLibraryRequest (state, { library }) {
    state.deletingLibrary = true
  },
  deleteLibrarySuccess (state, { ok, library }) {
    state.deletingLibrary = false
    state.deleteLibrarySuccess = ok || true
    state.deleteLibraryError = null
    const newList = state.libraryList.filter(s => s.name !== library)
    state.libraryList.splice(0, state.libraryList.length)
    state.libraryList.push(...newList)
  },
  deleteLibraryFailure (state, { error }) {
    state.deletingLibrary = false
    state.deleteLibraryError = error
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
