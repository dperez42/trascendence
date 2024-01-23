<template>
    <header class="h10">
      <header-web />
    </header>

    <div v-if="isLoading" class="flex-col container mx-auto my-5 p-5 bg-white">
        <div class="md:flex no-wrap md:-mx-2 ">
            <!-- Left Side -->
            <div class="w-full md:w-3/12 md:mx-2 ">
                <!-- Profile Card -->
                <div class="bg-white p-3 border-t-4 border-white">
                    <p v-if="user" class="text-xl text-gray-800 text-center font-bold leading-6">{{ user.login }}</p>
                    <div class="image overflow-hidden">
                      <!--<img v-if="user.images" class="h-auto w-full mx-auto" :src="'api/user/' + user.images" alt="">-->
                        <FileDrop class="h-auto w-full mx-auto"  @upload="imageLoaded" :avatar="avatar"/>
                    </div>
                    <ul
                        class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                        <li class="flex items-center py-3">
                            <span>Status</span>
                            <span v-if="user.isActive === true" class="ml-auto"><span
                                    class="bg-green-500 py-1 px-2 rounded text-white text-sm">Active</span></span>
                            <span v-else class="ml-auto"><span
                                    class="bg-red-500 py-1 px-2 rounded text-white text-sm">Inactive</span></span>
                        </li>
                        <!-- <li class="flex items-center py-3">
                            <span>Member since</span>
                            <span class="ml-auto">{{ user.first_time }}</span>
                        </li> -->
                    </ul>
                    </div>
                <!-- End of profile card -->
                <div v-if="isTwoFAEnabled && !user.twoFASecret && !showSuccessMessage" class="my-4">
                  <div class="bg-white p-3 border-t-4 border-white">
                      <div v-if="!QRCodeURL">
                          <button
                              class="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                              @click="GenerateTwoFA">Generar QR
                          </button>
                      </div>
                      <div v-if="QRCodeURL">
                          <p>Scan QR code with Google Authenticator App:</p>
                          <img :src="QRCodeURL" alt="2FA QR Code">
                          <p>Insert the code from Google Authenticator App:</p>
                          <input v-model="userToken" type="text" 
                            @keypress.enter="verifyAndEnableTwoFA"
                            placeholder="Insert Temporal Code" class="text-gray-500 text-center px-4 bg-gray-100">
                          <button @click="verifyAndEnableTwoFA" class="text-white px-5 font-bold bg-indigo-600 hover:text-gray-200">Verify and Enable 2FA</button>
                      </div>
                  </div>
                </div>
                <div v-if="showSuccessMessage" class="my-4">
                  <div class="bg-white p-3 border-t-4 border-white">
                    Token generated succesfully.
                  </div>
                </div>
                <div v-if="errorToken===true" 
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500">
                  Invalid Token, Try Again
                </div>
            </div>
            <!-- Right Side -->
            <div class="w-full md:w-9/12 mx-2 h-64">
                <!-- Profile tab -->
                <!-- About Section -->
                <div class="bg-white p-3 shadow-sm rounded-sm">
                    <!-- Settings Title-->
                    <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                        <span clas="text-green-500">
                            <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </span>
                        <span class="tracking-wide">About</span>
                    </div>
                    <!-- Settings -->
                    <div class="text-gray-700">
                      <!--1 linea login y login 42-->
                      <div class="-mx-3 flex flex-wrap">
                        <div class="w-full px-3 sm:w-1/2">
                            <div class="mb-5">
                              <label
                                for="fLogin"
                                class="mb-3 block text-base font-medium text-[#07074D]"
                              >
                                Nickname
                              </label>
                              <input
                                type="text"
                                v-model="user.login"
                                name="fLogin"
                                id="fLogin"
                                placeholder="Login"
                                class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                              />
                            </div>
                        </div>
                      </div>
                      <!--1 first name y Last name--> 
                      <div class="-mx-3 flex flex-wrap">
                        <div class="w-full px-3 sm:w-1/2">
                            <div class="mb-5">
                              <label
                                for="fName"
                                class="mb-3 block text-base font-medium text-[#07074D]"
                              >
                                First Name
                              </label>
                              <input
                                type="text"
                                v-model="user.name"
                                name="fName"
                                id="fName"
                                placeholder="First Name"
                                class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                              />
                            </div>
                        </div>
                        <div class="w-full px-3 sm:w-1/2">
                            <div class="mb-5">
                              <label
                                for="fLastName"
                                class="mb-3 block text-base font-medium text-[#07074D]"
                              >
                              Last Name
                              </label>
                              <input
                                type="text"
                                name="fLastName"
                                v-model="user.lastName"
                                id="fLastName"
                                placeholder="Last Name"
                                class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                              />
                            </div>
                        </div>
                      </div>  
                       <!--email--> 
                      <div class="mb-5">
                        <label
                          for="email"
                          class="mb-3 block text-base font-medium text-[#07074D]"
                        >
                          email
                        </label>
                        <input
                          type="text"
                          name="email"
                          v-model="user.email"
                          id="email"
                          disabled
                          placeholder="email@email.com"
                          class="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                      </div>
                    </div>
                    <!-- two-authentications-->
                    <div class="mb-5">
                      <label class="mb-3 block text-base font-medium text-[#07074D]">
                        Enable two factor authentication (2FA)?
                      </label>
                      <div class="flex items-center space-x-6">
                        <div class="flex items-center">
                          <input
                            type="radio"
                            name="two-authentication"
                            id="enable"
                            class="h-5 w-5"
                            value="true"
                            v-model="isTwoFAEnabled"
                            @change="() => handleTwoAuthChange(true)"
                          />
                          <label for="enable" class="pl-3 text-base font-medium text-[#07074D]">
                            Yes
                          </label>
                        </div>
                        <div class="flex items-center">
                          <input
                            type="radio"
                            name="two-authentication"
                            id="disable"
                            class="h-5 w-5"
                            value="false"
                            v-model="isTwoFAEnabled"
                            @change="() => handleTwoAuthChange(false)"
                          />
                          <label for="disable" class="pl-3 text-base font-medium text-[#07074D]">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <!-- Buttons-->
                    <div class="flex justify-between">
                      <!-- <button
                          class="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">Show
                          View Stadistics
                      </button> -->
                      <button
                        type="submit" @click.prevent="change_status_pop()"
                        class="hover:shadow-form rounded-md bg-blue-500 py-3 px-8 text-center text-base font-semibold text-white hover:opacity-50 outline-none">
                        My Stadistics
                      </button>
                      <button
                        class="hover:shadow-form rounded-md bg-red-500 py-3 px-8 text-center text-base font-semibold text-white hover:opacity-50 outline-none"
                        type="submit" @click.prevent="discard"
                      >
                      Discard
                      </button>
                      <button
                        class="hover:shadow-form rounded-md bg-green-500 py-3 px-8 text-center text-base font-semibold text-white hover:opacity-50 outline-none"
                        type="submit" @click.prevent="updateInfoUser"
                      >
                      Save
                      </button>
                      <!-- <button
                        class="hover:shadow-form rounded-md py-3 px-8 text-center text-base font-semibold bg-black text-white hover:opacity-50 outline-none"
                        type="submit"
                      >
                        <router-link to="admin">
                          Web Admin
                        </router-link>
                      </button> -->
                    </div>
                </div>
                <!-- End of about section -->
                <div class="my-4"></div>
                <!-- End of profile tab -->
            
            </div>
        </div>
    </div> 
    <!-- pop up player stadistics -->
    <div v-if="status_pop === true"  class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
			<div class="fixed inset-0 transition-opacity">
				<div class="absolute inset-0 bg-gray-500 opacity-75"></div>
			</div>
            <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div class="mt-5 sm:mt-6">  
                    <span class="flex w-full rounded-md shadow-sm"></span> 
                        <button @click.prevent="change_status_pop()">
                        Close
                        </button>
               </div>
              <div>      
                <player_Stat :my_player="user"/>
              </div>               
            </div>
         </div>  
    </div> 
</template>
  
  <script setup lang="ts">
  import { ref, computed,onUnmounted, onMounted} from 'vue';
  import { useStore } from 'vuex';
  import headerWeb from '../../components/headers/header-web.vue';
  import FileDrop from './FileDrop.vue';
  import axios from 'axios';
  import player_Stat from '../stadistics/player_stat.vue';
  import { toast } from 'vue3-toastify';

  const store = useStore();
  const isLoading = ref(false)
  const user = computed(() => store.state.user.user);
  const status_pop = ref(false);
  const isTwoFAEnabled = ref(true);
  const secret = ref('');
  const QRCodeURL = ref('');
  const userToken = ref('');
  const showSuccessMessage = ref(false);
  const avatar = ref('')
  const imagePayload = ref(null)
  const errorToken = ref(null)

  function handleTwoAuthChange(value: boolean) {
     isTwoFAEnabled.value = value;
  }

  const GenerateTwoFA = async () => {
    try {
        const response = await axios.get('/api/auth/generate-2fa');
        secret.value = response.data.secret;
        QRCodeURL.value = response.data.QRCodeURL;
      } catch (error) {
          console.error("Error generating 2FA:", error);
      }
  }

  const verifyAndEnableTwoFA = async () => {
    try {
        const response = await axios.post('/api/auth/validate-2fa', {
            secret: secret.value,
            token: userToken.value
        });
        if (response.data.isValid) {
            await enable2FAForUser();
        } else {
            errorToken.value = true
        }
    } catch (error) {
        console.error("Error verifying 2FA", error);
    }
  }

  const enable2FAForUser = async () => {
    const token = localStorage.getItem('token');
    const data = {
      secret: secret.value,
      token: userToken.value
    };
    try {
        const response = await axios.post(`/api/auth/enable-2fa`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 'success'){
          showSuccessMessage.value = true;
          errorToken.value = false;
        }
    } catch (error) {
        console.error("Error enabling 2FA:", error);
    }
  }
  
  function discard() {
    store.dispatch('user/refreshUser');  //update user data from back
    avatar.value = (store.state.user.user.images.startsWith('http') ? store.state.user.user.images : 'api/user/' +  store.state.user.user.images) //cambio el avatar por el del back
    //const redirectPath = '/load';
    //router.push(redirectPath);
  }

  function imageLoaded(filePayload: any) {
      imagePayload.value = filePayload  //object (name, url)
      avatar.value = filePayload.url    //actualizo el avatar
  }

  async function updateInfoUser() {
    try {
      let payload;
      if (isTwoFAEnabled.value === false){
        payload= {
        email: user.value.email,
        name: user.value.name,
        lastName: user.value.lastName,
        login: user.value.login,
        first_time: user.value.first_time,
        twoFASecret: null
      };
      } else {
        payload = {
        email: user.value.email,
        name: user.value.name,
        lastName: user.value.lastName,
        login: user.value.login,
        first_time: user.value.first_time
      };
      }
    if (isTwoFAEnabled.value === false) {
        payload.twoFASecret = null;
    }
      await store.dispatch('user/updateInfoUser', payload);
    } catch (error) {
      console.error("Error uploading file or refreshing user data:", error);
    }
    // download image in server if changed
    if (imagePayload.value){
      try {
        await store.dispatch('user/uploadFile', imagePayload.value);
      } catch (error) {
        console.error("Error uploading file or refreshing user data:", error);
      }
    }
    store.dispatch('user/refreshUser');
    toast.success("User data updated.");
  }

  async function updateFirstTime() {
    try {
      let payload: { [key: string]: any } = {
        first_time: false
      };
      await store.dispatch('user/updateInfoUser', payload);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
    store.dispatch('user/refreshUser');
  }

  function change_status_pop() {
    status_pop.value = !status_pop.value;
  }

  onMounted(async () => {
    updateFirstTime();
    store.dispatch('user/refreshUser');
    await GenerateTwoFA();
    setTimeout(() => {
      isTwoFAEnabled.value = user.value.twoFASecret === null ? false:true //user.value.twoFASecret;
      avatar.value = user.value.images.startsWith('http') ? user.value.images : 'api/user/' + user.value.images
      isLoading.value = true
      }, 100);
  });

  onUnmounted(async () => {
    //console.log("unmounted")
    //console.log(user.value)
  });
</script>
  
<style scoped>

</style>