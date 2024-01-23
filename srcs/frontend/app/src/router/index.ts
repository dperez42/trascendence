
import { createRouter, createWebHistory, NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router'


import AuthService from '../services/auth'
import ParentComponent from '../views/sections/home.vue'
import UserLogin from '../views/login/login-user.vue'
import loadSection from '../views/ load/data-load.vue'
import ChatSection from '../views/chat/my-chat.vue'
import GameSection from '../views/games/game_view.vue'
import LivedGamesSection from '../views/games/lived_games.vue'
import LeaderSection from '../views/leader/leader.vue'
import FriendsSection from '../views/friends/friends.vue'
import ProfileSection from '../views/profile/profile-user.vue'
import UsersSection from '../views/users/users.vue'
import AdminSection from '../views/admin/admin.vue'
import NotFound404 from '../views/errors/NotFound404.vue'

// A habilitar para el chequeo de si es admin o no
// const ifWebadmin: NavigationGuardWithThis<undefined> = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: (arg?: string) => void) => {
// 	if () {
//         next()
//     } else {
// 			Guarda la ruta a la que el usuario intentó acceder
// 			localStorage.setItem('redirectPath', to.path)
// 			next('/')
//     }
// }

const ifAuthenticated: NavigationGuardWithThis<undefined> = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: (arg?: string) => void) => {
    if (AuthService.isAuthenticated()) {
        next()
    } else {
        // Guarda la ruta a la que el usuario intentó acceder
        localStorage.setItem('redirectPath', to.path)
        next('/')
    }
}

const ifNotAuthenticated: NavigationGuardWithThis<undefined> = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: (arg?: string) => void) => {
    if (!AuthService.isAuthenticated()) {
        next()
    } else {
        const redirectPath = localStorage.getItem('redirectPath') || '/load'
        next(redirectPath)
    }
}

// const handleAccess: NavigationGuardWithThis<undefined> = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: (arg?: string) => void) => {
//     if (AuthService.isAuthenticated()) {
//         if (to.path === '/') {
//             const redirectPath = localStorage.getItem('redirectPath') || '/load';
//             next(redirectPath);
//         } else {
//             next();
//         }
//     } else {
//         if (to.path === '/' || to.path === '/lived_games' || to.path === '/resa') {
//             next();
//         } else {
//             localStorage.setItem('redirectPath', to.path);
//             next('/');
//         }
//     }
// };

const routes = [
	{
		path: '/:catchAll(.*)',
		name: 'NotFound',
		component: NotFound404
	},
	{
		path: '/',
		component: UserLogin,
		beforeEnter: ifNotAuthenticated
	},
	{
		path: '/load',
		component: loadSection,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/resa',
		component: ParentComponent,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/chat',
		component: ChatSection,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/game',
		component: GameSection,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/lived_games',
		component: LivedGamesSection,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/friends',
		component: FriendsSection,
		beforeEnter: ifAuthenticated
	}	,
	{
		path: '/leader',
		component: LeaderSection,
		beforeEnter: ifAuthenticated
	}	,
	{
		path: '/users',
		component: UsersSection,
		beforeEnter: ifAuthenticated
	}	,
	{
		path: '/profile',
		component: ProfileSection,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/admin',
		component: AdminSection,
		beforeEnter: ifAuthenticated, 
		// Falta añadir el chequeo de si el usuario es administrador o superadmin de la web
	}
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
export default router