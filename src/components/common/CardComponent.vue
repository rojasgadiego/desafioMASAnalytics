<template>
  <div class="call-card">
    <div class="icon-circle">
      <div class="icon">
        <slot name="icon"></slot>
      </div>
    </div>
    <h2 class="card-title">{{ title }}</h2>
    <p class="card-description">{{ description }}</p>
    <button class="action-button" @click="$emit('action-click')">
      {{ actionText }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'CallCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      required: true
    }
  },
  emits: ['action-click']
}
</script>

<style scoped>
.call-card {
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
  width: 250px;
  flex: none;
}

.call-card:hover {
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
  margin-top: -60px;
}

.icon {
  color: #125773;
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
  background-color: #161840;
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
  background-color: #125773;
}

@media (max-width: 768px) {
  .call-card {
    width: 100%;
    max-width: 350px;
  }
}
</style>