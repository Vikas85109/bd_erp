import { useState } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { aiMessages, aiSuggestions } from '../data/chat';

export default function AIAssistant() {
  const [messages, setMessages] = useState(aiMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      message: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: messages.length + 2,
        sender: 'ai',
        message: "I'm processing your request. Let me analyze the data and get back to you with insights.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl bg-white shadow-md">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-surface-border px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-secondary-900">AI Sales Assistant</h1>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <p className="text-xs text-surface-muted">Online — Powered by AI</p>
            </div>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Welcome Message */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-secondary-900">How can I help you today?</h2>
            <p className="mt-1 text-sm text-surface-muted">
              I can help you with lead management, follow-ups, reports, and more.
            </p>
          </div>

          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.message}
              isOwn={msg.sender === 'user'}
              senderName={msg.sender === 'ai' ? 'AI Assistant' : 'You'}
              time={msg.time}
            />
          ))}
        </div>

        {/* Suggestions */}
        <div className="border-t border-surface-border px-6 pt-4">
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-medium text-primary-700 transition-all duration-200 hover:bg-primary-100 hover:border-primary-300 hover:shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your leads, sales, or pipeline..."
              className="flex-1 rounded-xl border border-surface-border px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            />
            <button
              onClick={handleSend}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-md shadow-purple-500/25 transition-all duration-200 hover:shadow-lg"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
