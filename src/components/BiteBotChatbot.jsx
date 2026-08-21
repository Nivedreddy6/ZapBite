import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchBiteBotAIResponse } from '../utils/aiHelper';
import { 
  X, 
  Send, 
  Plus, 
  MapPin, 
  Cpu,
  Zap,
  Radio,
  Sparkles,
  Bot
} from 'lucide-react';

export const BiteBotChatbot = () => {
  const { 
    isBiteBotOpen, 
    setIsBiteBotOpen, 
    orders, 
    addToCart, 
    setActiveTrackingOrderId, 
    setCurrentRole 
  } = useApp();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `🤖 Greetings! I am **BiteBot AI** (Powered by ZapBite AI 3.0 ⚡).\n\nTry asking me:\n• *"Show biryani under ₹300"*\n• *"Pure veg high protein bowls"*\n• *"Where is my live order?"*`,
      suggestions: [
        '🔥 Top Biryani under ₹300',
        '🥗 Pure Veg Protein Bowls',
        '📍 Track My Live Order',
        '🍔 Cheesy Burgers & Fries'
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isBiteBotOpen) {
      scrollToBottom();
    }
  }, [messages, isBiteBotOpen]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const activeOrders = orders.filter((o) => o.status !== 'Delivered');
    const botRes = await fetchBiteBotAIResponse(queryText, activeOrders);

    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botRes.text,
      items: botRes.items || [],
      suggestions: botRes.suggestions || [],
      actions: botRes.actions || [],
      isGemini: botRes.isGemini,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleActionClick = (action) => {
    if (action.type === 'TRACK_ORDER') {
      setActiveTrackingOrderId(action.orderId);
      setCurrentRole('customer');
      setIsBiteBotOpen(false);
    }
  };

  if (!isBiteBotOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-[#0d1527] text-slate-100 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.9)] border border-emerald-500/30 flex flex-col h-[580px] overflow-hidden animate-fade-in-up font-sans backdrop-blur-xl">
      
      {/* Header */}
      <div className="bg-[#070b14] p-4 border-b border-emerald-500/20 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,245,155,0.3)]">
              <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#070b14] rounded-full animate-ping"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm text-white">BiteBot AI Neural Concierge</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                AI 3.0
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/80 font-mono">Neural Flavor & Order Synthesis</p>
          </div>
        </div>

        <button
          onClick={() => setIsBiteBotOpen(false)}
          className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-[#111c33] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#070b14]/90">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-start gap-2 max-w-[88%]">
              {msg.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-1 border border-emerald-500/40">
                  🤖
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-br-none shadow-[0_0_15px_rgba(0,245,155,0.3)] font-bold'
                    : 'bg-[#111c33] text-slate-200 rounded-bl-none border border-slate-700/80 shadow-md font-medium'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Dish items inside Bot response */}
                {msg.items && msg.items.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#070b14] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2.5"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                            <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                            <span className="text-emerald-400 font-bold">₹{item.price}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">★ {item.rating}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow-[0_0_10px_rgba(0,245,155,0.3)] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Custom Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act)}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-[11px] font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Suggestion Pills */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 pl-8">
                {msg.suggestions.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip)}
                    className="bg-[#111c33] hover:bg-[#1a2c4e] text-emerald-300 hover:text-emerald-200 text-[11px] px-3 py-1 rounded-full border border-emerald-500/30 transition-all font-mono font-bold shadow-xs cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-bold bg-[#0d2218] p-2.5 rounded-2xl w-fit border border-emerald-500/40 animate-pulse">
            <Cpu className="w-4 h-4 animate-spin text-emerald-400" />
            <span>BiteBot AI synthesizing response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 bg-[#070b14] border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask BiteBot (e.g. 'Biryani under ₹300')..."
          className="flex-1 bg-[#111c33] text-white text-xs px-4 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-400 placeholder-slate-400 font-medium"
        />
        <button
          onClick={() => handleSend()}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 p-3 rounded-2xl font-bold active:scale-95 transition-transform shrink-0 shadow-[0_0_15px_rgba(0,245,155,0.4)] cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
