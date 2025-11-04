import React, { useState, useRef, useEffect } from 'react';
import { type Message } from '../types';
import { getChatResponse } from '../services/geminiService';
import { Bot, Send, User, X } from 'lucide-react';

const AnimatedAvatar: React.FC = () => {
  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-75 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">MW</span>
      </div>
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Hey! 👋 I'm Muhib's AI assistant. Ask me anything about his experience, skills, projects, or even his thoughts on tech, travel, coffee, and building cool things!", 
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await getChatResponse(input);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className={`fixed bottom-8 right-8 transition-all duration-300 z-40 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:shadow-blue-500/50 hover:shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="Open chat"
        >
          <AnimatedAvatar />
        </button>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-8 right-8 w-[90vw] max-w-md h-[70vh] max-h-[650px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} border border-slate-700/50`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AnimatedAvatar />
              <div>
                <h3 className="font-bold text-white text-base">Chat with Muhib</h3>
                <p className="text-xs text-slate-400">Ask me anything!</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-white hover:bg-slate-700/50 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 animate-fadeIn ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2 text-sm ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-sm' 
                  : 'bg-slate-700/50 text-slate-100 rounded-bl-sm'
              }`}>
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400">
              <Bot className="w-4 h-4 animate-pulse" />
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-full disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Chatbot;