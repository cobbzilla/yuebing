import { userService } from '~/services/userService'
import { USER_LOCAL_STORAGE_KEY } from '~/services/util'

const user = JSON.parse(localStorage.getItem(USER_LOCAL_STORAGE_KEY))

export const state = () => ({
  user,
  userStatus: { loggedIn: !!user },
  invitationResults: null
})

export const actions = {
  login ({ dispatch, commit }, { email, password }) {
    commit('loginRequest', { email })
    userService.login(email, password)
      .then(
        (user) => {
          console.log(`login success! user=${JSON.stringify(user)}`)
          commit('loginSuccess', user)
          this.app.store.$router.push(user.admin ? '/admin' : '/')
        },
        (error) => {
          commit('loginFailure', error)
          // dispatch('alert/error', error, { root: true })
        }
      )
  },

  logout ({ commit }, { redirect = true }) {
    userService.logout()
    commit('logout')
    if (redirect) {
      this.app.store.$router.push('/')
    }
  },

  register ({ dispatch, commit }, user) {
    commit('registerRequest', user)

    userService.register(user)
      .then(
        (user) => {
          commit('registerSuccess', user)
          this.app.store.$router.push('/')
          // setTimeout(() => {
          // display success message after route change completes
          // dispatch('alert/success', 'Registration successful', { root: true })
          // })
        },
        (error) => {
          commit('registerFailure', error)
          // dispatch('alert/error', error, { root: true })
        }
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
        (error) => {
          commit('verifyFailure', { error })
        }
      )
  },

  requestPasswordReset ({ commit }, { email }) {
    commit('requestPasswordResetRequest', { email })
    userService.requestPasswordReset(email)
      .then(
        (ok) => {
          commit('requestPasswordResetSuccess', { user })
        },
        (error) => {
          commit('requestPasswordResetFailure', { error })
        }
      )
  },

  inviteFriends ({ commit }, { emails }) {
    commit('inviteFriendsRequest', { emails })
    userService.inviteFriends(emails)
      .then(
        (results) => {
          commit('inviteFriendsSuccess', { results })
        },
        (error) => {
          commit('inviteFriendsFailure', { error })
        }
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
  },
  loginFailure (state) {
    state.userStatus = {}
    state.user = null
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
  },
  registerFailure (state, error) {
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
    state.userStatus = { passwordResetRequested: true }
  },
  requestPasswordResetFailure (state, { error }) {
    state.userStatus = { passwordResetRequestError: error }
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
