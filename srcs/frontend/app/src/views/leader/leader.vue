<template>
  <div class="flex flex-col h-screen justify-between">
    <header class="h10">
      <header-web />
    </header>
    <h1 class="py-5 text-center text-3xl font-extrabold text-blue-500">LEADER BOARD</h1>
    <main class="mb-auto flex flex-col overflow-y-auto">
      <div>
          <Leader_table/>
      </div>
    </main>
    <footer class="sticky top-[100vh]">
      <footer-web/>
    </footer>
    </div>
  </template>
  
  <script>
  //https://www.w3schools.com/graphics/svg_examples.asp
  import headerWeb from '../../components/headers/header-web.vue'
  import footerWeb from '../../components/headers/footer-web.vue'
  import Leader_table from './leader_table.vue';

  export default {
    name: 'LeaderSection',
    props: {
    },
    components: {
      headerWeb,
      Leader_table,
      footerWeb
    },
    data() {
        return {
        } 
    },  
    setup() {


    },
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>