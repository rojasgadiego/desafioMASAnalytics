<template>
    <div class="app-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- Área sensible al hover mejorada -->
      <div class="hover-area" @mouseenter="expandSidebar"></div>
      
      <!-- Sidebar -->
    <aside class="sidebar" @mouseenter="expandSidebar" @mouseleave="collapseSidebar">
      <div class="sidebar-header">
        <!-- Logo container modificado para mostrar M o imagen según el estado -->
        <div class="logo-container">
          <!-- Cuando el sidebar está colapsado, muestra la M -->
          <div v-if="isSidebarCollapsed" class="logo-icon">M</div>
          
          <!-- Cuando el sidebar está expandido, muestra el logo -->
          <div v-else class="logo-full">
            <img :src="require('@/assets/logo-mas-analytics-color.svg')" alt="Logo MasAnalytics" class="logo-img" />
          </div>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <!-- Menú para todos los usuarios -->
          <li v-for="item in filteredMenuItems" :key="item.path">
            <router-link 
              :to="item.path" 
              :class="{ active: isActive(item.path) }"
              :title="item.name"
              @click="isMobile ? closeMobileSidebar() : handleNavigation()"
            >
              <span class="menu-icon" v-html="item.icon"></span>
              <span v-if="!isSidebarCollapsed" class="menu-text">{{ item.name }}</span>
            </router-link>
            
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <div class="user-avatar-container" v-if="isSidebarCollapsed">
          <div class="user-avatar">{{ userInitials }}</div>
        </div>
        <div class="user-info" v-if="!isSidebarCollapsed">
          <div class="user-name">{{ currentUser ? currentUser.email : 'Usuario' }}</div>
          <div class="user-role">{{ userRoles.length > 0 ? userRoles[0] : 'Rol no asignado' }}</div>
        </div>
        <button class="logout-button" @click="logout" :title="isSidebarCollapsed ? 'Cerrar sesión' : ''">
          <span class="logout-icon">⏻</span>
          <span v-if="!isSidebarCollapsed" class="logout-text">Cerrar sesión</span>
        </button>
      </div>
    </aside>
      
      <!-- Overlay para cerrar el sidebar en móviles -->
      <div 
        v-if="isMobile && !isSidebarCollapsed" 
        class="sidebar-overlay"
        @click="closeMobileSidebar"
      ></div>
      
      <!-- Main content -->
      <div class="main-content">
        <header class="top-header">
          <!-- Botón de menú para móviles -->
          <button v-if="isMobile" class="menu-button" @click="expandSidebar" aria-label="Abrir menú">
            ☰
          </button>
          <div class="breadcrumb">
            {{ currentRouteName }}
          </div>
        </header>
        
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
  
  export default {
    name: 'MainLayout',
    
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
       // Contar notificaciones (ejemplo)
       const notificationCount = ref(3)
      
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
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
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
      
      // Filtrar submenús según los roles del usuario
      const filteredSubmenuItems = (item) => {
        if (!item.submenu) return []
        
        return item.submenu.filter(subitem => {
          if (!subitem.roles || subitem.roles.length === 0) {
            return true
          }
          
          if (!userRoles.value || userRoles.value.length === 0) {
            return subitem.roles.length === 0
          }
          
          return subitem.roles.some(role => userRoles.value.includes(role))
        })
      }
      
      // Verificar si una ruta está activa
      const isActive = (path) => {
        return route.path === path || route.path.startsWith(`${path}/`)
      }
      
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
        filteredSubmenuItems,
        notificationCount,
        expandSidebar,
        collapseSidebar,
        toggleSidebar,
        handleNavigation,
        isActive,
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

/* Sidebar styles con mejoras visuales */
.sidebar {
  background-color: #161840;
  width: 250px;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); /* Transición más suave */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 10;
  height: 100vh;
}

.sidebar-collapsed .sidebar {
  width: 70px;
  overflow: hidden;
}

.sidebar-header {
  padding: 18px 16px;
  display: flex;
  align-items: center;
  justify-content: center; /* Centrar el logo */
  transition: padding 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  height: 70px; /* Altura fija para evitar saltos */
}

.sidebar-collapsed .sidebar-header {
  padding: 18px 0;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center; /* Centrado */
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  width: 100%; /* Ancho completo para centrar mejor */
}

/* Estilo para la letra M cuando está colapsado */
.logo-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background-color: #161840;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
}

/* Estilo para el logo completo cuando está expandido */
.logo-full {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px; /* Altura fija para el contenedor del logo */
}

.logo-img {
  height: 40px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

.toggle-sidebar {
  width: 28px;
  height: 28px;
  background: #f5f7fb;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.3s ease;
}

.sidebar-collapsed .toggle-sidebar {
  display: none;
}

.toggle-sidebar:hover {
  background: #eef1f6;
  color: #333;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding-top: 12px;
  transition: padding 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  /* Estilizar la barra de desplazamiento */
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 20px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 3px;
  padding: 0 8px;
  transition: padding 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.sidebar-collapsed .sidebar-nav li {
  padding: 0;
  text-align: center;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 12px;
  text-decoration: none;
  color: #ffffff;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.sidebar-collapsed .sidebar-nav a {
  justify-content: center;
  padding: 12px 0;
  border-left: none;
}

.sidebar-nav a:hover {
  background-color: #05daf246;
  color: #ffffff;
}

.sidebar-nav a.active {
  background-color:#05daf246;
  color: #ffffff;
  font-weight: 500;
}

/* Estilos para submenú */
.submenu {
  margin-top: 2px;
  margin-bottom: 8px;
  margin-left: 20px;
  padding-left: 10px !important;
  border-left: 1px dashed #e0e0e0;
}

.submenu li {
  margin-bottom: 2px;
}

.submenu a {
  padding: 8px 12px;
  font-size: 0.9rem;
}

.submenu-icon {
  font-size: 10px;
  margin-right: 8px;
  color: #aaa;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  margin-right: 14px;
  flex-shrink: 0;
  color: inherit;
  transition: margin 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.sidebar-collapsed .menu-icon {
  margin-right: 0;
  width: 20px;
  height: 20px;
}

.menu-text {
  white-space: nowrap;
  font-size: 0.95rem;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.sidebar-footer {
  border-top: 1px solid #f0f0f0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: padding 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.sidebar-collapsed .sidebar-footer {
  padding: 16px 0;
}

.user-info {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #f0f0f0;
  width: 100%;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.user-avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #161840;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.2);
  transition: all 0.3s ease;
}

.user-name {
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;
}

.user-role {
  font-size: 0.8rem;
  color: #ffffff;
  text-transform: capitalize;
}

.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.sidebar-collapsed .logout-button {
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background-color: #f5f5f5;
}

.logout-button:hover {
  background-color: #ffe5e5;
  color: #e74c3c;
}

.logout-icon {
  margin-right: 10px;
  transition: margin 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.sidebar-collapsed .logout-icon {
  margin-right: 0;
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

/* Main content styles con mejoras */
.main-content {
 flex: 1;
 display: flex;
 flex-direction: column;
 overflow: hidden;
 height: 100vh;
 position: relative;
 transition: margin-left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.top-header {
 height: 64px;
 background-color: #ffffff;
 padding: 0 24px;
 display: flex;
 align-items: center;
 justify-content: space-between;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
 border-bottom: 3px solid #125773;
 flex-shrink: 0;
}

.menu-button {
 background: none;
 border: none;
 font-size: 20px;
 margin-right: 12px;
 padding: 8px;
 cursor: pointer;
 color: #333;
 display: none; /* Solo visible en móvil */
 border-radius: 8px;
 transition: background 0.3s ease;
}

.menu-button:hover {
 background-color: #f5f7fb;
}

.breadcrumb {
 font-size: 16px;
 font-weight: 500;
 color: #000000;
}

.header-actions {
 display: flex;
 align-items: center;
 gap: 16px;
}

.notification-button, .user-button {
 background: none;
 border: none;
 cursor: pointer;
 position: relative;
 width: 40px;
 height: 40px;
 display: flex;
 align-items: center;
 justify-content: center;
 border-radius: 50%;
 transition: all 0.3s ease;
}

.notification-button:hover, .user-button:hover {
 background-color: #f5f5f5;
}

.notification-badge {
 position: absolute;
 top: 2px;
 right: 2px;
 background-color: #ff4757;
 color: white;
 font-size: 0.7rem;
 border-radius: 50%;
 width: 18px;
 height: 18px;
 display: flex;
 align-items: center;
 justify-content: center;
 font-weight: 600;
 box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3);
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
 .sidebar {
   position: fixed;
   height: 100%;
   transform: translateX(-100%);
   width: 250px;
   box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
   transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), width 0.6s cubic-bezier(0.23, 1, 0.32, 1);
 }
 
 .sidebar-collapsed .sidebar {
   transform: translateX(-100%);
 }
 
 .app-wrapper:not(.sidebar-collapsed) .sidebar {
   transform: translateX(0);
 }
 
 .sidebar-collapsed .main-content {
   margin-left: 0;
 }
 
 /* Mostrar el botón de menú en dispositivos móviles */
 .menu-button {
   display: flex;
 }
 
 /* Ajustar padding en móviles */
 .content-wrapper {
   padding: 16px;
 }
 
 .top-header {
   padding: 0 16px;
 }
 
 /* Ocultar área de hover en móviles */
 .hover-area {
   display: none;
 }
}
</style>