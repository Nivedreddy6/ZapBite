import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchBiteBotAIResponse } from '../utils/aiHelper';
import { 
  X, 
  Send, 
  Plus, 
  MapPin, 
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
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `🤖 Greetings! I am **ZapBot AI** (Powered by ZapBite AI ⚡).\n\nTry asking me:\n• *"Show biryani under ₹300"*\n• *"Pure veg high protein bowls"*\n• *"Where is my live order?"*`,
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
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[580px] overflow-hidden animate-fade-in-up font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-4 flex items-center justify-between text-white shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-0.5 border border-white/40 flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-white">ZapBot AI Concierge</h3>
              <span className="bg-black/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                ZapBite AI
              </span>
            </div>
            <p className="text-[11px] text-orange-100 font-medium">Smart Neural Food Search</p>
          </div>
        </div>

        <button
          onClick={() => setIsBiteBotOpen(false)}
          className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-black/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-start gap-2 max-w-[88%]">
              {msg.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs shrink-0 mt-1 border border-orange-200">
                  🤖
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-br-none shadow-xs font-semibold'
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Dish items inside Bot response */}
                {msg.items && msg.items.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2.5"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <h4 className="font-extrabold text-xs text-slate-900 truncate">{item.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-bold">
                            <span className="text-rose-600 font-extrabold">₹{item.price}</span>
                            <span>•</span>
                            <span className="text-amber-600 font-bold">★ {item.rating}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow-xs"
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
                        className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
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
                    className="bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-[11px] px-3 py-1 rounded-full border border-slate-200 transition-all font-semibold shadow-xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold bg-orange-50 p-2.5 rounded-2xl w-fit border border-orange-200 animate-pulse">
            <Cpu className="w-4 h-4 animate-spin" />
            <span>ZapBot AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask ZapBot (e.g. 'Biryani under ₹300')..."
          className="flex-1 bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500 placeholder-slate-400 font-medium"
        />
        <button
          onClick={() => handleSend()}
          className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 text-white p-3 rounded-2xl font-bold active:scale-95 transition-transform shrink-0 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
