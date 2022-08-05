import { userService } from '~/services/userService'

const USER_LOCAL_STORAGE_KEY = 'user'

const user = JSON.parse(localStorage.getItem(USER_LOCAL_STORAGE_KEY))

export const state = () => ({
  user,
  status: { loggedIn: !!user }
})

export const actions = {
  login ({ dispatch, commit }, { username, password }) {
    commit('loginRequest', { username })
    userService.login(username, password)
      .then(
        (user) => {
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
          setTimeout(() => {
            // display success message after route change completes
            // dispatch('alert/success', 'Registration successful', { root: true })
          })
        },
        (error) => {
          commit('registerFailure', error)
          // dispatch('alert/error', error, { root: true })
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
    state.status = { loggedIn: true }
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
    state.status = {}
  },
  registerFailure (state, error) {
    state.status = {}
  }
}
