import {io, Socket} from 'socket.io-client';
import {store} from '../store';

const SOCKET_URL = 'http://192.168.100.18:3000'; // Replace with your backend URL

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
