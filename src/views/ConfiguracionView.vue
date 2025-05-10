<template>
  <MainLayout>
    <div class="profile-config-container">
      
      <div class="config-grid">
        <!-- Sección de información de perfil -->
        <div class="config-card">
          <h2 class="section-title">Información Personal</h2>
          <div class="form-group">
            <label for="name">Nombre completo</label>
            <input 
              type="text" 
              id="name" 
              value="Usuario Normal"
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="role">Rol</label>
            <input 
              type="text" 
              id="role" 
              value="Usuario"
              class="form-control"
              disabled
            />
          </div>
          
          <div class="form-actions">
            <button class="btn primary-btn">
              Guardar Cambios
            </button>
          </div>
        </div>
        
        <!-- Sección de actualización de correo -->
        <div class="config-card">
          <h2 class="section-title">Actualizar Correo Electrónico</h2>
          <div class="form-group">
            <label for="currentEmail">Correo electrónico actual</label>
            <input 
              type="email" 
              id="currentEmail" 
              value="usuario@usuario.com"
              class="form-control"
              disabled
            />
          </div>
          
          <div class="form-group">
            <label for="newEmail">Nuevo correo electrónico</label>
            <input 
              type="email" 
              id="newEmail" 
              class="form-control"
            />
          </div>
          
          <div class="form-actions">
            <button class="btn primary-btn">
              Actualizar Correo
            </button>
          </div>
        </div>
        
        <!-- Sección de cambio de contraseña -->
        <div class="config-card">
          <h2 class="section-title">Cambiar Contraseña</h2>
          <div class="form-group">
            <label for="currentPassword">Contraseña actual</label>
            <div class="password-input">
              <input 
                type="password" 
                id="currentPassword" 
                class="form-control"
              />
              <button 
                type="button" 
                class="toggle-password"
              >
                Mostrar
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="newPassword">Nueva contraseña</label>
            <div class="password-input">
              <input 
                type="password" 
                id="newPassword" 
                class="form-control"
              />
              <button 
                type="button" 
                class="toggle-password"
              >
                Mostrar
              </button>
            </div>
          </div>
          
          <div class="form-actions">
            <button class="btn primary-btn">
              Cambiar Contraseña
            </button>
          </div>
        </div>
        
        <!-- Sección de seguridad de la cuenta -->
        <div class="config-card">
          <h2 class="section-title">Seguridad de la Cuenta</h2>
          
          <div class="form-group">
            <div class="security-item">
              <div class="security-item-content">
                <h3 class="security-item-title">Último acceso</h3>
                <p class="security-item-description">
                  Hoy, 10:25 AM desde Windows - Chrome
                </p>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <div class="security-item danger-zone">
              <div class="security-item-content">
                <h3 class="security-item-title">Eliminar cuenta</h3>
              </div>
              <button class="btn danger-btn">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'

export default {
  name: 'ProfileConfigView',
  components: {
    MainLayout
  }
}
</script>

<style scoped>
.profile-config-container {
  padding: 15px;
  max-height: calc(100vh - 80px); /* Ajusta según la altura del header de tu MainLayout */
  overflow: hidden;
}

.page-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  height: calc(100vh - 130px); /* Ajusta según la altura del header y el título */
}

.config-card {
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-title {
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #444;
  font-size: 0.85rem;
}

.form-control {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #6153f3;
  box-shadow: 0 0 0 2px rgba(97, 83, 243, 0.1);
}

.form-control:disabled {
  background-color: #f9f9f9;
  color: #777;
}

.password-input {
  position: relative;
  display: flex;
}

.password-input .form-control {
  flex: 1;
  padding-right: 70px;
}

.toggle-password {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 10px;
  background: transparent;
  border: none;
  border-left: 1px solid #ddd;
  color: #666;
  font-size: 0.75rem;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 10px;
}

.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-btn {
  background-color: #6153f3;
  color: white;
}

.primary-btn:hover {
  background-color: #4f43d9;
}

.danger-btn {
  background-color: #fff0f0;
  color: #f44336;
  border: 1px solid #ffcdd2;
}

.danger-btn:hover {
  background-color: #ffebee;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.security-item-content {
  flex: 1;
}

.security-item-title {
  font-size: 0.9rem;
  margin: 0 0 3px 0;
  color: #333;
}

.security-item-description {
  font-size: 0.8rem;
  margin: 0;
  color: #666;
}

.danger-zone {
  background-color: #fff5f5;
  border: 1px dashed #ffcdd2;
}

@media (max-width: 1200px) {
  .config-grid {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
    overflow-y: auto;
  }
  
  .profile-config-container {
    max-height: none;
    overflow: auto;
  }
}
</style>