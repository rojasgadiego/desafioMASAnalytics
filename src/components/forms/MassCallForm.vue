<template>
  <form @submit.prevent="$emit('submit')">
    <div class="form-group">
      <label for="campana">Llamada Masiva</label>
      <input 
        type="text" 
        id="campana" 
        :value="modelValue.nombre"
        @input="updateField('nombre', $event.target.value)"
        class="form-control"
      >
    </div>
    
    <div class="form-group">
      <label for="archivo">Archivo de configuración para múltiples llamadas</label>
      <input 
        type="file" 
        id="archivo" 
        @change="handleFileUpload"
        class="form-control file-input"
        accept=".csv,.xlsx,.xls"
      >
      <small class="file-help">Formatos aceptados: CSV, Excel (.xlsx, .xls)</small>
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
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Guardar el archivo en el modelo
        this.updateField('archivo', file);
        
        // También podemos guardar el nombre del archivo si es necesario
        this.updateField('nombreArchivo', file.name);
      }
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

.file-input {
  padding: 0.5rem;
}

.file-help {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.85rem;
}
</style>