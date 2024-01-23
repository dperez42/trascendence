import { MutationTree, Module, ActionTree } from 'vuex'
import {Game} from "../types/game"
// import { User } from '@/types/user';
import {Waiting_player} from "../types/waiting_player"
import axios from 'axios';

interface State {
  game: Game | null;
  games: any;
  waiting_player: Waiting_player | null;
  trigger_challenge: boolean;
  challenge:  any
}

const state: State = {
    game: null,
    games:[],
    waiting_player: null,
    trigger_challenge: false,
    challenge: null //for pop up message

}

const mutations: MutationTree<State> = {
  setGame(state, game: any) {
    //console.log(game)
    state.game = game; 
  },
  setListGames(state, games:any) {
    //console.log("setting list games")
    state.games = games;
    //console.log(state.games)
  },
  joinPlayer(state,player: any) {
    if (player==='p1'){
      //state.game.p1_state = true;
      //if (state.game.p2_state === true){
      //  state.game.game_status = 1;
      //}
    } 
    if (player==='p2'){
      //state.game.p2_state = true;
      //if (state.game.p1_state === true){
      //  state.game.game_status = 1;
      //}
    } 
  },
  changeGameStatus(state){
      if (state.game){
        state.game.game_status = state.game.game_status + 1;
        state.game.game_count = 5000;
        //console.log(state.game.game_status);
        if (state.game.game_status >= 4){
          state.game = null;
        }
      }
  }
}

const actions:  ActionTree<State, State> = {

  async statsChatGeneral(context, idChannel: string) {
    console.log("statsChannelGenera",  idChannel);
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/games/stats-chat-general/${idChannel}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;    
  },
  async statsChat(context, idChannel: string) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/games/stats-chat/${idChannel}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;    
  },
}

const gamesModule: Module<State, any> = {
  namespaced: true,
  state,
  actions,
  mutations
}

export default gamesModule;