import { Socket } from "socket.io-client";
import { Ref } from "vue";

import { toast } from 'vue3-toastify';
import { useStore } from "vuex";

// export function handleNotification($chatSocket: Socket | null, user: Ref<any>): () => void {
export function handleNotification($chatSocket: Socket | null, user: Ref<any>, token: string, onMessageReceived: (data: any) => void): () => void {

	if (!$chatSocket) return () => {};

	if ($chatSocket.listeners('message-server').length > 0) {
    return () => {};
	}

  const store = useStore();

  const connectErrorHandler = (err: unknown) => {
    console.error(`Connection error: ${(err as Error).message}`);
  };
  
  const connectHandler = (data: any) => {
    data;
  };
  
  const disconnectHandler = () => {
    console.log('Socket disconnected. Attempting to reconnect...');
  };

  const reconnectHandler = async () => {
    console.log('Socket reconnected!');
  };

  const messageServerHandler = (data: any) => {
    if (user.value) {
      store.dispatch('chats/receiveMessage', data);
      const {message, id, target, user, ...userDAta} = data;
      message;
      id;
      onMessageReceived({id: target, login: user, ...userDAta, status: false});
		} else {
			console.log('User is not defined; ignoring message');
		}
	};

  const sendMessagetoken = (token: string) => {
    const messageToSend = {
      token: token, 
      // ... cualquier otro dato que quieras enviar
    };
    $chatSocket.emit('client-register', messageToSend);
  };

  const contactOnlineServerHandler = (data: any) => {
    store.dispatch('online/updateOnlineUsers', data);
  };

  const usersOnlineServerHandler = (data: any) => {
    store.dispatch('online/updateOnlineAllUsers', data);
  };

  const connectContactServer = (data: any) => {
    const foundContact = store.getters['contacts/fetchContactByIdDual'](data);
    if (foundContact) {
        toast.success("Se Conecto: " + foundContact.login);
        store.dispatch('online/addOnlineUser', foundContact);
    } else {
        console.log("No se encontró el contacto con el ID especificado.");
    }
  };

  const disconnectContactServer = (data: any) => {
    const foundContact = store.getters['contacts/fetchContactByIdDual'](data);
    if (foundContact) {
        toast.error("Se Desconecto: " + foundContact.login);
        store.dispatch('online/removeOnlineUser', foundContact.id);
    } else {
        console.log("No se encontró el contacto con el ID especificado.");
    }
  };

  // const updateContact = (token: string) => {
  //   const messageToSend = {
  //     token: token
  //   };
  //   // $chatSocket.emit('client-update-contact', messageToSend);
  // };
  
  $chatSocket.on('connect-total', connectHandler);
  $chatSocket.on('message-error', connectErrorHandler);
  $chatSocket.on('disconnect', disconnectHandler);
  $chatSocket.on('reconnect', reconnectHandler);
  $chatSocket.on('message-server', messageServerHandler);
  $chatSocket.on('my-contact-server', contactOnlineServerHandler);
  $chatSocket.on('users-online-server', usersOnlineServerHandler);
  $chatSocket.on('connect-contact-server', connectContactServer);
  $chatSocket.on('disconnect-contact-server', disconnectContactServer);
  //
  sendMessagetoken(token);
  return () => {
    $chatSocket.off('connect-total', connectHandler);
    $chatSocket.off('message-error', connectErrorHandler);
    $chatSocket.off('disconnect', disconnectHandler);
    $chatSocket.off('reconnect', reconnectHandler);
    $chatSocket.off('message-server', messageServerHandler);
    $chatSocket.off('my-contact-server', contactOnlineServerHandler);
    $chatSocket.off('users-online-server', usersOnlineServerHandler);
    $chatSocket.off('connect-contact-server', connectContactServer);
    $chatSocket.off('disconnect-contact-server', disconnectContactServer);
    
  };
}