<template>
    <MainLayout>
      <div class="llamadas-container">
        <div class="cards-container">
          <!-- Tarjeta para Llamada Individual -->
          <div class="card">
            <div class="icon-circle">
              <div class="icon individual-call-icon">
                <!-- Ícono de persona con teléfono -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  <circle cx="10" cy="5" r="4" fill="none"></circle>
                </svg>
              </div>
            </div>
            <h2 class="card-title">Llamada Individual</h2>
            <p class="card-description">
              Prioriza a quién contactar de manera personalizada, con base al perfil y las necesidades específicas.
            </p>
            <button class="action-button" @click="iniciarLlamadaIndividual">
              Iniciar Llamada Individual
            </button>
          </div>
          
          <!-- Tarjeta para Llamadas Masivas -->
          <div class="card">
            <div class="icon-circle">
              <div class="icon mass-call-icon">
                <!-- Ícono de múltiples personas con teléfono -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"></path>
                </svg>
              </div>
            </div>
            <h2 class="card-title">Llamadas Masivas</h2>
            <p class="card-description">
              Comunicaciones a múltiples agentes de manera simultánea.
            </p>
            <button class="action-button" @click="iniciarLlamadasMasivas">
              Iniciar Llamadas Masivas
            </button>
          </div>
        </div>
        
        <!-- Modal para Llamada Individual (inicialmente oculto) -->
        <div class="modal" v-if="showIndividualModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Nueva Llamada Individual</h3>
              <button class="close-button" @click="showIndividualModal = false">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="cliente">Seleccionar Cliente</label>
                <select id="cliente" v-model="llamadaIndividual.cliente" class="form-control">
                  <option value="" disabled selected>Seleccione un cliente</option>
                  <option value="1">Juan Pérez - Empresa ABC</option>
                  <option value="2">María López - Comercial XYZ</option>
                  <option value="3">Carlos Rodríguez - Distribuidora 123</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="motivo">Motivo de la Llamada</label>
                <select id="motivo" v-model="llamadaIndividual.motivo" class="form-control">
                  <option value="" disabled selected>Seleccione un motivo</option>
                  <option value="seguimiento">Seguimiento de venta</option>
                  <option value="cobranza">Gestión de cobranza</option>
                  <option value="soporte">Soporte técnico</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              
              <div class="form-group" v-if="llamadaIndividual.motivo === 'otros'">
                <label for="otroMotivo">Especificar motivo</label>
                <input type="text" id="otroMotivo" v-model="llamadaIndividual.otroMotivo" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="notas">Notas previas</label>
                <textarea id="notas" v-model="llamadaIndividual.notas" rows="3" class="form-control"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="secondary-button" @click="showIndividualModal = false">Cancelar</button>
              <button class="primary-button" @click="realizarLlamadaIndividual" :disabled="!llamadaIndividualValida">
                Iniciar Llamada
              </button>
            </div>
          </div>
        </div>
        
        <!-- Modal para Llamadas Masivas (inicialmente oculto) -->
        <div class="modal" v-if="showMasivasModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Nueva Campaña de Llamadas</h3>
              <button class="close-button" @click="showMasivasModal = false">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="campana">Nombre de la Campaña</label>
                <input type="text" id="campana" v-model="llamadaMasiva.nombre" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="segmento">Segmento de Clientes</label>
                <select id="segmento" v-model="llamadaMasiva.segmento" class="form-control">
                  <option value="" disabled selected>Seleccione un segmento</option>
                  <option value="todos">Todos los clientes</option>
                  <option value="activos">Clientes activos</option>
                  <option value="inactivos">Clientes inactivos</option>
                  <option value="morosos">Clientes con pagos pendientes</option>
                  <option value="nuevos">Clientes nuevos (últimos 30 días)</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="objetivo">Objetivo de la campaña</label>
                <select id="objetivo" v-model="llamadaMasiva.objetivo" class="form-control">
                  <option value="" disabled selected>Seleccione un objetivo</option>
                  <option value="informativo">Informativo</option>
                  <option value="ventas">Ventas</option>
                  <option value="cobranza">Cobranza</option>
                  <option value="fidelizacion">Fidelización</option>
                  <option value="encuesta">Encuesta</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="script">Script de llamada</label>
                <textarea id="script" v-model="llamadaMasiva.script" rows="4" class="form-control"></textarea>
              </div>
              
              <div class="form-group">
                <label for="fechaInicio">Fecha de inicio</label>
                <input type="date" id="fechaInicio" v-model="llamadaMasiva.fechaInicio" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="prioridad">Prioridad</label>
                <select id="prioridad" v-model="llamadaMasiva.prioridad" class="form-control">
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="secondary-button" @click="showMasivasModal = false">Cancelar</button>
              <button class="primary-button" @click="realizarLlamadasMasivas" :disabled="!llamadaMasivaValida">
                Iniciar Campaña
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </template>

<script>
import { ref, computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'

export default {
  name: 'LlamadasView',
  components: {
    MainLayout
  },
  
  setup() {
    // Estado para modales
    const showIndividualModal = ref(false)
    const showMasivasModal = ref(false)
    
    // Estado para llamada individual
    const llamadaIndividual = ref({
      cliente: '',
      motivo: '',
      otroMotivo: '',
      notas: ''
    })
    
    // Estado para llamada masiva
    const llamadaMasiva = ref({
      nombre: '',
      segmento: '',
      objetivo: '',
      script: '',
      fechaInicio: '',
      prioridad: 'media'
    })
    
    // Validaciones
    const llamadaIndividualValida = computed(() => {
      return llamadaIndividual.value.cliente && 
        llamadaIndividual.value.motivo && 
        (llamadaIndividual.value.motivo !== 'otros' || llamadaIndividual.value.otroMotivo.trim() !== '')
    })
    
    const llamadaMasivaValida = computed(() => {
      return llamadaMasiva.value.nombre && 
        llamadaMasiva.value.segmento && 
        llamadaMasiva.value.objetivo && 
        llamadaMasiva.value.fechaInicio
    })
    
    // Métodos
    const iniciarLlamadaIndividual = () => {
      showIndividualModal.value = true
    }
    
    const iniciarLlamadasMasivas = () => {
      showMasivasModal.value = true
    }
    
    const realizarLlamadaIndividual = () => {
      // Aquí iría la lógica para realizar la llamada
      console.log('Realizando llamada individual:', llamadaIndividual.value)
      alert('Llamada individual iniciada correctamente')
      
      // Reiniciar formulario y cerrar modal
      llamadaIndividual.value = {
        cliente: '',
        motivo: '',
        otroMotivo: '',
        notas: ''
      }
      showIndividualModal.value = false
    }
    
    const realizarLlamadasMasivas = () => {
      // Aquí iría la lógica para iniciar campaña de llamadas
      console.log('Iniciando campaña de llamadas:', llamadaMasiva.value)
      alert('Campaña de llamadas iniciada correctamente')
      
      // Reiniciar formulario y cerrar modal
      llamadaMasiva.value = {
        nombre: '',
        segmento: '',
        objetivo: '',
        script: '',
        fechaInicio: '',
        prioridad: 'media'
      }
      showMasivasModal.value = false
    }
    
    return {
      showIndividualModal,
      showMasivasModal,
      llamadaIndividual,
      llamadaMasiva,
      llamadaIndividualValida,
      llamadaMasivaValida,
      iniciarLlamadaIndividual,
      iniciarLlamadasMasivas,
      realizarLlamadaIndividual,
      realizarLlamadasMasivas
    }
  }
}
</script>

<style scoped>
.llamadas-container {
  padding: 5px; /* Espacio para toda la sección */
}

.cards-container {
  display: flex;
  justify-content: start; /* Centra las tarjetas horizontalmente */
  gap: 20px; /* Espacio entre las tarjetas de 20px */
}

.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 250px; /* Ancho fijo para ambas tarjetas */
  flex: none; /* Evita que las tarjetas se estiren */
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.icon-circle {
  width: 80px;
  height: 80px;
  background-color: #f5f5ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  margin-top: -60px; /* Hace que el círculo aparezca arriba de la tarjeta */
}

.icon {
  color: #6153f3;
  width: 40px;
  height: 40px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.card-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.action-button {
  background-color: #6153f3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.action-button:hover {
  background-color: #4f43d9;
}

/* Estilos para los modales */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #444;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #6153f3;
  box-shadow: 0 0 0 2px rgba(97, 83, 243, 0.1);
}

.primary-button {
  background-color: #6153f3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.primary-button:hover:not(:disabled) {
  background-color: #4f43d9;
}

.primary-button:disabled {
  background-color: #c5c1f8;
  cursor: not-allowed;
}

.secondary-button {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.secondary-button:hover {
  background-color: #e5e5e5;
}

/* Media queries para responsividad */
@media (max-width: 768px) {
  .cards-container {
    flex-direction: column;
    align-items: center;
    gap: 60px; /* Mayor espacio vertical en móviles */
  }
  
  .card {
    width: 100%;
    max-width: 350px;
  }
  
  .modal-content {
    width: 90%;
  }
}
</style>