
import React, { useState, useRef, useEffect } from 'react';
import { getLibrarianResponse } from '../services/geminiService';
import { MOCK_BOOKS } from '../constants';

interface VirtualLibrarianProps {
  currentRatings?: Record<string, number>;
}

const VirtualLibrarian: React.FC<VirtualLibrarianProps> = ({ currentRatings = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'أهلاً بك في مكتبة المعرفة الإلكترونية! أنا مساعدك الذكي، كيف يمكنني مساعدتك في العثور على كتاب اليوم؟ يمكنني أيضاً مساعدتك في مراجعة الكتب التي قمت بتقييمها.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Add rating info to context if available
    const context = MOCK_BOOKS.map(b => {
      const rating = currentRatings[b.id];
      return `${b.title} لـ ${b.author} (${b.category})${rating ? ` - تقييم المستخدم لهذا الكتاب: ${rating} من 5 نجوم` : ''}`;
    }).join('\n');

    const aiResponse = await getLibrarianResponse(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || 'عذراً، لم أفهم ذلك.' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[450px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="font-bold">المساعد الذكي</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-blue-600 text-white rounded-tl-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tr-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl text-sm animate-pulse text-gray-400">
                  يكتب المساعد الآن...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اسأل عن كتاب أو معلومة..."
              className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2 border-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSend}
              className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
            >
              ➔
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center gap-2"
        >
          <span className="text-2xl">🤖</span>
          <span className="hidden md:inline font-medium">مساعدك الذكي</span>
        </button>
      )}
    </div>
  );
};

export default VirtualLibrarian;
