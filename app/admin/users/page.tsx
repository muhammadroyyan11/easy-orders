"use client";

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from 'lucide-react';

export default function UsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: '', name: '', email: '', password: '', role: 'CASHIER', branchId: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedUsers = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchData = async () => {
    setLoading(true);
    const [uRes, bRes] = await Promise.all([fetch('/api/users'), fetch('/api/branches')]);
    if(uRes.ok) setUsers(await uRes.json());
    if(bRes.ok) {
        const bData = await bRes.json();
        setBranches(bData.branches || []);
        if (bData.branches?.length > 0 && !form.branchId) {
            setForm(prev => ({...prev, branchId: bData.branches[0].id}));
        }
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name || !form.email) return;
    setLoading(true);
    const isEdit = !!form.id;
    const res = await fetch('/api/users', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const result = await res.json();
    if (result.error) {
       alert(result.error);
       setLoading(false);
       return;
    }
    setForm({ id: '', name: '', email: '', password: '', role: 'CASHIER', branchId: branches[0]?.id || '' });
    fetchData();
  };

  const handleDelete = async (id: string, role: string) => {
    if (role === 'SUPERADMIN' && !confirm('PERINGATAN! Anda menghapus SUPERADMIN. Lanjutkan?')) return;
    if (!confirm("Hapus pegawai ini permanen?")) return;
    setLoading(true);
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (u: any) => {
    setForm({...u, password: ''});
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
         <h1 className="text-2xl text-[#212529] font-normal tracking-tight">Data Pegawai</h1>
         <div className="flex items-center text-[13.5px] text-[#6c757d] gap-2 mt-2 sm:mt-0">
            <span>Beranda</span> <span className="text-gray-300">/</span> <span className="text-gray-600">Pegawai</span>
         </div>
      </div>

      <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#17a2b8] shadow-sm w-full">
         <div className="px-5 py-4 border-b border-[#dee2e6] flex justify-between items-center">
           <h3 className="font-medium text-[#212529] m-0">{form.id ? 'Ubah Akses Pegawai' : 'Tambah Pegawai Baru'}</h3>
           {form.id && <button type="button" onClick={() => setForm({ id: '', name: '', email: '', password: '', role: 'CASHIER', branchId: branches[0]?.id || '' })} className="text-xs text-blue-600 hover:underline">Batal Edit</button>}
         </div>
         <div className="p-5">
           <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-5xl">
             <div className="flex flex-col sm:flex-row gap-4">
               <div className="flex-1">
                 <label className="text-[13px] font-bold text-[#495057] mb-2 block">Nama Lengkap</label>
                 <Input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="h-[38px] rounded-[3px] focus:border-[#80bdff] shadow-none" placeholder="Cth: Budi Santoso" disabled={loading}/>
               </div>
               <div className="flex-1">
                 <label className="text-[13px] font-bold text-[#495057] mb-2 block">Email Login</label>
                 <Input required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="h-[38px] rounded-[3px] focus:border-[#80bdff] shadow-none" placeholder="budi@resto.com" disabled={loading}/>
               </div>
               <div className="flex-1">
                 <label className="text-[13px] font-bold text-[#495057] mb-2 block">Sandi {form.id && '(Isi untuk ubah)'}</label>
                 <Input type="password" required={!form.id} value={form.password} onChange={e=>setForm({...form, password: e.target.value})} className="h-[38px] rounded-[3px] focus:border-[#80bdff] shadow-none" placeholder="..." disabled={loading}/>
               </div>
             </div>
             <div className="flex flex-col sm:flex-row gap-4 items-end">
               <div className="flex-1 w-full">
                 <label className="text-[13px] font-bold text-[#495057] mb-2 block">Akses Mode</label>
                 <select disabled={loading} className="flex h-[38px] w-full rounded-[3px] border border-input bg-transparent px-3 py-1 text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
                    <option value="CASHIER">Kasir Cabang (CASHIER)</option>
                    <option value="ADMIN">Manajer Cabang (ADMIN)</option>
                    <option value="SUPERADMIN">Administrator HQ (SUPERADMIN)</option>
                 </select>
               </div>
               <div className={`flex-1 w-full ${form.role === 'SUPERADMIN' ? 'opacity-30' : ''}`}>
                 <label className="text-[13px] font-bold text-[#495057] mb-2 block">Tugas Cabang</label>
                 <select disabled={form.role === 'SUPERADMIN' || loading} className="flex h-[38px] w-full rounded-[3px] border border-input bg-transparent px-3 py-1 text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={form.branchId} onChange={e=>setForm({...form, branchId: e.target.value})}>
                    {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                 </select>
               </div>
               <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <button type="submit" disabled={loading} className="h-[38px] w-full sm:w-auto px-6 bg-[#17a2b8] text-white font-medium rounded-[3px] hover:bg-[#138496] transition-colors shadow-sm disabled:opacity-50">
                   {form.id ? 'Update Pegawai' : 'Simpan Master'}
                 </button>
               </div>
             </div>
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
              <th className="px-5 py-3.5 font-bold">Nama Pegawai</th>
              <th className="px-5 py-3.5 hidden sm:table-cell font-bold">Email Institusi</th>
              <th className="px-5 py-3.5 font-bold">Role Akses</th>
              <th className="px-5 py-3.5 hidden md:table-cell font-bold">Cabang Penempatan</th>
              <th className="px-5 py-3.5 text-right font-bold w-[120px]">Operasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dee2e6]">
            {paginatedUsers.map((u, index) => (
              <tr key={u.id} className="hover:bg-[#f2f4f5] transition-colors">
                <td className="px-5 py-3.5 text-[#212529] font-medium text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-5 py-3.5 text-[#212529] font-medium">{u.name}</td>
                <td className="px-5 py-3.5 text-[#007bff] hidden sm:table-cell hover:underline cursor-pointer">{u.email}</td>
                <td className="px-5 py-3.5 text-[#212529] font-medium">
                   <span className={`px-2 py-1 rounded-[3px] text-[11px] font-bold uppercase ${u.role === 'SUPERADMIN' ? 'bg-[#dc3545] text-white' : u.role === 'ADMIN' ? 'bg-[#ffc107] text-[#212529]' : 'bg-[#28a745] text-white'}`}>{u.role}</span>
                </td>
                <td className="px-5 py-3.5 text-[#6c757d] hidden md:table-cell">
                   {u.branch ? u.branch.name : <span className="text-[#dc3545] font-semibold italic">Semua Akses (HQ)</span>}
                </td>
                <td className="px-5 py-3.5 text-right">
                   <button onClick={() => handleEdit(u)} className="bg-[#17a2b8] text-white p-1.5 px-2.5 rounded-[3px] hover:bg-[#138496] transition-colors inline-block mr-1"><Edit2 size={14}/></button>
                   <button onClick={() => handleDelete(u.id, u.role)} className="bg-[#dc3545] text-white p-1.5 px-2.5 rounded-[3px] hover:bg-[#c82333] transition-colors inline-block"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {!loading && filteredData.length === 0 && (
               <tr><td colSpan={6} className="p-10 text-center text-gray-400">Pencarian tidak menemukan hasil (atau database kosong)</td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 0 && (
           <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#dee2e6] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[14px] text-[#212529]">
                 Menampilkan {!loading && filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} sampai {!loading ? Math.min(currentPage * itemsPerPage, filteredData.length) : 0} dari {!loading ? filteredData.length : 0} entri {searchTerm && `(difilter dari ${users.length} total entri)`}
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
