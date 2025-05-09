<template>
    <div class="app-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- Área sensible al hover mejorada -->
      <div class="hover-area" @mouseenter="expandSidebar"></div>
      
      <!-- Sidebar -->
      <aside class="sidebar" @mouseenter="expandSidebar" @mouseleave="collapseSidebar">
        <div class="sidebar-header">
          <div class="logo-container">
            <div class="logo-icon">M</div>
            <span v-if="!isSidebarCollapsed" class="app-name">MASAnalytics</span>
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
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',
          roles: [] // Disponible para todos los roles
        },
        { 
          name: 'Llamadas', 
          path: '/llamadas', 
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',
          roles: [] // Disponible para todos los roles
        },
        { 
          name: 'Monitoreo', 
          path: '/', 
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',
          roles: [] // Disponible para todos los roles
        },
        { 
          name: 'Agentes', 
          path: '/', 
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',
          roles: [] // Disponible para todos los roles
        },
        // { 
        //   name: 'Ventas', 
        //   path: '/ventas', 
        //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM12 8v8m-4-4h8"></path></svg>',
        //   roles: ['admin', 'usuario'], // Accesible para administradores y vendedores
        //   submenu: [
        //     { 
        //       name: 'Todas las Ventas', 
        //       path: '/ventas', 
        //       icon: '',
        //       roles: ['admin', 'usuario']
        //     },
        //     { 
        //       name: 'Ventas Individuales', 
        //       path: '/ventas/individuales', 
        //       icon: '',
        //       roles: ['admin', 'usuario']
        //     },
        //     { 
        //       name: 'Ventas de Ramos', 
        //       path: '/ventas/ramos', 
        //       icon: '',
        //       roles: ['admin', 'usuario']
        //     },
        //     { 
        //       name: 'Nueva Venta', 
        //       path: '/ventas/nueva', 
        //       icon: '',
        //       roles: ['admin', 'usuario']
        //     }
        //   ]
        // },
        // { 
        //   name: 'Inventario', 
        //   path: '/inventory', 
        //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
        //   roles: ['admin', 'editor', 'usuario']
        // },
        // { 
        //   name: 'Personal', 
        //   path: '/personal', 
        //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        //   roles: ['admin'] 
        // },
        // { 
        //   name: 'Facturas', 
        //   path: '/invoice', 
        //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>',
        //   roles: ['admin', 'editor', 'usuario']
        // },
        // { 
        //   name: 'Reportes', 
        //   path: '/reports', 
        //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
        //   roles: ['admin', 'usuario']
        // },
        // { 
        //   name: 'Configuración', 
        //   path: '/settings', 
        //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
        //   roles: ['admin']
        // }
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
    justify-content: space-between;
    transition: padding 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  
  .sidebar-collapsed .sidebar-header {
    padding: 18px 0;
    justify-content: center;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  
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
    margin-right: 10px;
    flex-shrink: 0;
    transition: margin 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  
  .sidebar-collapsed .logo-icon {
    margin-right: 0;
  }
  
  .app-name {
    font-size: 1.2rem;
    font-weight: 600;
    white-space: nowrap;
    color: #ffffff;
    font-family: 'Pacifico', cursive, sans-serif;
    letter-spacing: 0.5px;
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
    background-color: #05daf279;
    color: #ffffff;
  }
  
  .sidebar-nav a.active {
    background-color:#05daf279;
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
   background-color: #161840;
   padding: 0 24px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
   border-bottom: 3px solid #05DBF2;
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
   color: #ffffff;
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
  
  
  
  
  
  
  
  