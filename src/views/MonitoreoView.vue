<template>
  <MainLayout>
    <div class="log-llamadas-container">

      <!-- Encabezado y filtros -->
      <div class="page-header">
        <h1 class="page-title">Log de Llamadas</h1>
        <div class="filter-controls">
          <div class="date-filter">
            <label for="date-selector">Fecha:</label>
            <input 
              type="date" 
              id="date-selector" 
              v-model="selectedDate" 
              :max="maxDate" 
              @change="fetchLlamadas"
            />
          </div>
          <div class="status-filter">
            <label for="status-selector">Estado:</label>
            <select id="status-selector" v-model="selectedStatus" @change="filterLlamadas">
              <option value="todos">Todos</option>
              <option value="planificada">Planificadas</option>
              <option value="en-curso">En curso</option>
              <option value="finalizada">Finalizadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
          <button class="refresh-button" @click="fetchLlamadas">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Actualizar
          </button>
        </div>
      </div>
      
      <!-- Estadísticas rápidas -->
      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.enCurso }}</div>
          <div class="stat-label">En curso</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.planificadas }}</div>
          <div class="stat-label">Planificadas</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.finalizadas }}</div>
          <div class="stat-label">Finalizadas</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.canceladas }}</div>
          <div class="stat-label">Canceladas</div>
        </div>
      </div>

      <!-- Tabla de llamadas -->
      <div class="tabla-container">
        <table class="tabla-llamadas">
          <thead>
            <tr>
              <th @click="ordenarPor('hora')" class="sortable">
                Hora
                <span v-if="sortField === 'hora'" class="sort-indicator">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th @click="ordenarPor('cliente')" class="sortable">
                Cliente
                <span v-if="sortField === 'cliente'" class="sort-indicator">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th @click="ordenarPor('numero')" class="sortable">
                Número
                <span v-if="sortField === 'numero'" class="sort-indicator">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th @click="ordenarPor('agente')" class="sortable">
                Agente
                <span v-if="sortField === 'agente'" class="sort-indicator">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th @click="ordenarPor('estado')" class="sortable">
                Estado
                <span v-if="sortField === 'estado'" class="sort-indicator">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th @click="ordenarPor('duracion')" class="sortable">
                Duración
                <span v-if="sortField === 'duracion'" class="sort-indicator">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="llamadasPaginadas.length === 0">
              <td colspan="7" class="empty-message">
                No hay llamadas para mostrar con los filtros seleccionados.
              </td>
            </tr>
            <tr v-for="llamada in llamadasPaginadas" :key="llamada.id" :class="{ 'highlighted': llamada.estado === 'en-curso' }">
              <td>{{ formatHora(llamada.hora) }}</td>
              <td>{{ llamada.cliente }}</td>
              <td>{{ formatNumero(llamada.numero) }}</td>
              <td>{{ llamada.agente }}</td>
              <td>
                <span class="estado-badge" :class="'estado-' + llamada.estado">
                  {{ getEstadoText(llamada.estado) }}
                </span>
              </td>
              <td>{{ llamada.duracion || '-' }}</td>
              <td class="actions-cell">
                <button v-if="llamada.estado === 'planificada'" 
                        class="action-button start"
                        @click="iniciarLlamada(llamada.id)">
                  Iniciar
                </button>
                <button v-if="llamada.estado === 'en-curso'" 
                        class="action-button end"
                        @click="finalizarLlamada(llamada.id)">
                  Finalizar
                </button>
                <button v-if="llamada.estado === 'planificada'" 
                        class="action-button cancel"
                        @click="cancelarLlamada(llamada.id)">
                  Cancelar
                </button>
                <button v-if="llamada.estado === 'finalizada'" 
                        class="action-button view"
                        @click="verDetalle(llamada.id)">
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          Anterior
        </button>
        <div class="page-numbers">
          <button 
            v-for="page in totalPages" 
            :key="page" 
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
          Siguiente
        </button>
      </div>

    </div>
  </MainLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';

export default {
  name: 'MonitoreoView',
  components: {
    MainLayout
  },
  
  setup() {
    // Estados para filtros y ordenamiento
    const selectedDate = ref(new Date().toISOString().split('T')[0]); // Hoy en formato YYYY-MM-DD
    const maxDate = new Date().toISOString().split('T')[0]; // La fecha máxima es hoy
    const selectedStatus = ref('todos');
    const sortField = ref('hora');
    const sortDirection = ref('asc');
    
    // Estados para paginación
    const currentPage = ref(1);
    const itemsPerPage = 10; // Establecido a 10 elementos por página
    
    // Datos de llamadas (simulados)
    const llamadas = ref([]);
    
    // Estadísticas
    const stats = computed(() => {
      return {
        total: llamadas.value.length,
        enCurso: llamadas.value.filter(l => l.estado === 'en-curso').length,
        planificadas: llamadas.value.filter(l => l.estado === 'planificada').length,
        finalizadas: llamadas.value.filter(l => l.estado === 'finalizada').length,
        canceladas: llamadas.value.filter(l => l.estado === 'cancelada').length
      };
    });
    
    // Llamadas filtradas según criterios
    const llamadasFiltradas = computed(() => {
      let resultado = [...llamadas.value];
      
      // Aplicar filtro por estado
      if (selectedStatus.value !== 'todos') {
        resultado = resultado.filter(llamada => llamada.estado === selectedStatus.value);
      }
      
      // Aplicar ordenamiento
      resultado.sort((a, b) => {
        let valorA = a[sortField.value];
        let valorB = b[sortField.value];
        
        // Manejar casos especiales para ordenamiento
        if (sortField.value === 'hora') {
          valorA = new Date('1970/01/01 ' + a.hora).getTime();
          valorB = new Date('1970/01/01 ' + b.hora).getTime();
        }
        
        if (sortDirection.value === 'asc') {
          return valorA > valorB ? 1 : -1;
        } else {
          return valorA < valorB ? 1 : -1;
        }
      });
      
      return resultado;
    });
    
    // Total de páginas para paginación
    const totalPages = computed(() => {
      return Math.ceil(llamadasFiltradas.value.length / itemsPerPage);
    });
    
    // Llamadas paginadas
    const llamadasPaginadas = computed(() => {
      const startIdx = (currentPage.value - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      return llamadasFiltradas.value.slice(startIdx, endIdx);
    });
    
    // Método para simular carga de datos
    const fetchLlamadas = () => {
      // Simular una carga desde API
      setTimeout(() => {
        // Crear 21 registros exactamente
        const datosDePrueba = generarExactamente21Registros(selectedDate.value);
        llamadas.value = datosDePrueba;
        currentPage.value = 1; // Resetear a primera página
      }, 300);
    };
    
    // Generar exactamente 21 registros
    const generarExactamente21Registros = (fecha) => {
      const resultado = [];
      
      const estados = ['planificada', 'en-curso', 'finalizada', 'cancelada'];
      const clientes = [
        'Juan Pérez - Comercial ABC', 
        'María López - Distribuidora XYZ', 
        'Carlos Rodríguez - Empresa 123',
        'Ana Martínez - Tienda El Sol',
        'Roberto Sánchez - Servicios Técnicos',
        'Lucía García - Importadora Luna'
      ];
      const agentes = ['Agente 1', 'Agente 2', 'Agente 3', 'Agente 4'];
      
      // Distribuir estados para tener una mezcla realista
      // 21 registros: 8 planificadas, 5 en curso, 5 finalizadas, 3 canceladas
      const distribucionEstados = {
        'planificada': 8,
        'en-curso': 5,
        'finalizada': 5,
        'cancelada': 3
      };
      
      let idCounter = 1;
      
      // Generar registros para cada estado según la distribución
      for (const estado of estados) {
        const cantidad = distribucionEstados[estado];
        
        for (let i = 0; i < cantidad; i++) {
          // Generar hora aleatoria entre 8:00 y 19:00
          const hora = Math.floor(Math.random() * 11) + 8;
          const minutos = Math.floor(Math.random() * 60);
          const horaFormateada = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
          
          // Generar duración solo para llamadas finalizadas
          let duracion = null;
          if (estado === 'finalizada') {
            const minutosDuracion = Math.floor(Math.random() * 15) + 1;
            duracion = `${minutosDuracion} min`;
          }
          
          // Crear el objeto de llamada
          resultado.push({
            id: idCounter++,
            hora: horaFormateada,
            cliente: clientes[Math.floor(Math.random() * clientes.length)],
            numero: `+${Math.floor(Math.random() * 90000000) + 10000000}`,
            agente: agentes[Math.floor(Math.random() * agentes.length)],
            estado: estado,
            duracion: duracion,
            fecha: fecha
          });
        }
      }
      
      // Ordenar por hora para mayor realismo
      return resultado.sort((a, b) => {
        return new Date('1970/01/01 ' + a.hora) - new Date('1970/01/01 ' + b.hora);
      });
    };
    
    // Filtrar llamadas
    const filterLlamadas = () => {
      currentPage.value = 1; // Resetear a primera página
    };
    
    // Ordenar por campo
    const ordenarPor = (campo) => {
      if (sortField.value === campo) {
        // Si ya estamos ordenando por este campo, cambiar dirección
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        // Nuevo campo de ordenamiento
        sortField.value = campo;
        sortDirection.value = 'asc';
      }
    };
    
    // Navegación de páginas
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };
    
    // Formatear número de teléfono
    const formatNumero = (numero) => {
      if (!numero) return '';
      
      // Formato básico para números de teléfono
      return numero.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    };
    
    // Formatear hora (asegurar formato 24h)
    const formatHora = (hora) => {
      if (!hora) return '';
      return hora;
    };
    
    // Obtener texto de estado
    const getEstadoText = (estado) => {
      const estadosTexto = {
        'planificada': 'Planificada',
        'en-curso': 'En curso',
        'finalizada': 'Finalizada',
        'cancelada': 'Cancelada'
      };
      
      return estadosTexto[estado] || estado;
    };
    
    // Acciones de botones
    const iniciarLlamada = (id) => {
      const index = llamadas.value.findIndex(l => l.id === id);
      if (index !== -1) {
        llamadas.value[index].estado = 'en-curso';
      }
    };
    
    const finalizarLlamada = (id) => {
      const index = llamadas.value.findIndex(l => l.id === id);
      if (index !== -1) {
        llamadas.value[index].estado = 'finalizada';
        llamadas.value[index].duracion = `${Math.floor(Math.random() * 10) + 1} min`;
      }
    };
    
    const cancelarLlamada = (id) => {
      const index = llamadas.value.findIndex(l => l.id === id);
      if (index !== -1) {
        llamadas.value[index].estado = 'cancelada';
      }
    };
    
    const verDetalle = (id) => {
      alert(`Ver detalles de la llamada #${id}`);
      // Aquí podrías abrir un modal o navegar a una página de detalles
    };
    
    // Cargar datos iniciales
    onMounted(() => {
      fetchLlamadas();
    });
    
    return {
      selectedDate,
      maxDate,
      selectedStatus,
      sortField,
      sortDirection,
      currentPage,
      totalPages,
      llamadas,
      llamadasFiltradas,
      llamadasPaginadas,
      stats,
      fetchLlamadas,
      filterLlamadas,
      ordenarPor,
      goToPage,
      formatNumero,
      formatHora,
      getEstadoText,
      iniciarLlamada,
      finalizarLlamada,
      cancelarLlamada,
      verDetalle
    };
  }
}
</script>

<style scoped>
/* Contenedor principal */
.log-llamadas-container {
  padding: 0;
  position: relative;
  background-color: #f5f7fb;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.filter-controls {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.date-filter, .status-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-filter label, .status-filter label {
  font-weight: 500;
  color: #555;
}

.date-filter input, .status-filter select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background-color: #161840;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-button:hover {
  background-color: #125773;
}

/* Barra de estadísticas */
.stats-bar {
  display: flex;
  justify-content: space-around;
  background-color: white;
  padding: 15px;
  margin: 0 24px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;
}

/* Contenedor de la tabla */
.tabla-container {
  margin: 0 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tabla-llamadas {
  width: 100%;
  border-collapse: collapse;
}

.tabla-llamadas th, .tabla-llamadas td {
  padding: 12px 15px;
  text-align: left;
}

.tabla-llamadas th {
  background-color: #f5f7fb;
  color: #333;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
}

.tabla-llamadas tr {
  border-bottom: 1px solid #f0f0f0;
}

.tabla-llamadas tr:last-child {
  border-bottom: none;
}

.tabla-llamadas tr.highlighted {
  background-color: #f8f4ff;
}

.sortable {
  cursor: pointer;
  position: relative;
}

.sortable:hover {
  background-color: #eef0f5;
}

.sort-indicator {
  margin-left: 5px;
  display: inline-block;
}

.empty-message {
  text-align: center;
  padding: 40px 0;
  color: #777;
  font-style: italic;
}

/* Estilos para badges de estado */
.estado-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.estado-planificada {
  background-color: #e3f2fd;
  color: #1976d2;
}

.estado-en-curso {
  background-color: #e8f5e9;
  color: #388e3c;
}

.estado-finalizada {
  background-color: #e1f5fe;
  color: #0288d1;
}

.estado-cancelada {
  background-color: #ffebee;
  color: #d32f2f;
}

/* Botones de acción */
.actions-cell {
  white-space: nowrap;
}

.action-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 5px;
}

.action-button.start {
  background-color: #4caf50;
  color: white;
}

.action-button.start:hover {
  background-color: #388e3c;
}

.action-button.end {
  background-color: #ff9800;
  color: white;
}

.action-button.end:hover {
  background-color: #f57c00;
}

.action-button.cancel {
  background-color: #f44336;
  color: white;
}

.action-button.cancel:hover {
  background-color: #d32f2f;
}

.action-button.view {
  background-color: #2196f3;
  color: white;
}

.action-button.view:hover {
  background-color: #1976d2;
}

/* Paginación mejorada */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
  padding: 15px;
}

.pagination button {
  padding: 8px 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 40px;
}

.pagination button:hover:not(:disabled) {
  background-color: #125773;
  color: white;
  border-color: #125773;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-numbers button {
  padding: 5px 10px;
}

.page-numbers button.active {
  background-color: #161840;
  color: white;
  border-color: #161840;
}

/* Media queries para responsividad */
@media (max-width: 768px) {
  .top-bar {
    padding: 0 15px;
  }
  
  .colibri-icon {
    width: 50px;
    height: 30px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .stats-bar {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .stat-item {
    flex: 1;
    min-width: 70px;
  }
  
  .tabla-container {
    margin: 0 15px;
    overflow-x: auto;
  }
  
  .tabla-llamadas {
    min-width: 600px; /* Para asegurar que no se corte en móviles */
  }
}
</style>