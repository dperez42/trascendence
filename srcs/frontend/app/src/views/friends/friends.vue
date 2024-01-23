<template>
  <div class="flex flex-col h-screen justify-between">
    <header class="h10">
      <header-web />
    </header>
    <h1 class="py-5 text-center text-3xl font-extrabold text-blue-500">FRIENDS BOARD</h1>
    <main class="mb-auto flex flex-col overflow-y-auto">
      <div>
          <friends_table/>
      </div>
    </main>
    <footer class="sticky top-[100vh]">
      <footer-web/>
    </footer>
  </div>
   
</template>
  
  <script lang="ts">

  import headerWeb from '../../components/headers/header-web.vue'
  import footerWeb from '../../components/headers/footer-web.vue'
  import  friends_table from './friends_table.vue';

  export default {
    name: 'FriendsSection',
    props: {
    },
    components: {
      headerWeb,
      friends_table,
      footerWeb
    },
    data() {
        return {
        } 
    },
    async mounted(){
    },
    setup() {
      return{}
    },    
    methods: {
    }
  }
  </script>
  
  <style scoped>
  </style>