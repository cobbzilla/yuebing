import { userService } from '~/services/userService'

const user = JSON.parse(localStorage.getItem('user'))

export const state = () => user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: null }

export const actions = {
  login ({ dispatch, commit }, { username, password }) {
    commit('loginRequest', { username })
    console.log(`login: this.app.$config=${JSON.stringify(this.app.$config)}`)
    userService.login(username, password)
      .then(
        (user) => {
          commit('loginSuccess', user)
          this.app.$config.router.push('/')
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
          this.app.$config.router.push('/login')
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
    state.user = user
  },
  loginFailure (state) {
    state.status = {}
    state.user = null
  },
  logout (state) {
    state.status = {}
    state.user = null
  },
  registerRequest (state, user) {
    state.status = { registering: true }
  },
  registerSuccess (state, user) {
    state.status = {}
  },
  registerFailure (state, error) {
    state.status = {}
  }
}
