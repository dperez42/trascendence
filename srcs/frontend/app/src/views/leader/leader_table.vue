<template>
    <div v-if="status_pop === false" class="m-10">
      <div class="flex flex-col mt-6">
        <section v-if="errored">
            <p class="flex py-5 text-xl font-bold text-red-600">We're sorry, we're not able to retrieve this information at the moment, please try back later</p>	
        </section>
        <section v-else>
            <div v-if="loading" class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <spin_loader></spin_loader>
            </div>   
            <div  v-else class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden border border-gray-200 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">                   
                                <tr>
                                    <th scope="col" class="py-3.5 px-8 text-sm font-bold text-left rtl:text-right text-gray-500">Rank</th>
                                    <th scope="col" class="py-3.5 text-sm font-bold text-left rtl:text-right text-gray-500"></th>
                                    <th scope="col" class="px-4 py-3.5 text-sm font-bold text-left rtl:text-right text-gray-500">Nick</th>
                                    <th scope="col" class="px-4 py-3.5 text-sm font-bold text-left rtl:text-right text-gray-500">Points</th>
                                    <th scope="col" class="px-1 py-3.5 text-sm font-bold text-left rtl:text-right text-gray-500">Wins</th>
                                    <th scope="col" class="px-1 py-3.5 text-sm font-bold text-left rtl:text-right text-gray-500">Loses</th>
                                    <th scope="col" class="px-1 py-3.5 text-sm font-bold text-left rtl:text-right text-gray-500">Drawn</th>
                                    <th scope="col" class="px-1 py-3.5 text-sm font-bold text-left rtl:text-right text-gray-500">Played</th>
                                    <th scope="col" class="px-1 py-3.5 text-sm font-bold text-left rtl:text-right text-gray-500">Goals in Favor</th>
                                    <th scope="col" class="px-1 py-3.5 text-sm font-bold text-left rtl:text-right text-gray-500">Goals Against</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(item, index) in clasification" :key="index" 
                                    class="hover:bg-gray-300"
                                    @click.prevent="change_status_pop(item)">
                                    <td class="px-4 py-4 text-center text-xl font-black">
                                        <div>
                                            <img v-if = "index === 0" class="h-16" src="/path/medal/gold-medal.png" alt="Logo">
                                            <img v-if = "index === 1" class="h-16" src="/path/medal/silver-medal.png" alt="Logo">
                                            <img v-if = "index === 2" class="h-16" src="/path/medal/bronze-medal.png" alt="Logo">
                                            <div v-if = "index > 2" class="w-12"> {{ index + 1}}</div>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div class="flex items-center">
                                            <img 
                                                class="object-cover w-20 h-20 -mx-1 border-2 border-white rounded-full shrink-0" 
                                                :src=" item.t2_images === '' ? './avatar.png': (is_http (item.t2_images) ? item.t2_images :'/api/user/' + item.t2_images)"
                                                alt="">
                                    </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div>
                                            <h2 class="font-medium text-gray-800 ">{{item.login}}</h2>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                        <div class="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60">
                                            {{item.Ptos}}
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div>
                                            <h4 class="text-gray-700">{{item.Wins}}</h4>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div>
                                            <h4 class="text-gray-700">{{item.Loses}}</h4>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div>
                                            <h4 class="text-gray-700">{{item.Tides}}</h4>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div>
                                            <h4 class="text-gray-700">{{ Number(item.Wins) + Number(item.Loses) + Number(item.Tides)}}</h4>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div>
                                            <h4 class="text-gray-700">{{item.GF}}</h4>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                        <div>
                                            <h4 class="text-gray-700">{{item.GC}}</h4>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
        </div>
    </div>
    <!-- pop up player stadistics -->
    <div v-if="status_pop === true"  lass="flexfixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
			<div class="fixed inset-0 transition-opacity">
				<div class="absolute inset-0 bg-gray-500 opacity-75"></div>
			</div>
            <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div class="mt-5 sm:mt-6">  
                    <span class="flex w-full rounded-md shadow-sm"></span> 
                        <button @click.prevent="change_status_pop()">
                        Close
                        </button>
                </div>
                <div> 
                    <player_Stat :my_player="player_choose"/>
                </div>   
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import player_Stat from '../stadistics/player_stat.vue';
  import axios from 'axios'
  import spin_loader from '../../services/spin_loader.vue';

  export default {
    name: 'Leader_table',
    props: {
    },
    components: {
        player_Stat,
        spin_loader
    },
    data() {
        return {
            status_pop: false, // variabe to control pop up
            player_choose: null,
            loading: true,
            errored: false,
            clasification: [],
        } 
    },  
    async mounted() {
        const token = localStorage.getItem('token')
        await this.getClasification(token) 
    },  
    setup() {
        return {}
    },
    methods: {
        async getClasification(token) {
        await axios.get(`/api/gamesuser/`, {
            headers: {
            'Authorization': `Bearer ${token}`
            }
            })
            .then(response => {
                this.clasification = response.data
            })
            .catch(error => {
                console.error('error leader table', error);
                this.errored = true;
            })
            .finally(() => this.loading = false)
        },
        change_status_pop(user) {
            if (this.status_pop === true){
            this.status_pop = false;
            this. player_choose = null
            }
            else {
            this.status_pop= true;
            this. player_choose = user
            this.player_choose.images = user.t2_images
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