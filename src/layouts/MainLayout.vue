<template>
  <div class="app-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">

    <div class="hover-area" @mouseenter="expandSidebar"></div>
    
    <!-- Sidebar Component -->
    <AppSidebar 
      :isSidebarCollapsed="isSidebarCollapsed"
      :isMobile="isMobile"
      :currentUser="currentUser"
      :userRoles="userRoles"
      :filteredMenuItems="filteredMenuItems"
      :userInitials="userInitials"
      @expand-sidebar="expandSidebar"
      @collapse-sidebar="collapseSidebar"
      @close-mobile-sidebar="closeMobileSidebar"
      @handle-navigation="handleNavigation"
      @logout="logout"
    />
    
    <!-- Overlay para cerrar el sidebar en móviles -->
    <div 
      v-if="isMobile && !isSidebarCollapsed" 
      class="sidebar-overlay"
      @click="closeMobileSidebar"
    ></div>
    
    <!-- Main content -->
    <div class="main-content">
      <!-- Header Component -->
      <AppHeader 
        :isMobile="isMobile"
        :currentRouteName="currentRouteName"
        @expand-sidebar="expandSidebar"
      />
      
      <main class="content-wrapper">
        <slot></slot>
      </main>

      
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppHeader from '../components/layout/AppHeader.vue'

export default {
  name: 'MainLayout',
  components: {
    AppSidebar,
    AppHeader
  },
  
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    // Estado del sidebar - siempre inicia colapsado por defecto
    const isSidebarCollapsed = ref(true)
    
    // Variable para controlar el comportamiento del sidebar
    const autoCollapseEnabled = ref(true)
    
    // Detectar si estamos en un dispositivo móvil
    const isMobile = ref(false)
    
    // Temporizador para el colapso automático
    let collapseTimer = null
    
    // Función para detectar si estamos en un dispositivo móvil
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
      
      // Si cambiamos a móvil, desactivar el auto-colapso
      if (isMobile.value) {
        autoCollapseEnabled.value = false
      } else {
        autoCollapseEnabled.value = true
      }
    }
    
    // Función específica para cerrar sidebar en móviles
    const closeMobileSidebar = () => {
      if (isMobile.value) {
        isSidebarCollapsed.value = true;
      }
    }
    
    // Escuchar cambios en el tamaño de la ventana
    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
      
      // Recuperar el estado del sidebar del almacenamiento local (si existe)
      const savedState = localStorage.getItem('sidebarState')
      if (savedState) {
        isSidebarCollapsed.value = savedState === 'collapsed'
      }
      
      // Manejar cambios de enfoque de ventana para asegurar consistencia
      window.addEventListener('focus', () => {
        if (autoCollapseEnabled.value && !isMobile.value) {
          // Colapsar después de un tiempo cuando la ventana recupera el foco
          clearTimeout(collapseTimer)
          collapseTimer = setTimeout(() => {
            isSidebarCollapsed.value = true
          }, 2000)
        }
      })
      
      // Asegurar que el sidebar se colapsa automáticamente después de cargar
      if (autoCollapseEnabled.value && !isMobile.value) {
        clearTimeout(collapseTimer)
        collapseTimer = setTimeout(() => {
          isSidebarCollapsed.value = true
        }, 2000)
      }
      
      // Añadir listener para clicks en el documento (cerrar al hacer clic fuera)
      document.addEventListener('click', (e) => {
        if (isMobile.value && !isSidebarCollapsed.value) {
          // Verificar si el clic fue fuera de la barra lateral
          const sidebar = document.querySelector('.sidebar');
          const menuButton = document.querySelector('.menu-button');
          
          if (sidebar && !sidebar.contains(e.target) && 
              menuButton && !menuButton.contains(e.target)) {
            isSidebarCollapsed.value = true;
          }
        }
      });
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('focus', () => {})
      clearTimeout(collapseTimer)
    })
    
    // Observar cambios en la ruta
    watch(
      () => route.path,
      () => {
        // En dispositivos móviles, cerrar el sidebar inmediatamente tras la navegación
        if (isMobile.value) {
          isSidebarCollapsed.value = true;
        } 
        // En dispositivos no móviles, permitir que el sidebar permanezca abierto
        // brevemente después de la navegación antes de colapsarse automáticamente
        else if (autoCollapseEnabled.value) {
          clearTimeout(collapseTimer)
          collapseTimer = setTimeout(() => {
            isSidebarCollapsed.value = true
          }, 2000) // Colapsar después de 2 segundos de navegar
        }
      }
    )
    
    // Guardar el estado del sidebar cuando cambia
    watch(
      () => isSidebarCollapsed.value,
      (newValue) => {
        localStorage.setItem('sidebarState', newValue ? 'collapsed' : 'expanded')
      }
    )
    
    // Funciones para el manejo del sidebar
    const expandSidebar = () => {
      clearTimeout(collapseTimer)
      isSidebarCollapsed.value = false
    }
    
    const collapseSidebar = () => {
      if (autoCollapseEnabled.value && !isMobile.value) {
        clearTimeout(collapseTimer)
        collapseTimer = setTimeout(() => {
          isSidebarCollapsed.value = true
        }, 300) // Pequeño retraso para evitar colapsos accidentales
      }
    }
    
    const toggleSidebar = () => {
      clearTimeout(collapseTimer)
      isSidebarCollapsed.value = !isSidebarCollapsed.value
      
      // Si acabamos de expandir, configurar temporizador para colapsar automáticamente después de un tiempo
      if (!isSidebarCollapsed.value && autoCollapseEnabled.value && !isMobile.value) {
        collapseTimer = setTimeout(() => {
          isSidebarCollapsed.value = true
        }, 4000) // Mayor tiempo si el usuario lo expandió manualmente
      }
    }
    
    // Función para manejar la navegación
    const handleNavigation = () => {
      // No colapsamos inmediatamente para permitir que el usuario vea
      // dónde ha navegado, pero configuramos un temporizador
      if (autoCollapseEnabled.value && !isMobile.value) {
        clearTimeout(collapseTimer)
        collapseTimer = setTimeout(() => {
          isSidebarCollapsed.value = true
        }, 2000) // Colapsar 2 segundos después de hacer clic
      }
    }
    
    // Obtener usuario actual y roles
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const userRoles = computed(() => store.getters['auth/userRoles'] || [])
    
    // Calcular iniciales del usuario
    const userInitials = computed(() => {
      if (!currentUser.value) return '?'
      
      const email = currentUser.value.email || ''
      return email.charAt(0).toUpperCase()
    })
    
    // Obtener nombre de la ruta actual
    const currentRouteName = computed(() => {
      return route.meta.title || route.name || 'Dashboard'
    })
    
    // Lista de elementos del menú
    const menuItems = [
      { 
        name: 'Dashboard', 
        path: '/dashboard', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
        roles: [] // Disponible para todos los roles
      },
      { 
        name: 'Llamadas', 
        path: '/llamadas', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
        roles: [] // Disponible para todos los roles
      },
      { 
        name: 'Monitoreo', 
        path: '/monitoreo', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
        roles: [] // Disponible para todos los roles
      },
      { 
        name: 'Agentes', 
        path: '/agentes', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        roles: [] // Disponible para todos los roles
      },
      { 
        name: 'Configuración', 
        path: '/configuracion', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
        roles: [] // Disponible para todos los roles
      },
    ]
    
    // Filtrar menú según los roles del usuario
    const filteredMenuItems = computed(() => {
      return menuItems.filter(item => {
        // Si no tiene roles específicos, es accesible para todos
        if (!item.roles || item.roles.length === 0) {
          return true
        }
        
        // Si el usuario no tiene roles, solo muestra items sin restricción
        if (!userRoles.value || userRoles.value.length === 0) {
          return item.roles.length === 0
        }
        
        // Verifica si el usuario tiene alguno de los roles requeridos
        return item.roles.some(role => userRoles.value.includes(role))
      })
    })
    
    // Cerrar sesión
    const logout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/login')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
    }
    
    return {
      isSidebarCollapsed,
      isMobile,
      currentUser,
      userRoles,
      userInitials,
      currentRouteName,
      filteredMenuItems,
      expandSidebar,
      collapseSidebar,
      toggleSidebar,
      handleNavigation,
      logout,
      closeMobileSidebar
    }
  }
}
</script>

<style scoped>
.app-wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f7fb;
  position: relative;
}

/* Área para detectar hover con mejor posicionamiento */
.hover-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  z-index: 15;
  cursor: default;
}

/* Overlay para cierre en móvil */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

/* Main content styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  position: relative;
  transition: margin-left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.content-wrapper {
  flex: 1;
  padding: 20px 24px;
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Estilos específicos para dispositivos móviles */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }
  
  /* Ocultar área de hover en móviles */
  .hover-area {
    display: none;
  }
}

/* Estilos para el estado colapsado del sidebar */
.sidebar-collapsed .sidebar {
  width: 70px;
  overflow: hidden;
}

.sidebar-collapsed .sidebar-header {
  padding: 18px 0;
}

.sidebar-collapsed .sidebar-nav li {
  padding: 0;
  text-align: center;
}

.sidebar-collapsed .sidebar-nav a {
  justify-content: center;
  padding: 12px 0;
  border-left: none;
}

.sidebar-collapsed .menu-icon {
  margin-right: 0;
  width: 20px;
  height: 20px;
}

.sidebar-collapsed .sidebar-footer {
  padding: 16px 0;
}

.sidebar-collapsed .logout-button {
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background-color: #f5f5f5;
}

.sidebar-collapsed .logout-icon {
  margin-right: 0;
}

/* Estilos para móviles */
@media (max-width: 768px) {
  .sidebar-collapsed .sidebar {
    transform: translateX(-100%);
  }
  
  .app-wrapper:not(.sidebar-collapsed) .sidebar {
    transform: translateX(0);
  }
  
  .sidebar-collapsed .main-content {
    margin-left: 0;
  }
}

</style>