<template>
  <MainLayout>
    <div class="llamadas-container">

      <div class="cards-container">
        <!-- Card para Llamada Individual -->
        <call-card
          title="Llamada Individual"
          description="Prioriza a quién contactar de manera personalizada, con base al perfil y las necesidades específicas."
          action-text="Iniciar Llamada Individual"
          @action-click="showIndividualModal = true"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              <circle cx="10" cy="5" r="4" fill="none"></circle>
            </svg>
          </template>
        </call-card>
        
        <!-- Card para Llamadas Masivas -->
        <call-card
          title="Llamadas Masivas"
          description="Comunicaciones a múltiples agentes de manera simultánea."
          action-text="Iniciar Llamadas Masivas"
          @action-click="showMasivasModal = true"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"></path>
            </svg>
          </template>
        </call-card>
      </div>
      
      <!-- Modal para Llamada Individual -->
      <call-modal
        v-model="showIndividualModal"
        title="Nueva Llamada Individual"
        confirm-text="Iniciar Llamada"
        :disable-confirm="!llamadaIndividualValida"
        @confirm="realizarLlamadaIndividual"
      >
        <individual-call-form 
          v-model="llamadaIndividual" 
          @submit="realizarLlamadaIndividual"
        />
      </call-modal>
      
      <!-- Modal para Llamadas Masivas -->
      <call-modal
        v-model="showMasivasModal"
        title="Nueva Campaña de Llamadas"
        confirm-text="Iniciar Campaña"
        :disable-confirm="!llamadaMasivaValida"
        @confirm="realizarLlamadasMasivas"
      >
        <mass-call-form 
          v-model="llamadaMasiva" 
          @submit="realizarLlamadasMasivas"
        />
      </call-modal>

    </div>
  </MainLayout>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import CallCard from '@/components/common/CardComponent.vue'
import CallModal from '@/components/common/ModalComponent.vue'
import IndividualCallForm from '@/components/forms/IndividualCallForm.vue'
import MassCallForm from '@/components/forms/MassCallForm.vue'

export default {
  name: 'LlamadasView',
  components: {
    MainLayout,
    CallCard,
    CallModal,
    IndividualCallForm,
    MassCallForm
  },
  
  setup() {
    // Estado para modales
    const showIndividualModal = ref(false)
    const showMasivasModal = ref(false)
    
    const llamadaIndividual = reactive({
      cliente: '',
      motivo: '',
      otroMotivo: '',
      notas: ''
    })
    
    const llamadaMasiva = reactive({
      nombre: '',
      segmento: '',
      objetivo: '',
      script: '',
      fechaInicio: '',
      prioridad: 'media'
    })
    
    const llamadaIndividualValida = computed(() => {
      return llamadaIndividual.cliente && 
        llamadaIndividual.motivo && 
        (llamadaIndividual.motivo !== 'otros' || llamadaIndividual.otroMotivo.trim() !== '')
    })
    
    const llamadaMasivaValida = computed(() => {
      return llamadaMasiva.nombre && 
        llamadaMasiva.segmento && 
        llamadaMasiva.objetivo && 
        llamadaMasiva.fechaInicio
    })
    
    // Métodos
    const realizarLlamadaIndividual = () => {
      console.log('Realizando llamada individual:', llamadaIndividual)
      alert('Llamada individual iniciada correctamente')
      
      Object.assign(llamadaIndividual, {
        cliente: '',
        motivo: '',
        otroMotivo: '',
        notas: ''
      })
      showIndividualModal.value = false
    }
    
    const realizarLlamadasMasivas = () => {
      console.log('Iniciando campaña de llamadas:', llamadaMasiva)
      alert('Campaña de llamadas iniciada correctamente')
      
      // Reiniciar formulario y cerrar modal
      Object.assign(llamadaMasiva, {
        nombre: '',
        segmento: '',
        objetivo: '',
        script: '',
        fechaInicio: '',
        prioridad: 'media'
      })
      showMasivasModal.value = false
    }
    
    return {
      showIndividualModal,
      showMasivasModal,
      llamadaIndividual,
      llamadaMasiva,
      llamadaIndividualValida,
      llamadaMasivaValida,
      realizarLlamadaIndividual,
      realizarLlamadasMasivas
    }
  }
}
</script>

<style scoped>

.llamadas-container {
  padding: 5px;
}

.cards-container {
  display: flex;
  justify-content: start;
  gap: 20px;
}

@media (max-width: 768px) {
  .cards-container {
    flex-direction: column;
    align-items: center;
    gap: 60px;
  }
}
</style>