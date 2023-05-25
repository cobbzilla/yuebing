import { currentUser } from '@/services/util'
import { volumeService } from '@/services/volumeService'
import { newMediaObject } from '@/shared/media'

export const state = () => ({
  prefix: '',
  objectList: [],
  loadingObjects: false,
  loadingObjectsError: null,

  metadata: {},
  loadingMetadata: {},
  loadingMetadataError: {},

  assetData: {},
  loadingAsset: false,
  loadingAssetError: null,

  userMediaInfo: {},
  fetchingUserMediaInfo: {},
  fetchingUserMediaInfoError: {},
  updatingUserMediaInfo: {},
  updatingUserMediaInfoError: {},

  selectedThumbnails: {},
  fetchingSelectedThumbnail: false,
  fetchingSelectedThumbnailError: null,
  updatingSelectedThumbnail: false,
  updatingSelectedThumbnailError: null
})

export const actions = {
  fetchObjects ({ commit }, { prefix, noCache = null }) {
    commit('fetchObjectsRequest', { prefix })
    volumeService
      .listObjects(prefix, noCache)
      .then(
        objects => commit('fetchObjectsSuccess', objects),
        error => commit('fetchObjectsFailure', error)
      )
  },

  fetchMetadata ({ commit }, { path }) {
    commit('fetchMetaRequest', { path })
    volumeService
      .metadata(path)
      .then(
        (meta) => {
          meta.path = path
          commit('fetchMetaSuccess', { path, meta })
        },
        error => commit('fetchMetaFailure', { path, error })
      )
  },

  fetchAsset ({ commit }, { path }) {
    commit('fetchAssetRequest')
    volumeService
      .jsonAsset(path)
      .then(
        (assetContents) => {
          if (assetContents) {
            commit('fetchAssetSuccess', {
              path,
              assetContents
            })
          } else {
            const message = `fetchAsset: ERROR assetContents=${assetContents}`
            console.warn(message)
            commit('fetchAssetFailure', new TypeError(message))
          }
        },
        error => commit('fetchAssetFailure', error)
      )
  },

  fetchUserMediaInfo ({ dispatch, commit }, { path }) {
    commit('fetchUserMediaInfoRequest', { path })
    volumeService
      .fetchUserMediaInfo(path)
      .then(
        (values) => { commit('fetchUserMediaInfoSuccess', { path, values }) },
        (error) => { commit('fetchUserMediaInfoFailure', { path, error }) }
      )
  },

  updateUserMediaInfo ({ dispatch, commit }, { path, values }) {
    commit('updateUserMediaInfoRequest', { path })
    if (!currentUser()) {
      console.log('updateUserMediaInfo: No user logged in and not a public instance, not calling API')
      commit('updateUserMediaInfoSuccess', { path, values })
    } else {
      volumeService
        .updateUserMediaInfo(path, values)
        .then(
          () => { commit('updateUserMediaInfoSuccess', { path, values }) },
          error => commit('updateUserMediaInfoFailure', { path, error })
        )
    }
  },

  updateSelectedThumbnail ({ dispatch, commit }, { path, thumbnailAsset }) {
    commit('updateSelectedThumbnailRequest')
    if (!currentUser()) {
      console.log('updateSelectedThumbnail: No user logged in and not a public instance, not calling API')
      commit('updateSelectedThumbnailSuccess', { path, thumbnailAsset })
    } else {
      volumeService
        .updateSelectedThumbnail(path, thumbnailAsset)
        .then(
          () => {
            commit('updateSelectedThumbnailSuccess', { path, thumbnailAsset })
          },
          error => commit('updateSelectedThumbnailFailure', error)
        )
    }
  }
}

export const mutations = {
  fetchObjectsRequest (state, { prefix }) {
    state.prefix = prefix
    state.loadingObjects = true
  },
  fetchObjectsSuccess (state, objects) {
    state.objectList.splice(0, state.objectList.length)
    state.objectList.push(...objects)
    state.loadingObjectsError = null
    state.loadingObjects = false
  },
  fetchObjectsFailure (state, error) {
    state.loadingObjects = false
    state.loadingObjectsError = error
  },

  fetchMetaRequest (state, { path }) {
    const update = {}
    update[path] = true
    state.loadingMetadata = Object.assign({}, state.loadingMetadata, update)
  },
  fetchMetaSuccess (state, { path, meta }) {
    const update = {}
    update[path] = false
    state.loadingMetadata = Object.assign({}, state.loadingMetadata, update)
    update[path] = meta
    state.metadata = Object.assign({}, state.metadata, update)
    update[path] = null
    state.loadingMetadataError = Object.assign({}, state.loadingMetadataError, update)
    const found = state.objectList.find(o => o.name === path || o.sourcePath === path)
    if (found) {
      found.meta = meta
    } else {
      state.objectList.push(newMediaObject(path, meta))
    }
  },
  fetchMetaFailure (state, { path, error }) {
    const update = {}
    update[path] = false
    state.loadingMetadata = Object.assign({}, state.loadingMetadata, update)
    update[path] = error
    state.loadingMetadataError = Object.assign({}, state.loadingMetadataError, update)
  },

  fetchAssetRequest (state) {
    state.loadingAsset = true
  },
  fetchAssetSuccess (state, { path, assetContents }) {
    const assetObj = {}
    assetObj[path] = assetContents
    state.assetData = Object.assign({}, state.assetData, assetObj)
    state.loadingAssetError = null
    state.loadingAsset = false
  },
  fetchAssetFailure (state, error) {
    state.loadingAsset = false
    state.loadingAssetError = error
  },

  fetchUserMediaInfoRequest (state, { path }) {
    const update = {}
    update[path] = true
    state.fetchingUserMediaInfo = Object.assign({}, state.fetchingUserMediaInfo, update)
  },
  fetchUserMediaInfoSuccess (state, { path, values }) {
    const update = {}
    update[path] = false
    state.fetchingUserMediaInfo = Object.assign({}, state.fetchingUserMediaInfo, update)
    update[path] = values
    state.userMediaInfo = Object.assign({}, state.userMediaInfo, update)
    const found = state.objectList.find(o => o.name === path || o.sourcePath === path)
    if (found) {
      found.userMediaInfo = values
    }
    update[path] = null
    state.fetchingUserMediaInfoError = Object.assign({}, state.fetchingUserMediaInfoError, update)
  },
  fetchUserMediaInfoFailure (state, { path, error }) {
    const update = {}
    update[path] = false
    state.fetchingUserMediaInfo = Object.assign({}, state.fetchingUserMediaInfo, update)
    update[path] = error
    state.fetchingUserMediaInfoError = Object.assign({}, state.fetchingUserMediaInfoError, update)
  },

  updateUserMediaInfoRequest (state, { path }) {
    const update = {}
    update[path] = true
    state.updatingUserMediaInfo = Object.assign({}, state.updatingUserMediaInfo, update)
  },
  updateUserMediaInfoSuccess (state, { path, values }) {
    const update = {}
    update[path] = false
    state.updatingUserMediaInfo = Object.assign({}, state.updatingUserMediaInfo, update)
    update[path] = values
    state.userMediaInfo = Object.assign({}, state.userMediaInfo, update)
    update[path] = null
    state.updatingUserMediaInfoError = Object.assign({}, state.updatingUserMediaInfoError, update)
  },
  updateUserMediaInfoFailure (state, { path, error }) {
    const update = {}
    update[path] = false
    state.updatingUserMediaInfo = Object.assign({}, state.updatingUserMediaInfo, update)
    update[path] = error
    state.updatingUserMediaInfoError = Object.assign({}, state.updatingUserMediaInfoError, update)
  },

  updateSelectedThumbnailRequest (state) {
    state.updatingSelectedThumbnail = true
  },
  updateSelectedThumbnailSuccess (state, { path, thumbnailAsset }) {
    const found = state.objectList.find(o => o.name === path)
    if (found && found.meta) {
      found.meta.selectedThumbnail = thumbnailAsset
    }
    const newInfo = {}
    newInfo[path] = thumbnailAsset
    state.selectedThumbnails = Object.assign({}, state.selectedThumbnails, newInfo)
    state.updatingSelectedThumbnailError = null
    state.updatingSelectedThumbnail = false
  },
  updateSelectedThumbnailFailure (state, error) {
    state.updatingSelectedThumbnailError = error
    state.updatingSelectedThumbnail = false
  }
}
