<!-- Calculator.vue -->
<template>
  <div class="calculator">
    <div>
      <input
        v-model.number="num1"
        type="number"
      >
      <input
        v-model.number="num2"
        type="number"
      >
    </div>
    <div>
      <button @click="add">
        Add
      </button>
      <button @click="subtract">
        Subtract
      </button>
      <button @click="divide">
        Divide
      </button>
      <button @click="multiply">
        Multiply
      </button>
    </div>
    <div
      v-if="result !== null"
      class="result"
    >
      Result: {{ result }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Calculator extends Vue {
  num1: number = 0
  num2: number = 0
  result: number | null = null
  add () {
    this.result = this.num1 + this.num2
  }

  subtract () {
    this.result = this.num1 - this.num2
  }

  divide () {
    if (this.num2 !== 0) {
      this.result = this.num1 / this.num2
    } else {
      alert('Cannot divide by zero!')
    }
  }

  multiply () {
    this.result = this.num1 * this.num2
  }
}
</script>

<style scoped>
.calculator {
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
}
input[type="number"] {
  padding: 8px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: white;
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
.result {
  margin-top: 10px;
  font-size: 1.2em;
  color: #555;
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>
