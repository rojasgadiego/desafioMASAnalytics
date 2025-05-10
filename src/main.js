import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(store)
app.use(router)

store.dispatch('auth/initAuth')
  .then(isAuthenticated => {
    console.log('Estado de autenticación inicializado:', isAuthenticated ? 'Autenticado' : 'No autenticado')
    
    if (isAuthenticated && window.location.pathname === '/login') {
      router.replace('/dashboard')
    }
  })
  .catch(error => {
    console.error('Error al inicializar autenticación:', error)
  })
  .finally(() => {
    app.mount('#app')
  })