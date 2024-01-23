<template>
  <div class="flex flex-col h-screen justify-between">
    <header class="h10">
      <header-web />
    </header>
    <main class="mb-auto">
    <div v-if="status_pop === false">
      <h1 class="text-center mt-10 text-3xl font-extrabold text-blue-500">LIVE GAMES</h1>
        <div v-if = "games.length === 0" class="mt-6 text-center text-3xl font-extrabold 2xl:text-2xl text-black">
          <h1 class="text-2xl text-center font-bold text-red-500">No games playing currently</h1>
        </div>
        <!-- Text slides with image -->
        <div  v-else class="grid grid-cols-3 grid-flow-rows">
          <div v-for="(game, index) in games" :key="index" @click.prevent="change_status_pop(game.game_id)">  
            <h5 class="mt-8 text-center font-bold text-blac"> ROOM: {{ game.game_id }}</h5>
            <FieldSection :game="game" :cam="cam"/>
            <h5 class="text-center text-blac"> SCORE: {{ game.p1nick }} {{ game.p1ptos }} - {{ game.p2ptos }} {{ game.p2nick }}</h5>
          </div>
        </div>
    </div>
    <!-- Pop Up view choosed game-->
    <div v-else>
      <div v-for="(game, index) in games" :key="index">  
        <FieldSection :game="game" :cam="cam" v-if ="game.game_id === view_game_id"/>
      </div>
      <button class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click.prevent="change_status_pop()">
        Return to gallery
      </button>
    </div>
  </main>
  <footer class="sticky top-[100vh]">
    <footer-web/>
  </footer>
  </div>
  </template>
  
  <script>
  import FieldSection from './field.vue'
  import headerWeb from '../../components/headers/header-web.vue'
  import footerWeb from '../../components/headers/footer-web.vue'
  import { useStore } from 'vuex';
  import {computed} from 'vue';

  export default {
    name: 'LivedGamesSection',
    props: {
    },
    components: {
      FieldSection,
      headerWeb,
      footerWeb
    },
    data() {
        return {
          status_pop: false,      // Variable para habilitar el pop up
          view_game_id: null     // Variable para guardar el id del juego elegido
        } 
    },  
    setup() {
    const store = useStore();
    const games = computed(() => store.state.games.games);
    const user= computed(() => store.state.user.user);    
    const cam = {
          "x": -230, //-100
          "y": 350,  //250
          "z": 510, //250
          "Ox":0.74, //Math.PI/4, //Math.PI + Math.atan((500-(-100))/0), //0.4
          "Oy":0, //Math.PI,
          "Oz":-1.79//Math.PI
          };
    //console.log("lived games: ", games)
    //console.log("sotre: ", store)
    //const games = store.state.games.games 
    return {games,user,cam}
    },
    methods: {
      change_status_pop(game_id) {
        if (this.status_pop === true){
          this.status_pop = false;
          this.view_game_id = game_id
        }
        else {
          this.status_pop= true;
          this.view_game_id = game_id
        }
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>