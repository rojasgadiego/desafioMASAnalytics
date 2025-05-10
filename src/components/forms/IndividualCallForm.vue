<template>
  <form @submit.prevent="$emit('submit')">
    <div class="form-group">
      <label for="cliente">Seleccionar Cliente</label>
      <select 
        id="cliente" 
        :value="modelValue.cliente"
        @input="updateField('cliente', $event.target.value)"
        class="form-control"
      >
        <option value="" disabled selected>Seleccione un cliente</option>
        <option value="1">Juan Pérez - Empresa ABC</option>
        <option value="2">María López - Comercial XYZ</option>
        <option value="3">Carlos Rodríguez - Distribuidora 123</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="motivo">Motivo de la Llamada</label>
      <select 
        id="motivo" 
        :value="modelValue.motivo"
        @input="updateField('motivo', $event.target.value)"
        class="form-control"
      >
        <option value="" disabled selected>Seleccione un motivo</option>
        <option value="seguimiento">Seguimiento de venta</option>
        <option value="cobranza">Gestión de cobranza</option>
        <option value="soporte">Soporte técnico</option>
        <option value="otros">Otros</option>
      </select>
    </div>
    
    <div class="form-group" v-if="modelValue.motivo === 'otros'">
      <label for="otroMotivo">Especificar motivo</label>
      <input 
        type="text" 
        id="otroMotivo" 
        :value="modelValue.otroMotivo"
        @input="updateField('otroMotivo', $event.target.value)"
        class="form-control"
      >
    </div>
    
    <div class="form-group">
      <label for="notas">Notas previas</label>
      <textarea 
        id="notas" 
        :value="modelValue.notas"
        @input="updateField('notas', $event.target.value)"
        rows="3" 
        class="form-control"
      ></textarea>
    </div>
  </form>
</template>

<script>
export default {
  name: 'IndividualCallForm',
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