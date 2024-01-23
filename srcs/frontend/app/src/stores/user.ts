import { MutationTree, ActionTree, Module } from 'vuex'
import jwtDecode from 'jwt-decode';
import axios from 'axios'
import { User } from '@/types/user';
import { toast } from 'vue3-toastify';

interface State {
  user: User | null;
  isAuthenticated: boolean;
}

const state: State = {
  user: null,
  isAuthenticated: false,
}

const mutations: MutationTree<State> = {
  setUser(state, user: User) {
    state.user = user;
    state.isAuthenticated = !!user;  
  },
}

const actions: ActionTree<State, State> = {
  async fetchUser({ commit }, token: string) {
    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    const userResponse = await axios.get(`/api/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    commit('setUser', userResponse.data)
  },
  async uploadFile({ commit, state }, payload: any) {
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('image', payload.file);
      
    await axios.patch(`/api/user/upload-image`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type' : 'multipart/form-data'
      }
    })
    .then(response => {
      response;
      commit('setUser', { ...state.user});
    })
    .catch(error => {
      console.error(error);
    });
  },
  //
  async getUser() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;    
  },

  async updateInfoUser(context, payload: { name: string; lastName: string; email: string; login: string, twoFASecret?: string, authentication?: boolean }) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(`/api/user/`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 409) {
        const errorMessage = error.response.data.message || 'Un error ha ocurrido';
        console.error(errorMessage);
        if (error.response.status === 409){
          toast('Nickname in used, choose another')
        }
      } else {
        console.error('Un error inesperado ha ocurrido', error);
      }
    }
  },

  async updateActivityUser (context, payload: { id: number; activity: boolean } ) {
    const token = localStorage.getItem('token');
    return await axios.patch(`/api/user/updateactivity`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async updateRolUser(context, payload: { id: number; rol: string } ) {
    const token = localStorage.getItem('token');
    return await axios.patch(`/api/user/updateRole`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  async refreshUser({ commit }) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.id;
  
      const userResponse = await axios.get(`/api/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      commit('setUser', userResponse.data);
    } else {
      console.error("No token found in localStorage");
    }
  }
}

const userModule: Module<State, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
}

export default userModule;
