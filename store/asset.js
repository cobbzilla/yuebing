import { assetService } from '~/services/assetService'

export const state = () => ({
  queue: [],
  loadingQueue: false,
  loadingQueueError: null
})

export const actions = {
  fetchQueue ({ commit }) {
    commit('fetchQueueRequest')
    assetService
      .getQueue()
      .then(
        queue => commit('fetchQueueSuccess', queue),
        error => commit('fetchQueueFailure', error)
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
  }
}
