import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import './styles/css/tailwind.css'
import { gameSocket, chatSocket } from './services/socket'
import Vue3Toastify, { type ToastOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';



const app = createApp(App)

const defaultToastOptions: ToastOptions = {
  autoClose: 2000,
  position: "bottom-right",
};

app.use(Vue3Toastify, defaultToastOptions);

app.provide('$gameSocket', gameSocket);
app.provide('$chatSocket', chatSocket);
app.use(router)
app.use(store)
app.mount('#app')
