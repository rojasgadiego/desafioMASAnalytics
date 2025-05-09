<template>
  <MainLayout>
    <div class="dashboard-content">
      <div class="stats-container">
        <div class="stat-card">
          <h3>Cantidad de llamadas realizadas</h3>
          <div class="stat-value">12</div>
        </div>

        <div class="stat-card">
          <h3>Tasa de contacto</h3>
          <div class="stat-value">20%</div>
          <div class="stat-footer">
            <span class="stat-trend positive">+8% </span>
            <span class="stat-period">vs mes anterior</span>
          </div>
        </div>

        <div class="stat-card">
          <h3>Promedio de duración</h3>
          <div class="stat-value">3:30</div>
          <div class="stat-footer">
          </div>
        </div>

        <div class="stat-card">
          <h3>Tasa de éxito</h3>
          <div class="stat-value">86%</div>
          <div class="stat-footer">
            <span class="stat-trend positive">+24% </span>
            <span class="stat-period">vs mes anterior</span>
          </div>
        </div>
      </div>

      <!-- <div class="dashboard-grid">
        <div class="grid-item chart-container">
          <h2>Usabilidad</h2>
          <div class="chart-placeholder">
            <div class="fake-chart"></div>
          </div>
        </div>

        <div class="grid-item recent-activity">
          <h2>Actividad Reciente</h2>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon success">✓</div>
              <div class="activity-content">
                <div class="activity-title">Pedido completado #2458</div>
                <div class="activity-time">Hace 10 minutos</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon warning">!</div>
              <div class="activity-content">
                <div class="activity-title">Inventario bajo para producto X</div>
                <div class="activity-time">Hace 30 minutos</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon info">i</div>
              <div class="activity-content">
                <div class="activity-title">Nuevo usuario registrado</div>
                <div class="activity-time">Hace 1 hora</div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-item tasks-panel">
          <h2>Tareas Pendientes</h2>
          <div class="tasks-list">
            <div class="task-item">
              <input type="checkbox" id="task1" />
              <label for="task1">Revisar nuevos pedidos</label>
            </div>
            <div class="task-item">
              <input type="checkbox" id="task2" />
              <label for="task2">Actualizar inventario</label>
            </div>
            <div class="task-item">
              <input type="checkbox" id="task3" />
              <label for="task3">Contactar proveedor XYZ</label>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </MainLayout>
</template>

<script>
import { defineComponent } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    MainLayout
  }
})
</script>

<style scoped>
.dashboard-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 15px;
  margin-top: 5px;
}

.stat-card {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.stat-footer {
  font-size: 0.75rem;
  color: #777;
  margin-top: auto;
}

.stat-trend {
  font-weight: 600;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #f44336;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
  flex: 1;
  min-height: 0; /* Importante para que el contenedor flex respete overflow */
}

.grid-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.grid-item h2 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #333;
}

.chart-container {
  grid-column: 1;
  grid-row: span 2;
}

.chart-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.fake-chart {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #f5f7fb 0%, #e9ecef 50%, #f5f7fb 100%);
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes pulse {
  0% { background-position: right center; }
  100% { background-position: left center; }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  flex: 1;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.activity-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.activity-icon.success {
  background-color: #e8f5e9;
  color: #4caf50;
}

.activity-icon.warning {
  background-color: #fff8e1;
  color: #ff9800;
}

.activity-icon.info {
  background-color: #e3f2fd;
  color: #2196f3;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #333;
  font-size: 0.85rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #888;
  margin-top: 3px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  flex: 1;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.task-item label {
  font-size: 0.85rem;
  color: #444;
  cursor: pointer;
}

/* Media queries para distintos tamaños de pantalla */
@media (max-width: 1366px) {
  .stats-container {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .stat-value {
    font-size: 1.3rem;
  }
}

@media (max-width: 1200px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-grid {
    grid-template-columns: 2fr 1fr;
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    grid-row: auto;
  }
}
</style>