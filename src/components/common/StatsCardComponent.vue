<template>
  <div class="stats-card">
    <h3>{{ title }}</h3>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-footer" v-if="hasTrend || periodLabel">
      <span v-if="hasTrend" :class="['stat-trend', trendClass]">{{ trendValue }} </span>
      <span v-if="periodLabel" class="stat-period">{{ periodLabel }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    trendValue: {
      type: String,
      default: ''
    },
    trendDirection: {
      type: String,
      default: '',
      validator: (value) => ['positive', 'negative', ''].includes(value)
    },
    periodLabel: {
      type: String,
      default: ''
    }
  },
  computed: {
    hasTrend() {
      return this.trendValue !== '';
    },
    trendClass() {
      return this.trendDirection;
    }
  }
}
</script>

<style scoped>
.stats-card {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.stats-card h3 {
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

@media (max-width: 1366px) {
  .stat-value {
    font-size: 1.3rem;
  }
}
</style>