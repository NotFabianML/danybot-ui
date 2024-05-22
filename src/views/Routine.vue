<template>
  <v-row :dense="$vuetify.breakpoint.smAndDown">
    <v-col cols="12">
      <routine-card fullscreen />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import ConsoleCard from '@/components/widgets/console/ConsoleCard.vue'
import RoutineCard from '@/components/widgets/routine/RoutineCard.vue'
@Component({
  components: {
    RoutineCard
  }
})
export default class Routine extends Vue {
}
</script>
