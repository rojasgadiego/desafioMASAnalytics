<template>
    <MainLayout>
      <div class="agentes-container">
        <!-- Encabezado y controles principales -->
        <div class="page-header">
          <h1 class="page-title">Gestión de Agentes</h1>
          <div class="controls">
            <button class="refresh-button" @click="fetchAgentes">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              Actualizar
            </button>
          </div>
        </div>
        
        <!-- Contenido principal dividido en dos columnas -->
        <div class="main-content">
          <!-- Columna izquierda: Tabla de agentes existentes -->
          <div class="table-section">
            <div class="section-header">
              <h2>Agentes existentes</h2>
              <div class="search-container">
                <input 
                  type="text" 
                  placeholder="Buscar agentes..." 
                  v-model="searchQuery"
                  @input="filterAgentes"
                />
              </div>
            </div>
            
            <!-- Tabla de agentes -->
            <div class="tabla-container">
              <table class="tabla-agentes">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Voz</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredAgentes.length === 0">
                    <td colspan="5" class="empty-message">
                      No hay agentes disponibles
                    </td>
                  </tr>
                  <tr v-for="agente in filteredAgentes" :key="agente.id" :class="{ 'active-row': agente.activo }">
                    <td>{{ agente.id }}</td>
                    <td>{{ agente.nombre }}</td>
                    <td>{{ agente.voz }}</td>
                    <td>
                      <span :class="'estado-badge ' + (agente.activo ? 'estado-activo' : 'estado-inactivo')">
                        {{ agente.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="actions-cell">
                      <button class="action-button view" @click="verAgente(agente)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button class="action-button edit" @click="editarAgente(agente)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                          <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                        </svg>
                      </button>
                      <button class="action-button toggle" @click="toggleAgenteStatus(agente)">
                        <svg v-if="agente.activo" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Columna derecha: Formulario para crear agente -->
          <div class="form-section">
            <div class="section-header">
              <h2>{{ editMode ? 'Editar Agente' : 'Crear Nuevo Agente' }}</h2>
              <button v-if="editMode" class="cancel-edit-button" @click="cancelEdit">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
                Cancelar edición
              </button>
            </div>
            
            <!-- Formulario de creación de agente -->
            <form @submit.prevent="submitForm" class="agente-form">
              <div class="form-group">
                <label for="agente-nombre">Nombre del Agente *</label>
                <input 
                  type="text" 
                  id="agente-nombre" 
                  v-model="formData.nombre" 
                  required
                  :class="{ 'input-error': formErrors.nombre }"
                  placeholder="Ej: Agente de Ventas"
                />
                <div v-if="formErrors.nombre" class="error-message">{{ formErrors.nombre }}</div>
              </div>
              
              <div class="form-group">
                <label for="agente-script">Script / Prompt *</label>
                <textarea 
                  id="agente-script" 
                  v-model="formData.script" 
                  required
                  :class="{ 'input-error': formErrors.script }"
                  placeholder="Escribe el guión o instrucciones que usará el agente..."
                  rows="8"
                ></textarea>
                <div v-if="formErrors.script" class="error-message">{{ formErrors.script }}</div>
              </div>
              
              <div class="form-group">
                <label for="agente-voz">Voz a utilizar *</label>
                <select 
                  id="agente-voz" 
                  v-model="formData.voz" 
                  required
                  :class="{ 'input-error': formErrors.voz }"
                >
                  <option value="" disabled>Selecciona una voz</option>
                  <option value="María (Español)">María (Español)</option>
                  <option value="Pedro (Español)">Pedro (Español)</option>
                  <option value="Sarah (Inglés)">Sarah (Inglés)</option>
                </select>
                <div v-if="formErrors.voz" class="error-message">{{ formErrors.voz }}</div>
              </div>
              
              <div class="form-group">
                <label>Configuración adicional</label>
                <div class="checkbox-group">
                  <input type="checkbox" id="agente-activo" v-model="formData.activo" />
                  <label for="agente-activo">Activar agente inmediatamente</label>
                </div>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="submit-button" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="loading-spinner"></span>
                  {{ editMode ? 'Actualizar Agente' : 'Crear Agente' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue';
  import MainLayout from '@/layouts/MainLayout.vue';
  
  export default {
    name: 'AgentesView',
    components: {
      MainLayout
    },
    
    setup() {
      // Estado para la lista de agentes
      const agentes = ref([]);
      const filteredAgentes = ref([]);
      const searchQuery = ref('');
      
      // Estado para el formulario
      const formData = reactive({
        id: null,
        nombre: '',
        script: '',
        voz: '',
        activo: true
      });
      
      // Estado para errores del formulario
      const formErrors = reactive({
        nombre: '',
        script: '',
        voz: ''
      });
      
      // Estado para la UI
      const isSubmitting = ref(false);
      const editMode = ref(false);
      
      // Cargar datos iniciales simulados
      const fetchAgentes = () => {
        // Simulamos una carga desde una API
        setTimeout(() => {
          agentes.value = [
            { id: 1, nombre: 'Asistente de Ventas', script: 'Este es un script de ejemplo para asistente de ventas...', voz: 'María (Español)', activo: true },
            { id: 2, nombre: 'Soporte Técnico', script: 'Script para resolver problemas técnicos comunes...', voz: 'Pedro (Español)', activo: true },
            { id: 3, nombre: 'Encuesta de Satisfacción', script: 'Guión para realizar encuestas post-servicio...', voz: 'Sarah (Inglés)', activo: false },
            { id: 4, nombre: 'Agente de Cobranzas', script: 'Script de recordatorio amable para pagos pendientes...', voz: 'María (Español)', activo: true },
            { id: 5, nombre: 'Reservas y Citas', script: 'Script para confirmar y gestionar reservas...', voz: 'Pedro (Español)', activo: false }
          ];
          filteredAgentes.value = [...agentes.value];
        }, 500);
      };
      
      // Filtrar agentes según la búsqueda
      const filterAgentes = () => {
        if (!searchQuery.value) {
          filteredAgentes.value = [...agentes.value];
          return;
        }
        
        const query = searchQuery.value.toLowerCase();
        filteredAgentes.value = agentes.value.filter(agente => 
          agente.nombre.toLowerCase().includes(query) || 
          agente.voz.toLowerCase().includes(query)
        );
      };
      
      // Validar formulario
      const validateForm = () => {
        let isValid = true;
        
        // Resetear errores
        formErrors.nombre = '';
        formErrors.script = '';
        formErrors.voz = '';
        
        // Validar nombre
        if (!formData.nombre.trim()) {
          formErrors.nombre = 'El nombre del agente es obligatorio';
          isValid = false;
        } else if (formData.nombre.length < 3) {
          formErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
          isValid = false;
        }
        
        // Validar script
        if (!formData.script.trim()) {
          formErrors.script = 'El script/prompt es obligatorio';
          isValid = false;
        } else if (formData.script.length < 10) {
          formErrors.script = 'El script debe tener al menos 10 caracteres';
          isValid = false;
        }
        
        // Validar voz
        if (!formData.voz) {
          formErrors.voz = 'Debe seleccionar una voz para el agente';
          isValid = false;
        }
        
        return isValid;
      };
      
      // Enviar formulario
      const submitForm = async () => {
        if (!validateForm()) return;
        
        isSubmitting.value = true;
        
        try {
          // Simulamos una llamada a API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (editMode.value) {
            // Modo edición: actualizar agente existente
            const index = agentes.value.findIndex(a => a.id === formData.id);
            if (index !== -1) {
              agentes.value[index] = { ...formData };
              alert(`Agente "${formData.nombre}" actualizado con éxito`);
            }
          } else {
            // Modo creación: agregar nuevo agente
            const newId = agentes.value.length > 0 
              ? Math.max(...agentes.value.map(a => a.id)) + 1 
              : 1;
              
            const newAgente = {
              id: newId,
              nombre: formData.nombre,
              script: formData.script,
              voz: formData.voz,
              activo: formData.activo
            };
            
            agentes.value.push(newAgente);
            alert(`Agente "${formData.nombre}" creado con éxito`);
          }
          
          // Resetear formulario y actualizar lista filtrada
          resetForm();
          filterAgentes();
          
        } catch (error) {
          console.error('Error al guardar agente:', error);
          alert('Ha ocurrido un error al guardar el agente. Inténtelo de nuevo.');
        } finally {
          isSubmitting.value = false;
        }
      };
      
      // Resetear formulario
      const resetForm = () => {
        formData.id = null;
        formData.nombre = '';
        formData.script = '';
        formData.voz = '';
        formData.activo = true;
        editMode.value = false;
      };
      
      // Ver detalles del agente
      const verAgente = (agente) => {
        alert(`Detalles del agente: ${agente.nombre}\n\nScript/Prompt:\n${agente.script}\n\nVoz: ${agente.voz}\nEstado: ${agente.activo ? 'Activo' : 'Inactivo'}`);
      };
      
      // Editar agente
      const editarAgente = (agente) => {
        formData.id = agente.id;
        formData.nombre = agente.nombre;
        formData.script = agente.script;
        formData.voz = agente.voz;
        formData.activo = agente.activo;
        editMode.value = true;
        
        // Hacer scroll al formulario en dispositivos móviles
        if (window.innerWidth <= 768) {
          document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
      };
      
      // Cancelar edición
      const cancelEdit = () => {
        resetForm();
      };
      
      // Cambiar estado del agente (activar/desactivar)
      const toggleAgenteStatus = (agente) => {
        const index = agentes.value.findIndex(a => a.id === agente.id);
        if (index !== -1) {
          agentes.value[index].activo = !agentes.value[index].activo;
          
          // También actualizar en la lista filtrada
          const filteredIndex = filteredAgentes.value.findIndex(a => a.id === agente.id);
          if (filteredIndex !== -1) {
            filteredAgentes.value[filteredIndex].activo = agentes.value[index].activo;
          }
          
          alert(`El agente "${agente.nombre}" ha sido ${agentes.value[index].activo ? 'activado' : 'desactivado'}`);
        }
      };
      
      // Cargar datos al montar el componente
      onMounted(() => {
        fetchAgentes();
      });
      
      return {
        agentes,
        filteredAgentes,
        searchQuery,
        formData,
        formErrors,
        isSubmitting,
        editMode,
        fetchAgentes,
        filterAgentes,
        submitForm,
        verAgente,
        editarAgente,
        cancelEdit,
        toggleAgenteStatus
      };
    }
  }
  </script>
  
  <style scoped>
  /* Contenedor principal */
  .agentes-container {
    padding: 0;
    min-height: 100vh;
    background-color: #f5f7fb;
    display: flex;
    flex-direction: column;
  }
  
  /* Barra superior con línea inferior */
  .top-bar {
    background-color: #161840;
    width: 100%;
    height: 64px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    flex-shrink: 0;
    border-bottom: 3px solid #05DBF2; /* Línea turquesa */
  }
  
  /* Contenedor del logo */
  .brand-logo-container {
    display: flex;
    align-items: center;
  }
  
  /* Icono/Logo */
  .colibri-icon {
    width: 70px;
    height: 40px;
  }
  
  .colibri-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  /* Encabezado de página */
  .page-header {
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .page-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #333;
    margin: 0;
  }
  
  .controls {
    display: flex;
    gap: 10px;
  }
  
  .refresh-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    background-color: #4B64F2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .refresh-button:hover {
    background-color: #3a50d8;
  }
  
  /* Contenido principal dividido */
  .main-content {
    display: flex;
    flex: 1;
    gap: 20px;
    padding: 0 24px 24px;
  }
  
  /* Secciones comunes */
  .table-section, .form-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .table-section {
    flex: 1;
    min-width: 0; /* Para evitar que la tabla rompa el layout */
  }
  
  .form-section {
    width: 400px;
    flex-shrink: 0;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .section-header h2 {
    font-size: 1.2rem;
    font-weight: 500;
    color: #333;
    margin: 0;
  }
  
  /* Búsqueda */
  .search-container {
    position: relative;
  }
  
  .search-container input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    width: 240px;
  }
  
  /* Tabla de agentes */
  .tabla-container {
    overflow-x: auto;
    flex: 1;
  }
  
  .tabla-agentes {
    width: 100%;
    border-collapse: collapse;
  }
  
  .tabla-agentes th,
  .tabla-agentes td {
    padding: 12px 15px;
    text-align: left;
  }
  
  .tabla-agentes th {
    background-color: #f5f7fb;
    color: #333;
    font-weight: 600;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .tabla-agentes tr {
    border-bottom: 1px solid #f0f0f0;
  }
  
  .tabla-agentes tr:last-child {
    border-bottom: none;
  }
  
  .tabla-agentes tr.active-row {
    background-color: #f7faff;
  }
  
  .empty-message {
    text-align: center;
    padding: 40px 0;
    color: #777;
    font-style: italic;
  }
  
  /* Estados y badges */
  .estado-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .estado-activo {
    background-color: #e8f5e9;
    color: #388e3c;
  }
  
  .estado-inactivo {
    background-color: #ffebee;
    color: #d32f2f;
  }
  
  /* Botones de acción */
  .actions-cell {
    white-space: nowrap;
  }
  
  .action-button {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .action-button.view {
    background-color: #2196f3;
  }
  
  .action-button.view:hover {
    background-color: #1976d2;
  }
  
  .action-button.edit {
    background-color: #ff9800;
  }
  
  .action-button.edit:hover {
    background-color: #f57c00;
  }
  
  .action-button.toggle {
    background-color: #4caf50;
  }
  
  .action-button.toggle:hover {
    background-color: #388e3c;
  }
  
  /* Formulario */
  .agente-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-group label {
    font-weight: 500;
    color: #333;
    font-size: 0.95rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
    transition: border-color 0.3s;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #4B64F2;
  }
  
  .input-error {
    border-color: #f44336 !important;
  }
  
  .error-message {
    color: #f44336;
    font-size: 0.8rem;
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .checkbox-group input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
  
  .form-actions {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
  
  .submit-button {
    padding: 10px 20px;
    background-color: #4B64F2;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
  }
  
  .submit-button:hover:not(:disabled) {
    background-color: #3a50d8;
  }
  
  .submit-button:disabled {
    background-color: #b9b9b9;
    cursor: not-allowed;
  }
  
  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .cancel-edit-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 10px;
    background-color: #f0f0f0;
    color: #666;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .cancel-edit-button:hover {
    background-color: #e0e0e0;
    color: #333;
  }
  
  /* Responsive */
  @media (max-width: 1100px) {
    .main-content {
      flex-direction: column;
    }
    
    .form-section {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    .top-bar {
      padding: 0 15px;
    }
    
    .colibri-icon {
      width: 50px;
      height: 30px;
    }
    
    .page-header {
      padding: 15px;
    }
    
    .main-content {
      padding: 0 15px 15px;
    }
    
    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    
    .search-container input {
      width: 100%;
    }
    
    .tabla-agentes {
      min-width: 650px; /* Para permitir scroll horizontal en móviles */
    }
  }
  </style>