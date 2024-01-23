import { MutationTree, ActionTree, Module } from 'vuex'
import axios from 'axios'
import jwtDecode from 'jwt-decode';

interface State {
  contact: any[] | null;
}

const state: State = {
  contact: null,
}

const mutations: MutationTree<State> = {
  setContact(state, contact: any[]) {
    state.contact = contact; 
  },
}

const actions: ActionTree<State, State> = {
  async fetchContactById({ commit }, payload: { token: string }) {
    const decodedToken: any = jwtDecode(payload.token);
    const userId = decodedToken.id;
    const contactResponse = await axios.get(`/api/contact/${userId}`, {
      headers: {
        'Authorization': `Bearer ${payload.token}`
      }
    })
    commit('setContact', contactResponse.data)
    return contactResponse.data
  },

  async fetchContactByIdDual({ commit }, payload: { token: string }) {
    const decodedToken: any = jwtDecode(payload.token);
    const userId = decodedToken.id;
    const contactResponse = await axios.get(`/api/contact/${userId}`, {
      headers: {
        'Authorization': `Bearer ${payload.token}`
      }
    })
    commit('setContact', contactResponse.data)
    return contactResponse.data
  },
  
  async addContact(context, payload: { contactId: string}) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`/api/contact`, {
        contactId: payload.contactId,
      }, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      return response.data;
    } catch (error) {
			const err = error as Error;
			console.error("Ocurrió un error:", err.message);
			throw err;
    }
  },

  async editContact(context, payload: { contactId: string, contactData: any }) {
      const token = localStorage.getItem('token');
      try {
          const response = await axios.patch(`/api/contact`, 
            payload.contactData, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
          });
          return response.data;
      } catch (error) {
          const err = error as Error;
          console.error("Ocurrió un error:", err.message);
          throw err;
      }
  },

  async deleteContact(context, payload: { contactId: string }) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`/api/contact`, {
            data: {
                contactId: payload.contactId,
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        const err = error as Error;
        console.error("Ocurrió un error:", err.message);
        throw err;
    }
  },
  async getBlockedUsers() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`/api/contact/block-user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        const err = error as Error;
        console.error("Ocurrió un error:", err.message);
        throw err;
    }
  },

  async updateBlockStatus(context, payload: { contactId: string, seconds: number }) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.patch(`/api/contact/block-user`, {
          "blockId": payload.contactId,
          "seconds": payload.seconds
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        const err = error as Error;
        console.error("Ocurrió un error:", err.message);
        throw err;
    }
  }
}

const getters = {
  fetchContactByIdDual: (state: State) => (idToSearch: string) => {
      return state.contact?.find(contact => contact.id === idToSearch) || null;
  }
};

const contactModule: Module<State, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

export default contactModule;
