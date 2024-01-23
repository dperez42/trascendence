import { ActionTree, Module, MutationTree } from "vuex";
import axios from 'axios'; // Asegúrate de importar axios si aún no lo has hecho
// import jwtDecode from 'jwt-decode'; // Asegúrate de importar jwtDecode si aún no lo has hecho

type State = {
    channels: any[];
};

const state = (): State => ({
    channels: []
});
  
const mutations: MutationTree<State> = {

};
  
const actions:  ActionTree<State, State> = {
    async addChannels({ commit }, payload: { channelName: string, password?: string, isIncognito?: string }) {
        const token = localStorage.getItem('token');
		commit;
        try {
            const response = await axios.post(`/api/chat`, {
                name: payload.channelName,
                password: payload.password,
                isIncognito: payload.isIncognito
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

    async update(context, payload: {idChannel: string, bodyForm: any}) {
        const token = localStorage.getItem('token');
        try {
            const {idChannel, bodyForm} = payload;
            await axios.patch(`/api/chat/${idChannel}`, bodyForm, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return true;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || 'Un error ha ocurrido';
                console.error(errorMessage);
                return errorMessage;
            } else {
                console.error('Un error inesperado ha ocurrido', error);
                return 'Un error inesperado ha ocurrido';
            }
        }
    },

    async remove(context, idChannel: string) {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/chat/${idChannel}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;    
    },

    async chatout(context, idChannel: string) {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/chat/chat-out/${idChannel}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;    
    }
};

const getters = {
    // Puedes añadir getters aquí si los necesitas
};

const chatModule: Module<State, any> = {
	namespaced: true,
	state,
    mutations,
    actions,
    getters
  }

  export default chatModule;