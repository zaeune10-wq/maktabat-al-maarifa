
import React from 'react';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-l from-slate-900 via-slate-800 to-blue-900 text-white shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="text-3xl bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-all">📚</div>
            <h1 className="text-2xl font-bold font-serif-arabic tracking-tight">مكتبة المعرفة الإلكترونية</h1>
          </div>
          <nav className="flex flex-wrap justify-center mt-4 md:mt-0 gap-6 text-sm font-medium">
            {[
              { id: 'home', label: 'الرئيسية' },
              { id: 'books', label: 'الكتب' },
              { id: 'about', label: 'من نحن' },
              { id: 'contact', label: 'اتصل بنا' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id as Page)}
                className={`hover:text-blue-400 transition-colors relative pb-1 ${
                  currentPage === link.id ? 'text-blue-400 after:absolute after:bottom-0 after:right-0 after:w-full after:h-0.5 after:bg-blue-400' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-6 font-serif-arabic">عن مكتبة المعرفة</h3>
            <p className="text-sm leading-relaxed">
              مشروع معرفي يهدف إلى إحياء التراث العربي وتوفير المصادر العلمية الحديثة لكل طالب معرفة في أنحاء العالم العربي.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-6 font-serif-arabic">روابط سريعة</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition-colors">سياسة الخصوصية</button></li>
              <li><button className="hover:text-white transition-colors">شروط الاستخدام</button></li>
              <li><button className="hover:text-white transition-colors">حقوق النشر</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-6 font-serif-arabic">تواصل معنا</h3>
            <p className="text-sm mb-4">اشترك في النشرة البريدية ليصلك جديد الكتب.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors">
                اشترك
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لمكتبة المعرفة الإلكترونية</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
