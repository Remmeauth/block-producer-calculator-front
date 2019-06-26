<template>
  <div id="app">
    <v-app>
      <div id="logotype">
        <img id="logo" alt="Remme logotype" src="./assets/logo.png">
        <!-- <img id="logo" alt="Remme logotype" src="./assets/remme-logo-fullcolor.png"> -->
      </div>
      <v-content>
        <Calculator/>
      </v-content>
    </v-app>
  </div>
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-color: white;
}

#logo {
  width: 200px;
  height: 200px;
}

#logotype {
  height: 190px;
  text-align: center;
}
</style>
