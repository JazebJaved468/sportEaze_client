import {io, Socket} from 'socket.io-client';
import {store} from '../store';
import {GetChatListingResponse} from '../../types/core/core.response';
import {
  onMessageRecieved,
  onMessageSent,
  onMessageTyping,
} from '../../utils/helpers/chat.utils';
import {SocketEvents} from './socket.events';
import {OnMessageTyping} from '../../types/core/core.type';
import {onConnectionRequestReceived} from './socket.utils';
import {ConnectionRequestReceived} from './socket.type';
// const SOCKET_URL = 'http://192.168.100.18:3000'; // Replace with your backend URL
const SOCKET_URL = 'ws://192.168.100.3:3000'; // Replace with your backend URL

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'], // Ensures WebSocket is used instead of polling
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      auth: {
        token: store.getState().auth.userToken,
      },
    });

    // Successful connection
    socket.on(SocketEvents.SUCCESSFUL_CONNECTION, () => {
      console.log('Socket Connected Successfully!');
    });

    // Disconnection Successful
    socket.on(SocketEvents.SOCKET_DISCONNECT, () =>
      console.log('Socket Disconnected!'),
    );

    // Is Message Typing
    socket.on(SocketEvents.IS_MSG_TYPING, (data: OnMessageTyping) => {
      console.log('is message typing...', data);
      onMessageTyping(data);
    });

    // Message received
    socket.on(SocketEvents.MESSAGE_RECEIVED, (data: GetChatListingResponse) => {
      console.log('message received!', data);
      onMessageRecieved(data);
    });

    // Message sent
    socket.on(SocketEvents.MESSAGE_SENT, (data: GetChatListingResponse) => {
      console.log('message_sent!', data);
      onMessageSent(data);
    });

    // Message sent
    socket.on(
      SocketEvents.CONNECTION_REQUEST,
      (data: ConnectionRequestReceived) => {
        console.log('connection request received!', data);
        // onMessageSent(data);
        onConnectionRequestReceived(data);
      },
    );

    socket.on(
      SocketEvents.CONNECTION_RESPONSE,
      (data: ConnectionRequestReceived) => {
        console.log('conneciton response', data);
        // onMessageSent(data);
      },
    );

    // socket.on('newComment', data =>
    //   console.log('Commented', data);
    // });

    // socket.emit('joinPost', 'c3b8e818-6cc7-40f2-9e30-de0992765fa1');

    // console.log('Socket URL:', socket);
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
