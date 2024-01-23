import { Commit } from "vuex";

type State = {
	messages: Message[];
};

type Message = {
	id?: string;
	name: string;
	text: string;
	sent: boolean;
};

const state = (): State => ({
	messages: []
});
  
const mutations = {
	addMessage(state: State, message: Message) {
		state.messages.push(message);
	},

	setMessages(state: State, newMessages: Message[]) {
		state.messages = newMessages;
	}
};
  
const actions = {
	receiveMessage({ commit }: { commit: Commit }, data: any) {
		const message: Message = { 
			id: data.target,
			name: data.user,
			text: data.message, 
			sent: true 
	};
		commit('addMessage', message);
	}
};

const getters = {
    getChatById: (state: State) => (id: string) => {
        return state.messages.filter(message => message.id === id);
    }
};
  
export default {
    namespaced: true,
    state,
    mutations,
    actions,
	getters
};