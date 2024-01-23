<template>
  <div class="flex flex-col h-screen justify-between">
    <header class="h10">
      <header-web />
    </header>
  <main class="flex flex-col h-screen justify-between mb-auto">
    <div v-if="game" class="w-full h-full flex items-center justify-center p-0 m-0">
    <!-- Contenido del juego -->
    <div class="container bg-gray-900 rounded-lg shadow-lg relative  p-0 m-0">
        <FieldSection :game="game" :cam="cam"/>
    </div>
  </div>
    <div v-else >
      <h1 class="text-center mt-10 text-3xl font-extrabold text-blue-500">GAME</h1>
      <h2 class="mt-6 text-center text-2xl font-bold 2xl:text-2xl text-red-500">No game Available</h2>
    </div>
    <h2 class="mt-6 text-center text-lg font-bold">
        <button class="px-2 py-2 rounded-md bg-blue-500 text-white hover:bg-indigo-600"
        @click.prevent="handleModal_instruction()">                        
                      Instructions
        </button>
      </h2>
  </main>
  <footer class="sticky top-[100vh]">
    <footer-web/>
  </footer>
  </div>
    <!-- pop up friends stadistics -->
    <div v-if="showInstructionModal === true"  class="absolute h-full  align-middle flexfixed z-25 inset-0 
      max-h-max    
      overflow-scroll ">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 transition-opacity">
                  <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div class="justify-between inline-block align-middle bg-white rounded-lg px-4 pt-5 pb-4 text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-lg sm:w-full sm:p-6">
                  <!--Modal title-->
                  <div
                      class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4">
                      <!--Modal title-->
                      <h5
                          class="text-xl font-medium leading-normal text-neutral-800"
                          id="exampleModalLabel">
                          INSTRUCTIONS
                      </h5>
                      <!--Close button-->
                      <button
                          type="button"
                          @click.prevent="handleModal_instruction()"
                          class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                          aria-label="Close">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="h-6 w-6">
                              <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>
                  <!--Modal body-->
                  <div class="relative overflow-y-auto p-4">
                    <h3 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">Wellcome to PONG</h3>
                    <span>
                      To start a new macth, you can challenge any other user throught caht, friend or user page. Or you can go to the waiting room. In both cases you must choose a difficult level. Otherwise you can acceot challenges from another users or accept a game from the waiting room.
                    </span>

                    <span>
                      <br>To start the game, both players have 10 seconds to go into the game otherwise the game will be destroyed. 
                    </span>
                    
                    <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                      Match time:
                    </h5>
                     60 seconds<br><br>
                    <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                      Keyboard:
                    </h5>
                    "Q" or "Z" move up (left in 3D version)
                    "A" or "X" move down (right in 3D version)<br><br>
                    <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                      Levels:</h5>
                      <a class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl">
                        <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src="/level1.png" alt="">
                        <div class="flex flex-col justify-between p-4 leading-normal">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Level 1</h5>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Classical Pong NO obstacles.</p>
                        </div>
                    </a>
                    <a class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl">
                        <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src="/level2.png" alt="">
                        <div class="flex flex-col justify-between p-4 leading-normal">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Level 2</h5>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Classical Pong with a few obstacles.</p>
                        </div>
                    </a>
                    <a class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl">
                        <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src="/level3.png" alt="">
                        <div class="flex flex-col justify-between p-4 leading-normal">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Level 3</h5>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Classical Pong with a lot of obstacles.</p>
                        </div>
                    </a>
                    <a class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl">
                        <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src="/level3D.png" alt="">
                        <div class="flex flex-col justify-between p-4 leading-normal">
                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">3D Level </h5>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">A 3D Pong versión that includes camera movements.</p>
                        </div>
                    </a>
                    
                    <h6>
                    <br>At the end of the match you will see the end result during five seconds.
                    </h6>
                    <h6>
                    In the "Live Games" section, you can view all the live matches, included your own one.
                    </h6>
                  </div>
                  <!--Modal footer-->
                  <div
                      class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
                      <button
                          type="button"
                          @click.prevent="handleModal_instruction()"
                          class="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 
                                  text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out 
                                  hover:bg-primary-accent-100 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                      >
                              Close
                      </button>
                  </div>
              </div>
          </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onUnmounted, onBeforeUnmount} from 'vue';
import headerWeb from '../../components/headers/header-web.vue'
import footerWeb from '../../components/headers/footer-web.vue'
import FieldSection from './field.vue'
import { useStore } from 'vuex';
import { inject } from 'vue'
import { Socket } from 'socket.io-client';
import useSocket from './logic/socketGame.logic';
// import { toast, type ToastOptions } from 'vue3-toastify';


let interval: number;

const store = useStore();
const game = computed(() => store.state.games.game);
const player_up = ref(false)
const player_down = ref(false)
const cam_right = ref(false)
const cam_left= ref(false)
const cam_up= ref(false)
const cam_down= ref(false)
const cam_front= ref(false)
const cam_back= ref(false)
const cam_tilt_up= ref(false)
const cam_tilt_down= ref(false)
const cam_roll_right= ref(false)
const cam_roll_left= ref(false)
const cam_pan_right= ref(false)
const cam_pan_left= ref(false)
//modals ;
const showInstructionModal = ref(false);
const handleModal_instruction = () => {
  if (showInstructionModal.value === false) {
    showInstructionModal.value = true;
} else {
  showInstructionModal.value = false;	
}
};
//Posicion inicial de la cámara
let cam = {
          "x": -230, //-100
          "y": 350,  //250
          "z": 510, //250
          "Ox":0.74, //Math.PI/4, //Math.PI + Math.atan((500-(-100))/0), //0.4
          "Oy":0, //Math.PI,
          "Oz":-1.79//Math.PI
};

// const notify = (msg:string) => {
//       toast(msg, {
//       autoClose: 1000,
//       position: toast.POSITION.BOTTOM_RIGHT,
//     } as ToastOptions);
// }
    
const $gameSocket = inject<Socket | null>('$gameSocket', null);
const { emitUpdateGame } = useSocket($gameSocket);

const update_game = () => {
      if (game.value){
        // jugador moviendose hacia arriba
        if (player_up.value){
          if (game.value.p1nick === store.state.user.user.login){
            if ((game.value.p1y + game.value.pad[1]/2 - 5) > 0){
              game.value.p1y = game.value.p1y - 5;
              game.value.p1time =  Date.now() 
              emitUpdateGame({
                command: "UPDATE_PLAYER_MOV",     // Comando para actualizar movimiento de un jugador en el juego.
                params: {
                  game_id : game.value.game_id,         //inicialmente null, se lo asigna el backend
                  player_id: store.state.user.user.id,       //login = nick del jugador
                  player_pos: game.value.p1y,      // posicion del jugador
                },
              timestamp: Date.now() // La hora a la que se envió el comando. Este es un string que representa la hora en formato ISO 8601, como "2023-05-15T10:00:00Z". Si no se proporciona una marca de tiempo, este campo puede ser nulo.
              }); 
            }
          }
          if (game.value.p2nick === store.state.user.user.login){
            if ((game.value.p2y + game.value.pad[1]/2 - 5) > 0){
              game.value.p2y = game.value.p2y - 5;
              game.value.p2time =  Date.now() 
              emitUpdateGame({
                command: "UPDATE_PLAYER_MOV",     // Comando para actualizar movimiento de un jugador en el juego.
                params: {
                  game_id : game.value.game_id,         //inicialmente null, se lo asigna el backend
                  player_id: store.state.user.user.id,       //login = nick del jugador
                  player_pos: game.value.p2y,      //  posicion del jugador
                },
              timestamp: Date.now() // La hora a la que se envió el comando. Este es un string que representa la hora en formato ISO 8601, como "2023-05-15T10:00:00Z". Si no se proporciona una marca de tiempo, este campo puede ser nulo.
              }); 
            }
          }           
        }
        // jugador moviendose hacia abajo
        if ( player_down.value){
          if (game.value.p1nick === store.state.user.user.login){
            if ((game.value.p1y - game.value.pad[1]/2 + 5) < 499){
              game.value.p1y = game.value.p1y + 5;
              game.value.p1time =  Date.now() 
              emitUpdateGame({
                command: "UPDATE_PLAYER_MOV",     // Comando para actualizar movimiento de un jugador en el juego.
                params: {
                  game_id : game.value.game_id,         //inicualmente null, se lo asigna el backend
                  player_id: store.state.user.user.id,       //login = nick del jugador
                  player_pos: game.value.p1y,      //  posicion del jugador
                },
              timestamp: Date.now() // La hora a la que se envió el comando. Este es un string que representa la hora en formato ISO 8601, como "2023-05-15T10:00:00Z". Si no se proporciona una marca de tiempo, este campo puede ser nulo.
              }); //emit {game_id, p1id || p2id, p1y || py2}
            }
          }
          if (game.value.p2nick === store.state.user.user.login){
            if ((game.value.p2y - game.value.pad[1]/2 + 5) < 499){
              game.value.p2y = game.value.p2y + 5;
              game.value.p2time =  Date.now() 
              emitUpdateGame({
                command: "UPDATE_PLAYER_MOV",     // Comando para actualizar movimiento de un jugador en el juego.
                params: {
                  game_id : game.value.game_id,         //inicualmente null, se lo asigna el backend
                  player_id: store.state.user.user.id,       //ilogin = nick del jugador
                  player_pos: game.value.p2y,      //  posicion del jugador
                },
              timestamp: Date.now() // La hora a la que se envió el comando. Este es un string que representa la hora en formato ISO 8601, como "2023-05-15T10:00:00Z". Si no se proporciona una marca de tiempo, este campo puede ser nulo.
              }); 
            }
          }           
        }
        // camara

        if (cam_tilt_up.value){
          cam.Ox = cam.Ox + 0.010 //Arriba
          //cam.Oy = cam.Oy + 0.010 //tuerca horaria
          //cam.Oz = cam.Oz + 0.010 //izquierda
        } 
        if (cam_tilt_down.value){
          cam.Ox = cam.Ox - 0.010 //Abajo
          //cam.Oy = cam.Oy - 0.010 //tuerca antihoraria
          //cam.Oz = cam.Oz - 0.010 //derecha
        }
        if (cam_pan_left.value){
          //cam.Ox = cam.Ox - 0.010 //Abajo
          //cam.Oy = cam.Oy - 0.010 //tuerca antihoraria
          cam.Oz = cam.Oz - 0.010 //derecha
        }
        if (cam_pan_right.value){
          //cam.Ox = cam.Ox + 0.010 //Arriba
          //cam.Oy = cam.Oy + 0.010 //tuerca horaria
          cam.Oz = cam.Oz + 0.010 //izquierda
        } 
        if (cam_roll_left.value){
          //cam.Ox = cam.Ox - 0.010 //Abajo
          cam.Oy = cam.Oy - 0.010 //tuerca antihoraria
          //cam.Oz = cam.Oz - 0.010 //derecha
        }
        if (cam_roll_right.value){
          //cam.Ox = cam.Ox - 0.010 //Abajo
          cam.Oy = cam.Oy + 0.010 //tuerca antihoraria
          //cam.Oz = cam.Oz - 0.010 //derecha
        }





        if (cam_front.value){
          cam.x = cam.x + 10
          //cam.Ox = cam.Ox + 0.010 //Arriba
          //cam.Oy = cam.Oy + 0.010 //tuerca horaria
          //cam.Oz = cam.Oz + 0.010 //izquierda
          console.log("Ox",-Math.atan((cam.z)/(250-cam.y)))
          console.log("Oy",-Math.atan((cam.z)/(500-cam.x)))
          console.log("Oz",-Math.atan((500-cam.x)/(250-cam.y)))
        } 
        if (cam_back.value){
          cam.x = cam.x - 10
          //cam.Ox = cam.Ox - 0.010 //Abajo
          //cam.Oy = cam.Oy - 0.010 //tuerca antihoraria
          //cam.Oz = cam.Oz - 0.010 //derecha
          console.log("Ox",-Math.atan((cam.z)/(250-cam.y)))
          console.log("Oy",-Math.atan((cam.z)/(500-cam.x)))
          console.log("Oz",-Math.atan((500-cam.x)/(250-cam.y)))
        }
        if (cam_right.value){
          cam.y = cam.y + 10
          /*
          // traslado coordenadas a centro del campo
          const x2 = cam.x - 500
          const y2 = cam.y - 250
          const radio = Math.sqrt(Math.pow(Math.abs(x2),2) + Math.pow(Math.abs(y2),2))
          const ang_giro = step/radio
          const ang_actual = Math.atan(y2/x2)
          const ang_new = ang_actual + ang_giro
          let x_c = Math.sqrt(Math.pow(radio,2)/(1 + Math.pow(Math.tan(ang_new),2)))
          let y_c = Math.tan(ang_new) * x_c
          if ((Math.sqrt((Math.abs(x_c-x2),2) + Math.pow((y_c - y2),2))) > radio){
            x_c = - x_c
            //y_c = - y_c
          }
          cam.x = x_c + 500
          cam.y = y_c + 250
          //cam.Oz = -Math.PI/4 + Math.atan((500-cam.x)/(250-cam.y))
          */
        }
        if (cam_left.value){
          cam.y = cam.y - 10
          /*
          const x2 = cam.x - 500
          const y2 = cam.y - 250
          const radio = Math.sqrt(Math.pow(Math.abs(x2),2) + Math.pow(Math.abs(y2),2))
          const ang_giro = step/radio
          const ang_actual = Math.atan(y2/x2)
          const ang_new = ang_actual - ang_giro
          let x_c = Math.sqrt(Math.pow(radio,2)/(1 + Math.pow(Math.tan(ang_new),2)))
          let y_c = Math.tan(ang_new) * x_c
          if ((Math.sqrt(Math.pow((x_c-x2),2) + Math.pow((y_c - y2),2))) > radio){
            x_c = - x_c
            //y_c = - y_c
          }
          
          cam.x = x_c + 500
          cam.y = y_c + 250
          //cam.Oz = -Math.PI/4 + Math.atan((500-cam.x)/(250-cam.y))
          */
        }
        if (cam_up.value){
          if ((cam.z+10) < 1000){
          cam.z = cam.z + 10
          //cam.Ox = Math.atan((cam.z)/(250-cam.y))
          }
        }
        if (cam_down.value){
          if ((cam.z - 10) > 0){
          cam.z = cam.z - 10
          //cam.Ox = Math.atan((cam.z)/(250-cam.y))
          }
        }
        
        //cam.Ox = Math.PI + Math.atan((500-cam.x)/cam.z)
        //cam.Oy = Math.PI + Math.atan((250-cam.y)/cam.z)
        //cam.Oz = Math.atan((cam.y-250)/(cam.x-500))
      }
}
    
interval = setInterval(()=>{
      //console.log("II")
        update_game();
}, 10); // delay en ms 

    // Events listeners
let options = { capture: true };
let callback_keydown = (e:any) => {
      // Player
      if (e.key === "q" || e.key === "Q" || e.key === "z" || e.key === "Z") {player_up.value = true}
      if (e.key === "a" || e.key === "A" || e.key === "x" || e.key === "X") {player_down.value = true;}
      // Cámara
      if (e.key == "ArrowRight") {cam_right.value = true;}
      if (e.key == "ArrowLeft") {cam_left.value = true;}
      if (e.key == "ArrowUp") {cam_front.value = true;}
      if (e.key == "ArrowDown") {cam_back.value = true;}
      if (e.key == "w"  || e.key === "W" ) {cam_up.value = true;}
      if (e.key == "s"  || e.key === "S" ) {cam_down.value = true;}
      if (e.key == "u"  || e.key === "U" ) {cam_tilt_up.value = true;}
      if (e.key == "j"  || e.key === "J" ) {cam_tilt_down.value = true;}
      if (e.key == "y"  || e.key === "Y" ) {cam_pan_left.value = true;}
      if (e.key == "i"  || e.key === "I" ) {cam_pan_right.value= true;}
      if (e.key == "h"  || e.key === "H" ) {cam_roll_left.value = true;}
      if (e.key == "k"  || e.key === "K" ) {cam_roll_right.value = true;}
      if (e.key == " ") {
        cam.x=-230
        cam.y=350 
        cam.z= 510
        cam.Ox= 0.74;
        cam.Oy=0;
        cam.Oz=-1.79;
      }
    };
let callback_keyup = (e:any) => {
      // Player
      if (e.key === "q" || e.key === "Q" || e.key === "z" || e.key === "Z") {player_up.value = false}
      if (e.key === "a" || e.key === "A" || e.key === "x" || e.key === "X") {player_down.value = false;}
      // Cámara
      if (e.key == "ArrowRight") {cam_right.value = false;}
      if (e.key == "ArrowLeft") {cam_left.value = false;}
      if (e.key == "ArrowUp") {cam_front.value = false;}
      if (e.key == "ArrowDown") {cam_back.value = false;}
      if (e.key == "w"  || e.key === "W" ) {cam_up.value = false;}
      if (e.key == "s"  || e.key === "S" ) {cam_down.value = false;}
      if (e.key == "u"  || e.key === "U" ) {cam_tilt_up.value = false;}
      if (e.key == "j"  || e.key === "J" ) {cam_tilt_down.value = false;}
      if (e.key == "y"  || e.key === "Y" ) {cam_pan_left.value = false;}
      if (e.key == "i"  || e.key === "I" ) {cam_pan_right.value = false;}
      if (e.key == "h"  || e.key === "H" ) {cam_roll_left.value = false;}
      if (e.key == "k"  || e.key === "K" ) {cam_roll_right.value = false;}
}
window.addEventListener('keydown', callback_keydown, options);
window.addEventListener('keyup',  callback_keyup, options);
onUnmounted(() => window.removeEventListener('keydown', callback_keydown, options));
onUnmounted(() => window.removeEventListener('keyup', callback_keyup, options));
onBeforeUnmount(() =>{
   clearInterval(interval);
  });

</script>
