export default {
  namespaced: true,
  state: {
    loginError: null,
    registerError: null,
    loading: false,
    currentUser: null,
    isAuthenticated: false,
    fakeUsers: [
      { id: 1, email: 'admin@admin.com', password: 'admin123', name: 'Administrador', role: 'admin' },
      { id: 2, email: 'usuario@usuario.com', password: 'usuario123', name: 'Usuario Normal', role: 'user' }
    ]
  },
  mutations: {
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
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user
      state.isAuthenticated = !!user
    }
  },
  actions: {

    async login({ commit, state, dispatch }, credentials) {
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
        
        // Actualizar usuario actual en el estado
        commit('SET_CURRENT_USER', safeUser)
        
        // Llamar a la acción global
        dispatch('login', { token: fakeToken, user: safeUser }, { root: true })
        commit('SET_LOADING', false)
        return true
      } else {
        // Falló el login
        commit('SET_LOGIN_ERROR', 'Credenciales inválidas')
        commit('SET_LOADING', false)
        return false
      }
    },
    
    // Simular registro de usuario
    async register({ commit, dispatch }, userData) {
      commit('SET_LOADING', true)
      commit('SET_REGISTER_ERROR', null)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000))
      
      // Verificar si el correo ya existe
      const userExists = this.state.auth.fakeUsers.some(u => u.email === userData.email)
      
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
      
      // Actualizar usuario actual
      commit('SET_CURRENT_USER', safeUser)
      
      const fakeToken = `fake-jwt-token-${Math.random().toString(36).substring(2)}`
      dispatch('login', { token: fakeToken, user: safeUser }, { root: true })
      
      commit('SET_LOADING', false)
      return true
    },
    
    // Simular cierre de sesión
    async logout({ commit, dispatch }) {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Limpiar usuario actual
      commit('SET_CURRENT_USER', null)
      
      // Llamar a la acción global de cierre de sesión
      dispatch('logout', null, { root: true })
      return true
    },

    async initAuth({ commit, dispatch, rootState }) {
      const token = rootState.token
      
      if (token) {
        try {
          const isValid = await dispatch('verifyToken')
          
          if (isValid) {
            // Si el token es válido pero no tenemos usuario, intentar recuperar el perfil
            if (!rootState.user) {
              // En una aplicación real, harías una petición al backend
              // Para este ejemplo, simulamos un usuario basado en el token
              const userRole = token.includes('admin') ? 'admin' : 'user'
              const mockUser = {
                id: 1,
                email: userRole === 'admin' ? 'admin@admin.com' : 'usuario@usuario.com',
                name: userRole === 'admin' ? 'Administrador' : 'Usuario Normal',
                role: userRole
              }
              
              // Actualizar el usuario en el estado local y global
              commit('SET_CURRENT_USER', mockUser)
              dispatch('login', { token, user: mockUser }, { root: true })
            } else {
              // Si ya tenemos el usuario en el estado global, actualizamos el estado local
              commit('SET_CURRENT_USER', rootState.user)
            }
            
            return true
          }
        } catch (error) {
          console.error('Error al inicializar autenticación:', error)
          await dispatch('logout')
          return false
        }
      }
      
      return false
    },
    
    // Simular verificación de token (para restaurar sesión)
    async verifyToken({ rootState }) {
      const token = rootState.token

      if (!token) return false
      // Aquí solo verificamos que exista para simplificar
      if (token.startsWith('fake-jwt-token-')) {
        // Token válido, mantener sesión
        return true
      } else {
        // Token inválido
        return false
      }
    }
  },
  getters: {
    isLoading: state => state.loading,
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    currentUser: state => state.currentUser,
    isAuthenticated: state => state.isAuthenticated,
    userRoles: state => state.currentUser ? [state.currentUser.role] : []
  }
}