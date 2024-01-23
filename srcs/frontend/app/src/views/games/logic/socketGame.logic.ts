import { ref, onMounted } from 'vue';
import { Socket } from 'socket.io-client';
// import { useStore } from 'vuex';
// import {computed} from 'vue';

export default function useSocket($gameSocket: Socket | null) {
  const messages = ref<string[]>([]);
  // const loadList = async (games:any) => {
  //   const store = useStore();
  //   const chatsObject = await store.dispatch('games/setListGames',games);
  // };

  
  onMounted(() => {
  });

  const emitUpdateGame = (msg:object) => {
    //console.log('Sent message to server1',msg);
    if ($gameSocket && $gameSocket.connected) {
      $gameSocket.emit('client-game',msg);
      //messages.value.push('Sent message to server');
      //console.log('Sent message to server',msg);
    } else {
      //messages.value.push('Socket is not connected');
      //console.log('Socket is not connected');
    }
  };

  return { emitUpdateGame, messages };
}
