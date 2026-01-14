export interface IChatMessage {
  _id: string;
  sender: string;
  receiver?: string;
  message: string;
  room: string;
  isAdmin: boolean;
  createdAt: string;
  isBot?: boolean;
}

export interface ChatRoom {
  _id: string; // User ID
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  userName?: string;
  userEmail?: string;
}
