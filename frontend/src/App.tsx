import { useState, useRef, useEffect } from 'react';

// Define the structure of our chat messages
type Message = {
  role: 'user' | 'agent';
  content: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'agent', 
      content: 'Welcome to the AI Sales Agent System. I can help qualify leads, analyze requirements, and generate proposals. How can I assist you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the latest message
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
      // IMPORTANT: Replace this URL with your actual Render backend URL and endpoint
      const backendUrl = 'https://ai-sales-agent-system.onrender.com/api/chat'; 
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Adjust the payload structure based on your FastAPI endpoint schema
        body: JSON.stringify({ prompt: userText }), 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Adjust 'data.response' to match the exact JSON key your FastAPI server returns
      const agentReply = data.response || data.reply || data.message || "Request processed successfully.";
      
      setMessages((prev) => [...prev, { role: 'agent', content: agentReply }]);
    } catch (error) {
      console.error('API connection failed:', error);
      setMessages((prev) => [
        ...prev, 
        { role: 'agent', content: 'Error: Could not connect to the backend server. Please check if your Render service is live and CORS is configured.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4 px-6 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Sales Lead & Proposal Agent</h1>
          <p className="text-xs text-slate-400">Powered by FastAPI, LangGraph & React</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium">System Online</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full max-w-4xl mx-auto space-y-6">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4">
        <form 
          onSubmit={handleSendMessage} 
          className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 rounded-full p-1 shadow-inner border border-slate-200"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a lead, request a proposal, or ask a question..."
            className="flex-1 bg-transparent px-6 py-3 outline-none text-slate-800 placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}