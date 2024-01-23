<template>
	<div class="flex flex-col bg-gray-200 h-screen">
		<header>
			<header-web @message-received="handleMessage"></header-web>
		</header>
		<main class="h-screen">
			<div class="flex flex-row h-full">
				<div class="flex flex-col bg-white border-r border-gray-300 w-1/4 p-4 space-y-6">
<!-- Channels-->
					<section class="bg-white p-4 rounded-lg shadow-xl">
						<div class="flex justify-between items-center mb-3">
							<h2 class="font-bold text-lg">Channels</h2>
								<button @click="openModal" class="hover:bg-gray-200 p-1 rounded">
									<i class="fas fa-users px-1"></i>
								</button>
								<Modal v-if="user"
									v-model="showModal"
									@channel-added="handleChannelAdded"
									:user="user"
								/>
						</div>
						<div class="space-y-1">
							<div 
								v-for="(channel, i) in contactsChannels.filter(item => item.type === 'room')" 
								:key="i" 
								class="flex px-3 rounded hover:bg-orange-500" 
								:class="{'bg-blue-500': channel.status}" 
								@click="handleItemClick(channel.id, contactsChannels)"
							>
								<div class="flex items-center justify-between w-full">
									{{ channel.name }}
									<!-- Ícono de candado si el canal tiene contraseña -->
									<div class="flex items-center justify-end">
										<i
											v-if="channel"
											:class="[
												'fas',
												channel.password && channel.password !== '' ? 'fa-lock text-red-500 px-1 py-1 rounded' : 'fa-unlock text-black px-1 py-1 rounded',
											]"
											@click.stop="togglePassModal(channel)"
										></i>
										<DropdownMenu v-if="user"
											:userId="user.id"
											:channelId="channel.id"
											:nameChannel="channel.name"
											@contact-added="handleContactAddedChat"
											@delete-channel="handleDeleteChannel"
										/>
									</div>
								</div>
							</div>
						</div>
					</section>
<!-- Friends-->
					<section class="bg-white p-4 rounded-lg shadow-xl">
						<div class="cursor-pointer flex justify-between items-center mb-3">
							<h2 class="font-bold text-lg">Friends</h2>
						</div>
						<div class="space-y-1">
							<div
								v-for="(contact, i) in contactsChannels.filter(item => item.type === 'private')" 
								:key="i" 
								class="px-1 py-1 rounded" 
								:class="{'bg-blue-500': contact.status}"
							>
								<div @click="handleItemClick(contact.id, contactsChannels)" class="flex justify-between items-center px-1 py-1 rounded hover:bg-indigo-200">
									<span>{{ 'login' in contact ? contact.login : contact.name }}</span>
									
									<!-- Botones a la derecha -->
									<div class="flex space-x-1">
										<i 
											v-for="(icon, index) in iconsConfig"
											:key="index"
											:class="[icon.class, icon.conditionalClass ? icon.conditionalClass(contact) : '', icon.hoverClass]"
											@click="icon.action ? icon.action(contact, user) : null"
											:aria-hidden="icon.ariaHidden"
										></i>
									</div>
								</div>
							</div>
						</div>
					</section>
<!-- Chat Fast-->
					<section class="bg-white p-4 rounded-lg shadow-xl">
						<h2 class="font-bold text-lg">Chats fast</h2>
						<div class="space-y-1">
							<div
								v-for="(contact, i) in contactsChannels.filter(item => item.type === 'temp')" 
								:key="i" 
								class="px-1 py-1 rounded" 
								:class="{'bg-blue-500': contact.status}" 
							>
								<div  class="flex justify-between items-center px-1 py-1 rounded hover:bg-indigo-20"  @click="handleItemClick(contact.id, contactsChannels)">{{ 'login' in contact ? contact.login : contact.name }}
									<i 
									@click="handleAddClick(contact)" 
									class="fa fa-plus-circle hover:bg-cyan-500 p-1 rounded" 
									aria-hidden="true"
									>
									</i>
								</div>
							</div>
						</div>
					</section>
<!-- Users -->
					<section class="bg-white p-4 rounded-lg shadow-xl">
						<allUsers v-if="user"
							:userId="user.id"
							:contactsChannels="contactsChannels"
							@AddContactUser="AddContactUser"
							@DeleteContactUser="DeleteContactUser"
							@ChallengeUser="handleChallengeClick"
							@message-received="handleMessage"
							@BlockUser="BlockUser"
						/>
					</section>

				</div>
				<div class="flex-1 flex flex-col pl-2 bg-gray-100">
					<div class="messages-container flex-grow overflow-y-auto space-y-4 bg-white p-4 rounded shadow-md">

						<h3 v-if="activeItem && activeItem.id" class="text-xl font-bold mb-4">Messages</h3>
						<div
							v-for="(message, index) in localMessages" 
							:key="index"
							:class="[
								'flex rounded-xl shadow-md p-4 mb-2 overflow-w-auto',
								message.sent ? 'flex text-white msg-received' : 'msg-sent flex bg-white text-black'
							]"
						>
							<div class="flex">
								<span class="font-bold text-black-600 overflow-x-auto mr-2">{{ message.name }}:</span>
								<span>{{ message.text }}</span>
							</div>
						</div>
					</div>
					<div class="border-t border-gray-200 p-2 flex-shrink-0 relative">
						<input
							type="text"
							class="w-full p-2 border rounded pl-8"
							placeholder="Escriba su mensaje..."
							v-model.trim="messageContent"
							@keyup.enter="sendMessage('PRIVMSG', messageContent)"
						/>
						<i class="fas fa-paper-plane absolute top-1/2 left-3  transform -translate-y-1/2"></i>
					</div>
				</div>
			</div>
		</main>
		<footer class="sticky top-[100vh]">
		<footer-web/>
		</footer>
	</div>
	

<!-- Modal para agregar pass -->
	<div v-if="showPassModal" class="fixed inset-0 flex items-center justify-center z-50">
		<div class="absolute inset-0 bg-black opacity-60"></div>
		<div class="bg-white p-8 max-w-md mx-auto rounded-2xl shadow-2xl relative border-t-8 border-blue-500">
			<div class="mb-8 text-center">

				<!-- Mostrar si hay un mensaje de éxito -->
				<div v-if="modalMessageType === 'success'">
					<h2 class="text-2xl font-bold mb-4">Operación exitosa</h2>
					<p class="mb-4">¡Passwrod updated successfully!</p>
				</div>
				
				<!-- Mostrar si hay un error -->
				<div v-else-if="modalMessageType === 'error'" class="flex flex-col items-center justify-center">
					<h2 class="text-2xl font-bold mb-4 text-center">Error</h2>
					<img class="h-40 mb-4" src="/path/error/error404.webp" alt="error"> 
					<p class="text-lg font-medium text-red-600 text-center">{{ PassModalMessage }}</p>
				</div>

				<!-- Mostrar contenido del modal regular (agregar/eliminar contraseña) si no hay mensajes -->
				<div v-else>
					<!-- Si el canal tiene contraseña -->
					<div v-if="currentChannel && currentChannel.password">
						<h2 class="text-2xl font-bold mb-4">Remove password</h2>
						<p class="mb-4">Do you really want to remove the channel password?</p>
					</div>
					<!-- Si el canal no tiene contraseña -->
					<div v-else>
						<h2 class="text-2xl font-bold mb-4">Add password</h2>
						<input v-model="passwordToAdd" type="password" placeholder="type a password" class="border rounded py-2 px-3 w-full mb-4">
					</div>
				</div>

				<!-- Botones -->
				<div class="flex justify-center">
					
					<button v-if="currentChannel && modalMessageType === ''" @click="handlePasswordChange(currentChannel.id)" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150 mr-2">
						{{ currentChannel.password ? 'Eliminar' : 'Agregar' }}
					</button>
					<button @click="showPassModal = false; resetModal()" class="bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-100 py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150 ml-2">Cancelar</button>
				</div>
			</div>
		</div>
	</div>
<!-- modal bloqueo -->
	<div v-if="showModalblock" class="fixed inset-0 flex items-center justify-center z-50">
		<div class="absolute inset-0 bg-black opacity-60"></div>
		<div class="bg-white p-8 max-w-md mx-auto rounded-2xl shadow-2xl relative border-t-8 border-blue-500">
			<!-- Header -->
			<div class="flex justify-between items-center mb-4">
				<p class="text-2xl font-bold">Block User</p>
				<div class="modal-close cursor-pointer z-50" @click="closeModal">
					<i class="fa fa-times"></i>
				</div>
			</div>

			<!-- Body -->
			<div>
				<p class="mb-4">Select block duration:</p>
				<div>
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
				</div>
				<div class="mb-2">
					<input type="radio" id="forever" value="-1" v-model="secondsToBlock" class="mr-2">
					<label for="forever" class="cursor-pointer">Remove</label>
				</div>
			</div>
			<!-- Footer -->
			<div class="flex justify-end mt-4">
				<button @click="handleConfirmBlock" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150">
					Block
				</button>
			</div>
		</div>
	</div>
</template>


<script setup lang="ts">
import { Socket } from 'socket.io-client';
import { ref, inject, computed, onMounted, watchEffect, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';

import { ContactOrChannel } from '../../types/ContactChannel';

import useMessage	from './logic/message.logic';
import { loadContactsAndChats } from './logic/contact.logic';
import handlesClicks  from './logic/eventHandlers.logic'

import Modal		from '@/components/modals/modal-join-channel.vue';
import headerWeb	from '@/components/headers/header-web.vue';
import footerWeb	from '@/components/headers/footer-web.vue'

import DropdownMenu from './components/dropdown-menu.vue'
import allUsers from './components/modal-user.vue'

const token = ref<string | null>(localStorage.getItem('token'));

const contactsChannels = ref<ContactOrChannel[]>([]);

//
const store = useStore();
const user = computed(() => store.state.user.user);



const $chatSocket = inject<Socket | null>('$chatSocket', null);

const activeItem = computed(() => contactsChannels.value.find(channel => channel.status));

const messageContent = ref("");
const { sendMessage } = useMessage($chatSocket, user, activeItem, messageContent, store);
//
const showModal = ref(false);

const openModal = () => {
	showModal.value = true;
};

const secondsToBlock = ref(120);

//modal cana;
const showPassModal = ref(false);
const showPassModalMessage = ref(false);
const PassModalMessage = ref();
const passwordToAdd = ref('');
const currentChannel = ref<ContactOrChannel | null>(null);
const modalMessageType = ref('');

const togglePassModal = (channel: any) => {
    currentChannel.value = channel;
    showPassModal.value = true;
};

const resetModal = () => {
    passwordToAdd.value = '';
    showPassModalMessage.value = false;
    PassModalMessage.value = '';
    modalMessageType.value = '';
};


const handlePasswordChange = async (channelId: string) => {
    if (typeof passwordToAdd.value !== 'undefined') {
        const dataToSend = {
            idChannel: channelId,
            bodyForm: {
                password: passwordToAdd.value
            }
        };
        const response = await store.dispatch('channels/update', dataToSend);

        if (response === true) {
            const channelIndex = contactsChannels.value.findIndex(c => c.id === channelId);
            if(channelIndex !== -1) {
                if (passwordToAdd.value === '') {
                    contactsChannels.value[channelIndex].password = undefined;
                } else {
                    contactsChannels.value[channelIndex].password = passwordToAdd.value;
                }
            }

            showPassModal.value = false;
            resetModal();
        } else {
            showPassModalMessage.value = true;
            PassModalMessage.value = response;
            modalMessageType.value = 'error';
        }
    }
};

//chats pass
const localMessages = computed(() => store.getters['chats/getChatById'](activeItem.value?.id));

// modal block
const showModalblock = ref(false);
const  closeModal = () => showModalblock.value = false;

const { 
	handleChannelAdded,
	handleItemClick,
	handleAddClick,
	handleContactAddedChat,
	handleMessage,
	handleChallengeClick,
	handleContactDelete,
	handleContactIgnore,
	handleDeleteChannel,
	handleConfirmBlock,
} = handlesClicks(contactsChannels, activeItem, $chatSocket, (data) => {
	console.log('return data', data);
}, showModalblock, secondsToBlock);

//friends
const iconsConfig = [
	{
		class: "fa fa-wifi",
		hoverClass: "hover:bg-cyan-500 p-1 rounded",
		conditionalClass: (contact: any) => isUserOnline(contact) ? 'online' : '',
		action: null,
		ariaHidden: true
	},
	{
		class: "fas fa-table-tennis-paddle-ball",
		hoverClass: "hover:bg-cyan-500 p-1 rounded",
		action: handleChallengeClick,
		ariaHidden: true
	},
	{
		class: "fas",
		hoverClass: "hover:bg-cyan-500 p-1 rounded",
		conditionalClass: (contact: any) => isUserBlock(contact) ? 'blocked' : 'unblocked',
		action: handleContactIgnore,
		ariaHidden: true
	},
	{
		class: "fa fa-user-times",
		hoverClass: "hover:bg-cyan-500 p-1 rounded",
		action: handleContactDelete,
		ariaHidden: true
	}
];

const isUserOnline = (contact: any) => {
    const online = store.state.online.onlineUsers.some((user: any) => user.id === contact.id);
    return online;
};

// usuarios bloqueados

const isUserBlock = (contact: any) => {
    return contact.blocked? true: false;
};

const contactBLock = async () => {
	try {
		const response = await store.dispatch('contacts/getBlockedUsers');
		const blockedIdsSet = new Set(response.map((item: any) => item.block.id));
		contactsChannels.value = contactsChannels.value.map(item => {
			if (blockedIdsSet.has(item.id)) {
				return { ...item, blocked: true };
			}
			return item;
		});
	} catch (error: any) {
		console.error("Error connect contact block:", error.response.data.message);
		// console.clear();
		// throw error;
	}
}
//
const handleOnlineUsersChange = (newLength: number, oldLength: number): void => {
    console.log('Cambio en onlineUsers. Nueva longitud:', newLength, oldLength);
};

const standardizeUser = (user: any) => {
		return {
			id: user.id,
			login: user.login,
			name: user.name,
			images: user.images,
			blocked: user.blocked || false,
		};
	}

const AddContactUser = async(data: any) => {
	const existingContact = await contactsChannels.value.find((item: ContactOrChannel) => item.id === data.id);
	if (!existingContact) {
		contactsChannels.value.push(data);
		if ($chatSocket) {
			const currentOnlineUsers = (store.state.contacts.contact || []).map(standardizeUser);
			const standardizedContact = standardizeUser(data);
			const combinedUsers = [...currentOnlineUsers, standardizedContact];
			$chatSocket.emit('contact-online', { message: combinedUsers }, (response: any) => {
				console.log('Respuesta del servidor:', response);
				store.dispatch('online/updateOnlineUsers', response.message);
			});
		}
	}
};

const DeleteContactUser = async (data: any) => {
	if (data && contactsChannels) {
			const response = await store.dispatch('contacts/deleteContact', { contactId: data });
			if (response && response.status) {
				contactsChannels.value = [...contactsChannels.value.filter((item: any) => item.id !== data)];
			}
		}
};



const BlockUser = (dataBlock: any) => {
    contactsChannels.value = contactsChannels.value.map(item => {
        if (item.id === dataBlock.userId) {
            return { ...item, blocked: !dataBlock.blocked };
        }
        return item;
    });
};


onMounted(() => {
	watch(
		() => store.state.online.onlineUsers.length,
		handleOnlineUsersChange
	);
	
	watchEffect(async () => {
        if(user.value?.id) {
			await loadContactsAndChats(store, contactsChannels, token);
            contactsChannels.value.forEach(contact => contact.status = false);
			await contactBLock();
        }
    });
});

onBeforeUnmount(() => {
});

</script>
 
<style scoped>
.msg-sent {
	background-color: green!important;
	color: white!important;;
	align-self: flex-end;
	text-align: right;
}
.msg-received {
	background-color: white;
	color: black!important;
	align-self: flex-start;
	text-align: left;
}

.messages-container {
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	overflow-x: auto;
}
.online {
	color: rgb(0, 255, 0);
}

.blocked::before {
    content: "\f023";
    color: #e74c3c;
}

.unblocked::before {
    content: "\f09c";
    color: black;
}
</style>
