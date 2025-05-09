<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo centrado -->
      <div class="brand-logo-centered">
        <div class="colibri-icon">
          <img :src="require('@/assets/logo-mas-analytics-color.svg')" alt="Logo MasAnalitycs" />
        </div>
      </div>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Alerta de error -->
        <div v-if="loginError" class="alert-error">
          <p>{{ loginError }}</p>
        </div>
        
        <!-- Campo de email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            :class="{ 'input-error': errors.email }"
            required
            autocomplete="email"
          />
          <div v-if="errors.email" class="error-message">
            <p>{{ errors.email }}</p>
          </div>
        </div>
        
        <!-- Campo de contraseña -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="formData.password" 
              :class="{ 'input-error': errors.password }"
              required
              autocomplete="current-password"
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
          <div v-if="errors.password" class="error-message">
            <p>{{ errors.password }}</p>
          </div>
        </div>
        
        <!-- Recordar sesión -->
        <div class="form-check">
          <input type="checkbox" id="remember" v-model="formData.remember" />
          <label for="remember">Recordar sesión</label>
        </div>
        
        <!-- Credenciales de demostración -->
        <div class="demo-accounts">
          <p>Cuentas de demostración:</p>
          <div class="account-item">
            <strong>Admin:</strong> admin@admin.com / admin123
          </div>
          <div class="account-item">
            <strong>Usuario:</strong> usuario@usuario.com / usuario123
          </div>
        </div>
        
        <!-- Botón de envío -->
        <button 
          type="submit" 
          :disabled="isLoading" 
          class="login-button"
        >
          <span v-if="isLoading">
            <span class="spinner"></span>
            Iniciando sesión...
          </span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>
      
      <!-- Enlaces adicionales -->
      <div class="additional-links">
        <router-link to="/">Registrarse</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'LoginView',
  
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    // Estado del formulario
    const formData = reactive({
      email: '',
      password: '',
      remember: false
    })
    
    // Estado de errores
    const errors = reactive({
      email: '',
      password: ''
    })
    
    // Estado de UI
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const loginError = computed(() => store.getters['auth/loginError'])
    const showPassword = ref(false)
    
    // Validar el formulario
    const validateForm = () => {
      let isValid = true
      
      // Restablecer errores
      errors.email = ''
      errors.password = ''
      
      // Validar email
      if (!formData.email) {
        errors.email = 'El email es obligatorio'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Debe ser un email válido'
        isValid = false
      }
      
      // Validar contraseña
      if (!formData.password) {
        errors.password = 'La contraseña es obligatoria'
        isValid = false
      } else if (formData.password.length < 6) {
        errors.password = 'Debe tener al menos 6 caracteres'
        isValid = false
      }
      
      return isValid
    }
    
    // Manejar envío del formulario
    const handleSubmit = async () => {
      // Validar el formulario
      if (!validateForm()) return
      
      try {
        // Limpiar cualquier error previo
        store.commit('auth/SET_LOGIN_ERROR', null)
        
        // Llamar a la acción de login en el store
        const success = await store.dispatch('auth/login', {
          email: formData.email,
          password: formData.password
        })
        
        // Si el login es exitoso, redirigir
        if (success) {
          console.log('Login exitoso, redirigiendo...')
          const redirectPath = route.query.redirect || '/dashboard'
          
          // Pequeño delay para permitir que el store se actualice completamente
          setTimeout(() => {
            router.push(redirectPath)
          }, 100)
        }
      } catch (error) {
        console.error('Error en login:', error)
      }
    }
    
    return {
      formData,
      errors,
      isLoading,
      showPassword,
      loginError,
      handleSubmit
    }
  }
}
</script>

<style scoped>
/* Estilo base para el contenedor de login */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f5ff;
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(to bottom right, #f0f6ff, #F2F2F2);
}

/* Estilos para la tarjeta de login */
.login-card {
  width: 100%;
  max-width: 450px;
  padding: 30px;
  background-color: #161840;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  border: 1px solid rgba(190, 150, 230, 0.1);
  backdrop-filter: blur(5px);
  color: white; /* Color de texto global para el card */
}

/* Logo centrado */
.brand-logo-centered {
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center;
  margin-bottom: 30px;
  margin-top: 10px;
}

.colibri-icon {
  width: 220px; /* Un poco más grande para mejor visibilidad */
  height: auto; /* Mantiene la proporción */
  margin-bottom: 10px;
  position: relative;
}

.colibri-icon img {
  width: 100%;
  height: auto;
  display: block;
}

.brand-name {
  font-family: 'Pacifico', cursive, sans-serif;
  color: white; /* Cambiado a blanco */
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  text-align: center; /* Texto centrado */
}

.login-title {
  text-align: center;
  margin-bottom: 25px;
  color: white; /* Cambiado a blanco */
  font-size: 1.5rem;
  font-weight: 500;
}

/* Estilos del formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: 600;
  color: white; /* Cambiado a blanco */
  font-size: 0.95rem;
  text-align: left;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: rgba(255, 255, 255, 0.9);
}

input:focus {
  outline: none;
  border-color: #a073ff;
  box-shadow: 0 0 0 2px rgba(160, 115, 255, 0.2);
}

.input-error {
  border-color: #f44336;
}

.password-input {
  position: relative;
  display: flex;
}

.password-input input {
  flex: 1;
  padding-right: 80px;
}

.toggle-password {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 15px;
  background: transparent;
  border: none;
  border-left: 1px solid #ddd;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
  transition: all 0.3s;
}

.toggle-password:hover {
  background-color: #f5f5f5;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-check input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #a073ff;
}

.form-check label {
  margin-bottom: 0;
  font-size: 0.9rem;
  font-weight: normal;
  color: white; /* Cambiado a blanco */
}

/* Estilos para cuentas de demostración */
.demo-accounts {
  background-color: rgba(255, 255, 255, 0.1); /* Fondo semi-transparente */
  border-radius: 6px;
  padding: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  color: white; /* Cambiado a blanco */
}

.demo-accounts p {
  margin: 0 0 8px 0;
  font-weight: 600;
  color: white; /* Cambiado a blanco */
  font-size: 0.9rem;
}

.account-item {
  margin-bottom: 5px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9); /* Ligeramente menos brillante para mejor legibilidad */
}

.account-item:last-child {
  margin-bottom: 0;
}

.login-button {
  padding: 12px;
  background-color: #4B64F2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.login-button:hover:not(:disabled) {
  background-color: #6230e0;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.login-button:disabled {
  background-color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert-error {
  background-color: rgba(244, 67, 54, 0.2); /* Fondo rojo semi-transparente */
  border-left: 4px solid #f44336;
  color: white; /* Texto blanco para alertas en fondo oscuro */
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 5px;
}

.error-message {
  color: #ff7b7b; /* Rojo más claro para mejor visibilidad */
  font-size: 0.8rem;
  margin-top: 5px;
  text-align: left;
}

.error-message p {
  margin: 2px 0;
}

.additional-links {
  margin-top: 25px;
  text-align: center;
  font-size: 0.9rem;
}

.additional-links a {
  color: #a494ff; /* Púrpura más claro para mejor visibilidad en fondo oscuro */
  text-decoration: none;
  transition: color 0.3s;
}

.additional-links a:hover {
  color: white;
  text-decoration: underline;
}

.divider {
  margin: 0 10px;
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 480px) {
  .login-card {
    padding: 20px;
  }
  
  .brand-name {
    font-size: 2rem;
  }
  
  .login-title {
    font-size: 1.3rem;
  }
  
  input, .login-button {
    padding: 10px;
  }
}
</style>