import { ContactOrChannel } from "@/types/ContactChannel";
import useSocket from "@/views/games/logic/socketGame.logic";
import { Socket } from "socket.io-client";
import { inject } from "vue";
import { toast } from 'vue3-toastify';
import { useStore } from "vuex";

export default function handlesClicks(
	contactsChannels:any,
	activeItem: any,
	$chatSocket: Socket | null,
	onMessageReceived: (data: any) => void
): {
	handleChannelAdded: (newChannel: any) => void;
    handleItemClick: (itemId: string, items: ContactOrChannel[]) => void;
	handleAddClick: (contact: any) => Promise<void>;
	handleContactAddedChat: (login: any) => void;
	handleMessage: (data:any) => void;
	handleChallengeClick: (contact: any, user: any) => void;
	handleContactDelete: (contact: any) => void;
	handleContactAdd: (contact: any) => void;
	handleContactIgnore: (contact: any, user: any) => void;
} {

	const store = useStore();
	const $gameSocket = inject<Socket | null>('$gameSocket', null);
	const { emitUpdateGame } = useSocket($gameSocket);

	const handleChannelAdded = (newChannel: any) => {
		const existingChannel = contactsChannels.value.find((channel: any) => channel.id === newChannel.chat.id);
	
		if (!existingChannel) {
			const channelToAdd = {
				name: newChannel.chat.name,
				id: newChannel.chat.id,
				status: false,
				type: "room"
			};
			contactsChannels.value.push(channelToAdd);
		}
	};

	const handleItemClick = (
		itemId: string,
		items: ContactOrChannel[]
	) => {
		contactsChannels.value = items.map(item => {
			if (item.id === itemId) {
				return { ...item, status: !item.status };
			} else {
				return { ...item, status: false };
			}
		});
		if (activeItem.value) {
			store.getters['chats/getChatById'](activeItem.value.id);
		}
	};

	const handleAddClick = async (
		contact: any
	) => {
		// add contacts  and online
		if (contact && contactsChannels) {
			const response = await store.dispatch('contacts/addContact', { contactId: contact.id });
			const existingContact = contactsChannels.value.find((item: ContactOrChannel) => item.id === contact.id);

			if (existingContact) {
				existingContact.type = "private";
				if ($chatSocket) {
					const currentOnlineUsers = (store.state.contacts.contact || []).map(standardizeUser);
					const standardizedContact = standardizeUser(contact);
					const combinedUsers = [...currentOnlineUsers, standardizedContact];
					
					$chatSocket.emit('contact-online', { message: combinedUsers }, (response: any) => {
						// console.log('Respuesta recibida en el cliente:', response);
						store.dispatch('online/updateOnlineUsers', response.message);
					});
				}
			} else {
				contactsChannels.value.push(response.contact);
			}
		}
	}

	const handleContactAddedChat = (login: any) =>
	{
		if (!contactsChannels.value.some((item: ContactOrChannel) => item.id === login.user.id)) {
			const {roles, ...totalValues} = login.user;
			roles;
			contactsChannels.value.push(totalValues);
		} else {
			toast.error('This user is not in you friends list.');
		}
	}

	function handleMessage(data:any) {
		if(!contactsChannels.value.some((item: ContactOrChannel) => item.id === data.id))
		{
			const {type, ...noContact} = data;
			type;
			contactsChannels.value.push({...noContact, type: 'temp'});
		}
	}

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

	const handleContactDelete = async (contact: any) => {
		if (contact && contactsChannels) {
			const response = await store.dispatch('contacts/deleteContact', { contactId: contact.id });
			if (response && response.status) {
				contactsChannels.value = [...contactsChannels.value.filter((item: any) => item.id !== contact.id)];
				contactsChannels.value  = [...contactsChannels.value.filter((item:any)=> item.type === 'private')];
				console.log(contactsChannels)
			}
		}
	}

	const handleContactAdd = async (contact: any) => {
		if (contact && contactsChannels) {
			const response = await store.dispatch('contacts/addContact', contact);
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
				contactsChannels.value.push(friendToAdd);
			}
		}
	}
/*
	const handleChannelAdded = (newChannel: any) => {
		const existingChannel = contactsChannels.value.find((channel: any) => channel.id === newChannel.chat.id);
	
		if (!existingChannel) {
			const channelToAdd = {
				name: newChannel.chat.name,
				id: newChannel.chat.id,
				status: false,
				type: "room"
			};
			contactsChannels.value.push(channelToAdd);
		}
	};
*/
	const handleContactIgnore = (contact: any, user: any) =>
	{
		console.log("bloqueaste un contacto", contact, user);
	}
	
	const standardizeUser = (user: any) => {
		return {
			id: user.id,
			login: user.login,
			name: user.name,
			images: user.images,
			blocked: user.blocked || false,
		};
	}
	
    onMessageReceived({id: 2});
    return {
        handleChannelAdded,
        handleItemClick,
		handleAddClick,
		handleContactAddedChat,
		handleMessage,
		handleChallengeClick,
		handleContactDelete,
		handleContactAdd,
		handleContactIgnore,
    };
}