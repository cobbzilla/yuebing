import { s3Service } from '~/services/s3service'

export const state = () => ({
  objectList: [],
  loadingObjects: false,
  loadingObjectsError: null,

  metadata: {},
  loadingMetadata: false,
  loadingMetadataError: null
})

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
  }
}

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
  }
}
