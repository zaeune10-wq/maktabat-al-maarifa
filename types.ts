
export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  authorBio?: string; // نبذة عن المؤلف (اختياري)
  coverUrl: string;
  year: string;
  readUrl?: string; // رابط للقراءة (اختياري)
}

export type Page = 'home' | 'books' | 'about' | 'contact' | 'privacy';

export interface Category {
  id: string;
  name: string;
  icon: string;
}
