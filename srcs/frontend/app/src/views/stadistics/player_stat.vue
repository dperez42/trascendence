<template>
    <div>
      <div class="flex flex-col mt-6">
        <section v-if="errored" class="flex flex-col m-6 rounded-lg bg-indigo-100">
            <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>	
        </section>
        <section v-else> 
            <div v-if="loading" class="flex ">
                LOADING
                <spin_loader></spin_loader>
            </div>    
            <div v-else class="flex flex-col rounded-lg bg-white ">
                <div class="py-2 rounded-lg bg-black text-white columns-4">
                    <h3 class="font-bold uppercase px-2 py-6 text-left mb-8">{{ my_player.login}}</h3>
                    <div class="flex px-1.5 items-center">
                        <img class="object-cover w-12 h-12 -mx-1 border-2 border-white rounded-fullshrink-0" 
                        :src=" my_player.images === '' ? './avatar.png': (is_http (my_player.images) ? my_player.images :'api/user/' + my_player.images)" alt="">
                    </div>
                    <h5>Pts: {{ resume_player ? (resume_player.Ptos || '-') : '-' }}</h5>
                    <h5>Rank: {{ rank===99999 ? '-': rank}}</h5>
                    <h5>Wins: {{ resume_player ? (resume_player.Wins || '-') : '-' }}</h5>
                    <h5>Loss: {{ resume_player ? (resume_player.Loses || '-') : '-' }}</h5>
                    <h5>Ties: {{ resume_player ? (resume_player.Tides || '-') : '-' }}</h5>
                    <h5>GF: {{ resume_player ? (resume_player.GF || '-') : '-' }}</h5>
                    <h5>GA: {{ resume_player ? (resume_player.GC || '-') : '-' }}</h5>
                </div> 
                <div class="rounded-lg bg-gray-500 text-white">
                    <h3 class="py-3 font-bold text-center">GAMES PLAYED</h3>
                </div>
                <div class="flex flex-col overflow-y-auto">
                    <div  class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div class="border border-gray-200md:rounded-lg">
                                <table class="text-left w-full">
                                    <tbody class="flex-col items-center justify-between overflow-y-auto h-full bg-white divide-y divide-gray-200">
                                        <tr v-for="(item, index) in games" :key="index" >
                                            <td class="px-2 py-4 text-sm whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <img 
                                                        class="object-cover w-12 h-12 border-2 border-white rounded-full shrink-0" 
                                                        :src="my_player.login === item.p1_nick ? (my_player.images === '' ? './avatar.png': (is_http (my_player.images) ? my_player.images :'api/user/' + my_player.images)): avatar_url[index] === '' ? './avatar.png':( is_http(avatar_url[index])  ? avatar_url[index] :'api/user/' + avatar_url[index])"
                                                        alt=""/>
                                                    <h5 class="px-2 text-xs/5"></h5>
                                            </div>
                                            </td>
                                            <td class="px-2 py-4 text-sm font-medium whitespace-nowrap">
                                                <div class="inline">
                                                    <h2 class="font-medium text-gray-800">{{ item.p1_nick}}</h2>
                                                </div>
                                            </td>
                                            <td class="px-2 py-4 text-sm font-medium whitespace-nowrap">
                                                <div class="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60">
                                                    {{item.p1_goals}}
                                                </div>
                                            </td>
                                            <td class="px-2 py-4 text-sm font-medium whitespace-nowrap">
                                                <div class="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60">
                                                    {{item.p2_goals}}
                                                </div>
                                            </td>
                                            <td class="px-2 py-4 text-sm font-medium whitespace-nowrap">
                                                <div class="inline ">
                                                    <h2 class="font-medium text-gray-800">{{item.p2_nick}}</h2>
                                                </div>
                                            </td>
                                            <td class="px-2 py-4 text-sm whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <img 
                                                        class="object-cover w-12 h-12 -mx-1 border-2 border-white rounded-full shrink-0" 
                                                        :src="my_player.login === item.p2_nick ? (my_player.images === '' ? './avatar.png': (is_http (my_player.images) ? my_player.images :'api/user/' + my_player.images)): avatar_url[index] === '' ? './avatar.png':( is_http(avatar_url[index])  ? avatar_url[index] :'api/user/' + avatar_url[index])"
                                                        alt=""/>
                                                    <h5 class="px-2 text-xs/5"></h5>
                                            </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    </div>
  </template>
  
  <script >
  import axios from 'axios'
  import spin_loader from '../../services/spin_loader.vue'
  import { useStore } from 'vuex';
  import {computed} from 'vue';
  
  export default {
    name: 'player_Stat',
    props: {
        my_player:  {type:Object},
    },
    components: {
        spin_loader
    },
    data() {
        return {
            games: null,
            rank: 99999,
            resume_player: null,
            loading: true,
            errored: false,
            avatar_url:[],
        } 
    },  
    async mounted() {
        //console.log("klkl",this.my_player)
        const token = localStorage.getItem('token')
        await this.getresumePlayer(this.my_player.id, token)
        await this.getrankPlayer(this.my_player.id, token)
        await this.getGames(this.my_player.id, token)
        await this.getAvatarsUrls(this.my_player, this.games)
        },
    setup() {
        const store = useStore();
        const user = computed(() => store.state.user.user);
        return {user}
    },
    methods: {
        parse_time(timestamp){
            
            const date = Date(timestamp);
            const dt = new Date(date)
            return (dt.toLocaleString());
        },
        async getGames(id, token) {
            this.loading = true
            await axios.get(`/api/games/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
                })
                .then(response => {
                    this.games = response.data
                    console.log("here");
                })
                .catch(error => {
                    console.log(error);
                    console.log("here");
                    this.errored = true;
                })
                .finally(() => this.loading = false)

        },
        async getresumePlayer(id, token) {
            this.loading = true;
            await axios.get(`/api/gamesuser/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
                })
                .then(response => {
                    this.resume_player = response.data[0]
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                //.finally(() => this.loading = false)
        },
        async getrankPlayer(id, token) {
            this.loading = true;
            await axios.get(`/api/gamesuser`, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
                })
                .then(response => {
                    let i = 1;
                    for (var user of response.data){
                        if(user.id === id){
                            this.rank = i;
                        }
                        i++;
                    }
                    console.log("here1");
                })
                .catch(error => {
                    console.log(error);
                    console.log("here12");
                    this.errored = true;
                })
                .finally(() => {
                    this.loading = false
                })
        },
        async getAvatarsUrls(player, games) {
            const token = localStorage.getItem('token')
            for(let item of games){
                //console.log (" p2_id", item.p2_id)
                //console.log (" p1_id", item.p1_id)
                const url =  player.id === item.p1_id ? process.env.VUE_APP_SERVER_API + "/api/user/" + item.p2_id:process.env.VUE_APP_SERVER_API + "/api/user/" + item.p1_id
                //console.log (" url", url)
                //if (url  ){
                    await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                    })
                    .then(response => {
                        //console.log(response.data)
                        this.avatar_url.push(response.data.images);
                        //this.resume_player = response.data[0]
                    })
                    .catch(error => {
                        console.log(url)
                        //console.log(error);
                        this.errored = true;
                        if (error.response) {
                            // La respuesta fue hecha y el servidor respondió con un código de estado
                            // que esta fuera del rango de 2xx
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                            } else if (error.request) {
                            // La petición fue hecha pero no se recibió respuesta
                            // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
                            // http.ClientRequest en node.js
                            console.log(error.request);
                            } else {
                            // Algo paso al preparar la petición que lanzo un Error
                            console.log('Error', error.message);
                            }
                    })
                    .finally(() => {
                        this.loading = false
                        //console.log(this.avatar_url)
                    })
                //    }
            }
        },
        is_http (url) {
            if (!url) {
                return false
            }
            if (url.substring(0,4)==='http'){
                return(true)
            }
            return false
        }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>