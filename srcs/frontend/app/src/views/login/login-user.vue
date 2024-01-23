<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat" style="background-image: url(/pong_room.jpg)">
		<div class="max-w-md w-full space-y-8">
			<div>
				<h2 class="mt-6 text-center text-3xl font-extrabold 2xl:text-2xl text-indigo-600">
				C3P0 TEAM<br>TRANSCEDENCE WEB 
				<h3 class="px-5 lg:text-lg font-bold text-indigo-600"> cretaed by:<br>
					dperez-z, fballest & juan-gon</h3>
				<p class="max-w-xl mt-4 sm:text-sm text-indigo-300">
					Final project of the common core 42 Cursus,<br>
					Here you can find the effort of a team of three students in 42 Madrid.<br>
					Enjoy it. </p>
				</h2>
			</div>
			<form class="mt-8 space-y-6">
				<input type="hidden" name="remember" value="true" />
				<div v-if = "enable_user_password===true" class="rounded-md shadow-sm -space-y-px">
					<div>
						<label for="email-address" class="sr-only">
						Dirección de correo electrónico
						</label>
						<input
						v-model="email"
						id="email-address"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="Dirección de correo electrónico"
						/>
					</div>
					<div>
						<label for="password" class="sr-only">Password</label>
						<input
						v-model="password"
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="Password"
						/>
					</div>
				</div>
				<div v-if = "enable_user_password===true">
					<button
						@click.prevent="login"
						class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<span class="absolute left-0 inset-y-0 flex items-center pl-3">
						<svg
							class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
							fill-rule="evenodd"
							d="M10 2a2 2 0 00-2 2v8a2 2 0 104 0V4a2 2 0 00-2-2zm-7 9a7 7 0 1114 0 7 7 0 01-14 0z"
							clip-rule="evenodd"
							/>
						</svg>
						</span>
						Iniciar sesión
					</button>
				</div>

                    <button
						@click.prevent="loginApp"
						class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						<span class="absolute left-0 inset-y-0 flex items-center pl-3">
							<img class="h-8" src="/path/logo/42_Logo.svg.png" alt="Logo">
						</span>
						Login Authorization		
                    </button>
				<div v-if="errorMessage" class="mt-2 text-sm text-red-600">
					{{ errorMessage }}
				</div>
				<div v-if="needsAuthentication" 
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-indigo-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					<span class="absolute left-0 inset-y-0 flex items-center pl-3">
						<img class="h-8" src="/path/logo/Google-authenticator-Logo.svg" alt="Logo">
					</span>
					<input v-model="tokenSeg" type="text" class="justify-center"
							@keypress.enter="validateToken" 
							placeholder="  insert a valid token"/>
					<button @click.prevent="validateToken" class="text-white px-5 font-bold hover:bg-indigo-600 hover:text-gray-200"> Validar Token</button>
				</div>
				<div v-if="errorToken && needsAuthentication" 
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500">
					Invalid Token, Try Again
				</div>
			</form>

		</div>
	</div>
</template>
	
<script setup lang="ts">
import { onMounted } from 'vue';
import useAuth from './logic/login.logic';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import router from '@/router';


const enable_user_password = true
// Desestructuración de las variables y funciones desde useAuth
const { 
  email, 
  password, 
  errorMessage, 
  login, 
  loginApp, 
  needsAuthentication, 
  validateToken, 
  tokenSeg,
  token,
  errorToken,
} = useAuth();

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data?.message || 'Error desconocido');
  } else if (error instanceof Error) {
    console.error(error.message);
  }
};

const findId2F = async (token: string) => {
  try {
    const payload: any = jwtDecode(token);
    const userResponse = await axios.get(`/api/user/2f/${payload.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    needsAuthentication.value = userResponse.data;

    if (!needsAuthentication.value) {
      localStorage.setItem('token', token);
      router.push('/load');
    }
  } catch (error) {
    handleError(error);
  }
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  token.value = urlParams.get('token');
  if (token.value) {
    findId2F(token.value);
  }
});
</script>
