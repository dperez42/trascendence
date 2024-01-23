<template>
    <div>
    <div class="flex flex-col mt-6">
            <section v-if="errored" class="flex flex-col m-6 rounded-lg bg-indigo-100">
                <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>	
            </section>
            <section v-else>
                <div v-if="loading" class="flex ">
                    LOADING
                    <spin_loader></spin_loader>
                </div>    
                <div v-else class="flex flex-col m-6 rounded-lg bg-white ">
                    <div class="rounded-lg bg-gray-500 text-white">
                        <h3 class="py-3 font-bold text-center">USERS</h3>
                    </div>
                    <form>   
                        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search" 
                                v-model="search"
                                class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="Search Users..." required>
                        </div>
                    </form> 
                    <div class="flex flex-col">
                        <div  class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div class="border border-gray-200 md:rounded-lg">
                                    <table class="text-left w-full">
                                        <!-- <thead class="bg-black flex text-white w-full">                   
                                                <tr class="flex w-full mb-4">                                         
                                                <th class="p-4 w-1/3" >Local</th>
                                                <th class="p-4 w-1/3" >Visitante</th>
                                                <th class="p-4 w-1/3" >Tiempo</th>
                                            </tr>
                                        </thead> -->
                                        <tbody class="flex-col items-center justify-between overflow-y-auto h-full bg-white divide-y divide-gray-200">
                                            <tr v-for="(item, index) in  filteredList" :key="index" >
                                                <!-- <td class="flex w-full mb-4 px-4 py-4 text-sm whitespace-nowrap">
                                                    <div class="items-center">
                                                        <img class="items-center object-cover w-12 h-12 -mx-1 border-2 border-white rounded-full shrink-0" 
                                                        :src="my_player.login === item.p1_nick ? imageAvatar: avatar_images[index]"
                                                        alt="">
                                                    </div>
                                                    <div class="flex items-center">
                                                        <img 
                                                            class="object-cover w-12 h-12 -mx-1 border-2 border-white rounded-full shrink-0" 
                                                            :src="my_player.login === item.p2_nick ? imageAvatar: avatar_images[index]"
                                                            alt="">
                                                    </div>
                                                </td> -->
                                                <td class="px-2 py-4 text-sm whitespace-nowrap">
                                                    <div class="flex items-center">
                                                        <img
                                                            class="object-cover w-20 h-20 -mx-1 border-2 border-white rounded-full shrink-0" 
                                                            :src="item.images.startsWith('http') ? item.images : 'api/user/' + item.images" alt=""/>
                                                        <h5 class="px-2 text-xs/5"></h5>
                                                    </div>
                                                </td>
                                                <td class="px-2 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div class="inline">
                                                        <h1 class="font-medium text-gray-800">{{ item.login}}</h1>
                                                    </div>
                                                </td>
                                                <td class="py-3 px-6 text-center">
                                                    <div class="flex item-center justify-center">
                                                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                            @click.prevent="handleModal_add(item)">
                                                            Add
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item error" v-if="search && !filteredList.length">
                        <p>No results found!</p>
                    </div>
                </div>
            </section>
    </div>
    
    <!-- pop up confirm add friends -->
    <div v-if="showModal_add === true"  class="absolute h-full align-middle flexfixed z-10 inset-0 overflow-y-auto">
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
                        @click.prevent="handleModal_add(null)"
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
                    Do you want to add {{ user_choose.login }} as a friend ?
                </div>
                <!--Modal footer-->
                <div
                    class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
                    <button
                        type="button"
                        @click.prevent="handleModal_add(null)"
                        class="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 
                        text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-accent-100 
                        hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                        >
                        Close
                    </button>
                    <button
                        type="button"
                        @click.prevent="$emit('uploadFriend',{contactId: user_choose.id})"
                        class="ml-1 inline-block rounded bg-green-500 px-6 pb-2 pt-2.5
                            text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out 
                            hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] "
                        >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
  
<script setup lang="ts">
    import axios from 'axios'
    import spin_loader from '../../services/spin_loader.vue'
    import { useStore } from 'vuex';
    import {computed, ref, onMounted, watchEffect} from 'vue';
    import { loadContactsAndChats } from './logic/contact.logic';
    import { ContactOrChannel } from '../../types/ContactChannel';

    //emits: ['uploadFriend'],
    const contacts = ref<ContactOrChannel[]>([]);
    const users = ref<any>([]);  
    const errored = ref<any>(false)
    const loading = ref<any>(true)
    const user_choose = ref<any>(null)
    const search = ref<any>('')
    const token = ref<string | null>(localStorage.getItem('token'));
    const store = useStore();
    const user = computed(() => store.state.user.user);
    const friends = computed(() => store.state.contacts.contact);
    //filtered user by search field
    const filteredList = computed(() => {return users.value.filter((item) => item.login.includes(search.value))});

    onMounted(() => {
        //cargo friends
        watchEffect(async () => {
            if(user.value?.id) {
                await loadContactsAndChats(store, contacts, token);
                contacts.value.forEach(contact => contact.status = false);
            }
        });
        
        // cargo los usuarios
        watchEffect(async () => {
           
            const store = useStore();
            const user = computed(() => store.state.user.user);
            await axios.get(`/api/user/`, {
                headers: {
                'Authorization': `Bearer ${token.value}`
                }
                })
                .then(response => {
                        let flag = false
                        for(let item of response.data){
                            if (user.value.id === item.id) {
                                flag = true
                            }
                            
                            for(let friend of friends.value){
                                if (friend.id === item.id){
                                    flag = true
                                }
                            }
                            
                            if (flag === false){
                                users.value.push(item)
                            }
                            flag = false
                        }
                    })
                    .catch(error => {
                        console.error('error onMounted friend', error);
                        errored.value = true;
                    })
                    .finally(() => loading.value = false)
        });
    });

    // Modal Add 
    const showModal_add = ref(false);
    const handleModal_add = (contact:any) => {
        if (showModal_add.value === false) {
            showModal_add.value = true;
            user_choose.value = contact
        } else {
            showModal_add.value = false;	
            user_choose.value = null
        }
    };
</script>
  
<style scoped>
</style>