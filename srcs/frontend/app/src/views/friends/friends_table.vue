<template>
  <div class="m-10">
      <div class="flex flex-col mt-6 space-y-6">
          <section v-if="errored===true">
              <p class="py-5 text-xl font-bold text-red-600">We're sorry, we're not able to retrieve this information at the moment, please try back later</p>    
          </section>
          <section v-else class="min-w-full max-h-full">
              <div v-if="loading">
                      <spin_loader></spin_loader>
              </div>
              <div v-else class="flex flex-col bg-gray-200 h-screen">
                  <main class="h-full">
                      <div class="mx-6">
                              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                  @click.prevent="handleModal_add_friends()">
                                  Add friend
                              </button>
                      </div>
                      <div class="overflow-y-auto">
                                  <table class="min-w-full bg-white divide-y divide-gray-200">
                                  <tbody class="bg-white divide-y divide-gray-300">
                                      <tr 
                                          v-for="(item, index) in contactsChannels.filter(item => item.type === 'private')" 
                                          :key="index" 
                                          class="hover:bg-gray-200 transition ease-in-out duration-150">
                                          <td class="px-4 py-4">
                                              <h2 class="text-lg font-bold text-blue-500">{{item.login}}</h2>
                                          </td>
                                          <td class="px-4 py-4">
                                              <!-- <img class="object-cover w-20 h-20 border-2 border-white rounded-full" :src="'api/user/' + item.images" alt=""/> -->
                                              <img  v-if="item"
                                                  class="object-cover w-20 h-20 border-2 border-white rounded-full" 
                                                  :src="item.images.startsWith('http') ? item.images : 'api/user/' + item.images" 
                                                  alt=""
                                              />
                                          </td>
                                          <!-- is on line -->
                                          <td class="px-4 py-4 text-sm">
                                              <div class="flex items-center space-x-2">
                                                  <div v-if="is_online(item)">
                                                      <i class="fas fa-wifi font-bold text-green-500" aria-hidden="true"></i>  
                                                      <span class="font-bold text-blue-500"> Online</span>
                                                  </div>
                                                  <div v-else>
                                                      <i class="fas fa-circle-exclamation font-bold text-red-500"></i>
                                                      <span class="font-bold text-blue-500"> Offline</span>
                                                  </div>
                                              </div>
                                          </td>
                                          <!-- is playing -->
                                          <td class="px-4 py-4 text-sm">
                                              <div class="flex items-center space-x-2">
                                                  <div v-if="is_playing(item.id, games) && is_online(item)"
                                                      @click.prevent="handleModal_lived_game(item)"
                                                      class="cursor-pointer hover:text-blue-500">
                                                      <i class="fas fa-glasses font-bold text-red-500" aria-hidden="true"></i>
                                                      <span class="font-bold text-blue-500"> Playing</span>
                                                  </div>
                                                  <div v-else-if="!is_online(item)">
                                                      <i class="fas fa-triangle-exclamation font-bold text-red-500" aria-hidden="true"></i>
                                                      <span class="font-bold text-blue-500"> Not Available</span>
                                                  </div>
                                                  <div v-else class="cursor-pointer hover:text-blue-500"
                                                      @click.prevent="handleChallengeClick(item, user)">
                                                      <i class="fas fa-table-tennis-paddle-ball font-bold text-green-500"></i>
                                                      <span class="font-bold text-blue-500"> Available</span>
                                                  </div>
                                              </div>
                                          </td>
                                          <!-- <Stadistics-->
                                          <td class="px-4 py-4">
                                              <div class="cursor-pointer hover:text-blue-500" @click.prevent="handleModal_stat(item)">
                                                  <i class="fa fa-bar-chart font-bold text-green-500" aria-hidden="true"></i>
                                                  <span class="font-bold text-blue-500"> Stats</span>
                                              </div>
                                          </td>
                                          <!-- delete opcion -->
                                          <td class="px-4 py-4">
                                              <div class="cursor-pointer hover:text-blue-500" @click.prevent="handleModal_delete_friends(item)">
                                                  <i class="fa fa-user-minus font-bold text-green-500" aria-hidden="true"></i>
                                                  <span class="font-bold text-blue-500"> Remove</span>
                                              </div>
                                          </td>
                                      </tr>
                                  </tbody>
                                  </table>
                      </div>
                  </main>
                </div>
          </section>
      </div>
  </div>
  <!-- pop up delete friends class="absolute h-full align-middle flexfixed z-10 inset-0 overflow-y-auto"-->
<div v-if="showModal_delete_friends === true" class="absolute h-full align-middle flexfixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-end justify-center align-middle h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">             
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
                          REMOVE A FRIEND
                      </h5>
                      <!--Close button-->
                      <button
                          type="button"
                          @click.prevent="handleModal_delete_friends(null)"
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
                  <div class="relative flex-auto p-4 text-blue-500 font-bold text-xl px-5" >
                      Do you want to remove {{choose_friend.login}} as a friend ?
                  </div>
                  <!--Modal footer-->
                  <div
                      class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
                      <button
                          type="button"
                          @click.prevent="handleModal_delete_friends(null)"
                          class="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 
                                  text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out 
                                  hover:bg-primary-accent-100 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                      >
                              Close
                      </button>
                      <button
                          type="button"
                          @click.prevent="handleContactDelete(choose_friend), handleModal_delete_friends(null)"
                          class="ml-1 inline-block rounded bg-green-500 px-6 pb-2 pt-2.5 
                                  text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out 
                                  hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                      >
                              Confirm
                      </button>
                  </div>
              </div>
          </div>
  </div>
  <!-- pop up add friends -->
<div v-if="showModal_add_friends === true"  class="absolute h-full align-middle flexfixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-end justify-center align-middle h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                              ADD A FRIEND
                      </h5>
                      <!--Close button-->
                      <button
                              type="button"
                              @click.prevent="handleModal_add_friends()"
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
                  <div class="relative flex-auto p-4" > 
                      <friend_add @uploadFriend="startUpload" />
                  </div>
                  <!--Modal footer-->
                  <div
                      class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
                      <button
                          type="button"
                          @click.prevent="handleModal_add_friends()"
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
  <!-- pop up on line game -->
<div v-if="showModal_lived_game === true"  class="fixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 transition-opacity">
                  <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                      <FieldSection :game="friend_game(choose_friend, games)" :cam="cam" v-if ="friend_game(choose_friend, games)!=null"/>
                      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                        @click.prevent="handleModal_lived_game(null)">
                        exit
                    </button>
                  </div>               
              </div>
          </div> 

  </div>
  <!-- pop up friends stadistics -->
  <div v-if="showModal_stat === true"  class="absolute h-full align-middle flexfixed z-10 inset-0 
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
                          PLAYER STADISTICS
                      </h5>
                      <!--Close button-->
                      <button
                          type="button"
                          @click.prevent="handleModal_stat(null)"
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
                      <player_Stat :my_player="choose_friend"/>
                  </div>
                  <!--Modal footer-->
                  <div class="mt-4 flex justify-center">
                    <button 
                        @click="handleModal_stat(null)" 
                        class="bg-white border-2 border-blue-700 text-blue-700 hover:bg-blue-400 hover:text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150"
                    >
                        <i class="fa fa-arrow-left"></i> Back
                    </button>
                </div>
                  <!-- <div
                      class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
                      <button
                          type="button"
                          @click.prevent="handleModal_stat(null)"
                          class="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 
                                  text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out 
                                  hover:bg-primary-accent-100 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                      >
                              Close
                      </button>
                  </div> -->
              </div>
          </div>
  </div>
</template>

<script setup lang="ts">
import { Socket } from 'socket.io-client';
import { ref, inject, computed, onMounted, watchEffect, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import spin_loader from '../../services/spin_loader.vue';
import { ContactOrChannel } from '../../types/ContactChannel';
import FieldSection from '../games/field.vue'
import player_Stat from '../stadistics/player_stat.vue'
import friend_add from './friend_add.vue'
import { loadContactsAndChats } from './logic/contact.logic';
import handlesClicks  from './logic/eventHandlers.logic'

const token = ref<string | null>(localStorage.getItem('token'));

const contactsChannels = ref<ContactOrChannel[]>([]);
const choose_friend = ref<any>(null)
const loading = ref(true)
const errored = ref(false)
const store = useStore();
const user = computed(() => store.state.user.user);
const games = computed(() => store.state.games.games);

const $chatSocket = inject<Socket | null>('$chatSocket', null);
const activeItem = computed(() => contactsChannels.value.find(channel => channel.status));

// Modal to delete friends
const showModal_delete_friends = ref(false);
const handleModal_delete_friends = (contact: any) => {
  if (showModal_delete_friends.value === false) {
  showModal_delete_friends.value = true;
  choose_friend.value = contact
} else {
  showModal_delete_friends.value = false;	
  choose_friend.value = null
}
};
// Modal to add friends
const showModal_add_friends = ref(false);
const handleModal_add_friends = () => {
  showModal_add_friends.value === false ? showModal_add_friends.value = true:showModal_add_friends.value = false;
};
// Modal to show stadistics
const showModal_stat = ref(false);
const handleModal_stat = (contact:any) => {
  if (showModal_stat.value === false) {
  showModal_stat.value = true;
  choose_friend.value = contact
} else {
  showModal_stat.value = false;	
  choose_friend.value = null
}
};
// Modal to view game
const cam = {
        "x": -230, //-100
        "y": 350,  //250
        "z": 510, //250
        "Ox":0.74, //Math.PI/4, //Math.PI + Math.atan((500-(-100))/0), //0.4
        "Oy":0, //Math.PI,
        "Oz":-1.79//Math.PI
};
const showModal_lived_game = ref(false);
const handleModal_lived_game = (contact: any) => {
  if (showModal_lived_game.value === false) {
  showModal_lived_game.value = true;
  choose_friend.value = contact
} else {
  showModal_lived_game.value = false;	
  choose_friend.value = null
}
};

const {
  handleChallengeClick, 
handleContactDelete,
  handleContactAdd,
} = handlesClicks(contactsChannels, activeItem, $chatSocket, (data) => {
console.log(data);
});

const handleOnlineUsersChange = (newLength: number, oldLength: number): void => {
oldLength;
  console.log('Cambio en onlineUsers. Nueva longitud:', newLength, oldLength);
};

const is_online = (contact: any) => {
  const online = store.state.online.onlineUsers.some((user: any) => user.id === contact.id);
  return online;
};

const is_playing = (user_id:any, games:any) => {
  for(let game of games){
      if (game.p1id === user_id || game.p2id === user_id) {
          return true
      }
}
  return false
};

const friend_game = (friend:any, games:any) => {
  for(let game of games){
      if (game.p1id === friend.id || game.p2id === friend.id) {
          return game
      }
  }
  return null
};

const startUpload =  (payload: any) => {
  handleModal_add_friends()
  handleContactAdd(payload)
};

onMounted(() => {
watch(
  () => store.state.online.onlineUsers.length,
  handleOnlineUsersChange
);

watchEffect(async () => {
      if(user.value?.id) {
          loading.value = true
    await loadContactsAndChats(store, contactsChannels, token);
          contactsChannels.value.forEach(contact => contact.status = false);
          loading.value = false
      }
  });
});

onBeforeUnmount(() => {
});

</script>

<style scoped>
</style>
