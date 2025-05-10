<template>
  <MainLayout>
    <div class="dashboard-content">
      <div class="stats-container">
        <stats-card
          title="Cantidad de llamadas realizadas"
          value="12"
        />

        <stats-card
          title="Tasa de contacto"
          value="20%"
          trend-value="+8%"
          trend-direction="positive"
          period-label="vs mes anterior"
        />

        <stats-card
          title="Promedio de duración"
          value="3:30"
        />

        <stats-card
          title="Tasa de éxito"
          value="86%"
          trend-value="+24%"
          trend-direction="positive"
          period-label="vs mes anterior"
        />
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { defineComponent } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import StatsCard from '@/components/common/StatsCardComponent.vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    MainLayout,
    StatsCard
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

@media (max-width: 1366px) {
  .stats-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>