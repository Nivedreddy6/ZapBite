import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getBiteBotResponse } from '../utils/aiHelper';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Plus, 
  MapPin, 
  Utensils, 
  Flame, 
  CheckCircle2, 
  Clock,
  Cpu
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
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `🤖 Greetings! I am **ZapBot AI**, your smart neural food concierge.\n\nTry asking me:\n• *"Show biryani under ₹300"*\n• *"Pure veg high protein bowls"*\n• *"Where is my live order?"*`,
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

  const handleSend = (textToSend) => {
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

    setTimeout(() => {
      const activeOrders = orders.filter((o) => o.status !== 'Delivered');
      const botRes = getBiteBotResponse(queryText, activeOrders);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botRes.text,
        items: botRes.items || [],
        suggestions: botRes.suggestions || [],
        actions: botRes.actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
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
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-[#0b0f19] text-white rounded-3xl shadow-2xl border border-cyan-500/30 flex flex-col h-[580px] overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      
      {/* HUD Header */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 p-4 flex items-center justify-between border-b border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 p-0.5 border border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(0,245,212,0.3)]">
              <Cpu className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-400 border-2 border-slate-950 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-white">ZapBot AI Concierge</h3>
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold border border-cyan-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart AI Neural Food Search</p>
          </div>
        </div>

        <button
          onClick={() => setIsBiteBotOpen(false)}
          className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/70">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-start gap-2 max-w-[88%]">
              {msg.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 flex items-center justify-center text-xs shrink-0 mt-1 border border-cyan-500/30">
                  🤖
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-br-none shadow-lg shadow-rose-500/20'
                    : 'bg-slate-900 text-slate-100 rounded-bl-none border border-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Dish items inside Bot response */}
                {msg.items && msg.items.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#07090e] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2.5"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <h4 className="font-extrabold text-xs text-white truncate">{item.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-black text-rose-400">₹{item.price}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">★ {item.rating}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(item)}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow"
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
                        className="bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 text-slate-950 text-[11px] font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,245,212,0.3)]"
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
                    className="bg-slate-900 hover:bg-rose-500/20 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-[11px] px-3 py-1 rounded-full border border-slate-800 transition-all font-semibold"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask ZapBot (e.g. 'Biryani under ₹300')..."
          className="flex-1 bg-[#0b0f19] text-white text-xs px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-500/60 placeholder-slate-500"
        />
        <button
          onClick={() => handleSend()}
          className="bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 text-slate-950 p-3 rounded-2xl font-bold active:scale-95 transition-transform shrink-0 shadow-lg shadow-cyan-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
