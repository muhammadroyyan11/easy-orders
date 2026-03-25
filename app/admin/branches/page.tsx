"use client";

import { useEffect, useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from 'lucide-react';
import { useDebounce } from '@/lib/useDebounce';
import { DTWrapper, DTTop, DTBottom, DTTable, dtThClass, dtTdClass, dtTrClass, DTSortArrow } from '@/components/DataTableVanilla';

export default function BranchesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [branches, setBranches] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: '', name: '', address: '', phone: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useDebounce(searchTerm, 400);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    const url = new URL('/api/branches', window.location.origin);
    url.searchParams.set('page', currentPage.toString());
    url.searchParams.set('limit', itemsPerPage.toString());
    if(debouncedSearch) url.searchParams.set('search', debouncedSearch);

    const res = await fetch(url.toString());
    const data = await res.json();
    setBranches(Array.isArray(data.branches) ? data.branches : []);
    if(data.totalRecords !== undefined) {
       setTotalRecords(data.totalRecords);
       setTotalPages(data.totalPages);
    }
    setLoading(false);
  }, [currentPage, itemsPerPage, debouncedSearch]);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage]);
  useEffect(() => { fetchBranches(); }, [fetchBranches]);

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

      <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#007bff] shadow-sm w-full overflow-hidden p-4">
        <DTWrapper>
          <DTTop itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm} disabled={loading} />
          
          <DTTable>
            <thead>
              <tr>
                <th className={`${dtThClass} w-[50px] text-center`}>No.<DTSortArrow/></th>
                <th className={dtThClass}>Nama Cabang<DTSortArrow/></th>
                <th className={`${dtThClass} hidden sm:table-cell`}>Alamat Fisik<DTSortArrow/></th>
                <th className={`${dtThClass} hidden sm:table-cell`}>Telepon<DTSortArrow/></th>
                <th className={`${dtThClass} text-right w-[120px] pr-[18px]`}>Operasi</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((c, index) => (
                <tr key={c.id} className={dtTrClass}>
                  <td className={`${dtTdClass} text-center`}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className={dtTdClass}>{c.name}</td>
                  <td className={`${dtTdClass} hidden sm:table-cell`}>{c.address || "-"}</td>
                  <td className={`${dtTdClass} hidden sm:table-cell`}>{c.phone || "-"}</td>
                  <td className={`${dtTdClass} text-right`}>
                     <button onClick={() => handleEdit(c)} className="bg-[#17a2b8] text-white p-1.5 px-2.5 rounded-[3px] hover:bg-[#138496] transition-colors inline-block mr-1"><Edit2 size={14}/></button>
                     <button onClick={() => handleDelete(c.id)} className="bg-[#dc3545] text-white p-1.5 px-2.5 rounded-[3px] hover:bg-[#c82333] transition-colors inline-block"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
              {!loading && branches.length === 0 && (
                 <tr><td colSpan={5} className="p-10 text-center text-gray-500 font-medium">Pencarian tidak menemukan hasil (atau database kosong)</td></tr>
              )}
            </tbody>
          </DTTable>
          
          {totalPages > 0 && (
            <DTBottom currentPage={currentPage} totalPages={totalPages} totalRecords={totalRecords} currentRecordsCount={branches.length} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} loading={loading} isFiltered={!!searchTerm} />
          )}
        </DTWrapper>
      </div>
    </div>
  );
}
