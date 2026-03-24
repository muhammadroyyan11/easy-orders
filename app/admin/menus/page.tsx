"use client";

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function MenuAdmin() {
  const [menus, setMenus] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', categoryId: '', popular: false });
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(menus.length / itemsPerPage) || 1;
  const paginatedMenus = menus.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchData = async () => {
    const [resMenu, resCat] = await Promise.all([fetch('/api/menus'), fetch('/api/categories')]);
    setMenus(await resMenu.json());
    setCategories(await resCat.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch('/api/menus', { method: 'POST', body: JSON.stringify(form) });
    setForm({ name: '', description: '', price: '', image: '', categoryId: '', popular: false });
    fetchData();
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hancurkan unit menu ini dari sistem?")) return;
    await fetch(`/api/menus?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
         <h1 className="text-2xl text-[#212529] font-normal tracking-tight">Inventori Stok</h1>
         <div className="flex items-center text-[13.5px] text-[#6c757d] gap-2 mt-2 sm:mt-0">
            <span>Beranda</span> <span className="text-gray-300">/</span> <span className="text-gray-600">Menu</span>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full">
        {/* Editor Form Panel (AdminLTE Card) */}
        <div className="xl:col-span-1 bg-white rounded-[4px] border-t-[3px] border-t-[#28a745] shadow-sm h-fit">
          <div className="px-5 py-4 border-b border-[#dee2e6]">
            <h3 className="font-medium text-[#212529] m-0">Buat Resep Baru</h3>
          </div>
          <div className="p-5">
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Identitas Menu</label>
                <Input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="h-[38px] rounded-[3px] focus:border-[#80bdff] text-[13px] shadow-none"/>
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Bumbu / Deskripsi</label>
                <textarea required value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full rounded-[3px] border border-[#ced4da] p-3 text-[13px] focus:outline-none focus:border-[#80bdff] min-h-[90px] resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Pajak Tunai</label>
                  <Input required type="number" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="h-[38px] rounded-[3px] text-[13px]"/>
                </div>
                <div>
                  <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Taksonomi</label>
                  <select required value={form.categoryId} onChange={e=>setForm({...form, categoryId: e.target.value})} className="w-full h-[38px] rounded-[3px] border border-[#ced4da] px-3 text-[13px] bg-white focus:outline-none focus:border-[#80bdff]">
                    <option value="">Pilih</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Cloud Image (Opsional)</label>
                <div className="flex relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><ImageIcon size={14}/></div>
                   <Input value={form.image} onChange={e=>setForm({...form, image: e.target.value})} className="h-[38px] rounded-[3px] pl-9 text-[13px]"/>
                </div>
              </div>
              <label className="flex items-center gap-2 mt-2 cursor-pointer p-2 border border-[#dee2e6] rounded-[3px] bg-[#f8f9fa] hover:bg-[#e9ecef]">
                 <input type="checkbox" checked={form.popular} onChange={e=>setForm({...form, popular: e.target.checked})} className="mx-1" />
                 <span className="text-[13px] font-semibold text-[#495057] cursor-pointer">Fitur Spotlight 🔥</span>
              </label>
              <div className="pt-2 border-t border-[#dee2e6] mt-4">
                <button type="submit" disabled={isLoading} className="w-full h-[38px] bg-[#28a745] text-white font-medium rounded-[3px] hover:bg-[#218838] transition-colors disabled:opacity-50 text-[14px]">
                  Rilis Publik
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Grid List View - Span Full Width of Remaining Array */}
        <div className="xl:col-span-3 bg-white rounded-[4px] border-t-[3px] border-t-[#007bff] shadow-sm w-full h-fit">
           <div className="px-5 py-4 border-b border-[#dee2e6] bg-white">
             <h3 className="font-medium text-[#212529] m-0">Basis Data Menu Aktif</h3>
           </div>
           
           <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {paginatedMenus.map(m => (
                 <div key={m.id} className="flex flex-row sm:flex-col lg:flex-row gap-3 p-3 bg-white rounded border border-[#dee2e6] hover:border-[#b8bfc6] transition-colors relative">
                   <div className="w-[70px] h-[70px] sm:w-full sm:h-[120px] lg:w-[90px] lg:h-[90px] rounded bg-[#f4f6f9] overflow-hidden shrink-0">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     {m.image ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={24}/></div>}
                   </div>
                   <div className="flex-1 min-w-0 pr-6 flex flex-col justify-center">
                       <h3 className="font-bold text-[15px] text-[#212529] truncate">{m.name}</h3>
                       <span className="font-bold text-[#007bff] text-[15px]">Rp {m.price.toLocaleString('id-ID')}</span>
                     <div className="flex gap-1.5 mt-1.5">
                       <Badge variant="outline" className="text-[9px] bg-white rounded-[3px] text-gray-600 font-normal px-1 py-0">{m.category?.name || 'Null'}</Badge>
                       {m.popular && <Badge className="text-[9px] bg-[#ffc107] text-[#1f2d3d] border-none rounded-[3px] px-1 py-0 shadow-none font-bold">Populer</Badge>}
                     </div>
                   </div>
                   
                   <button onClick={() => handleDelete(m.id)} className="absolute top-2 right-2 text-[#dc3545] hover:bg-[#dc3545] hover:text-white p-1 rounded transition-colors hidden sm:block">
                     <Trash2 size={14}/>
                   </button>
                   <button onClick={() => handleDelete(m.id)} className="absolute top-4 right-4 text-[#dc3545] sm:hidden">
                     <Trash2 size={16}/>
                   </button>
                 </div>
               ))}
               {menus.length === 0 && (
                 <div className="col-span-full text-center py-10 bg-[#f4f6f9] border border-dashed rounded">
                   <p className="text-gray-500 font-medium">Katalog menu Anda kosong.</p>
                 </div>
               )}
               </div>
               
               {/* Pagination UI */}
               {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-[#dee2e6] pt-4">
                     <span className="text-xs text-[#6c757d] font-medium">
                       Menampilkan {paginatedMenus.length} dari {menus.length} Item (Hal {currentPage}/{totalPages})
                     </span>
                     <div className="flex gap-1">
                       <button 
                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                         disabled={currentPage === 1}
                         className="px-3 py-1 text-xs font-bold rounded-[3px] border border-[#ced4da] bg-white hover:bg-gray-50 disabled:opacity-50"
                       >Prev</button>
                       <button 
                         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                         disabled={currentPage === totalPages}
                         className="px-3 py-1 text-xs font-bold rounded-[3px] border border-[#ced4da] bg-white hover:bg-gray-50 disabled:opacity-50"
                       >Next</button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
