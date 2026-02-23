'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([{
        role: 'assistant',
        content: 'Halo Kak! Aku Kamito 🐶, asisten AI dari Etalase Kaos Kami. Ada yang bisa Kamito bantu cari kaos hari ini?'
    }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const apiMessages = messages.map(m => ({ role: m.role, content: m.content }));
            apiMessages.push({ role: 'user', content: userMessage });

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Waduh, sistem Kamito lagi error nih. Nanti coba lagi ya Kak! 😥' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Koneksi lagi bermasalah nih Kak. Coba periksa internetnya ya. 📡' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-[#141418] border border-white/10 rounded-2xl shadow-2xl mb-4 w-[350px] max-h-[500px] flex flex-col transform transition-all duration-300 ease-out origin-bottom-right">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-[#bbff00]/20 to-transparent border-b border-[#bbff00]/10 flex justify-between items-center rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#bbff00] text-black p-2 rounded-full">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#bbff00] leading-none">Kamito</h3>
                                <span className="text-xs text-white/50">AI Assistant</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[350px]">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-[#bbff00]/20 text-[#bbff00]' : 'bg-white/10 text-white'
                                    }`}>
                                    {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user'
                                        ? 'bg-[#bbff00] text-black rounded-tr-sm'
                                        : 'bg-white/10 text-white rounded-tl-sm'
                                    }`}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#bbff00]/20 text-[#bbff00] flex items-center justify-center">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-white/50 flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-white/10">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Tanya Kamito sesuatu..."
                                className="flex-1 bg-black/50 border border-white/10 rounded-full px-4 text-sm text-white focus:outline-none focus:border-[#bbff00] focus:ring-1 focus:ring-[#bbff00] transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-[#bbff00] text-black p-2.5 rounded-full hover:bg-[#aadd00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-white/10 text-white' : 'bg-[#bbff00] text-black'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
        </div>
    );
}
