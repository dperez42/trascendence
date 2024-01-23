<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat" style="background-image: url(/pong_room.jpg)">
    <div class="max-w-md w-full space-y-8">
      <div v-if="user" class="text-center text-3xl uppercase font-extrabold text-white ">
          HELLO {{ user.login }} !!!<br>WELLCOME TO THE C3P0'S TEAM<br> FT_TRANSCENDENCE WEB
        <div class="py-3"></div>
        <div v-if = "user.first_time===false">
          <router-link to="chat"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-blue-500 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span>
              <h1 class="text-center text-3xl font:extrabold text-white">READY ?</h1>
            </span>
          </router-link>
        </div>
        <div v-if = "user.first_time===true">
          <router-link to="profile"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-blue-500 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span>
              <h1 class="text-center text-3xl font:extrabold text-white">FIRST TIME, YOU WILL BE REDIRECTED TO PROFILE.</h1>
            </span>
          </router-link>
        </div>
      </div>
      <div v-else class="text-center text-3xl uppercase font-extrabold text-red-500 ">
        You must be logged to enjoy this webpage.
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, reactive, ref} from 'vue';
import { useStore } from 'vuex';
import { User } from '../../types/user'
import axios from 'axios'
import { useRouter } from 'vue-router';

const store = useStore();
const user = ref<User | null>(null);
const token = localStorage.getItem('token');
const router = useRouter()

const game = reactive({
  "game_id":null,          //inicualmente null, se lo asigna el backend
  "game_status":1,         //Status del juego 0:esperando a jugadores, 1:countdown to start, 2:play time, 3:show results and count down, 4:finish        
  "game_count": 1000,      //contador de tiempo 
  "game_type": 4,          //tipo de juego de 1 a 3
  "game_vel": 1,            //velocidad de juego
  "ballpos":[200,200],      //posicion bola init(500,250)
  "ballvel":[1,1],          // sentido de la bola y velocidad
  "ballrad": 20,            // tamaño de la bola (radio)
  "p1nick":'Daniel',    //nick del jugador 1
  "p1id":'31341',       //id del jugador 1
  "p1y":250,            // Posición del jugador 1, en un campo de juego de 1000x500
  "p1ptos":10,          // Puntos jugador 1 init=0
  "p1_state": false,    // Estado del jugador1 , no ha entrado en el juego =false, ha entrado en el juego =true
  "p2nick":'Opponent',    //nick del jugador 2
  "p2id":'eqe2e32',       //id del jugador 2
  "p2y":250,             // Posición del jugador 2, en un campo de juego de 1000x500
  "p2ptos":5,           // Puntos jugador 2 init=0
  "p2_state": true,     // Estado del jugador 2, no ha entrado en el juego =false, ha entrado en el juego =true
  "pad":[5,50]         // Dimensiones del pad
});
game;


onMounted(async () => {

  if (token) {
    try {
      await store.dispatch('user/fetchUser', token);
      user.value = store.state.user.user;

      // Configurar axios para usar el token de autorización
      const axiosInstance = axios.create({
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const [listResponse, waitingResponse] = await Promise.all([
        axiosInstance.get(`/api/games/listlivegames`),
        axiosInstance.get(`/api/games/roomwaiting`)
      ]);

      store.state.games.games = listResponse.data;
      store.state.games.waiting_player = waitingResponse.data || null;

    } catch (error) {
      if (error instanceof Error) {
        // Ahora puedes acceder a las propiedades estándar de Error, como message
        //localStorage.removeItem('token');  // Limpiar el token del local storage
        console.error("NN",error.message);
        //router.push('/');  // Redirigir al usuario a la página de inicio de sesión
      }

      // Si estás utilizando axios y esperas errores específicos de axios:
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        console.error("Ocurrió un error:", error);  
        //localStorage.removeItem('token');  // Limpiar el token del local storage
          //router.push('/');  // Redirigir al usuario a la página de inicio de sesión
      } else {
          //localStorage.removeItem('token');  // Limpiar el token del local storage
          console.error("Ocurrió un error:", error);
      }
      localStorage.removeItem('token');  // Limpiar el token del local storage
      router.push('/');  // Redirigir al usuario a la página de inicio de sesión
    }
  } else {
    router.push('/');  // Redirigir al usuario a la página de inicio de sesión
  }
});
</script>

<style scoped>
</style>