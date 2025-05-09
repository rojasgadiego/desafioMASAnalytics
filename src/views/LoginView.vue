<template>
  <div class="login-container">
    
    <div class="login-card">
      <!-- Logo y nombre de la aplicación -->
      <div class="brand-logo">
        <div class="colibri-icon">
          <div class="hummingbird"></div>
        </div>
        <h1 class="brand-name">MasAnalitycs</h1>
      </div>
      <h2 class="login-title">Iniciar Sesión</h2>
      
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
  background-image: linear-gradient(to bottom right, #f0f6ff, #fef4ff);
}

/* Estilos para la tarjeta de login */
.login-card {
  width: 100%;
  max-width: 450px;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  border: 1px solid rgba(190, 150, 230, 0.1);
  backdrop-filter: blur(5px);
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.95));
}

/* Logo y nombre de la florería */
.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.colibri-icon {
  width: 70px;
  height: 70px;
  margin-bottom: 10px;
  position: relative;
}


.brand-name {
  font-family: 'Pacifico', cursive, sans-serif;
  color: #743cfa;
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(116, 60, 250, 0.3);
}

.login-title {
  text-align: center;
  margin-bottom: 25px;
  color: #4a4a4a;
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
  color: #5d5d5d;
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
}

/* Estilos para cuentas de demostración */
.demo-accounts {
  background-color: #f8f4ff;
  border-radius: 6px;
  padding: 12px;
  border: 1px dashed #c5b3ff;
}

.demo-accounts p {
  margin: 0 0 8px 0;
  font-weight: 600;
  color: #5d5d5d;
  font-size: 0.9rem;
}

.account-item {
  margin-bottom: 5px;
  font-size: 0.85rem;
}

.account-item:last-child {
  margin-bottom: 0;
}

.login-button {
  padding: 12px;
  background-color: #743cfa;
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
  box-shadow: 0 4px 8px rgba(116, 60, 250, 0.2);
}

.login-button:hover:not(:disabled) {
  background-color: #6230e0;
  box-shadow: 0 6px 12px rgba(116, 60, 250, 0.3);
}

.login-button:disabled {
  background-color: #b9a4e6;
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
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  color: #d32f2f;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 5px;
}

.error-message {
  color: #f44336;
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
  color: #743cfa;
  text-decoration: none;
  transition: color 0.3s;
}

.additional-links a:hover {
  color: #6230e0;
  text-decoration: underline;
}

.divider {
  margin: 0 10px;
  color: #ccc;
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
  
  .flower {
    opacity: 0.4;
  }
}
</style>