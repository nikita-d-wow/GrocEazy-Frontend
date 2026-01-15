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
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { markMessagesRead } from '../../redux/actions/chatActions';
import type { RootState } from '../../redux/rootReducer';
import PageHeader from '../../components/common/PageHeader';
import type { IChatMessage, ChatRoom } from '../../redux/types/chat.types';

const ManagerLiveChat: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'chat'>('list');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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

  const scrollToBottom = React.useCallback(
    (behavior: 'auto' | 'smooth' = 'smooth') => {
      if (messagesContainerRef.current) {
        const { scrollHeight, clientHeight } = messagesContainerRef.current;
        messagesContainerRef.current.scrollTo({
          top: scrollHeight - clientHeight,
          behavior,
        });
      }
    },
    []
  );

  const handleRoomSelect = (roomId: string) => {
    setActiveRoom(roomId);
    setViewMode('chat');
    fetchMessages(roomId);
    socket.emit('join_room', roomId);
    // Mark as read in backend and update global state
    dispatch(markMessagesRead(roomId));
    socket.emit('mark_messages_read', roomId);
    // Use 'auto' for initial load to avoid jumping
    setTimeout(() => scrollToBottom('auto'), 100);
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
  }, [messages, otherTyping, scrollToBottom]);

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
    <div className="min-h-screen bg-transparent px-4 sm:px-8 lg:px-12 py-6 animate-fadeIn space-y-6">
      <PageHeader
        title="Live Support"
        highlightText="Chat"
        subtitle="Manage real-time customer support conversations"
        icon={MessageSquare}
      />

      <div className="h-[calc(100vh-220px)] min-h-[600px] flex bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl shadow-gray-200/40 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`
          flex flex-col border-r border-gray-100 w-full md:w-80 lg:w-96 shrink-0 bg-white/30 backdrop-blur-sm
          ${viewMode === 'chat' ? 'hidden md:flex' : 'flex'}
        `}
        >
          <div className="p-4 border-b border-gray-100/50">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search interactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <button
                  key={room._id}
                  onClick={() => handleRoomSelect(room._id)}
                  className={`
                    w-full p-3.5 rounded-2xl flex items-center gap-3 transition-all duration-300 group
                    ${
                      activeRoom === room._id
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                        : 'hover:bg-white text-gray-700'
                    }
                  `}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105
                    ${activeRoom === room._id ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}
                  >
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-xs truncate">
                        {room.userName ||
                          `User: ${room._id.slice(-4).toUpperCase()}`}
                      </span>
                      <span
                        className={`text-[9px] font-bold whitespace-nowrap ${activeRoom === room._id ? 'text-emerald-50' : 'text-gray-400'}`}
                      >
                        {new Date(room.lastTimestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] truncate font-medium ${activeRoom === room._id ? 'text-emerald-50/80' : 'text-gray-500'}`}
                    >
                      {room.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3 opacity-50">
                <MessageSquare className="w-8 h-8 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No Active Sessions
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`
          flex-1 flex flex-col bg-white/10 relative
          ${viewMode === 'list' && !activeRoom ? 'hidden md:flex' : 'flex'}
        `}
        >
          {activeRoom ? (
            <>
              {/* Header - Strongly Fixed with Glassmorphism */}
              <div className="sticky top-0 z-20 px-6 py-4 border-b border-gray-100/50 bg-white/80 backdrop-blur-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToList}
                    className="p-2 -ml-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition md:hidden"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div
                    onClick={() =>
                      navigate(`/manager/customer-details/${activeRoom}`)
                    }
                    className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200/40 border border-white cursor-pointer hover:scale-105 active:scale-95 transition-all"
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
                      <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {activeRoomData?.userName || 'Customer Inquiry'}
                      </h3>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors translate-y-[1px]" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200" />
                        <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">
                          Active Chat
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter px-2 py-0.5 bg-gray-50 rounded-md hidden sm:inline">
                        ID: {activeRoom.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages - Controlled Container for Scroll */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar scroll-smooth"
              >
                {messages.length > 0 ? (
                  messages.map((msg, idx) => {
                    const isManager = msg.isAdmin;
                    return (
                      <div
                        key={idx}
                        className={`flex ${isManager ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-400`}
                      >
                        <div
                          className={`flex flex-col ${isManager ? 'items-end' : 'items-start'} max-w-[85%]`}
                        >
                          <div
                            className={`
                               px-5 py-3 rounded-[2rem] shadow-lg relative transition-all duration-300
                               ${
                                 isManager
                                   ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-100 flex-row-reverse'
                                   : 'bg-white text-gray-800 rounded-tl-none border border-white shadow-gray-200/30'
                               }
                             `}
                          >
                            <p className="text-[13px] font-semibold leading-relaxed">
                              {msg.message}
                            </p>
                          </div>
                          <p className="mt-1.5 px-3 text-[9px] font-black text-gray-400 tracking-widest uppercase">
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
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-60">
                    <Clock className="w-12 h-12 mb-3 animate-pulse text-emerald-200" />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800">
                      Loading History
                    </p>
                  </div>
                )}

                {otherTyping && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="bg-emerald-50/70 backdrop-blur-md px-5 py-2.5 rounded-full rounded-tl-none border border-emerald-100 text-[10px] font-black text-emerald-600 flex items-center gap-3 shadow-sm italic">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0s]" />
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="mb-0.5">Customer is typing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100/50">
                <form
                  onSubmit={handleSend}
                  className="max-w-4xl mx-auto flex gap-3"
                >
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={handleTyping}
                      placeholder="Type your message..."
                      className="w-full bg-white/60 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-400 transition-all shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-90 text-white px-8 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed group cursor-pointer"
                  >
                    <span className="hidden sm:inline">Send Message</span>
                    <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-700">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner shadow-emerald-100/50 rotate-3">
                <MessageSquare className="w-10 h-10 opacity-40 -rotate-3" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                Support Dashboard
              </h3>
              <p className="text-sm text-gray-500 max-w-xs font-medium leading-relaxed">
                Select a conversation from the list to start responding.
              </p>
              <div className="mt-8 flex gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping [animation-delay:0.3s]" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping [animation-delay:0.6s]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerLiveChat;
