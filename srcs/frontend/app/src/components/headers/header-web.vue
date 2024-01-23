<template>
  <header class="bg-gradient-to-r from-blue-500 to-indigo-600 mb-2">
    <nav class="container mx-auto flex flex-wrap items-center justify-between p-4">
      
      <!-- Logo -->
      <div class="flex items-center justify-between w-full lg:w-auto">
        <img class="h-10 mr-3" src="/path/logo/42_Logo.svg.png" alt="Logo"> 
        <button @click="toggleNavbar" class="lg:hidden text-white cursor-pointer text-x px-3 py-1 focus:outline-none transition-transform transform hover:rotate-90">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <!-- Navigation Links -->
      <div v-bind:class="{'hidden': hideMenu, 'flex': !hideMenu}" class="lg:flex lg:flex-grow items-center w-full lg:w-auto">
        <ul class="flex flex-col lg:flex-row list-none mx-auto lg:ml-auto lg:mx-0 space-x-2">
          <!-- ... other links ... -->
          <li class="nav-item">
            <router-link to="chat" class="flex items-center px-2 text-x uppercase font-bold leading-snug text-white hover:opacity-50">
              <i class="fas fa-comments lg:text-lg leading-lg text-white mr-3"></i>CHAT
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="game" class="flex items-center px-2 text-x uppercase font-bold leading-snug text-white hover:opacity-50">
              <i class="fas fa-gamepad lg:text-lg leading-lg text-white mr-3"></i>GAME
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="lived_games" class="flex items-center px-2 text-x uppercase font-bold leading-snug text-white hover:opacity-50">
              <i class="fas fa-broadcast-tower lg:text-lg leading-lg text-white mr-3"></i>LIVE GAMES
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="leader" class="flex items-center px-2 text-x uppercase font-bold leading-snug text-white hover:opacity-50">
              <i class="fas fa-trophy lg:text-lg leading-lg text-white mr-3"></i>LEADERBOARD
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="friends" class="flex items-center px-2 text-x uppercase font-bold leading-snug text-white hover:opacity-50">
              <i class="fas fa-user-friends lg:text-lg leading-lg text-white mr-3"></i>FRIENDS
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="users" class="flex items-center px-2 text-x uppercase font-bold leading-snug text-white hover:opacity-50">
              <i class="fas fa-users lg:text-lg leading-lg text-white mr-3"></i>USERS
            </router-link>
          </li>
          <!-- User Menu -->
          <li v-if="user" class="nav-item relative group">
            <div @click="toggleMenu" class="cursor-pointer flex items-center px-2 text-xl font-bold leading-snug text-white hover:opacity-50">
              <img v-if="user" :src="user.images.startsWith('http') ? user.images : 'api/user/' + user.images" alt="User Profile" class="w-8 h-8 rounded-full border-2 border-white mr-3">
                <!-- Nombre del usuario o "Invitado" -->
                {{ user ? user.login : 'Invitado' }}
            </div>

            <!-- Menú desplegable del usuario -->
            <div v-show="menuOpen" class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg transition-transform transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100">
              <router-link to="profile" class="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white rounded-t-lg">Profile</router-link>
              <a href="#" @click="logout" class="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white rounded-b-lg">Logout</a>
            </div>
          </li>

        </ul>
      </div>
    </nav>
  </header> 
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { User } from '../../types/user'
import { Socket } from 'socket.io-client';
import { handleGameNotification, removeGameNotificationHandler } from './logic-header/notificationHandler';
import { handleNotification } from './logic-header/messagesSocket';
import axios from 'axios'

const emit = defineEmits(['message-received']);

const store = useStore()
const token = localStorage.getItem('token');

const user = ref<User | null>(null)

const router = useRouter()



const $chatSocket = inject<Socket | null>('$chatSocket', null);
const $gameSocket = inject<Socket | null>('$gameSocket', null);

const menuOpen = ref(false)
const hideMenu = ref(true)

const windowOnClick = () => {
  menuOpen.value = false
  window.removeEventListener('click', windowOnClick)
}

const toggleMenu = (event: Event) => {
  menuOpen.value = !menuOpen.value
  if(menuOpen.value) {
    window.addEventListener('click', windowOnClick)
  } else {
    window.removeEventListener('click', windowOnClick)
  }
  event.stopPropagation()
}

const toggleNavbar = (event: Event) => {
  hideMenu.value = !hideMenu.value
  event.stopPropagation()
}

let cleanupChat: (() => void) | undefined;

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // T
onMounted(async () => {

  if ($chatSocket) {
    $chatSocket.on('disconnect', () => {
      console.log('Desconectado del servidor de chat');

      if (retryCount < MAX_RETRIES) {
        console.log(`Reintento ${retryCount + 1} de ${MAX_RETRIES} en ${RETRY_DELAY / 1000} segundos...`);

        setTimeout(() => {
          retryCount++;

          $chatSocket.connect();
        }, RETRY_DELAY);
      } else {
        console.log('Número máximo de reintentos alcanzado. Refrescando la página...');
        location.reload();
      }
    });
  }

  if(token)
  {
    cleanupChat = handleNotification($chatSocket, user, token, (data) => {
      emit('message-received', data);
    });
  }
  
  if (token) {
    try {
      await store.dispatch('user/fetchUser', token);
      user.value = store.state.user.user;
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
        console.error(error.message);
      }

      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          router.push('/');
      } else {
          console.error("Error connect contact:", error);
      }
      localStorage.removeItem('token');
      router.push('/');
    }
  } else {
    router.push('/');
  }
  // handleGameNotification($gameSocket);
  handleGameNotification($gameSocket).then(route => {
    if (route) {
      router.push(route);
    }
  }).catch(error => {
    console.error("Error with the game notification:", error);
  });
});

onUnmounted(() => {
  removeGameNotificationHandler($gameSocket);
});

const logout = () => {
  if (cleanupChat) cleanupChat();
  if($chatSocket)
    $chatSocket.disconnect();
  localStorage.removeItem('token')
  //store.commit('user/setUser', null)
  removeGameNotificationHandler($gameSocket);
  router.push('/')
}
</script>

<style>
  /* Add this at the end of your styles, or in your styles section */
  .group:hover .group-hover\:scale-100 {
    transform: scale(100%);
  }
  .group:hover .group-hover\:opacity-100 {
    opacity: 100%;
  }
</style>