<template>
  <div class="routine">
    <div id="file-upload">
      <input
        type="file"
        @change="handleFileChange"
      >
      <button @click="saveFile">
        Save
      </button>
    </div>
    <div class="content">
      <file-system
        :roots="'gcodes'"
        name="routine"
        bulk-actions
        max-height="600"
        :filter-files="filterCsvFiles"
        @view-csv="handleViewCsv"
      />
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>PICK</th>
              <th>PLACE</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in csvData"
              :key="index"
            >
              <td>{{ row.pick }}</td>
              <td>{{ row.place }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import FileSystem from '@/components/widgets/filesystem/FileSystem.vue'
import FilesMixin from '@/mixins/files'
import Papa from 'papaparse'

@Component({
  components: {
    FileSystem
  }
})
export default class Routine extends Mixins(FilesMixin) {
  selectedFile: File | null = null
  csvData: Array<{ pick: string, place: string }> = []

  handleFileChange (event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]
    }
  }

  async saveFile () {
    if (this.selectedFile) {
      const path = '' // Path relativo dentro del directorio `gcodes`
      const root = 'gcodes' // Directorio raíz donde se almacenan los archivos G-code

      try {
        await this.uploadFile(this.selectedFile, path, root, false)
        alert('File saved successfully!')
        await this.loadCsv(this.selectedFile)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('Failed to save the file.')
      }
    }
  }

  async loadCsv (csv: File) {
    return new Promise((resolve, reject) => {
      Papa.parse(csv, {
        header: true,
        dynamicTyping: false,
        complete: (result) => {
          this.csvData = result.data as Array<{ pick: string, place: string }>
          resolve(result.data)
        },
        error: (error) => {
          console.error('Error parsing CSV:', error)
          reject(error)
        }
      })
    })
  }

  async handleViewCsv (csvFile: File) {
    await this.loadCsv(csvFile)
  }

  filterCsvFiles (file: File) {
    return file.name.endsWith('.csv')
  }
}
</script>

<style scoped>
.routine {
  text-align: center;
  max-width: 1200px; /* Ajusta el tamaño según tus necesidades */
  margin: 0 auto;
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
#file-upload {
  margin-top: 20px;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 100px;
  margin-top: 90px;
  margin-bottom: 50px;
}
.table-container {
  flex: 1;
  max-width: 50%; /* Ajusta el tamaño según tus necesidades */
  margin-right: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #858585;
}
</style>
