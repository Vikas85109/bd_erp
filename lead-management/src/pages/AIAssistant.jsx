import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, Users, Calendar, Mail, MessageSquare, BarChart3, Zap } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { leads } from '../data/leads';
import { followups } from '../data/followups';

// --------------- helpers ---------------

const ts = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

const daysSince = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.floor((now - d) / 86400000));
};

// Score: higher = hotter. value weight + status weight - days-since-contact penalty
const qualifyLead = (lead) => {
  const statusScore = { Converted: 20, Proposal: 40, Qualified: 60, Contacted: 30, New: 50, Lost: 5 };
  const valScore = Math.min(40, Math.round((lead.value / 600000) * 40));
  const daysPenalty = Math.min(30, daysSince(lead.lastContact) * 2);
  const score = (statusScore[lead.status] || 20) + valScore - daysPenalty;
  const clamped = Math.max(0, Math.min(100, score));
  let label = 'Cold';
  if (clamped >= 65) label = 'Hot';
  else if (clamped >= 40) label = 'Warm';
  return { ...lead, score: clamped, label };
};

const qualifiedLeads = leads
  .map(qualifyLead)
  .sort((a, b) => b.score - a.score);

// --------------- AI response engine ---------------

const generateAIResponse = (text) => {
  const lower = text.toLowerCase();

  // --- leads / show leads ---
  if (/\bleads?\b/.test(lower) && !/follow/.test(lower)) {
    const counts = {};
    leads.forEach((l) => { counts[l.status] = (counts[l.status] || 0) + 1; });
    const totalValue = leads.reduce((s, l) => s + l.value, 0);
    let msg = `Here is your lead summary:\n\n`;
    msg += `Total leads: ${leads.length}\nTotal pipeline value: ${fmt(totalValue)}\n\n`;
    Object.entries(counts).forEach(([status, count]) => {
      msg += `• ${status}: ${count} lead${count > 1 ? 's' : ''}\n`;
    });
    msg += `\nWould you like me to qualify them or drill into a specific status?`;
    return msg;
  }

  // --- follow-up ---
  if (/follow/.test(lower)) {
    const upcoming = followups.filter((f) => !f.completed).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);
    let msg = `Here are your upcoming follow-ups:\n\n`;
    upcoming.forEach((f, i) => {
      msg += `${i + 1}. ${f.title}\n   Company: ${f.company} | Due: ${f.dueDate} | Priority: ${f.priority}\n\n`;
    });
    msg += `You have ${followups.filter((f) => !f.completed).length} pending follow-ups total. Want me to draft a message for any of these?`;
    return msg;
  }

  // --- qualify / qualification ---
  if (/qualif/.test(lower)) {
    const top5 = qualifiedLeads.slice(0, 5);
    let msg = `Lead Qualification Analysis (top 5):\n\n`;
    top5.forEach((l, i) => {
      msg += `${i + 1}. ${l.name} — ${l.company}\n   Score: ${l.score}/100 (${l.label}) | Value: ${fmt(l.value)} | Status: ${l.status}\n\n`;
    });
    msg += `Scoring is based on deal value, pipeline status, and recency of contact. Shall I set follow-ups for the hot leads?`;
    return msg;
  }

  // --- schedule / demo ---
  if (/schedul|demo/.test(lower)) {
    let msg = `Here are available slots for scheduling:\n\n`;
    msg += `Today:\n  • 2:00 PM – 2:30 PM\n  • 4:00 PM – 4:30 PM\n\n`;
    msg += `Tomorrow:\n  • 10:00 AM – 10:30 AM\n  • 1:00 PM – 1:30 PM\n  • 3:00 PM – 3:30 PM\n\n`;
    const pending = followups.filter((f) => f.type === 'meeting' && !f.completed);
    if (pending.length > 0) {
      msg += `You also have ${pending.length} pending demo/meeting follow-ups:\n`;
      pending.slice(0, 3).forEach((f) => {
        msg += `  • ${f.title} (${f.dueDate})\n`;
      });
      msg += `\n`;
    }
    msg += `Would you like me to schedule a follow-up? Just say "Schedule for [lead name] at [time]".`;
    return msg;
  }

  // --- pricing / quotation / quote ---
  if (/pric|quot/.test(lower)) {
    let msg = `Quick Pricing Summary:\n\n`;
    msg += `Starter Plan:  ${fmt(5000)}/user/month (up to 10 users)\n`;
    msg += `Growth Plan:   ${fmt(8000)}/user/month (up to 50 users)\n`;
    msg += `Enterprise:    ${fmt(12000)}/user/month (unlimited users)\n\n`;
    msg += `Volume discounts:\n`;
    msg += `  • 20+ seats → 10% off\n  • 50+ seats → 20% off\n  • 100+ seats → custom pricing\n\n`;
    const highVal = leads.filter((l) => l.value >= 300000).sort((a, b) => b.value - a.value);
    if (highVal.length > 0) {
      msg += `High-value leads awaiting quotes:\n`;
      highVal.slice(0, 3).forEach((l) => {
        msg += `  • ${l.name} (${l.company}) — ${fmt(l.value)}\n`;
      });
      msg += `\n`;
    }
    msg += `Want me to generate a detailed quotation for a specific lead?`;
    return msg;
  }

  // --- report / analytics ---
  if (/report|analytic/.test(lower)) {
    const total = leads.length;
    const converted = leads.filter((l) => l.status === 'Converted').length;
    const lost = leads.filter((l) => l.status === 'Lost').length;
    const active = total - converted - lost;
    const totalVal = leads.reduce((s, l) => s + l.value, 0);
    const wonVal = leads.filter((l) => l.status === 'Converted').reduce((s, l) => s + l.value, 0);
    const convRate = ((converted / total) * 100).toFixed(1);
    let msg = `Conversion & Pipeline Report:\n\n`;
    msg += `Total Leads: ${total}\nActive Pipeline: ${active}\nConverted: ${converted} (${convRate}%)\nLost: ${lost}\n\n`;
    msg += `Pipeline Value: ${fmt(totalVal)}\nWon Revenue: ${fmt(wonVal)}\nAvg Deal Size: ${fmt(Math.round(totalVal / total))}\n\n`;
    msg += `Top sources:\n`;
    const sources = {};
    leads.forEach((l) => { sources[l.source] = (sources[l.source] || 0) + 1; });
    Object.entries(sources).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => {
      msg += `  • ${s}: ${c} leads\n`;
    });
    msg += `\nNeed a deeper breakdown by date range or assignee?`;
    return msg;
  }

  // --- whatsapp ---
  if (/whatsapp/.test(lower)) {
    let msg = `Here's a WhatsApp message template:\n\n`;
    msg += `---\nHi [Name],\n\nThank you for your interest in our platform! I wanted to follow up on our recent conversation.\n\n`;
    msg += `We have some exciting updates that I think would be perfect for [Company]:\n`;
    msg += `✅ New automation features\n✅ Enhanced reporting dashboard\n✅ Mobile app improvements\n\n`;
    msg += `Would you be available for a quick call this week to discuss?\n\nBest regards,\n[Your Name]\n---\n\n`;
    msg += `I can personalize this for a specific lead. Just tell me which one!`;
    return msg;
  }

  // --- email ---
  if (/email/.test(lower)) {
    let msg = `Here's a professional follow-up email template:\n\n`;
    msg += `---\nSubject: Following up on our conversation\n\n`;
    msg += `Dear [Name],\n\nI hope this email finds you well. I wanted to follow up regarding our discussion about [Product/Service] for [Company].\n\n`;
    msg += `As discussed, our solution offers:\n`;
    msg += `• Comprehensive lead management & pipeline tracking\n`;
    msg += `• Automated follow-up scheduling\n`;
    msg += `• Real-time analytics & reporting\n\n`;
    msg += `I have attached a brief overview for your reference. Would you have 15 minutes this week for a quick walkthrough?\n\n`;
    msg += `Looking forward to hearing from you.\n\nBest regards,\n[Your Name]\n---\n\n`;
    msg += `Want me to customize this for a specific lead?`;
    return msg;
  }

  // --- pipeline ---
  if (/pipeline/.test(lower)) {
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Converted', 'Lost'];
    let msg = `Pipeline Summary:\n\n`;
    stages.forEach((s) => {
      const items = leads.filter((l) => l.status === s);
      const val = items.reduce((sum, l) => sum + l.value, 0);
      const bar = '█'.repeat(items.length) + '░'.repeat(Math.max(0, 5 - items.length));
      msg += `${s.padEnd(11)} ${bar}  ${items.length} leads  (${fmt(val)})\n`;
    });
    msg += `\nTotal pipeline value: ${fmt(leads.reduce((s, l) => s + l.value, 0))}\n`;
    msg += `\nWant me to focus on any specific stage?`;
    return msg;
  }

  // --- ask about a specific lead by name ---
  const matchedLead = leads.find((l) => lower.includes(l.name.toLowerCase().split(' ')[0].toLowerCase()));
  if (matchedLead) {
    const q = qualifyLead(matchedLead);
    const lf = followups.filter((f) => f.leadId === matchedLead.id && !f.completed);
    let msg = `Here is the information on ${matchedLead.name}:\n\n`;
    msg += `Company: ${matchedLead.company}\nStatus: ${matchedLead.status}\nDeal Value: ${fmt(matchedLead.value)}\nSource: ${matchedLead.source}\nAssigned To: ${matchedLead.assignedTo}\nLast Contact: ${matchedLead.lastContact} (${daysSince(matchedLead.lastContact)} days ago)\nQualification: ${q.score}/100 (${q.label})\n\n`;
    msg += `Notes: ${matchedLead.notes}\n\n`;
    if (lf.length > 0) {
      msg += `Pending follow-ups:\n`;
      lf.forEach((f) => { msg += `  • ${f.title} (Due: ${f.dueDate})\n`; });
      msg += `\n`;
    }
    msg += `Would you like to schedule a follow-up or draft a message for ${matchedLead.name}?`;
    return msg;
  }

  // --- default ---
  return `I can help you with a variety of sales tasks. Try asking me about:\n\n• "Show leads" — view your lead summary\n• "Follow-ups" — see upcoming follow-ups\n• "Qualify leads" — run qualification analysis\n• "Schedule demo" — view available slots\n• "Pricing" — get pricing summary\n• "Report" — see conversion metrics\n• "WhatsApp" or "Email" — draft message templates\n• "Pipeline" — view pipeline breakdown\n\nYou can also ask about any lead by name (e.g., "Tell me about Rajesh").`;
};

// --------------- quick action chips ---------------

const quickActions = [
  { label: 'Qualify top leads', icon: Zap, text: 'Qualify my top leads' },
  { label: 'Draft follow-up email', icon: Mail, text: 'Draft a follow-up email' },
  { label: 'Schedule demo', icon: Calendar, text: 'Schedule a demo' },
  { label: 'Send WhatsApp message', icon: MessageSquare, text: 'Send a WhatsApp message' },
  { label: 'Show pipeline summary', icon: BarChart3, text: 'Show me the pipeline summary' },
  { label: 'Generate report', icon: Sparkles, text: 'Generate a conversion report' },
];

// --------------- component ---------------

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message: 'Hello! I am your AI Sales Assistant. I can help you manage leads, schedule follow-ups, draft messages, generate reports, and more.\n\nTry one of the quick actions below, or just ask me anything!',
      time: ts(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const addAIResponse = (userText) => {
    setIsTyping(true);
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const reply = generateAIResponse(userText);
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: 'ai', message: reply, time: ts() },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: messages.length + 1, sender: 'user', message: input.trim(), time: ts() };
    setMessages((prev) => [...prev, userMsg]);
    const text = input.trim();
    setInput('');
    addAIResponse(text);
  };

  const handleChipClick = (text) => {
    const userMsg = { id: messages.length + 1, sender: 'user', message: text, time: ts() };
    setMessages((prev) => [...prev, userMsg]);
    addAIResponse(text);
  };

  const handleLeadClick = (lead) => {
    const text = `Tell me about ${lead.name}`;
    const userMsg = { id: messages.length + 1, sender: 'user', message: text, time: ts() };
    setMessages((prev) => [...prev, userMsg]);
    addAIResponse(text);
  };

  const handleScheduleClick = () => {
    setToast('Follow-up scheduled successfully!');
  };

  const scoreBadge = (label) => {
    if (label === 'Hot') return 'bg-red-50 text-red-600 border-red-200';
    if (label === 'Warm') return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-sky-50 text-sky-600 border-sky-200';
  };

  return (
    <div className="flex gap-5 h-[calc(100vh-8rem)]">
      {/* ============ Main Chat Panel ============ */}
      <div className="flex flex-1 min-w-0 flex-col rounded-2xl bg-white shadow-md">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-surface-border px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 border border-violet-100">
            <Bot className="h-5 w-5 text-violet-400" />
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
            <div className="flex items-center gap-1 rounded-full bg-violet-50 border border-violet-100 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-medium text-violet-500">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-1">
          {messages.length === 1 && (
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100">
                <Bot className="h-8 w-8 text-violet-400" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-secondary-900">How can I help you today?</h2>
              <p className="mt-1 text-sm text-surface-muted">
                I can help you with lead management, follow-ups, reports, and more.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id}>
              <ChatBubble
                message={msg.message}
                isOwn={msg.sender === 'user'}
                senderName={msg.sender === 'ai' ? 'AI Assistant' : 'You'}
                time={msg.time}
              />
              {/* Schedule button on relevant AI messages */}
              {msg.sender === 'ai' && /schedule|slot|follow-up/i.test(msg.message) && (
                <div className="flex justify-start mb-3 ml-1">
                  <button
                    onClick={handleScheduleClick}
                    className="flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600 transition-all hover:bg-primary-100 hover:shadow-sm"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Schedule Follow-up
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[75%]">
                <p className="mb-1 text-xs font-medium text-surface-muted">AI Assistant</p>
                <div className="rounded-2xl rounded-bl-md bg-white shadow-sm border border-surface-border/50 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips */}
        <div className="border-t border-surface-border px-6 pt-4">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleChipClick(action.text)}
                  className="flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-medium text-primary-700 transition-all duration-200 hover:bg-primary-100 hover:border-primary-300 hover:shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              );
            })}
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
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); }}
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-primary-500/10 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>

      {/* ============ Right Sidebar — Lead Qualification Panel ============ */}
      <div className="hidden lg:flex w-80 flex-col rounded-2xl bg-white shadow-md">
        {/* Sidebar Header */}
        <div className="flex items-center gap-2.5 border-b border-surface-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 border border-violet-100">
            <Users className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-secondary-900">Lead Qualification</h2>
            <p className="text-xs text-surface-muted">Top 5 scored leads</p>
          </div>
        </div>

        {/* Lead Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {qualifiedLeads.slice(0, 5).map((lead) => (
            <button
              key={lead.id}
              onClick={() => handleLeadClick(lead)}
              className="w-full text-left rounded-xl border border-surface-border/60 p-3.5 transition-all duration-200 hover:shadow-md hover:border-primary-200 hover:bg-primary-50/30 group"
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-secondary-900 truncate group-hover:text-primary-600 transition-colors">{lead.name}</p>
                  <p className="text-xs text-surface-muted truncate">{lead.company}</p>
                </div>
                <span className={`shrink-0 ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${scoreBadge(lead.label)}`}>
                  {lead.label}
                </span>
              </div>

              {/* Score bar */}
              <div className="mt-2.5 mb-1.5">
                <div className="flex items-center justify-between text-[10px] text-surface-muted mb-1">
                  <span>Score</span>
                  <span className="font-semibold text-secondary-700">{lead.score}/100</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${lead.label === 'Hot' ? 'bg-red-400' : lead.label === 'Warm' ? 'bg-amber-400' : 'bg-sky-400'}`}
                    style={{ width: `${lead.score}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-surface-muted mt-2">
                <span>{fmt(lead.value)}</span>
                <span>{lead.status}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-surface-border p-4">
          <button
            onClick={() => handleChipClick('Qualify my top leads')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Zap className="h-4 w-4" />
            Run Full Analysis
          </button>
        </div>
      </div>

      {/* ============ Toast Notification ============ */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-600/20">
            <Calendar className="h-4 w-4" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
