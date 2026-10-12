import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'agent';
  content: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'agent', 
      content: 'Hello! I am your Agentic AI Sales Assistant. I can help qualify leads, analyze requirements, and generate tailored proposals. How can we accelerate your sales pipeline today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      // Ensure this matches your Render backend URL
      const backendUrl = 'https://ai-sales-agent-system.onrender.com/api/chat'; 
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }), 
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const agentReply = data.response || "Request processed successfully.";
      
      setMessages((prev) => [...prev, { role: 'agent', content: agentReply }]);
    } catch (error) {
      console.error('API connection failed:', error);
      setMessages((prev) => [
        ...prev, 
        { role: 'agent', content: '⚠️ Connection Error: Unable to reach the backend server. Please check your Render deployment.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sleek Gradient Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-20 shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600 tracking-tight">
              Sales Intelligence Agent
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Automated Lead Qualification & Proposals</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">System Active</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 w-full max-w-4xl mx-auto space-y-8 scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-sm shadow-indigo-200' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-6 py-5 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Floating Glassmorphism Input Area */}
      <footer className="bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-6 pb-6 px-4">
        <form 
          onSubmit={handleSendMessage} 
          className="max-w-4xl mx-auto flex items-end gap-3 bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 transition-all focus-within:shadow-indigo-100 focus-within:border-indigo-300"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Describe the prospect, paste lead data, or request a proposal..."
            className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-700 placeholder-slate-400 resize-none max-h-32 min-h-[52px]"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-full p-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 mb-0.5"
          >
            <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-4 font-medium">
          Agentic AI responses are generated using LangGraph and may require human verification.
        </p>
      </footer>
    </div>
  );
}