import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';

interface OnlineState {
  onlineUsers: { id: string; login: string; name: string }[];
  allonlineUsers:  { id: string; login: string; name: string }[];
}

const state: OnlineState = {
  onlineUsers: [],
  allonlineUsers: []
};

const mutations: MutationTree<OnlineState> = {
  SET_ONLINE_USERS(state, users: { id: string; login: string; name: string }[]) {
    state.onlineUsers = users;
  },
  ADD_ONLINE_USER(state, user: { id: string; login: string; name: string }) {
    state.onlineUsers.push(user);
  },
  REMOVE_ONLINE_USER(state, userId: string) {
    state.onlineUsers = state.onlineUsers.filter(user => user.id !== userId);
  },
  SET_ALL_ONLINE_USERS(state, users: { id: string; login: string; name: string }[]) {
    state.allonlineUsers = users;
  },
  ADD_ALL_ONLINE_USER(state, user: { id: string; login: string; name: string }) {
    state.allonlineUsers.push(user);
  },
  REMOVE_ALL_ONLINE_USER(state, userId: string) {
    state.allonlineUsers = state.allonlineUsers.filter(user => user.id !== userId);
  },
};

const actions: ActionTree<OnlineState, any> = {
  updateOnlineUsers({ commit }, users) {
    commit('SET_ONLINE_USERS', users);
  },
  addOnlineUser({ commit }, user) {
    commit('ADD_ONLINE_USER', user);
  },
  removeOnlineUser({ commit }, userId) {
    commit('REMOVE_ONLINE_USER', userId);
  },
  updateOnlineAllUsers({ commit }, users) {
    commit('SET_ALL_ONLINE_USERS', users);
  },
  addOnlineAllUser({ commit }, user) {
    commit('ADD_ALL_ONLINE_USER', user);
  },
  removeOnlineAllUser({ commit }, userId) {
    commit('REMOVE_ALL_ONLINE_USER', userId);
  },
};



const getters: GetterTree<OnlineState, any> = {
  onlineUsersList: (state) => state.onlineUsers,
  allonlineUsersList: (state) => state.allonlineUsers,
};

const onlineModule: Module<OnlineState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default onlineModule;
