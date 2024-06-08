<template>
  <div class="routine">
    <RoutineFileUpload
      @file-selected="handleFileChange"
      @save-file="saveFile"
    />
    <div class="content">
      <file-system
        :roots="'gcodes'"
        name="routine"
        bulk-actions
        max-height="600"
        :filter-files="filterCsvFiles"
        @view-csv="handleViewCsv"
      />
      <RoutinePickAndPlaceTable
        :csv-data="csvData"
        @generate-gcode="handleGenerateGCode"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import FileSystem from '@/components/widgets/filesystem/FileSystem.vue'
import FilesMixin from '@/mixins/files'
import RoutineMixin from './RoutineMixin'
import RoutineFileUpload from './RoutineFileUpload.vue'
import RoutinePickAndPlaceTable from './RoutinePickAndPlaceTable.vue'
import Papa from 'papaparse'

@Component({
  components: {
    FileSystem,
    RoutineFileUpload,
    RoutinePickAndPlaceTable
  }
})
export default class Routine extends Mixins(FilesMixin, RoutineMixin) {
  csvData: Array<{ pick: string, place: string }> = []

  async handleViewCsv (csvFile: File) {
    try {
      const data = await this.loadCsv(csvFile)
      if (Array.isArray(data) && data.every(row => 'pick' in row && 'place' in row)) {
        this.csvData = data as Array<{ pick: string, place: string }>
      } else {
        throw new Error('Invalid CSV format')
      }
    } catch (error) {
      console.error('Error loading CSV:', error)
      alert('Failed to load CSV.')
    }
  }

  async handleGenerateGCode (formData: Array<{ pick: string, place: string }>) {
    // Convert form data to CSV
    const csv = Papa.unparse(formData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const file = new File([blob], 'routine.csv', { type: 'text/csv' })

    // Upload CSV file
    try {
      const path = ''
      const root = 'gcodes'
      await this.uploadFile(file, path, root, false)
      this.selectedFile = file
      await this.loadCsv(this.selectedFile)

      // Generate G-code
      await this.generateGCode()
    } catch (error) {
      console.error('Error generating G-code:', error)
      alert('Failed to generate G-code.')
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
.content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 100px;
  margin-top: 90px;
  margin-bottom: 50px;
}
</style>
