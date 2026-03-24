"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Coffee, List, QrCode, LogOut, Menu, Bell, Search, History, FileSpreadsheet, FileText, ChefHat, TrendingUp, Users, Store } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [currentBranchId, setCurrentBranchId] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    fetch('/api/branches').then(r => r.json()).then(data => {
       if (data.branches) {
           setBranches(data.branches);
           setCurrentBranchId(data.currentBranchId);
       }
    });
  }, []);

  const pathname = usePathname();
  if (pathname === '/admin/login') return <>{children}</>;

  const handleBranchSwitch = async (id: string) => {
    await fetch('/api/auth/branch', { method: 'POST', body: JSON.stringify({ branchId: id }) });
    window.location.reload();
  };

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
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#343a40] font-black text-lg shadow-sm">E</div>
            <span>Easy <b className="font-bold">Orders</b></span>
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
             <NavLink href="/admin/kitchen" icon={<ChefHat size={18} />} label="Dapur KDS (Chef)" />
             <NavLink href="/admin/analytics" icon={<TrendingUp size={18} />} label="Statistik Omzet" />
             <NavLink href="/admin/history" icon={<History size={18} />} label="Riwayat Transaksi" />
             <NavLink href="/admin/menus" icon={<Coffee size={18} />} label="Katalog Menu" />
             <NavLink href="/admin/categories" icon={<List size={18} />} label="Data Kategori" />
             <NavLink href="/admin/tables" icon={<QrCode size={18} />} label="Manajemen Meja" />
             <div className="pt-2 pb-1">
                 <p className="px-3 text-[11px] font-bold text-[#818896] uppercase tracking-wider">Perusahaan SaaS</p>
             </div>
             <NavLink href="/admin/shift" icon={<List size={18} />} label="Shift & Rekap Laci" />
             <NavLink href="/admin/branches" icon={<Store size={18} />} label="Manajemen Outlet" />
             <NavLink href="/admin/users" icon={<Users size={18} />} label="Data Pegawai" />
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
            {/* Topbar */}
            <div className="h-[57px] px-4 bg-white border-b border-[#dee2e6] flex items-center justify-between shadow-sm sticky top-0 z-20 w-full">
               <button 
                 onClick={() => setIsMobileMenuOpen(true)} 
                 className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
               >
                 <Menu size={22} />
               </button>
               
               <div className="flex-1 flex justify-between items-center px-2 lg:px-6">
                 
                 {/* BRANCH SELECTOR */}
                 <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold text-[#6c757d] uppercase tracking-wider hidden sm:inline-block">Outlet Aktif:</span>
                    <select 
                       value={currentBranchId}
                       onChange={(e) => handleBranchSwitch(e.target.value)}
                       className="bg-[#f8f9fa] border border-[#ced4da] text-[#212529] text-[14px] font-bold py-1.5 px-3 rounded-[4px] hover:border-[#80bdff] focus:outline-none transition-all cursor-pointer shadow-sm w-44 truncate"
                    >
                      {branches.map(b => (
                         <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                 </div>

                 <div className="flex items-center gap-3 ml-auto">
                    <div className="relative hidden md:block">
                      {/* Assuming 'Input' is a custom component or a simple input tag */}
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                      <input placeholder="Pencarian global..." className="h-[36px] w-[250px] pl-9 bg-[#f4f6f9] border-transparent focus:bg-white text-[13px] rounded-[20px] transition-all border"/>
                    </div>
                 </div>
               </div>
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
