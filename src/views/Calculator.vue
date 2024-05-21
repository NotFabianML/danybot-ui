<template>
  <v-row :dense="$vuetify.breakpoint.smAndDown">
    <v-col cols="12">
      <calculator-card fullscreen />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import ConsoleCard from '@/components/widgets/console/ConsoleCard.vue'
import CalculatorCard from '@/components/widgets/calculator/CalculatorCard.vue'
@Component({
  components: {
    CalculatorCard
  }
})
export default class Calculator extends Vue {
}
</script>
