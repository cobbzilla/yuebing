import { adminService } from '@/services/adminService'

export const state = () => ({
  queue: [],
  loadingQueue: false,
  loadingQueueError: null,

  migratingUsers: false,
  userMigrationResults: null,
  userMigrationError: null,

  findingUsers: false,
  userList: null,
  totalUserCount: null,
  findUsersError: null,

  deletingUser: false,
  deleteUserSuccess: null,
  deleteUserError: null
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
  },

  findUsers ({ commit }, { query }) {
    commit('findUsersRequest', { query })
    adminService.findUsers(query)
      .then(
        (results) => {
          commit('findUsersSuccess', { results })
        },
        (error) => {
          commit('findUsersFailure', { error })
        }
      )
  },

  deleteUser ({ commit }, { email }) {
    commit('deleteUserRequest', { email })
    adminService.deleteUser(email)
      .then(
        (ok) => {
          commit('deleteUserSuccess', { ok, email })
        },
        (error) => {
          commit('deleteUserFailure', { error })
        }
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
  }
}
