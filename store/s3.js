import { s3Service } from '~/services/s3service'

export const state = () => ({
  objectList: [],
  loading: false,
  loadError: null
})

export const getters = {
  getObjectList (state) {
    return state.objectList
  }
}

export const mutations = {
  fetchObjectsRequest (state) {
    state.loading = true
  },
  fetchObjectsSuccess (state, objects) {
    state.objectList.splice(0, state.objectList.length)
    state.objectList.push(...objects)
    state.loading = false
  },
  fetchObjectsFailure (state, error) {
    state.loading = false
    state.loadError = error
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
  }
}
