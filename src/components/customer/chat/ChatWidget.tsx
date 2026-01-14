import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MessageCircle, Send, X, Minus, Bot } from 'lucide-react';
import socketClient from '../../../services/socket';
import api from '../../../services/api';
import type { RootState } from '../../../redux/rootReducer';
import type { IChatMessage } from '../../../redux/types/chat.types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = socketClient.getSocket();

  const user = useSelector((state: RootState) => state.auth.user);
  const room = user?.id || 'guest';

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && user) {
      // Fetch history
      api.get(`/chat/history/${room}`).then((res) => {
        setMessages(res.data);
      });

      socket.emit('join_room', room);

      socket.on('receive_message', (newMessage: IChatMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      socket.on('bot_message', (botMsg: IChatMessage) => {
        setMessages((prev) => [
          ...prev,
          { ...botMsg, isBot: true } as IChatMessage,
        ]);
      });

      socket.on(
        'user_typing',
        (data: { room: string; isAdmin: boolean; isTyping: boolean }) => {
          if (data.room === room && data.isAdmin) {
            setOtherTyping(data.isTyping);
          }
        }
      );

      return () => {
        socket.off('receive_message');
        socket.off('bot_message');
        socket.off('user_typing');
      };
    }
  }, [isOpen, room, user, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) {
      return;
    }

    const messageData = {
      room,
      sender: user.id,
      message,
      isAdmin: false,
    };

    socket.emit('send_message', messageData);
    setMessage('');
    socket.emit('typing', { room, user: user.name, isTyping: false });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { room, user: user?.name, isTyping: true });

      setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', { room, user: user?.name, isTyping: false });
      }, 3000);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-green-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
        >
          <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`
            w-80 md:w-96 glass-effect rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)]
            flex flex-col transition-all duration-300 border border-white/30
            ${isMinimized ? 'h-16' : 'h-[500px]'}
          `}
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-500/80 to-green-400/80 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">GrocEazy Support</h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/30">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.isAdmin || msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] p-3 rounded-2xl text-sm shadow-sm
                        ${
                          msg.isAdmin || msg.isBot
                            ? 'bg-white text-gray-800 rounded-tl-none'
                            : 'bg-emerald-500 text-white rounded-tr-none'
                        }
                      `}
                    >
                      <p>{msg.message}</p>
                      <span
                        className={`text-[9px] mt-1 block opacity-60 ${msg.isAdmin || msg.isBot ? 'text-gray-500' : 'text-white'}`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                {otherTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/50 px-3 py-2 rounded-2xl rounded-tl-none text-xs text-gray-500 italic flex items-center gap-2">
                      <span className="flex gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </span>
                      Manager is typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSend}
                className="p-4 bg-white/50 border-t border-white/20 flex gap-2"
              >
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/80 border border-emerald-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-emerald-200"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
