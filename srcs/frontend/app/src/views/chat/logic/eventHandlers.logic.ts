import { ContactOrChannel } from "@/types/ContactChannel";
import useSocket from "@/views/games/logic/socketGame.logic";
import { Socket } from "socket.io-client";
import { Ref, inject, ref } from "vue";
import { toast } from 'vue3-toastify';
import { useStore } from "vuex";

export default function handlesClicks(
	contactsChannels:any,
	activeItem: any,
	$chatSocket: Socket | null,
	onMessageReceived: (data: any) => void,
	showModalblock: Ref<boolean> ,
	secondsToBlock: Ref<number>
): {
	handleChannelAdded: (newChannel: any) => void;
    handleItemClick: (itemId: string, items: ContactOrChannel[]) => void;
	handleAddClick: (contact: any) => Promise<void>;
	handleContactAddedChat: (login: any) => void;
	handleDeleteChannel: (login: any, idChannel: string) => void;
	handleMessage: (data:any) => void;
	handleChallengeClick: (challenge: any) => void;
	handleContactDelete: (contact: any) => void;
	handleContactIgnore: (contact: any, user: any) => void;
	handleConfirmBlock: () => void;
} {

	const store = useStore();
	const $gameSocket = inject<Socket | null>('$gameSocket', null);
	const { emitUpdateGame } = useSocket($gameSocket);
	const contactRef = ref();



	const handleChannelAdded = (newChannel: any) => {
		const existingChannel = contactsChannels.value.find((channel: any) => channel.id === newChannel.chat.id);
		if (!existingChannel) {
			const channelToAdd = {
				name: newChannel.chat.name,
				id: newChannel.chat.id,
				status: false,
				password: newChannel.chat.password? '*****' : '',
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
			toast.error('This user is not in your friends list.');
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


	const handleChallengeClick = (challenge: any, externalUser: any = null) => {
	
		const contact = challenge?.contact || challenge;
		const finalUser = challenge.user || externalUser;
		
		if (finalUser && contact) {
			emitUpdateGame({
				command: "CHALLENGE_ASK", 
				params: {
					player_id: finalUser.id,
					player_nick: finalUser.login,
					contact_id: contact.id,
					contact_nick: contact.login,
					timestamp: Date.now()
				}
			});
		} else {
			console.error("User or Contact data is missing");
		}
	};

	const handleContactDelete = async (contact: any) => {
		if (contact && contactsChannels) {
			const response = await store.dispatch('contacts/deleteContact', { contactId: contact.id });
			if (response && response.status) {
				contactsChannels.value = [...contactsChannels.value.filter((item: any) => item.id !== contact.id)];
			}
		}
	}

	
	const handleDeleteChannel = (channel: any, idChannel: string) =>
	{
		const updatedContactsChannels = contactsChannels.value.filter((item: ContactOrChannel) => item.id !== idChannel);
		contactsChannels.value = updatedContactsChannels;
	}
	
	const handleContactIgnore = async (contact: any, user: any) => {
		user;
		contactRef.value = contact;
		if (contact) {
			showModalblock.value = true;
		}
	}

	const handleConfirmBlock = async () => {
		try {
			const response = await store.dispatch('contacts/updateBlockStatus',
			{ 
				contactId: contactRef.value.id,
				seconds: secondsToBlock.value
			});
			showModalblock.value = false;

			contactsChannels.value = contactsChannels.value.map((item: any) => {
				if (item.id === contactRef.value.id) {
					return { ...item, blocked: secondsToBlock.value > 0 };
				}
				return item;
			});
	
			contactRef.value = null;
			return response;
		} catch (error) {
			console.error("Error al bloquear contacto:", error);
			// throw error;
		}
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
		handleDeleteChannel,
		handleMessage,
		handleChallengeClick,
		handleContactDelete,
		handleContactIgnore,
		handleConfirmBlock,
    };
}