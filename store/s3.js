import { s3Service } from '~/services/s3service'
import { newMediaObject } from '@/shared/media'

export const state = () => ({
  prefix: '',
  objectList: [],
  loadingObjects: false,
  loadingObjectsError: null,

  metadata: {},
  loadingMetadata: false,
  loadingMetadataError: null,

  assetData: {},
  loadingAsset: false,
  loadingAssetError: null,

  userMediaInfo: {},
  fetchingUserMediaInfo: false,
  fetchingUserMediaInfoError: null,
  updatingUserMediaInfo: false,
  updatingUserMediaInfoError: null,

  selectedThumbnails: {},
  fetchingSelectedThumbnail: false,
  fetchingSelectedThumbnailError: null,
  updatingSelectedThumbnail: false,
  updatingSelectedThumbnailError: null
})

export const actions = {
  fetchObjects ({ commit }, { prefix }) {
    commit('fetchObjectsRequest', { prefix })
    s3Service
      .listS3(prefix)
      .then(
        objects => commit('fetchObjectsSuccess', objects),
        error => commit('fetchObjectsFailure', error)
      )
  },

  fetchMetadata ({ commit }, { path }) {
    commit('fetchMetaRequest')
    s3Service
      .metadata(path)
      .then(
        (meta) => {
          meta.path = path
          commit('fetchMetaSuccess', { path, meta })
        },
        error => commit('fetchMetaFailure', error)
      )
  },

  fetchAsset ({ commit }, { path }) {
    commit('fetchAssetRequest')
    s3Service
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
    commit('fetchUserMediaInfoRequest')
    s3Service
      .fetchUserMediaInfo(path)
      .then(
        (values) => {
          commit('fetchUserMediaInfoSuccess', { path, values })
        },
        (error) => {
          commit('fetchUserMediaInfoFailure', error)
        }
      )
  },

  updateUserMediaInfo ({ dispatch, commit }, { path, values }) {
    commit('updateUserMediaInfoRequest')
    s3Service
      .updateUserMediaInfo(path, values)
      .then(
        () => {
          commit('updateUserMediaInfoSuccess', { path, values })
        },
        error => commit('updateUserMediaInfoFailure', error)
      )
  },

  updateSelectedThumbnail ({ dispatch, commit }, { path, thumbnailAsset }) {
    commit('updateSelectedThumbnailRequest')
    s3Service
      .updateSelectedThumbnail(path, thumbnailAsset)
      .then(
        () => {
          commit('updateSelectedThumbnailSuccess', { path, thumbnailAsset })
        },
        error => commit('updateSelectedThumbnailFailure', error)
      )
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

  fetchMetaRequest (state) {
    state.loadingMetadata = true
  },
  fetchMetaSuccess (state, { path, meta }) {
    state.metadata = Object.assign({}, state.metadata, { path: meta })
    state.loadingMetadataError = null
    state.loadingMetadata = false
    const found = state.objectList.find(o => o.name === path)
    if (found) {
      found.meta = meta
    } else {
      state.objectList.push(newMediaObject(path, meta))
    }
  },
  fetchMetaFailure (state, error) {
    state.loadingMetadata = false
    state.loadingMetadataError = error
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

  fetchUserMediaInfoRequest (state) {
    state.fetchingUserMediaInfo = true
  },
  fetchUserMediaInfoSuccess (state, { path, values }) {
    const newInfo = {}
    newInfo[path] = values
    state.userMediaInfo = Object.assign({}, state.userMediaInfo, newInfo)
    state.fetchingUserMediaInfoError = null
    state.fetchingUserMediaInfo = false
  },
  fetchUserMediaInfoFailure (state, error) {
    state.fetchingUserMediaInfoError = error
    state.fetchingUserMediaInfo = false
  },

  updateUserMediaInfoRequest (state) {
    state.updatingUserMediaInfo = true
  },
  updateUserMediaInfoSuccess (state, { path, values }) {
    const newInfo = {}
    newInfo[path] = values
    state.userMediaInfo = Object.assign({}, state.userMediaInfo, newInfo)
    state.updatingUserMediaInfoError = null
    state.updatingUserMediaInfo = false
  },
  updateUserMediaInfoFailure (state, error) {
    state.updatingUserMediaInfoError = error
    state.updatingUserMediaInfo = false
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
