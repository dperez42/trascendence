import { Ref } from 'vue';
import { Socket } from 'socket.io-client';
import { generateMessageData } from '../../chat/utils/message.utils';

interface MessageFunctions {
    sendMessage: (command: string, messageContentRecep: string) => void;
}

export default function useMessage($chatSocket: Socket | null, user: Ref<any>, activeItem: Ref<any>, messageContent: Ref<string>, store: any): MessageFunctions {
    const sendMessage = (command: string, messageContentRecep: string) => {
        const { value } = activeItem;
        if (value) {
            const { type, id, name } = value;
            const chat = {
                id: user.value.id,
                command,
                type,
                target: id,
                reason: null,
                name,
                password: null,
                topic: null,
                message: messageContentRecep
            };
            store.commit('chats/addMessage', { name: user.value.login, text: chat.message, id, sent: false });
            emitToSocket(chat);
        } else {
            store.commit('chats/addMessage', { name: "server", text: "Select a channel or contact.", sent: false });
        }
        messageContent.value = '';
    };

    const emitToSocket = (chat: any) => {
        if (!$chatSocket) {
            console.error('Socket is not provided');
            return;
        }

        if ($chatSocket.connected) {
            const messageToSend = generateMessageData({
                id: chat.id,
                command: chat.command,
                type: chat.type,
                target: chat.target,
                reason: chat.reason,
                user: user.value.login,
                name: chat.name,
                password: chat.password,
                topic: chat.reason,
                message: chat.message
            });
            $chatSocket.emit('client-message', messageToSend);
        } else {
            console.error('Socket is not connected');
        }
    };

    return {
        sendMessage
    };
}
