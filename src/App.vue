<template>
  <v-app>
    <v-content>
      <Calculator/>
    </v-content>
  </v-app>
</template>

<script>
import Calculator from './components/Calculator'

export default {
  name: 'App',
  components: {
    Calculator
  }
}
</script>
