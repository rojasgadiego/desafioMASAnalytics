<template>
  <aside class="sidebar" @mouseenter="$emit('expand-sidebar')" @mouseleave="$emit('collapse-sidebar')">
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
      <button class="logout-button" @click="$emit('logout')" :title="isSidebarCollapsed ? 'Cerrar sesión' : ''">
        <span class="logout-icon">⏻</span>
        <span v-if="!isSidebarCollapsed" class="logout-text">Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    },
    currentUser: {
      type: Object,
      default: () => ({})
    },
    userRoles: {
      type: Array,
      default: () => []
    },
    filteredMenuItems: {
      type: Array,
      required: true
    },
    userInitials: {
      type: String,
      required: true
    }
  },
  
  emits: ['expand-sidebar', 'collapse-sidebar', 'logout'],
  
  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(`${path}/`);
    },
    closeMobileSidebar() {
      this.$emit('close-mobile-sidebar');
    },
    handleNavigation() {
      this.$emit('handle-navigation');
    }
  }
}
</script>

<style scoped>
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

.sidebar-header {
  padding: 18px 16px;
  display: flex;
  align-items: center;
  justify-content: center; /* Centrar el logo */
  transition: padding 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  height: 70px; /* Altura fija para evitar saltos */
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

.logout-button:hover {
  background-color: #ffe5e5;
  color: #e74c3c;
}

.logout-icon {
  margin-right: 10px;
  transition: margin 0.6s cubic-bezier(0.23, 1, 0.32, 1);
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
}
</style>