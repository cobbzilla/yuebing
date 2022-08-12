import { userService } from '~/services/userService'
import { USER_LOCAL_STORAGE_KEY } from '~/services/util'

const user = JSON.parse(localStorage.getItem(USER_LOCAL_STORAGE_KEY))

export const state = () => ({
  user,
  status: { loggedIn: !!user }
})

export const actions = {
  login ({ dispatch, commit }, { email, password }) {
    commit('loginRequest', { email })
    userService.login(email, password)
      .then(
        (user) => {
          console.log(`login success! user=${JSON.stringify(user)}`)
          commit('loginSuccess', user)
          this.app.store.$router.push('/')
        },
        (error) => {
          commit('loginFailure', error)
          // dispatch('alert/error', error, { root: true })
        }
      )
  },
  logout ({ commit }) {
    userService.logout()
    commit('logout')
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
  verify ({ commit }, { email, token }) {
    commit('verifyRequest', { email, token })
    userService.verify(email, token)
      .then(
        (user) => {
          console.log(`>>> verify success: ${JSON.stringify(user)}`)
          commit('verifySuccess', { user })
          this.app.store.$router.push('/')
        },
        (error) => {
          console.log(`>>> verify error: ${JSON.stringify(error)}`)
          commit('verifyFailure', { error })
        }
      )
  }
}

export const mutations = {
  loginRequest (state, user) {
    state.status = { loggingIn: true }
    state.user = user
  },
  loginSuccess (state, user) {
    state.status = { loggedIn: true, verified: !!user.verified }
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user))
    state.user = user
  },
  loginFailure (state) {
    state.status = {}
    state.user = null
  },
  logout (state) {
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY)
    state.status = {}
    state.user = null
  },
  registerRequest (state, user) {
    state.status = { registering: true }
  },
  registerSuccess (state, user) {
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user))
    state.user = user
    state.status = { loggedIn: true }
  },
  registerFailure (state, error) {
    state.status = {}
  },
  verifyRequest (state, { email, token }) {
    state.status = { verifying: true }
  },
  verifySuccess (state, { user }) {
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user))
    state.user = user
    state.status = { loggedIn: true, verified: true }
  },
  verifyFailure (state, { error }) {
    if (error && Array.isArray(error.verifyToken)) {
      state.status = { verifyError: error.verifyToken[0] }
    } else {
      state.status = { verifyError: error }
    }
  }
}
