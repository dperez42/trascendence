<template>
    <div class="flex-col w-full relative border-2 border-gray-300 border-dashed rounded-lg p-6" id="dropzone"
        :class="entering ? 'bg-gray-500':'bg-gray-100'"
        @drop.prevent="handleDrop"
        @dragenter="entering = true"
        @dragleave="entering = false"
    >
        <img v-if="user && user.images" class="h-auto w-full mx-auto" :src="avatar" alt="">
        <input type="file" class="absolute inset-0 w-full h-full opacity-0 z-50" 
            @input="handleInput($event as InputEvent)"
        />
        <h3 class="mt-2 text-sm font-medium text-gray-900">
            <label for="file-upload" class="relative cursor-pointer">
                <span>Drag and drop</span>
                <span class="text-blue-500"> or browse </span>
                <span>to upload</span>
            </label>
        </h3>
        <p class="mt-1 text-xs text-gray-800">
            PNG, JPG, GIF up to 1MB
        </p>
    </div>

</template>
  
<script setup lang="ts"> 
import {computed, onMounted, onUnmounted, ref} from 'vue';
import { toast, type ToastOptions } from 'vue3-toastify';
import { useStore } from 'vuex';

const { avatar } = defineProps({
	avatar: {
		type: String,
		default: ''
	},
});

const entering = ref(false);
const emit = defineEmits(["upload"]);
const events = ["dragenter", "dragleave", "dragover", "drop"]
//
const store = useStore();
const user = computed(() => store.state.user.user);
//const user = store.state.user.user;
// creo una imagen tempora
const image_tmp = ref('api/user/' + user.value.images)

/*
let imagePath = 'api/user/';
if (user && user.images) {
    imagePath = 'api/user/' + user.images;
}
const image_tmp = ref(imagePath)
*/

const notify = (msg:string) => {
    toast(msg, {
    autoClose: 2000,
    position: toast.POSITION.BOTTOM_RIGHT,
  } as ToastOptions);
}

onMounted(() => {
      events.forEach(event => document.body.addEventListener(event, (e)=>e.preventDefault()))
})

onUnmounted(() => {
      events.forEach(event => document.body.removeEventListener(event, (e)=>e.preventDefault()))
})

function handleDrop(e: DragEvent): void {
    const files = e.dataTransfer?.files as FileList;

    if (files.length === 0) {
        console.log("No files dropped.");
        return;
    }
    if (files.length > 1) {
        console.log("Only one file allowed.");
        notify('Only One File');
        return;
    }
    const file = files[0];
    if (!isValidImage(file)) {
        notify('Please enter a valid image file');
        return;
    }

    const url = window.URL || window.webkitURL;
    const image = new Image();
    image.onload = function() {
        notify('Valid image file');
        emit("upload", { name: file.name, url: URL.createObjectURL(file), file });
        image_tmp.value = URL.createObjectURL(file)
    };
    image.onerror = function() {
        notify('Invalid image file');
    };
    image.src = url.createObjectURL(file);
}

function isValidImage(file: File): boolean {
    const [fileType] = file.type.split("/");
    return fileType === "image";
}

function handleInput(e: InputEvent): void {
    const files = (e.target as HTMLInputElement).files as FileList;

    if (files.length === 0) {
        console.log("No files selected.");
        return;
    }

    if (files.length > 1) {
        console.log("Only one file allowed.");
        notify('Only One File');
        return;
    }
    const file = files[0];
    if (file.size >= 1000000) {
        notify('Please enter a image file with less 1 MB');
        return;
    }
    if (!isValidImage(file)) {
        notify('Please enter a valid image file');
        return;
    }


    const url = window.URL || window.webkitURL;
    const image = new Image();
    image.onload = function() {
        notify('Uploading image file');
        emit("upload", { name: file.name, url: URL.createObjectURL(file), file });
        image_tmp.value = URL.createObjectURL(file)
    };
    image.onerror = function() {
        notify('Invalid image file');
    };
    image.src = url.createObjectURL(file);
}

</script>
<style scoped>
</style>
