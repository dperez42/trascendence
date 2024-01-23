<template>
  <div class="flex flex-col h-screen justify-between">
    <header class="h10">
      <header-web />
    </header>
    <h1 class="py-5 text-center text-3xl font-extrabold text-blue-500">USERS</h1>
    <main class="mb-auto flex flex-col overflow-y-auto">
      <div>
          <users_table/>
      </div>
    </main>
    <footer class="sticky top-[100vh]">
      <footer-web/>
    </footer>
    </div>
  </template>
  
  <script>
  import headerWeb from '../../components/headers/header-web.vue'
  import footerWeb from '../../components/headers/footer-web.vue'
  import users_table from './users_table.vue';

  export default {
    name: 'UsersSection',
    props: {
    },
    components: {
      headerWeb,
      users_table,
      footerWeb
    },
    async mounted(){
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