"use client";

import { useEffect, useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from 'lucide-react';
import { useDebounce } from '@/lib/useDebounce';
import { DTWrapper, DTTop, DTBottom, DTTable, dtThClass, dtTdClass, dtTrClass, DTSortArrow } from '@/components/DataTableVanilla';

export default function UsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: '', name: '', email: '', password: '', role: 'CASHIER', branchId: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useDebounce(searchTerm, 400);

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // API URL with pagination explicitly for Users
    const uUrl = new URL('/api/users', window.location.origin);
    uUrl.searchParams.set('page', currentPage.toString());
    uUrl.searchParams.set('limit', itemsPerPage.toString());
    if(debouncedSearch) uUrl.searchParams.set('search', debouncedSearch);

    const [uRes, bRes] = await Promise.all([fetch(uUrl.toString()), fetch('/api/branches')]);
    
    if(uRes.ok) {
       const uData = await uRes.json();
       setUsers(Array.isArray(uData.users) ? uData.users : []);
       if(uData.totalRecords !== undefined) {
          setTotalRecords(uData.totalRecords);
          setTotalPages(uData.totalPages);
       }
    }
    
    if(bRes.ok) {
        const bData = await bRes.json();
        setBranches(bData.branches || []);
        if (bData.branches?.length > 0 && !form.branchId) {
            setForm(prev => prev.branchId ? prev : ({...prev, branchId: bData.branches[0].id}));
        }
    }
    setLoading(false);
  }, [currentPage, itemsPerPage, debouncedSearch, form.branchId]);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage]);
  useEffect(() => { fetchData(); }, [fetchData]);

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

      <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#007bff] shadow-sm w-full overflow-hidden p-4">
        <DTWrapper>
          <DTTop itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm} disabled={loading} />
          <DTTable>
            <thead>
              <tr>
                <th className={`${dtThClass} w-[50px] text-center`}>No.<DTSortArrow/></th>
                <th className={dtThClass}>Nama Pegawai<DTSortArrow/></th>
                <th className={`${dtThClass} hidden sm:table-cell`}>Email Institusi<DTSortArrow/></th>
                <th className={dtThClass}>Role Akses<DTSortArrow/></th>
                <th className={`${dtThClass} hidden md:table-cell`}>Cabang Penempatan<DTSortArrow/></th>
                <th className={`${dtThClass} text-right w-[120px] pr-[18px]`}>Operasi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id} className={dtTrClass}>
                  <td className={`${dtTdClass} text-center`}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className={dtTdClass}>{u.name}</td>
                  <td className={`${dtTdClass} text-[#007bff] hidden sm:table-cell hover:underline cursor-pointer`}>{u.email}</td>
                  <td className={dtTdClass}>
                     <span className={`px-2 py-1 rounded-[3px] text-[11px] font-bold uppercase ${u.role === 'SUPERADMIN' ? 'bg-[#dc3545] text-white' : u.role === 'ADMIN' ? 'bg-[#ffc107] text-[#212529]' : 'bg-[#28a745] text-white'}`}>{u.role}</span>
                  </td>
                  <td className={`${dtTdClass} text-[#6c757d] hidden md:table-cell`}>
                     {u.branch ? u.branch.name : <span className="text-[#dc3545] font-semibold italic">Semua Akses (HQ)</span>}
                  </td>
                  <td className={`${dtTdClass} text-right`}>
                     <button onClick={() => handleEdit(u)} className="bg-[#17a2b8] text-white p-1.5 px-2.5 rounded-[3px] hover:bg-[#138496] transition-colors inline-block mr-1"><Edit2 size={14}/></button>
                     <button onClick={() => handleDelete(u.id, u.role)} className="bg-[#dc3545] text-white p-1.5 px-2.5 rounded-[3px] hover:bg-[#c82333] transition-colors inline-block"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                 <tr><td colSpan={6} className="p-10 text-center text-gray-500 font-medium">Pencarian tidak menemukan hasil (atau database kosong)</td></tr>
              )}
            </tbody>
          </DTTable>
          
          {totalPages > 0 && (
            <DTBottom currentPage={currentPage} totalPages={totalPages} totalRecords={totalRecords} currentRecordsCount={users.length} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} loading={loading} isFiltered={!!searchTerm} />
          )}
        </DTWrapper>
      </div>
    </div>
  );
}
