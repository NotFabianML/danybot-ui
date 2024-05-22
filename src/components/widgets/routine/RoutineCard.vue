<!-- RoutineCard.vue -->
<template>
  <div class="routine-card">
    <collapsable-card
      :title="$t('app.printer.title.routine')"
      icon="$list"
      card-classes="d-flex flex-column"
      content-classes="flex-grow-1 flow-shrink-0"
    >
      <routine />
    </collapsable-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Routine from './Routine.vue'
@Component({
  components: {
    Routine
  }
})
export default class RoutineCard extends Vue {}
</script>

<style scoped>
.routine-card {
  margin-top: 20px;
}
</style>
