import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Crear la instancia de la aplicación
const app = createApp(App)

// Usar Vuex y Vue Router
app.use(store)
app.use(router)

// Inicializar estado de autenticación antes de montar la aplicación
store.dispatch('auth/initAuth')
  .then(isAuthenticated => {
    console.log('Estado de autenticación inicializado:', isAuthenticated ? 'Autenticado' : 'No autenticado')
    
    // Intentar redirigir al dashboard si ya está autenticado
    if (isAuthenticated && window.location.pathname === '/login') {
      router.replace('/dashboard')
    }
  })
  .catch(error => {
    console.error('Error al inicializar autenticación:', error)
  })
  .finally(() => {
    // Montar la aplicación después de intentar inicializar
    app.mount('#app')
  })