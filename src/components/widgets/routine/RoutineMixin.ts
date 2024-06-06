import { Mixins, Component } from 'vue-property-decorator'
import Papa from 'papaparse'
import { DanyBotAPI } from '@/api/DanyBotAPI'
import FilesMixin from '@/mixins/files'

@Component
export default class RoutineMixin extends Mixins(FilesMixin) {
  selectedFile: File | null = null
  csvData: Array<{ pick: string, place: string }> = []

  getTimestamp () {
    const date = new Date()
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`
  }

  handleFileChange (file: File) {
    this.selectedFile = file
  }

  async saveFile () {
    if (this.selectedFile) {
      const path = ''
      const root = 'gcodes'

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
        const apiData = await DanyBotAPI.getAll()
        apiData.pick_and_place_list = this.csvData.map(row => [row.pick, row.place])

        const response = await DanyBotAPI.createGcode(apiData)
        if (response) {
          const filename = `routine_${this.getTimestamp()}.gcode`

          const blob = new Blob([response.gcode], { type: 'text/plain' })
          this.selectedFile = new File([blob], filename, { type: 'text/plain' })

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
