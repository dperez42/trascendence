<template>
  <div class="flex flex-col justify-center items-center px-10 py-6 space-y-4 bg-gradient-to-r from-blue-500 to-indigo-600">
    <!-- Titulo y Estado del Jugador -->
    <div class="flex flex-col items-center space-y-2">
        <h2 class="text-2xl font-bold text-white">MATCHMAKER</h2>
        
        <!-- Mostrar estados según si hay jugadores esperando o no -->
        <h2 v-if="waiting_player === null" class="text-lg font-bold text-white">Nobody Waiting</h2>
        <h2 v-if="waiting_player != null" class="text-lg font-bold text-white">Player Assigned: - {{waiting_player.player_nick}} - </h2>
        <h2 v-if="waiting_player != null" class="text-lg font-bold text-white">Game Level: - {{waiting_player.game_level}} -</h2>
    </div>

    <!-- Botones de Acción -->
    <div class="w-full max-w-md">
        <button v-if="waiting_player === null" class="w-full mb-2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click.prevent="TogglePopup">
          Play a Match ?
        </button>
        <button v-if="waiting_player != null && waiting_player.player_id != user.id" class="w-full mb-2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click.prevent="created_waiting_room">
          Accept Match Against {{waiting_player.player_nick}} ?
        </button>
        <button v-if="waiting_player != null && waiting_player.player_id === user.id" class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click.prevent="leave_waiting_room">
          Leave the Match ?
        </button>
    </div>

  </div>


  <div v-if="buttonTrigger" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-60"></div>
    <div class="bg-white p-8 max-w-md mx-auto rounded-2xl shadow-2xl relative border-t-8 border-indigo-500">
      <h2 class="text-2xl font-bold mb-6 text-center text-indigo-600">Elige el nivel</h2>
      <div class="grid grid-cols-2 gap-4">
        <template v-if="waiting_player === null">
          <button @click.prevent="join_waiting_room(1)" class="flex items-center justify-center py-2 px-4 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:-translate-y-0.5">
            <i class="fas fa-star mr-2"></i> Level 1
          </button>
          <button @click.prevent="join_waiting_room(2)" class="flex items-center justify-center py-2 px-4 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:-translate-y-0.5">
            <i class="fas fa-star-half-alt mr-2"></i> Level 2
          </button>
          <button @click.prevent="join_waiting_room(3)" class="flex items-center justify-center py-2 px-4 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:-translate-y-0.5">
            <i class="fas fa-trophy mr-2"></i> Level 3
          </button>
          <button @click.prevent="join_waiting_room(4)" class="flex items-center justify-center py-2 px-4 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:-translate-y-0.5">
            <i class="fas fa-gamepad mr-2"></i> 3D Level
          </button>
        </template>
      </div>
      <button @click.prevent="TogglePopup" class="mt-6 w-full flex justify-center py-2 px-4 border border-red-600 text-sm font-medium rounded-md text-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:-translate-y-0.5">
        Close
      </button>
    </div>
  </div>

  
  <div v-if="trigger_challenge" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-60"></div>
    <div class="bg-white p-8 max-w-md mx-auto rounded-2xl shadow-2xl relative border-t-8 border-blue-500">
      <div class="flex items-center justify-between mb-8">
        <div class="flex flex-col items-center relative group">
          <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-xl transform rotate-6 transition-transform duration-150 group-hover:-translate-y-1 group-hover:scale-110 z-10">
            <span class="text-xl font-black tracking-wide uppercase text-white overflow-hidden truncate">{{ challenge.player_id_1_nick }}</span>
          </div>
          <span class="mt-2 text-gray-700 uppercase tracking-widest font-semibold">Challenger</span>
        </div>
        <div class="self-center text-4xl font-black text-gray-700 uppercase tracking-widest mx-6">
          VS
        </div>
        <div class="flex flex-col items-center relative group">
          <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-xl transform rotate-6 transition-transform duration-150 group-hover:-translate-y-1 group-hover:scale-110 z-10">
            <span class="text-xl font-black tracking-wide uppercase text-blue-500 overflow-hidden truncate">{{ challenge.player_id_2_nick }}</span>
          </div>
          <span class="mt-2 text-gray-700 uppercase tracking-widest font-semibold">Challenged</span>
        </div>
      </div>
      <div class="flex justify-center">
        <button @click.prevent="accept_challengue()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150 mr-2">
            Accept
        </button>
        <button @click.prevent="dismiss_challengue()" class="bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-100 py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150 ml-2">
            Refuse
        </button>
      </div>
    </div>
  </div>
</template>

  
<script lang="ts">

import {inject, computed} from 'vue'
import { useStore } from 'vuex';
import { ref } from 'vue';
import { Socket } from 'socket.io-client';
import useSocket from '../../views/games/logic/socketGame.logic';

export default {
  name: 'GameSection',
  components: {
  },
  data() {
    return {
    }
  },
  setup() {
    const buttonTrigger= ref(false)
    const store = useStore();
    const user = computed(() => store.state.user.user);
    const games = computed(() => store.state.games.games);
    const waiting_player = computed(() => store.state.games.waiting_player);
    const challenge = computed(() => store.state.games.challenge);
    const trigger_challenge = computed(() => store.state.games.trigger_challenge);
    const $gameSocket = inject<Socket | null>('$gameSocket', null);
    const { emitUpdateGame } = useSocket($gameSocket);
    const TogglePopup = () => {
      buttonTrigger.value = ! buttonTrigger.value
    }
    const join_waiting_room = (level:number) => { 
      console.log("level",level);
      console.log("lsocket",$gameSocket);
      emitUpdateGame({
          command: "JOIN_WAITING_ROOM", 
          params: {
            player_id : user.value.id,
            player_nick : user.value.login,
            game_level : level,
            timestamp: Date.now()
          }
      });
       
      buttonTrigger.value = ! buttonTrigger.value
    }
    const leave_waiting_room = () => {
      emitUpdateGame({
          command: "LEAVE_WAITING_ROOM", 
          params: {
            player_id : user.value.id,
            timestamp: Date.now()
          }
      }); 
    }
    const created_waiting_room = () => {
      emitUpdateGame({
          command: "CREATED_WAITING_ROOM", 
          params: {
            player_id_1 : waiting_player.value.player_id,
            player_nick_1 : waiting_player.value.player_nick,
            player_id_2 : user.value.id,
            player_nick_2 : user.value.login,
            game_level : waiting_player.value.game_level,
            timestamp: Date.now()
          }
      }); 
    }
    const accept_challengue = () => {
        emitUpdateGame({
            command: "CREATED_WAITING_ROOM", 
            params: {
              player_id_1 : challenge.value.player_id_1,
              player_nick_1 : challenge.value.player_id_1_nick,
              player_id_2 :  challenge.value.player_id_2,
              player_nick_2 :  challenge.value.player_id_2_nick,
              game_level : 1,
              timestamp: Date.now()
            }
        });
        emitUpdateGame({
            command: "CHALLENGE_ACCEPT", 
            params: {
              player_id_1 : challenge.value.player_id_1,
              player_nick_1 : challenge.value.player_id_1_nick,
              player_id_2 :  challenge.value.player_id_2,
              player_nick_2 :  challenge.value.player_id_2_nick,
              game_level : 1,
              timestamp: Date.now()
            }
        }); 
        store.state.games.trigger_challenge = false;
        store.state.games.challenge = null
    }
    const dismiss_challengue = () => {
        emitUpdateGame({
            command: "CHALLENGE_DISMISS", 
            params: {
              player_id_1 : challenge.value.player_id_1,
              player_nick_1 : challenge.value.player_id_1_nick,
              player_id_2 :  challenge.value.player_id_2,
              player_nick_2 :  challenge.value.player_id_2_nick,
              timestamp: Date.now()
            }
        }); 
        store.state.games.trigger_challenge = false;
        store.state.games.challenge = null
    }
    const is_playing = () =>{
            for(let game of games.value){
                if (game.p1id === user.value.id || game.p2id === user.value.id) {
                    return true
                }
            }
            console.log("is playing", false)
            return false
        }
    return {waiting_player, user, games, buttonTrigger, trigger_challenge , is_playing, challenge, accept_challengue, dismiss_challengue, TogglePopup, join_waiting_room, leave_waiting_room, created_waiting_room}
  },
    methods: {
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>