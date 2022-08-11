import { adminService } from '@/services/adminService'

export const state = () => ({
  queue: [],
  loadingQueue: false,
  loadingQueueError: null,

  migratingUsers: false,
  userMigrationResults: null,
  userMigrationError: null
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

  migrateUsers ({ commit }, { oldKey, oldIV }) {
    commit('migrateUsersRequest')
    adminService
      .migrateUsers(oldKey, oldIV)
      .then(
        results => commit('migrateUsersSuccess', { results }),
        error => commit('migrateUsersFailure', error)
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

  migrateUsersRequest (state) {
    state.migratingUsers = true
  },
  migrateUsersSuccess (state, { results }) {
    state.userMigrationResults = results
    state.userMigrationError = null
    state.migratingUsers = false
  },
  migrateUsersFailure (state, error) {
    state.migratingUsers = false
    state.userMigrationError = error
  }
}
