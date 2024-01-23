import { MutationTree, ActionTree, Module } from 'vuex'
//import axios from 'axios'
//import jwtDecode from 'jwt-decode';

interface State {
  users_connected: any | null;
}

const state: State = {
  users_connected: [ //null,
    '9f6443c9-5397-4bc5-9cc3-245e2c720cc9', // tester2
    'bef07ec7-c562-4b9d-a634-d7eec302aa75', // juan-gon2
    //'5e9e3eb6-f43a-4d35-a03f-bf04519bbec7',  // dperez-42
    'deefc7f9-5a5d-42e3-9110-5be31fcbf7bd' //tester
]
}

const mutations: MutationTree<State> = {
}

const actions: ActionTree<State, State> = {
}

const users_connectedModule: Module<State, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
}

export default users_connectedModule;
