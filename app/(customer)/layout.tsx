import Link from 'next/link';
import { ChevronLeft, Search, Share2 } from 'lucide-react';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white w-full max-w-7xl mx-auto shadow-xl relative sm:border-x border-gray-200">
      
      {/* Delivery App Style Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          
          <div className="flex-1 flex justify-center">
             <span className="font-bold text-gray-900 text-lg tracking-tight">Resto Modern</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button className="flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full bg-white relative">
        {children}
      </main>
      
    </div>
  );
}
