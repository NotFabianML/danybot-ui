<template>
  <div class="routine">
    <div id="file-upload">
      <input
        type="file"
        accept=".csv"
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
      <div class="right-container">
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
        <button
          v-if="csvData.length"
          @click="generateGCode"
        >
          Generate Gcode
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import FileSystem from '@/components/widgets/filesystem/FileSystem.vue'
import FilesMixin from '@/mixins/files'
import Papa from 'papaparse'
import { DanyBotAPI } from '@/api/DanyBotAPI'

@Component({
  components: {
    FileSystem
  }
})
export default class Routine extends Mixins(FilesMixin) {
  selectedFile: File | null = null
  csvData: Array<{ pick: string, place: string }> = []
  jsonData: string | null = null

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

  async generateGCode () {
    if (this.csvData.length) {
      try {
        // Obtener datos iniciales desde la API
        const apiData = await DanyBotAPI.getAll()

        // Reemplazar pick_and_place_list con los datos de csvData
        apiData.pick_and_place_list = this.csvData.map(row => [row.pick, row.place])

        // Generar el G-code usando los datos actualizados
        const response = await DanyBotAPI.createGcode(apiData)
        if (response) {
          const date = new Date()
          const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`
          const filename = `routine_${timestamp}.gcode`

          const blob = new Blob([response.gcode], { type: 'text/plain' })
          this.selectedFile = new File([blob], filename, { type: 'text/plain' })

          // Subir el archivo G-code generado
          await this.uploadFile(this.selectedFile, '', 'gcodes', false)
          alert('File saved successfully!')
        } else {
          console.error('No data received from API')
          alert('Failed to generate and upload the G-code.')
        }
      } catch (error) {
        console.error('Error generating G-code:', error)
        alert('Failed to generate and upload the G-code.')
      }
    } else {
      alert('No CSV data to generate G-code.')
    }
  }
}
</script>

<style scoped>
.routine {
  text-align: center;
  max-width: 1200px;
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
p {
  margin: 10px 0;
  color: #fff;
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
.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;;
  gap: 20px;
}
.table-container {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
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
