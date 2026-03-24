"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Coffee, List, QrCode, LogOut, Menu, Bell, Search, History, FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const pathname = usePathname();
  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#f4f6f9] text-[#212529]">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* AdminLTE 3 Dark Sidebar */}
      <aside className={`print:hidden fixed inset-y-0 left-0 z-50 w-[250px] bg-[#343a40] transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col shadow-[0_14px_28px_rgba(0,0,0,0.25)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Logo Menu */}
        <div className="h-[57px] flex items-center px-4 border-b border-[#4b545c] shrink-0">
          <span className="font-light text-xl text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#343a40] font-black text-lg shadow-sm">R</div>
            <span>Admin<b className="font-bold">LTE</b></span>
          </span>
        </div>
        
        {/* Sidebar Content */}
        <div className="overflow-y-auto flex-1 pb-4">
          {/* User Panel */}
          <div className="flex items-center p-4 border-b border-[#4b545c] mb-2 gap-3">
             <div className="w-10 h-10 rounded-full bg-[#007bff] flex items-center justify-center text-white font-bold text-sm shadow-md">SA</div>
             <p className="text-[#c2c7d0] text-sm font-medium">Super Admin</p>
          </div>

          <nav className="px-2 space-y-1 mt-3">
             <NavLink href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard Kasir" />
             <NavLink href="/admin/history" icon={<History size={18} />} label="Riwayat Transaksi" />
             <NavLink href="/admin/menus" icon={<Coffee size={18} />} label="Katalog Menu" />
             <NavLink href="/admin/categories" icon={<List size={18} />} label="Data Kategori" />
             <NavLink href="/admin/tables" icon={<QrCode size={18} />} label="Manajemen Meja" />
          </nav>
        </div>
        
        <div className="p-2 border-t border-[#4b545c]">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#c2c7d0] hover:text-white hover:bg-[#dc3545] rounded transition-colors font-medium">
            <LogOut size={16} /> Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Main Fluid Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* AdminLTE Light Navbar */}
        <header className="print:hidden h-[57px] flex items-center justify-between px-4 bg-white border-b border-[#dee2e6] shrink-0 z-10 w-full">
          <div className="flex items-center gap-4">
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={22} className="hidden lg:block"/>
              <Menu size={22} className="lg:hidden"/>
            </button>
            <div className="hidden sm:flex items-center gap-4 font-medium text-sm text-gray-500">
               <span className="hover:text-gray-700 cursor-pointer transition-colors">Home</span>
               <span className="hover:text-gray-700 cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-gray-500">
             <Search size={18} className="cursor-pointer hover:text-gray-700"/>
             <div className="relative cursor-pointer hover:text-gray-700">
                <Bell size={18}/>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#dc3545] rounded-full border border-white"></span>
             </div>
          </div>
        </header>

        {/* Coded Full Width Main Area */}
        <main className="flex-1 pb-16 overflow-y-auto overscroll-y-contain w-full animate-in fade-in duration-200">
           {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 text-[15px] rounded-[4px] transition-colors ${isActive ? 'bg-[#007bff] text-white shadow-sm' : 'text-[#c2c7d0] hover:bg-[#4b545c] hover:text-white'}`}>
      <span>{icon}</span>
      {label}
    </Link>
  );
}
