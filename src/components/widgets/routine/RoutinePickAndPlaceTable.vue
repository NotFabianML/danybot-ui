<template>
  <div class="container">
    <div class="form-container">
      <div
        v-for="(row, index) in formData"
        :key="index"
        class="form-row"
      >
        <input
          v-model="row.pick"
          type="text"
          placeholder="Pick"
        >
        <input
          v-model="row.place"
          type="text"
          placeholder="Place"
        >
        <button
          class="remove-btn"
          @click="removeRow(index)"
        >
          Remove
        </button>
      </div>
    </div>
    <button
      class="add-btn"
      @click="addRow"
    >
      Agregar Valor
    </button>
    <button
      v-if="formData.length"
      class="generate-btn"
      @click="handleGenerateGCode"
    >
      Generate Gcode
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

@Component
export default class RoutinePickAndPlaceTable extends Vue {
  @Prop({ type: Array, default: () => [] }) csvData!: Array<{ pick: string, place: string }>

  formData: Array<{ pick: string, place: string }> = []

  @Watch('csvData', { immediate: true, deep: true })
  onCsvDataChange (newData: Array<{ pick: string, place: string }>) {
    this.formData = newData.map(row => ({ ...row }))
  }

  addRow () {
    this.formData.push({ pick: '', place: '' })
  }

  removeRow (index: number) {
    this.formData.splice(index, 1)
  }

  validateInput (value: string) {
    const regex = /^([1-9]|1[0-2])[A-Z]([1-9]|1[0-2])$/
    return regex.test(value)
  }

  handleGenerateGCode () {
    const isValid = this.formData.every(row => this.validateInput(row.pick) && this.validateInput(row.place))

    if (isValid) {
      this.$emit('generate-gcode', this.formData)
    } else {
      alert('Please fill in all fields before generating Gcode.')
    }
  }
}
</script>

<style scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 20px;
}
.form-container {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
}
.form-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}
input[type="text"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  color: #fff;
}
button {
  padding: 8px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.remove-btn {
  background-color: #dc3545;
}
.remove-btn:hover {
  background-color: #c82333;
}
.add-btn, .generate-btn {
  align-self: flex-start;
}
</style>
