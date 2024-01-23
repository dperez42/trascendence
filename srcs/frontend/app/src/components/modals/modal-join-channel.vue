<template>
	<div v-if="props.modelValue" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-60"></div>
    <div class="bg-white p-8 max-w-md mx-auto rounded-2xl shadow-2xl relative border-t-8 border-blue-500">
        <div class="flex items-center justify-between mb-8">
            <div class="flex flex-col items-center relative group">
                <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-xl transform rotate-6 transition-transform duration-150 group-hover:-translate-y-1 group-hover:scale-110 z-10">
                    <i class="fas fa-users px-1 text-white"></i>
                </div>
                <span class="mt-2 text-gray-700 uppercase tracking-widest font-semibold">JOIN OR ADD TO CHANNEL</span>
            </div>
        </div>

        <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">CHANNEL DETAILS</h3>
            <div class="space-y-4">
                <div class="flex items-center mb-4" v-if="rawUser.roles.some((role: any) => role === 'admin' || role === 'super-user')">
                    <input type="checkbox" id="incognitoMode" class="form-checkbox h-5 w-5 text-red-600" v-model="isIncognito">
                    <label for="incognitoMode" class="ml-2 text-red-600">Modo Incógnito</label>
                </div>
                <div>
                    <label for="channel" class="block text-sm font-medium text-gray-700">CHANNEL</label>
                    <input 
                        type="text" 
                        v-model="channelName" 
                        name="channel" 
                        placeholder="Name channel" 
                        class="mt-1 p-2 w-full border rounded-md"
                    >
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">PASSWORD</label>
                    <input type="password" v-model="password" name="password" placeholder="Passsord" class="mt-1 p-2 w-full border rounded-md">
                </div>
                <div v-if="errorMessage" class="text-red-600 mb-4">
                    {{ errorMessage }}
                </div>
            </div>
        </div>
        <div class="flex justify-center mt-6">
            <button @click="saveChannel" class="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150 mr-4">
                SAVE
            </button>
            <button @click="closeModal" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150 ml-4">
                CANCEL
            </button>
        </div>
    </div>
</div>

</template>
  
<script setup lang="ts">
import { ref, toRaw, watchEffect } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps(['modelValue', 'user']);
const rawUser = toRaw(props.user);

const emit = defineEmits(['update:modelValue', 'channel-added']);

const closeModal = () => {
    emit('update:modelValue', false);
	channelName.value = '';
    password.value = '';
    errorMessage.value = ''
};

const isIncognito = ref(false);
const channelName = ref('');
const password = ref('');
const errorMessage = ref('');

const saveChannel = async () => {
    try {
        const channel = await store.dispatch('channels/addChannels', {
            channelName: channelName.value,
            password: password.value,
            isIncognito: isIncognito.value
        });
        channelName.value = '';
        password.value = '';
        isIncognito.value = false;
        closeModal();
        emit('channel-added', channel);
    } catch (error) {
        const axiosError = error as { response: { data: any } };
        if (axiosError.response && axiosError.response.data) {
            errorMessage.value = axiosError.response.data.message;
        }
    }
};

watchEffect(() => {
    channelName.value = channelName.value.toUpperCase();
    
});
</script>
