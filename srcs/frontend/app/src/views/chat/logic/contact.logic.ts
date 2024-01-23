import { ContactOrChannel } from '@/types/ContactChannel';
import { UserChats } from '@/types/userChats';

export const transformChats = (chatsObject: { [key: string]: UserChats }) => {
    return Object.values(chatsObject).map((chat: UserChats, index: number) => ({
        name: chat.chatName,
        id: chat.chatId,
        password: chat.password,
        status: index === 0,
        type: "room"
    }));
}

export const transformContacts = (contactsObject: any) => {
    return contactsObject.map((contact: ContactOrChannel) => (
        { ...contact, status: false, type: 'private' }
    ));
}

export const ensureAuthenticated = (token: any) => {
    if (!token.value) {
        console.error('No se encontró un token en el almacenamiento local. Por favor, inicia sesión.');
        throw new Error('User not authenticated');
    }
}

export const loadContactsAndChats = async (store: any, contactsChannels: any, token: any) => {
    ensureAuthenticated(token);
    try {
        const chatsObject = await store.dispatch('chat/fetchChatById', { token: token.value });
        const contactObject = await store.dispatch('contacts/fetchContactById', { token: token.value });
        contactsChannels.value = [...transformChats(chatsObject), ...transformContacts(contactObject)];
    } catch (error: any) {
        console.error('error loadContactsAndChats', error.response.data.message);
    }
};