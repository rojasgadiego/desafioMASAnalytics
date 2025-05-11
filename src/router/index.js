import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Login from '@/views/LoginView.vue'
import Dashboard from '@/views/DashboardView.vue'
import Llamadas from '@/views/LlamadasView.vue'
import Monitoreo from '@/views/MonitoreoView.vue'
import Agentes from '@/views/AgentesView.vue'
import ProfileConfigView from '@/views/ConfiguracionView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { 
      requiresGuest: true,
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: 'Dashboard'
    }
  },
  {
    path: '/llamadas',
    name: 'Llamadas',
    component: Llamadas,
    meta: {
      requiresAuth: true,
      title: 'Llamadas'
    }
  },
  {
    path: '/monitoreo',
    name: 'Monitoreo',
    component: Monitoreo,
    meta: {
      requiresAuth: true,
      title: 'Monitoreo'
    }
  },
  {
    path: '/agentes',
    name: 'Agemtes',
    component: Agentes,
    meta: {
      requiresAuth: true,
      title: 'Agentes'
    }
  },
  {
    path: '/configuracion',
    name: 'Configuración',
    component: ProfileConfigView,
    meta: {
      requiresAuth: true,
      title: 'Configuración'
    }
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación global para protección de rutas
router.beforeEach(async (to, from, next) => {
  // Actualizar título de la página
  document.title = to.meta.title ? `${to.meta.title} | MAS Analytics` : 'MAS Analytics'
  
  // Verificar si la ruta requiere autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Comprobar si el usuario está autenticado
  let isAuthenticated = store.getters['isAuthenticated']
  
  // Si no está autenticado según el store global, verificamos el módulo auth
  if (!isAuthenticated) {
    isAuthenticated = store.getters['auth/isAuthenticated']
  }
  
  // Si aún no está autenticado pero hay un token, intentamos inicializar
  if (!isAuthenticated && localStorage.getItem('token')) {
    try {
      await store.dispatch('auth/initAuth')
      isAuthenticated = store.getters['auth/isAuthenticated']
    } catch (error) {
      console.error('Error al restaurar autenticación:', error)
    }
  }
  
  // Decidir la navegación basada en la autenticación y los requisitos de la ruta
  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (requiresGuest && isAuthenticated) {
    next({ path: '/dashboard' })
  } else {
    next()
  }
})

export default router