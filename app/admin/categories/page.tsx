"use client";

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from 'lucide-react';

export default function CategoryAdmin() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchCat = async () => {
    const res = await fetch('/api/categories');
    setCategories(await res.json());
  };

  useEffect(() => { fetchCat(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!name) return;
    setIsLoading(true);
    await fetch('/api/categories', { method: 'POST', body: JSON.stringify({ name }) });
    setName("");
    fetchCat();
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus taksonomi kategori permanen?")) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    fetchCat();
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
         <h1 className="text-2xl text-[#212529] font-normal tracking-tight">Kategori Produk</h1>
         <div className="flex items-center text-[13.5px] text-[#6c757d] gap-2 mt-2 sm:mt-0">
            <span>Beranda</span> <span className="text-gray-300">/</span> <span className="text-gray-600">Kategori</span>
         </div>
      </div>

      <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#17a2b8] shadow-sm w-full">
         <div className="px-5 py-4 border-b border-[#dee2e6]">
           <h3 className="font-medium text-[#212529] m-0">Tambah Filter Baru</h3>
         </div>
         <div className="p-5">
           <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-end max-w-2xl">
             <div className="flex-1 w-full">
               <label className="text-[13px] font-bold text-[#495057] mb-2 block">Cth: Makanan Penutup</label>
               <Input required value={name} onChange={e=>setName(e.target.value)} className="h-[38px] rounded-[3px] focus:border-[#80bdff] shadow-none" disabled={isLoading}/>
             </div>
             <button type="submit" disabled={isLoading} className="h-[38px] w-full sm:w-auto px-5 bg-[#17a2b8] text-white font-medium rounded-[3px] hover:bg-[#138496] transition-colors shadow-sm disabled:opacity-50">
               Simpan Master
             </button>
           </form>
         </div>
      </div>

      <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#007bff] shadow-sm w-full overflow-hidden">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-white border-b border-[#dee2e6] text-[#495057]">
            <tr>
              <th className="px-5 py-3.5 font-bold">Identifikasi Grup</th>
              <th className="px-5 py-3.5 hidden sm:table-cell font-bold">Tanggal Integrasi</th>
              <th className="px-5 py-3.5 text-right font-bold w-[120px]">Operasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dee2e6]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#f2f4f5] transition-colors">
                <td className="px-5 py-3.5 text-[#212529] font-medium">{c.name}</td>
                <td className="px-5 py-3.5 text-[#6c757d] hidden sm:table-cell">{new Date(c.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="px-5 py-3.5 text-right">
                   <button onClick={() => handleDelete(c.id)} className="bg-[#dc3545] text-white p-1.5 px-2.5 rounded-[3px] hover:bg-[#c82333] transition-colors inline-block"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
               <tr><td colSpan={3} className="p-10 text-center text-gray-400">Database Taksonomi Kosong</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
