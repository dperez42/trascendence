<template>
		<i class="fas fa-gear px-1 py-1 rounded"
        @click.stop="openMenu"
        ></i>

	<div v-if="isOpen" class="dropdown-menu z-50 absolute mt-2 w-48 bg-white border border-gray-200 rounded shadow-md">
        <a @click.stop="handleDeleteChannel(channelId!)" class="block px-4 py-2 hover:bg-blue-500 hover:text-white">
            <i class="fas fa-trash"></i> Delete Channel
        </a>
        <a @click.stop="handleClick(userId!, channelId!)" class="block px-4 py-2 hover:bg-blue-500 hover:text-white">
            <i class="fas fa-cogs"></i> View user channel
        </a>
    </div>

    <!-- Fondo oscuro solo cuando el modal esté abierto -->
    <div v-if="isModalOpen" class="absolute  inset-0 bg-gray-500 opacity-50 z-40"></div>
    
	<div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-2xl shadow-2xl w-1/2 border-t-8 border-blue-500">
            <h2 class="text-2xl mb-4">{{nameChannel}} Users</h2>
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-4 py-2 bg-gray-100 text-left">User</th>
                        <th class="px-4 py-2 bg-gray-100 text-left">Rol</th>
                        <th class="px-4 py-2 bg-gray-100 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in filteredData(data)" :key="item.id">
                        <td class="px-4 py-2">{{ item.user.login }}</td>
                        <td class="px-4 py-2">{{ item.rol }}</td>
                        <td class="px-4 py-2 flex justify-around items-center">
                            <i 
                                @click="kick(item.user.id, channelId,)" 
                                class="fa fa-user-times cursor-pointer hover:text-blue-500" 
                                :class="{'opacity-50 pointer-events-none': item.user.id == userId}" 
                                aria-hidden="true"
                            ></i>
                            <i @click="() => { if(item.rol !== 'admin') moderator(item.user.id, channelId, item.rol) }"
                                class="fa fa-user-shield cursor-pointer hover:text-blue-500"
                                :class="{'opacity-50 pointer-events-none': item.user.id == userId}"
                                aria-hidden="true"
                            ></i>
                            <i 
                                @click="silence(item.user.id, channelId, item.silence)" 
                                class="fa fa-volume-mute cursor-pointer" 
                                :class="{'text-red-500': item.silence, 'text-black': !item.silence}" 
                                aria-hidden="true"
                            ></i>
                            <i 
                                @click="msgPrv(item)" 
                                class="fa fa-comments cursor-pointer hover:text-green-500" 
                                :class="{'opacity-50 pointer-events-none': item.user.id == userId}" 
                                aria-hidden="true"
                            ></i>
                        </td>

                    </tr>
                </tbody>
            </table>
            <slot>
                <h3 class="p-2">Remember that if you are the last admin and leave the channel you will loose your priviledges and the oldest moderator or user will be admin, are you sure?</h3>
            </slot>
            <div v-if="!isConfirmingExit">
                <button @click.stop="isConfirmingExit = true" class="mt-4 mr-2 px-4 py-2 bg-red-500 text-white rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150">
                    Channel Exit
                </button>
                <button @click="isModalOpen = false; noAccessLevel = false" class="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150">
                    Close
                </button>
            </div>
            
            <p v-if="noAccessLevel" class="text-red-500 w-full text-center mb-4 rounded">{{ messageError }}</p>
            <div v-if="isConfirmingExit" class="mt-4 flex flex-col items-center">
                <p v-if="data.length < 2" class="text-red-500 w-full text-center mb-4 rounded">You are the only one on the channel, do you want to leave?</p>

                <div class="w-full flex justify-between">
                    <button @click.stop="leaveChat(channelId!); noAccessLevel = false" class="w-1/2 mr-2 px-4 py-2 bg-red-600 text-white rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150">
                        Do you want to leave the channel?
                    </button>
                    <button @click.stop="isConfirmingExit = false" class="w-1/2 ml-2 px-4 py-2 bg-gray-300 text-black rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
    <cancelAceptModal 
        :isVisibleCancelAcept="isVisibleCancelAcept" 
        :message=message
        :title="modalTitle" 
        @confirm="confirmDelete" 
        @cancel="cancelDelete"
    />

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import { useStore } from 'vuex';
import cancelAceptModal		from '@/components/modals/cancel-acept.vue';


const store = useStore();
const data = ref<UserItem[]>([]);
const token = ref<string | null>(localStorage.getItem('token'));

interface UserItem {
    id: number;
	rol: string;
	silence: boolean;
    user: {
		id: string;
        login: string;
        name: string;
        images: string;
        roles: [];
        status: boolean;
        type: string;
    };
}
const defaultUserItem: UserItem = {
    id: 0,
	rol: '',
	silence: false,
    user: {
        id: '',
        login: '',
        name: '',
        images: '',
        roles: [],
        status: false,
        type: 'temp'
    }
};

const { userId, channelId, nameChannel } = defineProps({
	userId: {
		type: String,
		default: ''
	},
	channelId: {
		type: String,
		default: ''
	},
	nameChannel: String
});

const emit = defineEmits(['contact-added', 'delete-channel']);



const isVisibleCancelAcept = ref(false);
const message = ref('');
const modalTitle = ref('');
const messageError = ref('');
const channelIdToDelete = ref<string | null>(null)


const isOpen = ref(false);
const noAccessLevel = ref(false);
const isConfirmingExit = ref(false);
const isModalOpen = ref(false);

const closeMenu = (e: Event) => {
  if ((e.target as HTMLElement).classList.contains('dropdown-button')) {
    return;
  }

  if (e.target && !(e.target as HTMLElement).closest('.dropdown-menu')) {
    isOpen.value = false;
  }
};

const filteredData = (data: UserItem[]) => {
        return data.filter((item: any) => item.rol !== 'invisible');
}

const openMenu = () => {
  isOpen.value = true;

  setTimeout(() => {
    isOpen.value = false;
  }, 5000);
};

const handleClick = (userId: string, channelId: string) => {
    if (!userId || !channelId) {
        console.error("userId or channelId is missing");
        return;
    }
    isOpen.value = false;
    isModalOpen.value = true;
    callUserChat(channelId);
};
//modal:

const confirmDelete = async () => {
    try {
        const response = await store.dispatch('channels/remove', channelIdToDelete.value);
        emit('delete-channel', response, channelId);
        isVisibleCancelAcept.value = false;
    } catch (error: any) {
        if (error.response) {
            message.value = error.response.data.message;            
        } else {
            console.error("Error deleting a channel:", error.message);
        }
    }
};

const cancelDelete = () => {
    isVisibleCancelAcept.value = false;
    message.value = '';
}

const handleDeleteChannel = (channelId: string) => {
    channelIdToDelete.value = channelId;
    modalTitle.value = "Do you really want to delete this channel?";
    isVisibleCancelAcept.value = true;
};

//
const leaveChat = async (channelId: string) => {
    try {
        const response = await store.dispatch('channels/chatout', channelId);
        isModalOpen.value = false;
        emit('delete-channel', response, channelId);
    } catch (error: any) {
        if (error.response) {
            console.log(error.response.data.message);
        } else {
            console.error("Error deleting the channel:", error.message);
        }
    }
}

const kick = async(userId: string, channelId: string) =>{
	try {
        await store.dispatch('chat/deleteUserChat', { userIdDelete: userId, chatId: channelId });
        data.value = data.value.filter((item: any) => item.user.id !== userId);
    } catch (error: any) {
        if (error.response) {
            noAccessLevel.value = true;
            messageError.value = error.response.data.message;
        } else {
            console.error("Error deleting the user:", error.message);
        }
    }
}

const moderator = async( userId: string, channelId: string, moderator: string) =>{
    const moderatorUser = moderator === 'user' ? 'moderator': 'user';
    try {
        await store.dispatch('chat/moderatorUserChat', { userIdModerator: userId, chatId: channelId, rol: moderatorUser});
        data.value = data.value.map((item: any) => {
            if (item.user.id === userId) {
                item.rol = moderatorUser;
            }
            return item;
        });
    } catch (error: any) {
        if (error.response) {
            noAccessLevel.value = true;
            messageError.value = error.response.data.message;
        } else {
            console.error("Error changing the user's role:", error.message);
        }
    }
}

const silence = async( userId: string, channelId: string, silence: boolean) =>{
    try {
        await store.dispatch('chat/silenceUserChat', { userIdSilence: userId, chatId: channelId, silence: !silence });
        data.value = data.value.map((item: any) => {
            if (item.user.id === userId) {
                item.silence = !silence;
            }
            return item;
        });
    } catch (error: any) {
        if (error.response) {
            noAccessLevel.value = true;
            messageError.value = error.response.data.message;
            
        } else {
            console.error("Error silencing the user:", error.message);
        }
    }
}




const msgPrv = (item: any) =>{
	isModalOpen.value = false;
	emit('contact-added', item);
}

//data
async function callUserChat(channelId:string)
{
	try {
		const response = await store.dispatch('chat/fetchChatByIdDetailUser', { token: token.value, channelId });
		const arrayResponse = Object.values(response);
		data.value = await Promise.all(arrayResponse.map(mergeWithDefault));
        isConfirmingExit.value = false;
	} catch (error) {
		console.error("Error fetching chat data:", error);
	}
}

async function mergeWithDefault(item: any): Promise<UserItem> {
  return {
    ...defaultUserItem,
    ...item,
    user: {
      ...defaultUserItem.user,
      ...item.user,
      status: item.user?.status ?? defaultUserItem.user.status
    }
  };
}

onMounted(() => {
	document.addEventListener('click', closeMenu);
	watchEffect(async () => {
		
	});
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>
