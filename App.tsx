
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import VirtualLibrarian from './components/VirtualLibrarian';
import { Page, Book } from './types';
import { MOCK_BOOKS, CATEGORIES } from './constants';
import { generateBookSuggestions } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('maktabati_books');
    return saved ? JSON.parse(saved) : MOCK_BOOKS;
  });
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [notifications, setNotifications] = useState<{id: number, text: string, type: 'success' | 'info'}[]>([]);
  
  // Suggestions state
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Favorites & Ratings persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('maktabati_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('maktabati_ratings');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('maktabati_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('maktabati_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('maktabati_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addNotification = (text: string, type: 'success' | 'info' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      let matchesCategory = true;
      if (selectedCategory === 'favorites') matchesCategory = favorites.includes(book.id);
      else if (selectedCategory === 'top-rated') matchesCategory = (ratings[book.id] || 0) >= 4;
      else if (selectedCategory !== 'all') matchesCategory = book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [debouncedSearchQuery, selectedCategory, books, favorites, ratings]);

  const handleGetSuggestions = async () => {
    setIsSuggesting(true);
    const categoryNames = CATEGORIES.map(c => c.name);
    const results = await generateBookSuggestions(categoryNames);
    
    const formattedResults = results.map((b: any) => ({
      ...b,
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      coverUrl: b.coverUrl || `https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop`
    }));
    
    setSuggestedBooks(formattedResults);
    setIsSuggesting(false);
  };

  const toggleFavorite = (bookId: string) => {
    setFavorites(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const addSuggestedToLibrary = (book: Book) => {
    if (books.find(b => b.title === book.title)) {
      addNotification('هذا الكتاب موجود بالفعل في مكتبتك!');
      return;
    }
    setBooks([book, ...books]);
    setSuggestedBooks(prev => prev.filter(b => b.id !== book.id));
    addNotification(`تمت إضافة "${book.title}" إلى مكتبتك.`, 'success');
  };

  const handleReadClick = (book: Book) => {
    if (book.readUrl && book.readUrl !== '#') {
      window.open(book.readUrl, '_blank', 'noopener,noreferrer');
    } else {
      addNotification('رابط القراءة غير متوفر حالياً لهذا الكتاب.', 'info');
    }
  };

  const handleDownloadClick = (book: Book) => {
    if (book.readUrl && book.readUrl !== '#') {
      const link = document.createElement('a');
      link.href = book.readUrl;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addNotification(`بدء تحميل: ${book.title}`, 'success');
    } else {
      addNotification('عذراً، ملف التحميل غير متوفر لهذا الكتاب.', 'info');
    }
  };

  const renderStars = (bookId: string, isInteractive = false) => {
    const currentRating = ratings[bookId] || 0;
    return (
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={!isInteractive}
            onClick={(e) => { if (isInteractive) { e.stopPropagation(); setRatings(prev => ({ ...prev, [bookId]: star })); } }}
            className={`${isInteractive ? 'hover:scale-125 transition-transform' : 'cursor-default'} ${star <= currentRating ? 'text-amber-400' : 'text-slate-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${isInteractive ? 'w-8 h-8' : 'w-4 h-4'}`}>
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="space-y-12">
        <div className="relative overflow-hidden rounded-3xl bg-blue-900 text-white p-8 md:p-16 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform origin-top-right"></div>
          <div className="relative z-10 max-w-2xl text-right">
            <h2 className="text-4xl md:text-5xl font-bold font-serif-arabic mb-6 leading-tight">اكتشف عوالم جديدة بين طيات الكتب</h2>
            <p className="text-blue-100 mb-10 text-lg">ابحث في آلاف الكتب والمصادر المعرفية المختارة بعناية.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input type="text" placeholder="ابحث عن عنوان، مؤلف..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white text-gray-900 rounded-xl px-12 py-4 focus:ring-4 focus:ring-blue-500/50 outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-white/10 text-white rounded-xl px-6 py-4 border border-white/20 outline-none focus:bg-white/20 transition-all backdrop-blur-sm">
                <option value="all" className="text-gray-900">جميع التصنيفات</option>
                <option value="favorites" className="text-gray-900">المفضلة الخاصة بي</option>
                <option value="top-rated" className="text-gray-900">الأعلى تقييماً ⭐</option>
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.name} className="text-gray-900">{cat.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 font-serif-arabic text-blue-900 border-b pb-4 border-blue-100 flex items-center gap-2"><span>🗂️</span> المجموعات</h3>
              <div className="flex flex-wrap lg:flex-col gap-1">
                <button onClick={() => setSelectedCategory('all')} className={`px-4 py-3 rounded-xl text-right transition-all flex items-center justify-between group w-full ${selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <span className="flex items-center gap-3">📚 الكل</span>
                  <span className="text-xs opacity-50">{books.length}</span>
                </button>
                <button onClick={() => setSelectedCategory('favorites')} className={`px-4 py-3 rounded-xl text-right transition-all flex items-center justify-between group w-full ${selectedCategory === 'favorites' ? 'bg-rose-600 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <span className="flex items-center gap-3"><span className={selectedCategory === 'favorites' ? 'text-white' : 'text-rose-500'}>❤️</span>المفضلة</span>
                  <span className="text-xs opacity-50">{favorites.length}</span>
                </button>
                <div className="my-3 border-t border-gray-100"></div>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)} 
                    className={`px-4 py-3 rounded-xl text-right transition-all flex items-center justify-between group w-full ${selectedCategory === cat.name ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <span className="flex items-center gap-3"><span>{cat.icon}</span>{cat.name}</span>
                    <span className="text-xs opacity-50">{books.filter(b => b.category === cat.name).length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleGetSuggestions}
                disabled={isSuggesting}
                className="w-full bg-amber-50 text-amber-700 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-amber-100 hover:shadow-xl transition-all border border-amber-200 disabled:opacity-50"
              >
                <span className="text-xl">✨</span>
                <span>{isSuggesting ? 'جاري البحث...' : 'استكشف مقترحات ذكية'}</span>
              </button>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            {(isSuggesting || suggestedBooks.length > 0) && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-3xl border border-amber-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-serif-arabic text-amber-900 flex items-center gap-2"><span>✨</span> مقترحات ذكية لك</h3>
                  {suggestedBooks.length > 0 && !isSuggesting && <button onClick={() => setSuggestedBooks([])} className="text-amber-600 text-xs hover:underline">إخفاء</button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {isSuggesting ? [1,2,3].map(i => <div key={i} className="bg-white/50 h-64 rounded-2xl animate-pulse border border-amber-100"></div>) : 
                    suggestedBooks.map(book => (
                      <div key={book.id} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex flex-col h-full group hover:shadow-md transition-shadow">
                        <div className="aspect-[3/4] mb-3 overflow-hidden rounded-xl bg-slate-100">
                          <img src={book.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={book.title} />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1 line-clamp-1">{book.title}</h4>
                        <p className="text-[10px] text-slate-500 mb-2">{book.author}</p>
                        <button onClick={() => addSuggestedToLibrary(book)} className="mt-auto w-full bg-amber-600 text-white text-xs py-2 rounded-lg font-bold hover:bg-amber-700">أضف للمكتبة 📥</button>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold font-serif-arabic text-slate-800">
                {selectedCategory === 'all' ? 'المكتبة' : selectedCategory === 'favorites' ? 'كتبي المفضلة' : `كتب ${selectedCategory}`}
              </h3>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">تم العثور على {filteredBooks.length} كتاب</span>
            </div>

            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBooks.map((book) => (
                  <div 
                    key={book.id} 
                    onClick={() => setSelectedBook(book)} 
                    className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden shrink-0">
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <button className="bg-white text-gray-900 py-2.5 rounded-xl font-bold text-sm">عرض التفاصيل</button>
                      </div>
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold">{book.category}</span>
                        {favorites.includes(book.id) && <span className="bg-white p-2 rounded-full shadow-md text-rose-500 text-xs">❤️</span>}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-2">{renderStars(book.id)}</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1 font-serif-arabic line-clamp-1">{book.title}</h4>
                      <p className="text-sm text-slate-500 mb-4">{book.author}</p>
                      <div className="mt-auto border-t border-gray-50 pt-4">
                        <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">"{book.description}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="text-6xl mb-6">🏜️</div>
                <h4 className="text-2xl font-bold text-gray-600 font-serif-arabic">المكتبة خالية حالياً</h4>
                <p className="text-gray-400 mt-2 max-w-sm mx-auto">استكشف مقترحاتنا الذكية للبدء في بناء مكتبتك الخاصة.</p>
                <div className="flex gap-4 justify-center mt-8">
                  <button onClick={handleGetSuggestions} className="bg-amber-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-amber-700 transition-all flex items-center gap-2">✨ استكشف المقترحات</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBook(null)}>
          <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row overflow-y-auto max-h-[85vh]">
              <div className="md:w-[40%] h-80 md:h-auto relative">
                <img src={selectedBook.coverUrl} className="w-full h-full object-cover" alt={selectedBook.title} />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">سنة النشر</p>
                  <p className="text-2xl font-bold">{selectedBook.year || 'غير متوفر'}</p>
                </div>
              </div>
              <div className="md:w-[60%] p-8 md:p-12 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-bold text-blue-900 font-serif-arabic mb-1">{selectedBook.title}</h3>
                    <h4 className="text-xl font-bold text-slate-600 mb-4">{selectedBook.author}</h4>
                  </div>
                  <button onClick={() => setSelectedBook(null)} className="p-3 hover:bg-slate-100 rounded-full transition-colors">✕</button>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl flex items-center justify-between border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase">تقييمك</span>
                  {renderStars(selectedBook.id, true)}
                </div>

                <div className="space-y-4">
                  <h5 className="text-lg font-bold text-slate-800 border-r-4 border-blue-600 pr-3">📜 عن الكتاب</h5>
                  <p className="text-slate-600 leading-relaxed text-lg font-serif-arabic italic">"{selectedBook.description}"</p>
                </div>

                <div className="flex flex-col gap-4 pt-8 border-t border-slate-100">
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => handleReadClick(selectedBook)} 
                      className="flex-[2] min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      <span>📖</span> قراءة الكتاب الآن
                    </button>
                    <button 
                      onClick={() => handleDownloadClick(selectedBook)} 
                      className="flex-1 min-w-[150px] bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      <span>📥</span> تحميل الكتاب
                    </button>
                    <button 
                      onClick={() => toggleFavorite(selectedBook.id)} 
                      className={`min-w-[70px] py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${favorites.includes(selectedBook.id) ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-100' : 'bg-slate-100 text-slate-600'}`}
                    >
                      <span>{favorites.includes(selectedBook.id) ? '❤️' : '🤍'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-[150] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`${n.type === 'success' ? 'bg-emerald-600' : 'bg-slate-800'} text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-500 pointer-events-auto flex items-center gap-3`}>
            <span>{n.type === 'success' ? '✅' : 'ℹ️'}</span>
            <span className="text-sm font-bold">{n.text}</span>
          </div>
        ))}
      </div>

      <VirtualLibrarian currentRatings={ratings} />
    </Layout>
  );
};

export default App;
