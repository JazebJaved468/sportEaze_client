import {io, Socket} from 'socket.io-client';
import {store} from '../store';
import {Sport} from '../../types/core/core.type';

// const SOCKET_URL = 'http://192.168.100.18:3000'; // Replace with your backend URL
const SOCKET_URL = 'ws://192.168.100.18:3000/post-comments'; // Replace with your backend URL

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'], // Ensures WebSocket is used instead of polling
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      auth: {
        accessToken: store.getState().auth.userToken,
      },
    });

    socket.on('success-connection', () => {
      console.log('Socket Connected Successfully!');
    });

    socket.on('disconnect', () => console.log('Socket Disconnected!'));

    socket.on('newComment', data => {
      console.log('Commented', data);
    });

    socket.emit('joinPost', 'c3b8e818-6cc7-40f2-9e30-de0992765fa1');
  }

  return socket;
};

export const getSocket = connectSocket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
