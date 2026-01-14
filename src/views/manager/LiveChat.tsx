import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Send,
  User as UserIcon,
  Clock,
  MessageSquare,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import socketClient from '../../services/socket';
import api from '../../services/api';
import type { RootState } from '../../redux/rootReducer';
import PageHeader from '../../components/common/PageHeader';
import type { IChatMessage, ChatRoom } from '../../redux/types/chat.types';

const ManagerLiveChat: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = socketClient.getSocket();

  const user = useSelector((state: RootState) => state.auth.user);

  const fetchRooms = React.useCallback(async () => {
    try {
      const res = await api.get('/chat/rooms');
      setRooms(res.data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching rooms', err);
    }
  }, []);

  const fetchMessages = React.useCallback(async (roomId: string) => {
    try {
      const res = await api.get(`/chat/history/${roomId}`);
      setMessages(res.data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching messages', err);
    }
  }, []);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleRoomSelect = (roomId: string) => {
    setActiveRoom(roomId);
    setViewMode('chat');
    fetchMessages(roomId);
    socket.emit('join_room', roomId);
  };

  const handleBackToList = () => {
    setActiveRoom(null);
    setViewMode('list');
  };

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    const handleReceiveMessage = (msg: IChatMessage) => {
      if (msg.room === activeRoom) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchRooms();
    };

    const handleUserTyping = (data: {
      room: string;
      isAdmin: boolean;
      isTyping: boolean;
    }) => {
      if (data.room === activeRoom && !data.isAdmin) {
        setOtherTyping(data.isTyping);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [activeRoom, fetchRooms, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeRoom || !user) {
      return;
    }

    const messageData = {
      room: activeRoom,
      sender: user.id,
      message: input,
      isAdmin: true,
    };

    socket.emit('send_message', messageData);
    setInput('');
    socket.emit('typing', {
      room: activeRoom,
      user: user.name,
      isTyping: false,
    });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        room: activeRoom,
        user: user?.name,
        isTyping: true,
      });
      setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', {
          room: activeRoom,
          user: user?.name,
          isTyping: false,
        });
      }, 3000);
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room._id.toLowerCase().includes(search.toLowerCase()) ||
      (room.userName &&
        room.userName.toLowerCase().includes(search.toLowerCase())) ||
      (room.userEmail &&
        room.userEmail.toLowerCase().includes(search.toLowerCase())) ||
      room.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const activeRoomData = rooms.find((r) => r._id === activeRoom);

  return (
    <div className="min-h-screen bg-transparent px-6 sm:px-12 lg:px-20 py-10 animate-fadeIn space-y-8">
      {/* Universal Page Header */}
      <PageHeader
        title="Live Support"
        highlightText="Chat"
        subtitle="Manage real-time customer support conversations"
        icon={MessageSquare}
      />

      {/* Main Container - Explicit height to prevent shrinking and cropping */}
      <div className="flex gap-6 h-[750px] bg-white/40 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
          flex flex-col border-r border-gray-100 w-full md:w-80 lg:w-96 shrink-0
          ${viewMode === 'chat' ? 'hidden md:flex' : 'flex'}
        `}
        >
          <div className="p-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search interactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 custom-scrollbar">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <button
                  key={room._id}
                  onClick={() => handleRoomSelect(room._id)}
                  className={`
                    w-full p-4 rounded-3xl flex items-center gap-4 transition-all duration-300
                    ${
                      activeRoom === room._id
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                        : 'hover:bg-white text-gray-700'
                    }
                  `}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                    ${activeRoom === room._id ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}
                  >
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-sm truncate">
                        {room.userName ||
                          `User: ${room._id.slice(-4).toUpperCase()}`}
                      </span>
                      <span
                        className={`text-[10px] whitespace-nowrap ${activeRoom === room._id ? 'text-emerald-50' : 'text-gray-400'}`}
                      >
                        {new Date(room.lastTimestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${activeRoom === room._id ? 'text-emerald-50' : 'text-gray-500'}`}
                    >
                      {room.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex items-center justify-center py-10 text-gray-400 text-xs italic">
                No active conversations
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`
          flex-1 flex flex-col bg-white/30
          ${viewMode === 'list' && !activeRoom ? 'hidden md:flex' : 'flex'}
        `}
        >
          {activeRoom ? (
            <>
              {/* Header */}
              <div className="px-8 py-5 border-b border-gray-100 bg-white/60 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToList}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition md:hidden"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div
                    onClick={() =>
                      navigate(`/manager/customer-details/${activeRoom}`)
                    }
                    className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 cursor-pointer hover:shadow-md transition-all"
                  >
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div
                      className="flex items-center gap-2 cursor-pointer group"
                      onClick={() =>
                        navigate(`/manager/customer-details/${activeRoom}`)
                      }
                    >
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {activeRoomData?.userName || 'Customer Inquiry'}
                      </h3>
                      <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                          Active
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight hidden sm:inline">
                        REF: {activeRoom.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar">
                {messages.length > 0 ? (
                  messages.map((msg, idx) => {
                    const isManager = msg.isAdmin;
                    return (
                      <div
                        key={idx}
                        className={`flex ${isManager ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div
                          className={`flex flex-col ${isManager ? 'items-end' : 'items-start'} max-w-[80%]`}
                        >
                          <div
                            className={`
                               px-6 py-3.5 rounded-[2rem] shadow-sm relative
                               ${
                                 isManager
                                   ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-100'
                                   : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                               }
                             `}
                          >
                            <p className="text-sm font-medium leading-relaxed">
                              {msg.message}
                            </p>
                          </div>
                          <p className="mt-1.5 px-3 text-[10px] font-bold text-gray-400 tracking-wider">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                    <Clock className="w-10 h-10 mb-2 animate-pulse" />
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Waking Up History
                    </p>
                  </div>
                )}

                {otherTyping && (
                  <div className="flex justify-start animate-in fade-in duration-300">
                    <div className="bg-emerald-50/50 px-5 py-2.5 rounded-full rounded-tl-none border border-emerald-100 text-[11px] font-black text-emerald-600 flex items-center gap-2 italic">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </span>
                      Typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-8 bg-white/60 border-t border-gray-100">
                <form
                  onSubmit={handleSend}
                  className="max-w-4xl mx-auto flex gap-4"
                >
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={handleTyping}
                      placeholder="Type your message..."
                      className="w-full bg-white border border-gray-200 rounded-[1.5rem] px-8 py-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 transition-all shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-10 rounded-[1.5rem] flex items-center gap-2 font-black text-sm uppercase transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-gray-300">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Support Dashboard
              </h3>
              <p className="text-sm text-gray-500">
                Pick a customer session from the list to start responding.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerLiveChat;
