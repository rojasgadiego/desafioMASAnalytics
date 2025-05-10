<template>
  <form @submit.prevent="$emit('submit')">
    <div class="form-group">
      <label for="campana">Nombre de la Campaña</label>
      <input 
        type="text" 
        id="campana" 
        :value="modelValue.nombre"
        @input="updateField('nombre', $event.target.value)"
        class="form-control"
      >
    </div>
    
    <div class="form-group">
      <label for="segmento">Segmento de Clientes</label>
      <select 
        id="segmento" 
        :value="modelValue.segmento"
        @input="updateField('segmento', $event.target.value)"
        class="form-control"
      >
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
      <select 
        id="objetivo" 
        :value="modelValue.objetivo"
        @input="updateField('objetivo', $event.target.value)"
        class="form-control"
      >
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
      <textarea 
        id="script" 
        :value="modelValue.script"
        @input="updateField('script', $event.target.value)"
        rows="4" 
        class="form-control"
      ></textarea>
    </div>
    
    <div class="form-group">
      <label for="fechaInicio">Fecha de inicio</label>
      <input 
        type="date" 
        id="fechaInicio" 
        :value="modelValue.fechaInicio"
        @input="updateField('fechaInicio', $event.target.value)"
        class="form-control"
      >
    </div>
    
    <div class="form-group">
      <label for="prioridad">Prioridad</label>
      <select 
        id="prioridad" 
        :value="modelValue.prioridad"
        @input="updateField('prioridad', $event.target.value)"
        class="form-control"
      >
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>
    </div>
  </form>
</template>

<script>
export default {
  name: 'MassCallForm',
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'submit'],
  methods: {
    updateField(field, value) {
      // Crear una copia del objeto modelValue
      const updatedValue = { ...this.modelValue, [field]: value };
      // Emitir la actualización al componente padre
      this.$emit('update:modelValue', updatedValue);
    }
  }
}
</script>

<style scoped>
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
</style>