import { MutationTree, ActionTree, Module } from 'vuex'
import axios from 'axios'
import jwtDecode from 'jwt-decode';

interface State {
  chat: any | null;
}

const state: State = {
  chat: null,
}

const mutations: MutationTree<State> = {
  setChat(state, chat: any) {
    state.chat = chat; 
  },
}

const actions: ActionTree<State, State> = {

  // async fetchChatById({ commit }, payload: { token: string }) {
  //   const decodedToken: any = jwtDecode(payload.token);
  //   const userId = decodedToken.id;
  //   const chatResponse = await axios.get(`/api/chat-user/find-to-idchat/${userId}`, {
  //     headers: {
  //       'Authorization': `Bearer ${payload.token}`
  //     }
  //   })
  //   commit('setChat', chatResponse.data)
  //   return chatResponse.data
  // },
  async fetchChatById({ commit }, payload: { token: string }) {
    const decodedToken: any = jwtDecode(payload.token);
    if (decodedToken && decodedToken.id) {
      try {
        const chatResponse = await axios.get(`/api/chat-user/find-to-idchat/${decodedToken.id}`, {
          headers: {
            'Authorization': `Bearer ${payload.token}`
          }
        });

        if (chatResponse.data) {
          commit('setChat', chatResponse.data);
          return chatResponse.data;
        }
      } catch (error: any) {
        console.error('Error fetching chat by ID:', error.response.data.message);
      }
    } else {
      console.error('Invalid token or token does not contain id');
    }
  },

  async fetchChatByIdDetailUser({ commit }, payload: { token: string, channelId: string }) {
    
    const chatResponse = await axios.get(`/api/chat-user/find-chatsid-detail-user/${payload.channelId}`, {
      headers: {
        'Authorization': `Bearer ${payload.token}`
      }
    })
    commit('setChat', chatResponse.data)
    return chatResponse.data
  },

  async silenceUserChat(context, payload: { userIdSilence: string, chatId: string, silence: boolean }) {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/api/chat-user/moderator/${payload.userIdSilence}`, {
        chatId: payload.chatId,
        silence: payload.silence
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
  },

  async deleteUserChat(context, payload: { userIdDelete: string, chatId: string}) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`/api/chat-user/user-id-chat/${payload.userIdDelete}/${payload.chatId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
},
  
  async moderatorUserChat(context, payload: { userIdModerator: string, chatId: string, rol: string }) {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/api/chat-user/moderator/${payload.userIdModerator}`, {
        chatId: payload.chatId,
        rol: payload.rol
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
  }
}

const chatModule: Module<State, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
}

export default chatModule;
