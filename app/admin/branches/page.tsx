"use client";

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from 'lucide-react';

export default function BranchesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: '', name: '', address: '', phone: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = branches.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase())));
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedBranches = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchBranches = async () => {
    setLoading(true);
    const res = await fetch('/api/branches');
    const data = await res.json();
    setBranches(Array.isArray(data.branches) ? data.branches : []);
    setLoading(false);
  };

  useEffect(() => { fetchBranches(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name) return;
    setLoading(true);
    const isEdit = !!form.id;
    await fetch('/api/branches', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ id: '', name: '', address: '', phone: '' });
    fetchBranches();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus cabang ini permanen? Transaksi bisa terputus!")) return;
    setLoading(true);
    await fetch(`/api/branches?id=${id}`, { method: 'DELETE' });
    fetchBranches();
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (b: any) => {
    setForm(b);
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
         <h1 className="text-2xl text-[#212529] font-normal tracking-tight">Manajemen Cabang</h1>
         <div className="flex items-center text-[13.5px] text-[#6c757d] gap-2 mt-2 sm:mt-0">
            <span>Beranda</span> <span className="text-gray-300">/</span> <span className="text-gray-600">Cabang</span>
         </div>
      </div>

      <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#17a2b8] shadow-sm w-full">
         <div className="px-5 py-4 border-b border-[#dee2e6] flex justify-between items-center">
           <h3 className="font-medium text-[#212529] m-0">{form.id ? 'Edit Cabang' : 'Tambah Cabang Baru'}</h3>
           {form.id && <button type="button" onClick={() => setForm({id:'', name:'', address:'', phone:''})} className="text-xs text-blue-600 hover:underline">Batal Edit</button>}
         </div>
         <div className="p-5">
           <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3 items-end max-w-4xl">
             <div className="flex-1 w-full">
               <label className="text-[13px] font-bold text-[#495057] mb-2 block">Nama Cabang</label>
               <Input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="h-[38px] rounded-[3px] focus:border-[#80bdff] shadow-none" placeholder="Cth: Cabang Sudirman" disabled={loading}/>
             </div>
             <div className="flex-1 w-full">
               <label className="text-[13px] font-bold text-[#495057] mb-2 block">Telepon</label>
               <Input required value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="h-[38px] rounded-[3px] focus:border-[#80bdff] shadow-none" placeholder="021-..." disabled={loading}/>
             </div>
             <div className="flex-1 w-full sm:w-[35%]">
               <label className="text-[13px] font-bold text-[#495057] mb-2 block">Alamat</label>
               <Input required value={form.address} onChange={e=>setForm({...form, address: e.target.value})} className="h-[38px] rounded-[3px] focus:border-[#80bdff] shadow-none" placeholder="Jl. Raya..." disabled={loading}/>
             </div>
             <button type="submit" disabled={loading} className="h-[38px] w-full sm:w-auto px-5 bg-[#17a2b8] text-white font-medium rounded-[3px] hover:bg-[#138496] transition-colors shadow-sm disabled:opacity-50">
               {form.id ? 'Update Cabang' : 'Simpan Master'}
             </button>
           </form>
         </div>
      </div>

      <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#007bff] shadow-sm w-full overflow-hidden">
        {/* DataTable Top Controls */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#dee2e6]">
           <div className="flex items-center gap-2 text-[14px] text-[#495057]">
              <span>Tampilkan</span>
              <select value={itemsPerPage} onChange={e => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="border border-[#ced4da] rounded-[3px] px-2 py-1 outline-none focus:border-[#80bdff]">
                 <option value={10}>10</option>
                 <option value={25}>25</option>
                 <option value={50}>50</option>
                 <option value={100}>100</option>
              </select>
              <span>entri</span>
           </div>
           <div className="flex items-center gap-2 text-[14px] text-[#495057]">
              <span>Cari:</span>
              <input type="search" value={searchTerm} onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="border border-[#ced4da] rounded-[3px] px-3 py-1 outline-none focus:border-[#80bdff]" placeholder="Ketik kata kunci..." disabled={loading}/>
           </div>
        </div>

        <table className="w-full text-left text-[14px]">
          <thead className="bg-white border-b border-[#dee2e6] text-[#495057]">
            <tr>
              <th className="px-5 py-3.5 font-bold w-[50px] text-center">No.</th>
              <th className="px-5 py-3.5 font-bold">Nama Cabang</th>
              <th className="px-5 py-3.5 hidden sm:table-cell font-bold">Alamat Fisik</th>
              <th className="px-5 py-3.5 hidden sm:table-cell font-bold">Telepon</th>
              <th className="px-5 py-3.5 text-right font-bold w-[120px]">Operasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dee2e6]">
            {paginatedBranches.map((c, index) => (
              <tr key={c.id} className="hover:bg-[#f2f4f5] transition-colors">
                <td className="px-5 py-3.5 text-[#212529] font-medium text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-5 py-3.5 text-[#212529] font-medium">{c.name}</td>
                <td className="px-5 py-3.5 text-[#6c757d] hidden sm:table-cell">{c.address || "-"}</td>
                <td className="px-5 py-3.5 text-[#6c757d] hidden sm:table-cell">{c.phone || "-"}</td>
                <td className="px-5 py-3.5 text-right">
                   <button onClick={() => handleEdit(c)} className="bg-[#17a2b8] text-white p-1.5 px-2.5 rounded-[3px] hover:bg-[#138496] transition-colors inline-block mr-1"><Edit2 size={14}/></button>
                   <button onClick={() => handleDelete(c.id)} className="bg-[#dc3545] text-white p-1.5 px-2.5 rounded-[3px] hover:bg-[#c82333] transition-colors inline-block"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {!loading && filteredData.length === 0 && (
               <tr><td colSpan={5} className="p-10 text-center text-gray-400">Pencarian tidak menemukan hasil (atau database kosong)</td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 0 && (
           <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#dee2e6] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[14px] text-[#212529]">
                 Menampilkan {!loading && filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} sampai {!loading ? Math.min(currentPage * itemsPerPage, filteredData.length) : 0} dari {!loading ? filteredData.length : 0} entri {searchTerm && `(difilter dari ${branches.length} total entri)`}
              </span>
              <div className="flex gap-1">
                 <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-xs font-bold rounded-[3px] border border-[#ced4da] bg-white hover:bg-gray-50 disabled:opacity-50">Mundur</button>
                 <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-xs font-bold rounded-[3px] border border-[#ced4da] bg-white hover:bg-gray-50 disabled:opacity-50">Maju</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
