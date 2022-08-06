import { s3Service } from '~/services/s3service'

export const state = () => ({
  objectList: [],
  loadingObjects: false,
  loadingObjectsError: null,

  metadata: {},
  loadingMetadata: false,
  loadingMetadataError: null,

  assetData: {},
  loadingAsset: false,
  loadingAssetError: null
})

export const actions = {
  fetchObjects ({ commit }, { prefix }) {
    commit('fetchObjectsRequest')
    s3Service
      .listS3(prefix)
      .then(
        objects => commit('fetchObjectsSuccess', objects),
        error => commit('fetchObjectsFailure', error)
      )
  },

  fetchMetadata ({ commit }, { path }) {
    commit('fetchMetaRequest')
    console.log(`fetchMetadata: starting for path: ${path}`)
    s3Service
      .metadata(path)
      .then(
        (meta) => {
          console.log(`fetchMetadata: SUCCESS path=${path}, meta=${meta} ... committing....`)
          meta.path = path
          commit('fetchMetaSuccess', { path, meta })
        },
        error => commit('fetchMetaFailure', error)
      )
  },

  fetchAsset ({ commit }, { path }) {
    commit('fetchAssetRequest')
    console.log(`fetchAsset: starting for path: ${path}`)
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
  }
}

export const mutations = {
  fetchObjectsRequest (state) {
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
    console.log('fetchMetaRequest...')
    state.loadingMetadata = true
  },
  fetchMetaSuccess (state, { path, meta }) {
    console.log(`fetchMetaSuccess: path=${path}, meta=${JSON.stringify(meta)}, and state=${state}`)
    // state.metadata[path] = meta
    state.metadata = Object.assign({}, state.metadata, { path: meta })
    state.loadingMetadataError = null
    state.loadingMetadata = false
    const found = state.objectList.find(o => o.name === path)
    if (found) {
      found.meta = meta
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
  }
}
