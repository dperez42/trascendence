<template>
    <h2 
        @click="showPassModal = !showPassModal; fetchUsers()" 
        class="font-bold text-lg cursor-pointer transition-colors duration-300" 
        :class="showPassModal ? 'text-orange-500' : 'text-black'"
    >
        Users <i class="fa fa-users"></i>
    </h2>
    
    <div v-if="showPassModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black opacity-60"></div>
        <div 
            class="relative mx-auto overflow-hidden rounded-lg shadow-2xl border-t-8 border-blue-500 transform duration-300" 
            :class="[showUserDetails ? 'w-3/4 h-3/4' : 'max-w-md max-h-80vh']"
            style="overflow-y: auto;" 
        >
            <div v-if="isLoading" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <i class="fa fa-spinner fa-spin mb-2"></i>
                <span>Cargando...</span>
            </div>
            
            <div v-if="error" class="p-8">
                <i class="fa fa-exclamation-triangle"></i> {{ error }}
            </div>
            <div v-else class="bg-white p-8">
                <table class="w-full text-sm">
                    <thead>
                        <tr>
                            <th class="border px-4 py-2">Login</th>
                            <th class="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in response.data" :key="user.login">
                            <td class="border px-4 py-2">{{ user.login }}</td>
                            <td class="border px-4 py-2">
                                <i @click="emitChallengeUser(user, user_princ)"   class="fas fa-table-tennis-paddle-ball px-2 cursor-pointer"></i>
                                <i @click="emitChatFast(user)" class="fa fa-comments px-2 cursor-pointer"></i>
                                <i @click="clickShowUserDetails(user.id)" class="fa fa-bar-chart px-2 cursor-pointer"></i>
                                <i v-if = "is_friend(user.id, contactsChannels)" @click="emitDeleteContactUser(user.id)" class="fa fa-user-times font-bold text-red-500 px-2 cursor-pointer"></i>
                                <i v-else @click="emitAddContactUser(user.id, user.blocked)" class="fa fa-user-plus font-bold text-green-500 px-2 cursor-pointer"></i>
                                <i @click="clickBlock(user.id, user.blocked)" 
                                    :class="user.blocked ? 'fa fa-lock font-bold text-red-500' : 'fa fa-unlock font-bold text-green-500'"
                                    class="px-2 cursor-pointer">
                                </i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="errorContact"> contacto existente </div>
                <div class="mb-8 text-center mt-4">
                    <button 
                        @click="showPassModal = false; errorContact = false;" 
                        class="bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-100 py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150"
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            <div 
                class="absolute top-0 right-0 bg-gray-100 p-8 max-h-screen overflow-y-auto h-full w-full transform duration-300 flex flex-col justify-between" 
                :class="{ 'translate-x-full': !showUserDetails }"
            >
                <div>
                    <h3 class="flex-col text-xl text-center font-bold mb-4">USER PROFILE AND STATS</h3>
                    <div v-if="userDetailas" class="flex flex-col items-center space-y-4 text-sm">
                        <div class="bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-xl">
                            <img :src="'api/user/' + userDetailas.images" alt="User Image" class="w-full h-full rounded-full">
                        </div>
                        <div v-if="stats" class="flex-col items-center justify-center space-y-4 w-full p-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-x-2 items-center">
                                    <i class="fas fa-user-circle text-xl"></i>
                                    <span>{{ userDetailas.login }}</span>
                                </div>

                                <div class="space-x-2 items-center">
                                    <i class="fas fa-gamepad text-xl"></i>
                                    <span>{{ stats.totalGames }}</span>
                                </div>

                                <div class="space-x-2 items-center" :class="{ 'text-blue-600': stats.totalWins > stats.totalLosses, 'text-red-600': stats.totalWins <= stats.totalLosses }">
                                    <i class="fas fa-trophy text-xl"></i>
                                    <span>{{ stats.totalWins }}</span>
                                </div>

                                <div class="space-x-2 items-center text-red-600">
                                    <i class="fas fa-skull text-xl"></i>
                                    <span>{{ stats.totalLosses }}</span>
                                </div>

                                <div class="space-x-2 items-center" :class="{ 'text-blue-600': stats.winPercentage >= 50, 'text-red-600': stats.winPercentage < 50 }">
                                    <i class="fas fa-chart-pie text-xl"></i>
                                    <span>{{ stats.winPercentage ? stats.winPercentage.toFixed(2) : '0.00' }}%</span>
                                </div>
                            </div>
                        </div>
                        <div v-if="responseGame.gamesPart && responseGame.gamesPart.length > 0" class="mt-4 w-full">
                            <table class="absolute flex-col text-center justify-between text-xs sm:text-base min-w-full bg-white border border-gray-300 divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th class="px-6 py-3 text-xs sm:text-base font-bold text-gray-500 uppercase">Opponent</th>
                                        <th class="px-6 py-3 text-xs sm:text-base font-bold text-gray-500 uppercase">Goals Against</th>
                                        <th class="px-6 py-3 text-xs sm:text-base font-bold text-gray-500 uppercase">Goals in Favor</th>
                                        <th class="px-6 py-3 text-xs sm:text-base font-bold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="game in responseGame.gamesPart" :key="game.gameid" class="flex-col bg-white border-t border-gray-300 hover:bg-gray-50">
                                        <td class="px-6 py-4 text-xs sm:text-base text-gray-500">{{ game.opponentnick }}</td>
                                        <td class="px-6 py-4 text-xs sm:text-base text-gray-500">{{ game.opponentgoals }}</td>
                                        <td class="px-6 py-4 text-xs sm:text-base text-gray-500">{{ game.playergoals }}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <i v-if="game.playergoals > game.opponentgoals" class="fas fa-trophy text-green-500"></i>
                                            <i v-else-if="game.playergoals < game.opponentgoals" class="fas fa-frown text-red-500"></i>
                                            <i v-else class="fas fa-equals text-blue-500"></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="mt-4 flex justify-center">
                <button 
                    @click="showUserDetails = false" 
                    class="bg-white border-2 border-blue-700 text-blue-700 hover:bg-blue-400 hover:text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150"
                >
                    <i class="fa fa-arrow-left"></i> Volver
                </button>
            </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';



const { userId } = defineProps({
	userId: {
		type: String,
		default: ''
	},
    contactsChannels: {
        type: Array,
        default: null,
    },
});

interface User {
	id: string;
	login: string;
	images: string;
	blocked: boolean;
	status: boolean;
	type: string;
}

interface ResponseTypeUser {
  data: User[];
}

interface Stats {
    averageGoalsPerGame: number;
    goalDifference: number;
    totalGames: number;
    totalLosses: number;
    totalWins: number;
    winPercentage: number;
}

interface gamespart {
    gameid: string;
    opponentid: string;
    opponentnick: string;
    opponentgoals: number;
    playergoals: number;
    goaldifference: number;
    opponentpoints: number;
    playerpoints: number;
    pointsdifference: number;
    gamedate: string;
}

interface ResponseTypeGame {
  gamesPart: gamespart[];
}

interface addUser{
    id: string;
    login: string;
    name: string;
    images: string;
    blocked: boolean;
    status: boolean;
    type: string;
}

const store = useStore();
const user_princ = computed(() => store.state.user.user);
const errorContact = ref(false);



const emit = defineEmits(['AddContactUser', 'DeleteContactUser', 'ChallengeUser', 'BlockUser', 'message-received']);

const showPassModal = ref(false);
const showUserDetails = ref(false);
const response = ref<ResponseTypeUser>({ data: []});
const responseBlock = ref();
const responseGame = ref<ResponseTypeGame>({ gamesPart: []});
const userDetailas = ref<User>();
const isLoading = ref(true);
const error = ref(''); 
const stats = ref<Stats>();

const fetchUsers = async () => {
    isLoading.value = true;
    try {
        const userList: any  = await store.dispatch('user/getUser');
        // normalizo los datos:
        response.value.data = userList.data.map((user: any) => {
            return {
                id: user.id,
                login: user.login,
                name: user.name,
                images: user.images,
                blocked: false,
                status: false,
                type: "private"
            };
        });
        responseBlock.value = await store.dispatch('contacts/getBlockedUsers');
        response.value.data = response.value.data.filter(user => user.id !== userId);
        //bloqueo de estados de usuarios
        responseBlock.value.forEach((blockedUser: any) => {
            if (blockedUser.block && blockedUser.block.id) {
                const userToUpdate = response.value.data.find(user => user.id === blockedUser.block.id);
                if (userToUpdate) {
                    userToUpdate.blocked = true;
                }
            }
        });

    } catch (err) {
        error.value = "Hubo un error al obtener los usuarios.";
        isLoading.value = false;
        console.error("Error obteniendo usuarios:", err);
    } finally {
        isLoading.value = false;
    }
};

const emitAddContactUser = async(userId: string, blocked: boolean) => {
    try {
        const response = await store.dispatch('contacts/addContact', { contactId: userId });
        const userResponse: addUser = {
            id: response.contact.id,
            login: response.contact.login,
            name: response.contact.name,
            images: response.contact.images,
            blocked: blocked,
            status: false,
            type: "private",
        };
        emit('AddContactUser', userResponse);
    } catch (error) {
        errorContact.value = true;
    }
};
const emitDeleteContactUser = (contactId: any) => {
		if (contactId) {
            emit('DeleteContactUser', contactId);
		}
};
const emitChallengeUser = (contact: any, user:any) => {
		if (contact) {
            emit('ChallengeUser', {contact, user});
		}
};

const emitChatFast = (contact: any) => {
    delete contact.blocked;
    delete contact.images;
    delete contact.name;
    if (contact) {
        emit('message-received', contact);
    }
};
const clickShowUserDetails = async(userId: string) =>
{
    try {
        userDetailas.value = response.value.data.find(user => user.id === userId);
        if (!userDetailas.value) return;
        const responseStats = await store.dispatch('games/statsChatGeneral', userDetailas.value.id);
        stats.value = responseStats.data;
        //
        const responseGameData = await store.dispatch('games/statsChat', userDetailas.value.id);
        if (responseGameData.data && responseGameData.data.length > 0) {
            responseGame.value = { gamesPart: responseGameData.data };
        } else {
            responseGame.value = { gamesPart: [] };
        }


        showUserDetails.value = true;
        
    } catch (error) {
        console.error('Error clicke clickShowUserDetails', error);
    }
}

const clickBlock = async(userId: string, blocked: boolean) =>
{
    try {
        const blocker = blocked ? -1 : 631632000;
        await store.dispatch('contacts/updateBlockStatus', {contactId: userId, seconds: blocker } );
        fetchUsers();
        const blockData: any =  {userId, blocked};
        emit('BlockUser', blockData);
    } catch (error) {
        console.error('error clickBlock', error);
    }
}

const is_friend = (user_id: string, friend_list: any): boolean => {
    return friend_list.some((friend: any) => friend.id === user_id);
}

onMounted(() => {
});

</script>


<style scoped>
</style>
