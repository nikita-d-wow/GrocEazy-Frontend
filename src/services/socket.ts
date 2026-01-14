import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class SocketClient {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('Connected to socket server');
    });

    this.socket.on('connect_error', (error) => {
      // eslint-disable-next-line no-console
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  getSocket() {
    return this.socket || this.connect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketClient = new SocketClient();
export default socketClient;
