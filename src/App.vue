<template>
  <div id="app">
    <v-app>
      <div id="logotype">
        <v-layout align-center justify-center row fill-height>
          <img id="logo" alt="Remme logotype" src="./assets/logo.png">
        </v-layout> 
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
  max-width: 35%;
  margin-top: 10px;
}

#logotype {
  text-align: center;
  margin-bottom: 15px;
}
</style>
