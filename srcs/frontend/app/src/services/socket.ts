import { io, Socket } from 'socket.io-client'

// const token = localStorage.getItem('token') || '';

const server = process.env.VUE_APP_SERVER_SOCKET;
//const server = 'ws://localhost:3000'
export const chatSocket: Socket = io(`${server}/message-ws`);
// export const chatSocket: Socket = io(`${server}/message-ws`, {
//   transports: ['polling'],
//   extraHeaders: {
//     'Authorization': `${token}`
//   },
//    reconnection: true,
//    reconnectionAttempts: 10,
//    reconnectionDelay: 2000
// });

export const gameSocket: Socket = io(`${server}/game-ws`);
