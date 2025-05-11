<template>

  <header class="top-header">

    <button v-if="isMobile" class="menu-button" @click="$emit('expand-sidebar')" aria-label="Abrir menú">
      ☰
    </button>
    
    <div class="breadcrumb">
      {{ currentRouteName }}
    </div>
    
    <!-- Puedes añadir aquí más elementos como notificaciones si son necesarios -->
    <div class="header-actions">
      <slot name="header-actions"></slot>
    </div>
  </header>

</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    isMobile: {
      type: Boolean,
      required: true
    },
    currentRouteName: {
      type: String,
      required: true
    }
  },
  emits: ['expand-sidebar']
}
</script>

<style scoped>
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
  color: #333333;
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

/* Estilos específicos para dispositivos móviles */
@media (max-width: 768px) {
  .menu-button {
    display: flex;
  }
  
  .top-header {
    padding: 0 16px;
  }
}
</style>