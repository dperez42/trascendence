<template>
	<div v-if="isVisibleCancelAcept" class="fixed inset-0 flex items-center justify-center z-50">
		<div class="absolute inset-0 bg-black opacity-60"></div>
		<div class="bg-white p-8 max-w-md mx-auto rounded-2xl shadow-2xl relative border-t-8 border-blue-500">
			<div class="text-center"> <!-- Nota: aquí se eliminó "mb-8" -->
				<slot name="title">
					<h2 class="p-2">{{ title }}</h2>
				</slot>
				<div class="flex justify-center">
					<button v-if="showConfirmButton" @click="onConfirm" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150 mr-2">Acept</button>
					<button @click="onCancel" class="bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-100 py-2 px-4 rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-transform duration-150 ml-2">Cancelar</button>
				</div>
				<p v-if="message" class="text-red-500 p-2 rounded">{{ message }}</p>
			</div>
		</div>
	</div>
</template>


<script setup lang="ts">

defineProps({
	isVisibleCancelAcept: Boolean,
	title: String,
	message: String,
	showConfirmButton: {
		type: Boolean,
		default: true
	}
});
  
const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => {
	emit('confirm');
};

const onCancel = () => {
	emit('cancel');
};
</script>
