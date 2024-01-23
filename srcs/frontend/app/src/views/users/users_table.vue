<template>
    <div class="m-10">
        <div class="flex flex-col mt-6 space-y-6">
            <section v-if="error===true">
                <p class="py-5 text-xl font-bold text-red-600">We're sorry, we're not able to retrieve this information at the moment, please try back later</p>    
            </section>
            <section v-else class="min-w-full max-h-full">
                <div v-if="isLoading">
                    <spin_loader></spin_loader>
                </div>
                <div v-else>
                    <!-- Search box -->
                    <div>
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
                    </div>
                    <!-- Users Table-->
                    <div class="overflow-y-auto">
                        <table class="min-w-full  bg-white divide-y divide-gray-200">
                        <tbody class="bg-white divide-y divide-gray-300">
                            <tr v-for="(item, index) in filteredList" :key="index" class="hover:bg-gray-200 transition ease-in-out duration-150">
                                <td class="px-4 py-4">
                                    <h2 class="text-lg font-bold text-blue-500">{{item.login}}</h2>
                                </td>
                                <td class="px-4 py-4">
                                    <!-- <img class="object-cover w-20 h-20 border-2 border-white rounded-full" :src="'api/user/' + item.images" alt=""/> -->
                                    <img 
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
                                <!-- friend ? -->
                                <td class="px-4 py-4">
                                    <div v-if=" !is_friend(item.id, friends)" class="cursor-pointer hover:text-blue-500" 
                                        @click.prevent="handleModal_add(item)">
                                        <i class="fa fa-user-plus font-bold text-green-500" aria-hidden="true"></i>
                                        <span class="font-bold text-blue-500"> Add Friend</span>
                                    </div>
                                    <div v-else class="cursor-pointer hover:text-blue-500" 
                                        @click.prevent="handleModal_del(item)">
                                        <i class="fa fa-user-minus font-bold text-red-500" aria-hidden="true"></i>
                                        <span class="font-bold text-blue-500"> Remove Friend</span>
                                    </div>
                                </td> 
                                <!-- control block users-->
                                <td class="px-4 py-4">
                                    <div v-if=" !is_blocked(item.id)" class="cursor-pointer hover:text-blue-500" 
                                        @click.prevent="handleModal_block(item)">
                                        <i class="fa fa-unlock font-bold text-green-500" aria-hidden="true"></i>
                                        <span class="font-bold text-blue-500"> Block User</span>
                                    </div>
                                    <div v-else class="cursor-pointer hover:text-blue-500" 
                                        @click.prevent="handleModal_block(item)">
                                        <i class="fa fa-lock font-bold text-red-500" aria-hidden="true"></i>
                                        <span class="font-bold text-blue-500"> Unblock User</span>
                                    </div>
                                </td>
                                 <!-- admin test: -->
                                 <td class="px-4 py-4">
                                        <div v-if="user && user.roles && user.roles.some((role: any) => role === 'admin' || role === 'super-user')" class="cursor-pointer hover:text-blue-500" 
                                        @click.prevent="adminRol(item)">
                                        <div v-if="rolUser(item.roles) === 'user'" class="cursor-pointer hover:text-blue-500">
                                            <i class="fa fa-user font-bold text-red-500 px-1" aria-hidden="true"></i>
                                            <span class="font-bold text-blue-500"> {{ rolUser(item.roles) }}</span>
                                        </div>
                                        <div v-else class="cursor-pointer hover:text-blue-500">
                                            <i class="fa fa-crown font-bold text-green-500 px-1" aria-hidden="true"></i>
                                            <span class="font-bold text-blue-500"> {{ rolUser(item.roles) }}</span>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-4 py-4">
                                    <div v-if="user && user.roles && user.roles.some((role: any) => role === 'admin')" class="cursor-pointer hover:text-blue-500" 
                                        @click.prevent="adminBlock(item)">
                                        <div v-if="isActive(item.isActive) === 'Active'" class="cursor-pointer hover:text-blue-500">
                                            <i class="fa fa-globe font-bold text-green-500 px-1" aria-hidden="true"></i>
                                            <span class="font-bold text-blue-500"> {{ isActive(item.isActive) }}</span>
                                        </div>
                                        <div v-else class="cursor-pointer hover:text-blue-500">
                                            <i class="fa fa-skull font-bold text-red-500 px-1" aria-hidden="true"></i>
                                            <span class="font-bold text-blue-500"> {{ isActive(item.isActive) }}</span>
                                        </div>
                                    </div>
                                </td>
                           </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
            </section>
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
                            <FieldSection :game="friend_game(choose_user, games)" :cam="cam" v-if ="friend_game(choose_user, games)!=null"/>
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
                            <player_Stat :my_player="choose_user"/>
                        </div>
                        <!--Modal footer-->
                        <!--Modal footer-->
                        <div class="mt-4 flex justify-center">
                            <button 
                                @click="handleModal_stat(null)" 
                                class="bg-white border-2 border-blue-700 text-blue-700 hover:bg-blue-400 hover:text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150"
                            >
                                <i class="fa fa-arrow-left"></i> Back
                            </button>
                        </div>
                    </div>  
                </div>
        </div>
<!-- pop up confirm add friend-->
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
                                    ADD A FRIEND
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
                        <div class="relative flex-auto p-4" > 
                            Really do you want to add {{choose_user.login}} as friend?
                        </div>
                        <!--Modal footer-->
                        <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
                            <button
                                type="button"
                                @click.prevent="handleModal_add(null)"
                                class="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 
                                        text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out 
                                        hover:bg-primary-accent-100 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                            >
                                    Close
                            </button>
                            <button
                                type="button"
                                @click.prevent="ContactAdd(choose_user), handleModal_add(choose_user)"
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
<!-- pop up confirm delete friend-->
        <div v-if="showModal_del === true" class="absolute h-full align-middle flexfixed z-10 inset-0 overflow-y-auto">
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
                                @click.prevent="handleModal_del(null)"
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
                            Do you want to remove {{choose_user.login}} as a friend ?
                        </div>
                        <!--Modal footer-->
                        <div
                            class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
                            <button
                                type="button"
                                @click.prevent="handleModal_del(null)"
                                class="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 
                                        text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out 
                                        hover:bg-primary-accent-100 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                            >
                                    Close
                            </button>
                            <button
                                type="button"
                                @click.prevent=" ContactDelete(choose_user), handleModal_del(choose_user)"
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
<!-- modal bloqueo -->
        <div v-if="showModal_block" class="fixed inset-0 flex items-center justify-center z-50">
            <div class="absolute inset-0 bg-black opacity-60"></div>
            <div class="bg-white p-8 max-w-md mx-auto rounded-2xl shadow-2xl relative border-t-8 border-blue-500">
                <!-- Header -->
                <div class="flex justify-between items-center mb-4">
                    <p class="text-2xl font-bold">Block Usersss</p>
                    <div class="modal-close cursor-pointer z-50" @click.prevent="handleModal_block(choose_user)">
                        <i class="fa fa-times"></i>
                    </div>
                </div>

                <!-- Body -->
                <div>
                    <p class="mb-4">Select block duration:</p>
                    <div class="mb-2">
                        <input type="radio" id="oneMinute" value="60" v-model="secondsToBlock" class="mr-2">
                        <label for="oneMinute" class="cursor-pointer">1 minute</label>
                    </div>
                    <div class="mb-2">
                        <input type="radio" id="twoMinutes" value="120" v-model="secondsToBlock" class="mr-2">
                        <label for="twoMinutes" class="cursor-pointer">2 minutes</label>
                    </div>
                    <div class="mb-2">
                        <input type="radio" id="fiveMinutes" value="300" v-model="secondsToBlock" class="mr-2">
                        <label for="fiveMinutes" class="cursor-pointer">5 minutes</label>
                    </div>
                    <div class="mb-2">
                        <input type="radio" id="oneHour" value="3600" v-model="secondsToBlock" class="mr-2">
                        <label for="oneHour" class="cursor-pointer">1 hour</label>
                    </div>
                    <div class="mb-2">
                        <input type="radio" id="oneHour" value="631632000" v-model="secondsToBlock" class="mr-2">
                        <label for="oneHour" class="cursor-pointer">Forever</label>
                    </div>
                    <div class="mb-2">
                        <input type="radio" id="forever" value="-1" v-model="secondsToBlock" class="mr-2">
                        <label for="forever" class="cursor-pointer">Remove</label>
                    </div>
                </div>
                <!-- Footer -->
                <div class="flex justify-end mt-4">
                    <button @click="handleConfirmBlock()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150">
                        Block
                    </button>
                </div>
            </div>
        </div>
</template>
  
<script setup lang="ts">
import player_Stat from '../stadistics/player_stat.vue';
import { useStore } from 'vuex';
import {computed, inject,ref, onMounted, watchEffect } from 'vue';
import spin_loader from '../../services/spin_loader.vue';
import FieldSection from '../games/field.vue'
import { Socket } from 'socket.io-client';
import useSocket from '../games/logic/socketGame.logic';
import { ContactOrChannel } from '../../types/ContactChannel';
import { loadContactsAndChats } from '../friends/logic/contact.logic';
import { toast } from 'vue3-toastify';

const users = ref<any>([]);                     //List of Users
const search = ref<any>('')
const filteredList = computed(() => {return users.value.filter((item: any) => item.login.includes(search.value))});
const friends = ref<ContactOrChannel[]>([]);    //List of friends
const blocked_users = ref<any>([]);             //List of blocked Users by user

const store = useStore();
const games = computed(() => store.state.games.games);
// const onlineUsers = computed(() =>store.state.online.onlineUsers);
const onlineAllUsers = computed(() =>store.state.online.allonlineUsers);

const token = ref<string | null>(localStorage.getItem('token'));
const user = computed(() => store.state.user.user);

const isLoading = ref<any>(true)
const error = ref<any>(false)

const choose_user = ref<any>(null)
const cam = ref<any>(null)

const $gameSocket = inject<Socket | null>('$gameSocket', null);
// const $chatSocket = inject<Socket | null>('$chatSocket', null);
const { emitUpdateGame } = useSocket($gameSocket);

const secondsToBlock = ref(120);
//--- CHECK STATUS -----
//check if is in online
const is_online = (contact: any) => {
    const online = onlineAllUsers.value.some((user: any) => user.userId === contact.id);
    return online;
};
//check if is playing
const is_playing = (user_id:any, games:any) => {
    for(let game of games){
        if (game.p1id === user_id || game.p2id === user_id) {
            return true
        }
	}
    return false
};
//check if is blocked
const is_blocked = (userId: string) => {
    return blocked_users.value.some((user: any) => user.block.id === userId)
};
// check is friend
const is_friend = (user_id: string, friends:any): boolean => {
    return friends.some((friend: any) => friend.id === user_id);
};
//--- ACTIONS ----
// remove friend
const ContactDelete = async (contact: any) => {
    if (contact && friends) {
        const response = await store.dispatch('contacts/deleteContact', { contactId: contact.id });
        response;
        friends.value = [...friends.value.filter((item: any) => item.id !== contact.id)];
		friends.value  = [...friends.value.filter((item:any)=> item.type === 'private')];
			
    }
}
// add friend
const ContactAdd = async (contact: any) => {
	if (contact && friends) {
		const response = await store.dispatch('contacts/addContact', {contactId: contact.id});
		if (response && response.status) {
				const friendToAdd = {
					name: response.contact.name,
					lastName: response.contact.lastName,
					id: response.contact.id,
					login: response.contact.login,
					images: response.contact.images,
					status: true,
					blocked: false,
					type: "private"
				};
				friends.value.push(friendToAdd);
		}
	}
}
// send challenge
const handleChallengeClick = (contact: any, user: any) => {
		emitUpdateGame({
				command: "CHALLENGE_ASK", 
				params: {
				player_id : user.id,
				player_nick : user.login,
				contact_id : contact.id,
				contact_nick : contact.login,
				timestamp: Date.now()
				}
		}); 
        toast.success("Mandado reto a " + contact.login);
};
// view on line game
const friend_game = (friend:any, games:any) => {
    for(let game of games){
        if (game.p1id === friend.id || game.p2id === friend.id) {
            return game
        }
    }
    return null
};
// Handle confirm block
const handleConfirmBlock = async () => {
		try {
			const response = await store.dispatch('contacts/updateBlockStatus',
			{ 
				contactId: choose_user.value.id,
				seconds: secondsToBlock.value
			});
			showModal_block.value = false;
            blocked_users.value = await store.dispatch('contacts/getBlockedUsers');
			choose_user.value = null;
			return response;
		} catch (error) {
			console.error("Error al bloquear contacto:", error);
			// throw error;
		}
};
//--- WATCHERS ----
const isActive = (activity: boolean) => {
    if (activity===true){
        return 'Active';
    }
    else {
        return 'Banned';
    }
}

const adminBlock = (user: any) => {
    if (user.isActive===true){
        user.isActive=false;
        console.log('false');
    }
    else {
        user.isActive=true;
        console.log('true');
    }
    store.dispatch('user/updateActivityUser', { id: user.id, activity: user.isActive });
}

// ------ MODALS --------
// Modal to view game
const showModal_lived_game = ref(false);
const handleModal_lived_game = (contact: any) => {
    if (showModal_lived_game.value === false) {
		showModal_lived_game.value = true;
		choose_user.value = contact
	} else {
		showModal_lived_game.value = false;	
		choose_user.value = null
	}
};
// Modal to show stadistics
const showModal_stat = ref(false);
const handleModal_stat = (contact:any) => {
    if (showModal_stat.value === false) {
		showModal_stat.value = true;
		choose_user.value = contact
	} else {
		showModal_stat.value = false;	
		choose_user.value = null
	}
};
// Modal to add friend
const showModal_add = ref(false);
const handleModal_add = (contact:any) => {
    if (showModal_add.value === false) {
		showModal_add.value = true;
		choose_user.value = contact
	} else {
		showModal_add.value = false;	
		choose_user.value = null
	}
};
// Modal to delete friend
const showModal_del = ref(false);
const handleModal_del = (contact:any) => {
    if (showModal_del.value === false) {
		showModal_del.value = true;
		choose_user.value = contact
	} else {
		showModal_del.value = false;	
		choose_user.value = null
	}
};
// Modal to block user
const showModal_block = ref(false);
const handleModal_block = (contact:any) => {
    if (showModal_block.value === false) {
		showModal_block.value = true;
		choose_user.value = contact
	} else {
		showModal_block.value = false;	
		choose_user.value = null
	}
};
// admin control
const rolesOrder = ['user', 'super-user'];

const rolUser = (roles: any[]): any => {
    if (!roles) {
        return null;
    }
    
    if (roles.length > 0) {
        return roles[roles.length - 1];
    }
    return null;
}

const adminRol = async (user: any) => {
    if (!user || !user.roles) {
        console.error("Usuario o roles no definidos");
        return;
    }
    const originalRoles = [...user.roles];
    const currentRole = rolUser(user.roles);
    const currentIndex = rolesOrder.indexOf(currentRole);
    const nextIndex = (currentIndex + 1) % rolesOrder.length;
    
    user.roles.push(rolesOrder[nextIndex]);
    user.roles = [rolesOrder[nextIndex]];

    try {
        await store.dispatch('user/updateRolUser', { id: user.id, rol: rolesOrder[nextIndex] });
    } catch (error) {
        user.roles = originalRoles;
    }
};

//
onMounted(() => {
    //cargo friends
	watchEffect(async () => {
        if(user.value?.id) {
			await loadContactsAndChats(store, friends, token);
            friends.value.forEach((friends: any) => friends.status = false);
        }
    });
    // cargo los usuarios
    watchEffect(async () => {
        isLoading.value = true;
        try {
            const userList: any  = await store.dispatch('user/getUser');
            // normalizo los datos:
            users.value = await userList.data.map((userr: any) => {
                //console.log('', userr)
                return {
                    id: userr.id,
                    login: userr.login,
                    name: userr.name,
                    images: userr.images,
                    isActive: userr.isActive,
                    blocked: false,
                    status: false,
                    type: "private",    
                    roles: userr.roles || []
                }
            });
            // Elimino actual user
            users.value = await users.value.filter((userr: any) => userr.id !== user.value.id);
            blocked_users.value = await store.dispatch('contacts/getBlockedUsers');
        } catch (err) {
            error.value = "Hubo un error al obtener los usuarios.";
            isLoading.value = false;
            console.log("Error obteniendo usuarios:", err);
        } finally {
            isLoading.value = false;
        }
    });
  });
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
 
  </style>