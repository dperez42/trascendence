<template>
  <div class="absolute flex h-screen w-full overflow-hidden bg-cover bg-no-repeat">
    <div class="top-0 bottom-0 left-0 right-0 h-screen w-screen bg-gradient-to-t from-indigo-800 to-blue-500 mb-2 overflow-hidden bg-fixed">
      <h1 class="py-10 mb-6 text-center text-5xl font-extrabold text-white">ADMIN PANEL <span class="fas fa-gears text-white font-extrabold"></span></h1>
      <h3 class="py-5 mb-8 text-2xl text-center font-medium text-white">Wellcome to the admin panel, according your privileges you can...</h3>
      <div class="items-center justify-center">
        <div class="px-6 text-center text-white">
          <button
            type="button"
            class="rounded border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-lg font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-orange-500 hover:bg-orange-500 hover:bg-opacity-500 hover:text-orange-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 "
            data-te-ripple-init
            data-te-ripple-color="light">
            <span class="fas fa-comments text-white font-extrabold mr-3"></span>
            Manage Channels 
          </button>
          <br>
          <br>
          <button
            type="button"
            class="rounded border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-lg font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-orange-500 hover:bg-orange-500 hover:bg-opacity-500 hover:text-orange-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 "
            data-te-ripple-init
            data-te-ripple-color="light">
            <span class="fas fa-users text-white font-extrabold mr-3"></span>
            Ban Users 
          </button>
          <br>
          <br>
          <button
            type="button"
            class="rounded border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-lg font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-orange-500 hover:bg-orange-500 hover:bg-opacity-500 hover:text-orange-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 "
            data-te-ripple-init
            data-te-ripple-color="light">
            <span class="fas fa-key text-white font-extrabold mr-3"></span>
            Manage Roles
          </button>
          <br>
          <br>
          <button
            type="button"
            class="rounded border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-lg font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-orange-500 hover:bg-orange-500 hover:bg-opacity-500 hover:text-orange-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 "
            data-te-ripple-init
            data-te-ripple-color="light">
            <router-link to="profile">
              <span class="fas fa-rotate-left text-white font-extrabold mr-3"></span>
              Back to profile              
            </router-link> 
          </button>
        </div>
      </div>
    </div>
</div>
      <!-- <footer class="sticky top-[100vh]">
        <footer-web/>
      </footer> -->
</template>
    
    <script>
    //https://www.w3schools.com/graphics/svg_examples.asp
    // import headerWeb from '../../components/headers/header-web.vue'
    // import footerWeb from '../../components/headers/footer-web.vue'
    // import Users_table from '../users/Users_table.vue';
    //import { useStore } from 'vuex';
    //import { computed} from 'vue';
  
    export default {
      name: 'UsersSection',
      props: {
      },
      components: {

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