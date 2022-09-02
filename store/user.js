import { userService } from '@/services/userService'
import { saveAnonLocale, USER_LOCAL_STORAGE_KEY } from '@/services/util'

const user = () => JSON.parse(localStorage.getItem(USER_LOCAL_STORAGE_KEY))

export const state = () => ({
  user: user(),
  userStatus: { loggedIn: !!user },
  anonLocale: null,
  loginError: null,
  registerError: null,
  invitationResults: null,
  updateResults: null
})

export const actions = {
  login ({ dispatch, commit }, { usernameOrEmail, password }) {
    commit('loginRequest', { usernameOrEmail })
    userService.login(usernameOrEmail, password)
      .then(
        (user) => {
          // console.log(`login success! user=${JSON.stringify(user)}`)
          commit('loginSuccess', user)
          this.app.store.$router.push(user.admin ? '/admin' : '/')
        },
        (error) => { commit('loginFailure', { error }) }
      )
  },

  logout ({ commit }, { redirect = true }) {
    userService.logout()
      .then(() => {
        commit('logout')
        if (redirect) {
          // force hard redirect
          window.location.href = '/refresh'
        }
      },
      (error) => { console.log(`logout error: ${error}`) })
  },

  register ({ dispatch, commit }, user) {
    commit('registerRequest', user)
    userService.register(user)
      .then(
        (user) => {
          commit('registerSuccess', user)
          this.app.store.$router.push('/')
        },
        (error) => { commit('registerFailure', error) }
      )
  },

  verify ({ commit }, { email, token, resetPasswordHash, password }) {
    commit('verifyRequest', { email, token, resetPasswordHash, password })
    userService.verify(email, token, resetPasswordHash, password)
      .then(
        (user) => {
          commit('verifySuccess', { user })
          this.app.store.$router.push('/')
        },
        (error) => { commit('verifyFailure', { error }) }
      )
  },

  requestPasswordReset ({ commit }, { email }) {
    commit('requestPasswordResetRequest', { email })
    userService.requestPasswordReset(email)
      .then(
        () => { commit('requestPasswordResetSuccess', { user }) },
        (error) => { commit('requestPasswordResetFailure', { error }) }
      )
  },

  setLocale ({ commit }, { locale }) {
    commit('setLocaleRequest', { locale })
    const currentUser = user()
    if (currentUser && currentUser.session) {
      commit('setLocaleSuccess', { locale })
      userService.setLocale(currentUser, locale)
        .then(
          (updatedUser) => { commit('setLocaleFinalSuccess', { updatedUser }) },
          (error) => { commit('setLocaleFailure', { error }) }
        )
    } else {
      commit('setAnonLocaleSuccess', { locale })
    }
  },

  updateUser ({ commit }, { update }) {
    commit('updateUserRequest', { update })
    userService.updateUser(update)
      .then(
        (results) => { commit('updateUserSuccess', { results }) },
        (error) => { commit('updateUserFailure', { error }) }
      )
  },

  deleteUser ({ commit }) {
    commit('deleteUserRequest')
    userService.deleteUser()
      .then(
        () => {
          commit('deleteUserSuccess')
          commit('logout')
        },
        (error) => {
          commit('deleteUserFailure', { error })
        }
      )
  },

  inviteFriends ({ commit }, { emails }) {
    commit('inviteFriendsRequest', { emails })
    userService.inviteFriends(emails)
      .then(
        (results) => { commit('inviteFriendsSuccess', { results }) },
        (error) => { commit('inviteFriendsFailure', { error }) }
      )
  },

  clearInvitationResults ({ commit }) {
    commit('clearInvitationResultsSuccess')
  }
}

export const mutations = {
  loginRequest (state, user) {
    state.userStatus = { loggingIn: true }
    state.user = user
  },
  loginSuccess (state, user) {
    state.userStatus = { loggedIn: true, verified: !!user.verified }
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user))
    state.user = user
    state.loginError = null
  },
  loginFailure (state, { error }) {
    state.userStatus = {}
    state.user = null
    state.loginError = error
  },

  logout (state) {
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY)
    state.userStatus = {}
    state.user = null
  },

  registerRequest (state, user) {
    state.userStatus = { registering: true }
  },
  registerSuccess (state, user) {
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user))
    state.user = user
    state.userStatus = { loggedIn: true }
    state.registerError = null
  },
  registerFailure (state, error) {
    state.registerError = error
    state.userStatus = {}
  },

  verifyRequest (state, { email, token, resetPasswordHash, password }) {
    state.userStatus = { verifying: true }
  },
  verifySuccess (state, { user }) {
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user))
    state.user = user
    state.userStatus = { loggedIn: true, verified: true }
  },
  verifyFailure (state, { error }) {
    state.userStatus = { verifyError: error }
  },

  requestPasswordResetRequest (state, { email, token, resetPasswordHash, password }) {
    state.userStatus = { requestingPasswordReset: true }
  },
  requestPasswordResetSuccess (state) {
    state.userStatus = { passwordResetSuccess: true }
  },
  requestPasswordResetFailure (state, { error }) {
    state.userStatus = { passwordResetRequestError: error }
  },

  setLocaleRequest (state, { locale }) {
    state.userStatus = Object.assign({}, state.userStatus, { updating: true })
    state.localeResults = null
  },
  setLocaleSuccess (state, { locale }) {
    state.user = Object.assign(state.user, { locale })
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(state.user))
  },
  setLocaleFinalSuccess (state, { updatedUser }) {
    state.user = Object.assign(state.user, updatedUser)
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(state.user))
  },
  setAnonLocaleSuccess (state, { locale }) {
    state.anonLocale = locale
    saveAnonLocale(locale)
  },
  setLocaleFailure (state, { error }) {
    state.userStatus.updating = null
    state.userStatus = Object.assign({}, state.userStatus, { updating: null, localeError: error })
  },

  updateUserRequest (state, { update }) {
    state.userStatus = Object.assign({}, state.userStatus, { updating: true })
    state.updateResults = null
  },
  updateUserSuccess (state, { results }) {
    state.user = Object.assign(state.user, results)
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(state.user))
    state.userStatus.updating = null
    state.updateResults = results
  },
  updateUserFailure (state, { error }) {
    state.userStatus.updating = null
    state.userStatus = Object.assign({}, state.userStatus, { updating: null, updateError: error })
    state.updateResults = null
  },

  deleteUserRequest (state) {
    state.userStatus = Object.assign({}, state.userStatus, { deleting: true })
  },
  deleteUserSuccess (state) {
    state.userStatus.deleting = null
    state.userStatus.deleted = true
  },
  deleteUserFailure (state, { error }) {
    state.userStatus.deleting = null
    state.userStatus = Object.assign({}, state.userStatus, { deleting: null, deleteError: error })
  },

  inviteFriendsRequest (state, { emails }) {
    state.userStatus = Object.assign({}, state.userStatus, { inviting: true })
    state.invitationError = null
  },
  inviteFriendsSuccess (state, { results }) {
    state.userStatus.inviting = null
    state.invitationResults = results
  },
  inviteFriendsFailure (state, { error }) {
    state.userStatus.inviting = null
    state.userStatus = Object.assign({}, state.userStatus, { inviting: null, invitationError: error })
  },
  clearInvitationResultsSuccess (state) {
    state.invitationResults = null
    if (state.userStatus.invitationError) {
      delete state.userStatus.invitationError
    }
  }
}
