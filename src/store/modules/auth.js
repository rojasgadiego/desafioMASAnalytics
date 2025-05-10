export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loginError: null,
    registerError: null,
    loading: false,
    fakeUsers: [
      { id: 1, email: 'admin@admin.com', password: 'admin123', name: 'Administrador', role: 'admin' },
      { id: 2, email: 'usuario@usuario.com', password: 'usuario123', name: 'Usuario Normal', role: 'user' }
    ]
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
    SET_LOGIN_ERROR(state, error) {
      state.loginError = error
    },
    SET_REGISTER_ERROR(state, error) {
      state.registerError = error
    },
    ADD_FAKE_USER(state, user) {
      const newId = state.fakeUsers.length + 1
      state.fakeUsers.push({
        id: newId,
        ...user,
        role: 'user'
      })
    }
  },
  actions: {
    async login({ commit, state }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_LOGIN_ERROR', null)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
      
      // Buscar usuario
      const user = state.fakeUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      )
      
      if (user) {
        // Éxito - crear token falso
        const fakeToken = `fake-jwt-token-${Math.random().toString(36).substring(2)}`
        
        // Remover la contraseña del objeto usuario
        const safeUser = { ...user }
        delete safeUser.password
        
        // Guardar usuario en localStorage para persistencia
        localStorage.setItem('user', JSON.stringify(safeUser))
        
        // Actualizar estado
        commit('SET_USER', safeUser)
        commit('SET_TOKEN', fakeToken)
        commit('SET_LOADING', false)
        
        return true
      } else {
        // Falló el login
        commit('SET_LOGIN_ERROR', 'Credenciales inválidas')
        commit('SET_LOADING', false)
        return false
      }
    },
    
    async register({ commit, state }, userData) {
      commit('SET_LOADING', true)
      commit('SET_REGISTER_ERROR', null)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000))
      
      // Verificar si el correo ya existe
      const userExists = state.fakeUsers.some(u => u.email === userData.email)
      
      if (userExists) {
        commit('SET_REGISTER_ERROR', 'Este correo ya está registrado')
        commit('SET_LOADING', false)
        return false
      }
      
      // Registrar nuevo usuario
      const newUser = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: 'user'
      }
      
      commit('ADD_FAKE_USER', newUser)
      
      // Auto-login después del registro
      const safeUser = { ...newUser }
      delete safeUser.password
      
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(safeUser))
      
      // Generar token y actualizar estado
      const fakeToken = `fake-jwt-token-${Math.random().toString(36).substring(2)}`
      commit('SET_USER', safeUser)
      commit('SET_TOKEN', fakeToken)
      commit('SET_LOADING', false)
      
      return true
    },
    
    logout({ commit }) {
      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Actualizar estado
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
      
      return true
    },
    
    async initAuth({ commit, dispatch }) {
      const token = localStorage.getItem('token')
      const userJSON = localStorage.getItem('user')
      
      if (!token || !userJSON) {
        return false
      }
      
      try {
        // Verificar token
        const isTokenValid = token.startsWith('fake-jwt-token-')
        
        if (!isTokenValid) {
          await dispatch('logout')
          return false
        }
        
        // Restaurar usuario
        const user = JSON.parse(userJSON)
        commit('SET_USER', user)
        commit('SET_TOKEN', token)
        
        return true
      } catch (error) {
        console.error('Error al inicializar autenticación:', error)
        await dispatch('logout')
        return false
      }
    }
  },
  getters: {
    isLoading: state => state.loading,
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    currentUser: state => state.user,
    isAuthenticated: state => state.isAuthenticated,
    userRoles: state => state.user ? [state.user.role] : [],
    token: state => state.token
  }
}