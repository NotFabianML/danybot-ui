<!-- CalculatorCard.vue -->
<template>
  <div class="calculator-card">
    <collapsable-card
      title="Calculator"
      icon="calculator"
      card-classes="d-flex flex-column"
      content-classes="flex-grow-1 flow-shrink-0"
    >
      <calculator />
    </collapsable-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Calculator from './Calculator.vue'
@Component({
  components: {
    Calculator
  }
})
export default class CalculatorCard extends Vue {}
</script>

<style scoped>
.calculator-card {
  margin-top: 20px;
}
</style>
