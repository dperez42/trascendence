import { Socket } from 'socket.io-client';
import { toast } from 'vue3-toastify';
import store from '../../../stores'

export function handleGameNotification($gameSocket: Socket | null) : Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (!$gameSocket) {
      reject(new Error("No socket provided"));
      return;
    }


    let isHandlerRegistered = false;
    if ($gameSocket && !isHandlerRegistered) {
      $gameSocket.on('connect', () => {
        toast('connected to game server')
        isHandlerRegistered = true;
      });

      $gameSocket.on('server-game', (data: any) => {
        switch (data.command) {
          case 'GAME_LIST':
            handleGameList(data);
            break;
          case 'UPDATE_CONTACTS':
            handleUpdateContacts(data);
            break;
          case 'MSG':
            handleMsg(data);
            break;
          case 'GAME_CREATED':
          {
            const routeResponse = handleCreate(data);
            if (routeResponse) {
              resolve(routeResponse);
            }
            break;
          }
          case 'CHALLENGE_ASK':
            handleChallengeAsk(data);
            break;
          case 'UPDATE_WAITING_ROOM':
            handleUpdateWaitingRoom(data);
            break;
          case 'UPDATE_BLOCKED':
              //handleUpdateWaitingRoom(data);
            break;
          case null:
            handleNull(data);
            break;
        }

      });
    }
  });
}

export function removeGameNotificationHandler($gameSocket: Socket | null) {
  if ($gameSocket) {
    $gameSocket.off('server-game');
    $gameSocket.off('connect');
  }
}

function handleGameList(data: any) {
  store.state.games.games = null;
  let flag: boolean = false;

  for (let i = 0; i < data.data.length; i++) {
    if (data.data[i].p1id === store.state.user.user.id || data.data[i].p2id === store.state.user.user.id) {
      if ((data.data[i].p1id === store.state.user.user.id) && (store.state.games.game != null)) {
        if (data.data[i].p1time < store.state.games.game.p1time) {
          data.data[i].p1y = store.state.games.game.p1y;
          data.data[i].p1time = store.state.games.game.p1time;
        }
      }
      if ((data.data[i].p2id === store.state.user.user.id) && (store.state.games.game != null)) {
        if (data.data[i].p2time < store.state.games.game.p2time) {
          data.data[i].p2y = store.state.games.game.p2y;
          data.data[i].p2time = store.state.games.game.p2time;
        }
      }
      store.commit('games/setGame', data.data[i]);
      flag = true;
    }
  }
  
  if (!flag) {
    store.state.games.game = null;
  }
  store.commit('games/setListGames', data.data);
}

function handleUpdateContacts(data: any)
{
  store.state.contacts.contact = null
  store.state.contacts.contact = data.data
}

function handleMsg(data: any)
{
  if (data.params.player_id_1 ===  '*' || data.params.player_id_1 === store.state.user.user.id || data.params.player_id_2 === store.state.user.user.id){
    toast('game server message: '+ data.params.msg)
    //router.push('/game');
  }
}

function handleCreate(data: any): string | null {
  if (data.params.player_id_1 === store.state.user.user.id || 
      data.params.player_id_2 === store.state.user.user.id){
    toast('game server message: '+ data.params.msg);
    return '/game';
  }
  return null;
}

function handleChallengeAsk(data: any)
{
  if (data.params.player_id_2 === store.state.user.user.id){
    toast('recieved PETICION DE JUEGO')
    store.state.games.challenge = data.params
    store.state.games.trigger_challenge = true
    console.log("state: ", store.state.games.trigger_challenge)
  }
}

function handleUpdateWaitingRoom(data: any)
{
  toast('recieved waiting room update')
  store.state.games.waiting_player = data.data
}


function handleNull(data: any)
{
  if (store.state.games.game != null){
    if (data.command === 'UPDATE_PLAYER_STAT'){
        if (data.params.game_id === store.state.games.game.game_id){
          if (data.params.player_nick === store.state.games.game.p1nick){
            store.state.games.game.p1_state = data.params.player_status
          }
          if (data.params.player_nick === store.state.games.game.p2nick){
            store.state.games.game.p2_state = data.params.player_status
          }
        }
    }
    if (data.command === 'UPDATE_PLAYER_MOV'){
        if (data.params.game_id === store.state.games.game.game_id){
          if (data.params.player_nick != store.state.user.user.login){
            if (data.params.player_nick === store.state.games.game.p1nick){
              store.state.games.game.p1y = data.params.player_pos
            }
            if (data.params.player_nick === store.state.games.game.p2nick){
              store.state.games.game.p2y = data.params.player_pos
            }
          }
        }
    }
    if (data.command === 'UPDATE_GAME_STAT'){
      if (data.params.game_id === store.state.games.game.game_id){
        store.state.games.game.game_status = data.params.game_status
      }
    }
  }
}