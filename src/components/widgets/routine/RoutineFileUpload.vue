<template>
  <div id="file-upload">
    <input
      type="file"
      accept=".csv"
      @change="onFileChange"
    >
    <button @click="saveFile">
      Save
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class RoutineFileUpload extends Vue {
  onFileChange (event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      this.$emit('file-selected', target.files[0])
    }
  }

  saveFile () {
    this.$emit('save-file')
  }
}
</script>

<style scoped>
#file-upload {
  margin-top: 20px;
}
input[type="file"] {
  padding: 8px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #000;
  background-color: #bbb9b9;
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
</style>
