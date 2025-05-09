import { createStore } from 'vuex'
import auth from './modules/auth'

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  mutations: {
    SET_AUTH(state, { token, user }) {
      state.token = token
      state.user = user
      state.isAuthenticated = !!token

      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  },
  actions: {
    login({ commit }, { token, user }) {
      commit('SET_AUTH', { token, user })
    },
    logout({ commit }) {
      commit('SET_AUTH', { token: null, user: null })
    },
    // Nueva acción para inicializar el estado desde localStorage
    initFromLocalStorage({dispatch }) {
      const token = localStorage.getItem('token')
      if (token) {
        // Intenta recuperar el usuario si existe el token
        return dispatch('auth/initAuth')
      }
      return false
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user
  },
  modules: {
    auth
  }
})