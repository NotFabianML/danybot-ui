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
      <button @click="viewJSON">
        View JSON
      </button>
      <p v-if="jsonData">
        JSON data: "{{ jsonData }}"

      </p>
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
      <button
        v-if="csvData.length"
        @click="generateGCode"
      >
        Generate GCode
      </button>
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

  async viewJSON () {
    try {
      const data = await DanyBotAPI.getAll()
      console.log(data)
      this.jsonData = JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error fetching JSON:', error)
    }
  }

  async generateGCode () {
    if (this.csvData.length) {
      const jsonPayload = {
        deck: [
          { stand_location_X: 12.07, stand_location_Y: 125.81, stand_number: 1 },
          { stand_location_X: 153, stand_location_Y: 125.81, stand_number: 2 },
          { stand_location_X: 294.8, stand_location_Y: 125.7, stand_number: 3 },
          { stand_location_X: 436.4, stand_location_Y: 125.81, stand_number: 4 },
          { stand_location_X: 12.07, stand_location_Y: 272, stand_number: 5 },
          { stand_location_X: 153.5, stand_location_Y: 272, stand_number: 6 },
          { stand_location_X: 295.5, stand_location_Y: 272, stand_number: 7 },
          { stand_location_X: 436.4, stand_location_Y: 272, stand_number: 8 },
          { stand_location_X: 12.07, stand_location_Y: 418.8, stand_number: 9 },
          { stand_location_X: 154.5, stand_location_Y: 418.8, stand_number: 10 },
          { stand_location_X: 295.5, stand_location_Y: 418.8, stand_number: 11 },
          { stand_location_X: 436.4, stand_location_Y: 418.8, stand_number: 12 }
        ],
        pick_and_place_list: this.csvData.map(row => [row.pick, row.place]),
        pref_selected_vial: 2,
        racks: [
          {
            close_piker: 0,
            empty_secure_height: 140,
            holding_secure_height: 115,
            name: 'Vial 1ml 96',
            open_piker: 0.4,
            picking_height: 174,
            placing_height: 160,
            rack_dimensionX: 8,
            rack_dimensionY: 12,
            rack_id: 1,
            vial_diameter: 9.34,
            xy_empyt_speed: 10000,
            xy_holding_speed: 10000,
            z_empyt_speed: 2250,
            z_holding_speed: 2250,
            z_picking_speed: 300
          },
          {
            close_piker: 0,
            dimensionY: 6,
            empty_secure_height: 160,
            holding_secure_height: 100,
            name: 'Vial 5ml 48',
            open_piker: 0.4,
            picking_height: 202,
            placing_height: 202,
            rack_dimensionX: 8,
            rack_id: 2,
            vial_diameter: 9,
            xy_empyt_speed: 50000,
            xy_holding_speed: 10000,
            z_empyt_speed: 2250,
            z_holding_speed: 2250,
            z_picking_speed: 300
          }
        ]
      }

      try {
        const response = await DanyBotAPI.createGCode(jsonPayload)
        console.log('GCode generated:', response)
        alert('GCode generated successfully!')
      } catch (error) {
        console.error('Error generating GCode:', error)
        alert('Failed to generate GCode.')
      }
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
.table-container {
  flex: 1;
  max-width: 50%;
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
