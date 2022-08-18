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
  deleteUserError: null,

  findingSources: false,
  sourceList: null,
  totalSourceCount: null,
  sourceListError: null,

  addingSource: false,
  addSourceSuccess: null,
  addSourceError: null,

  deletingSource: false,
  deleteSourceSuccess: null,
  deleteSourceError: null
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
  },

  findSources ({ commit }, { query }) {
    commit('findSourcesRequest', { query })
    adminService.findSources(query)
      .then(
        (results) => {
          commit('findSourcesSuccess', { results })
        },
        (error) => {
          commit('findSourcesFailure', { error })
        }
      )
  },

  addSource ({ commit }, { src }) {
    commit('addSourceRequest', { src })
    adminService.addSource(src)
      .then(
        (ok) => {
          commit('addSourceSuccess', { ok, src })
        },
        (error) => {
          commit('addSourceFailure', { error })
        }
      )
  },

  deleteSource ({ commit }, { src }) {
    commit('deleteSourceRequest', { src })
    adminService.deleteSource(src)
      .then(
        (ok) => {
          commit('deleteSourceSuccess', { ok, src })
        },
        (error) => {
          commit('deleteSourceFailure', { error })
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
  }
}
