"use client";

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, AlertTriangle, Calculator, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ShiftPage() {
  const [activeShift, setActiveShift] = useState<any>(null);
  const [expectedCash, setExpectedCash] = useState(0);
  const [cashOrdersTotal, setCashOrdersTotal] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Forms
  const [startingCash, setStartingCash] = useState('');
  const [actualCash, setActualCash] = useState('');
  const [notes, setNotes] = useState('');

  // Pagination for History
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchShiftData = async () => {
    setIsLoading(true);
    try {
      const [actRes, histRes] = await Promise.all([
        fetch('/api/shift'),
        fetch('/api/shift?type=history')
      ]);
      if (actRes.ok) {
        const actData = await actRes.json();
        setActiveShift(actData.activeShift);
        setExpectedCash(actData.expectedCash);
        setCashOrdersTotal(actData.cashOrdersTotal);
      }
      if (histRes.ok) {
        const histData = await histRes.json();
        setHistory(histData.shifts || []);
      }
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  useEffect(() => { fetchShiftData(); }, []);

  const handleOpenShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Buka shift dengan nominal awal ini?')) return;
    try {
      const res = await fetch('/api/shift', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ startingCash })
      });
      if (res.ok) {
        alert("Shift Kasir Resmi Dibuka! Sistem Order Telah Aktif.");
        setStartingCash('');
        fetchShiftData();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal membuka shift");
      }
    } catch (e) { alert("Server error"); }
  };

  const handleCloseShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Anda yakin ingin menutup Shift Kasir sekarang? Ini akan merekam selisih uang dan mematikan sistem order!')) return;
    try {
      const res = await fetch('/api/shift', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ shiftId: activeShift.id, actualCash, notes })
      });
      if (res.ok) {
        alert("Shift Berhasil Ditutup!");
        setActualCash('');
        setNotes('');
        fetchShiftData();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menutup shift");
      }
    } catch (e) { alert("Server error"); }
  };

  // DataTable Logic
  const filteredHistory = history.filter(h => 
    (h.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (h.branch?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getDiscrepancyBadge = (discrepancy: number) => {
      if (discrepancy === 0) return <Badge className="bg-[#28a745] text-white rounded-[3px] px-2 py-0 border-none text-[10px]">BALANCE</Badge>;
      if (discrepancy > 0) return <Badge className="bg-[#17a2b8] text-white rounded-[3px] px-2 py-0 border-none text-[10px]">OVER (+)</Badge>;
      return <Badge className="bg-[#dc3545] text-white rounded-[3px] px-2 py-0 border-none text-[10px]">SHORT (-)</Badge>;
  }

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
         <h1 className="text-2xl text-[#212529] font-normal tracking-tight">Manajemen Shift & Laci Tunai</h1>
         <div className="flex items-center text-[13.5px] text-[#6c757d] gap-2 mt-2 sm:mt-0">
            <span>Beranda</span> <span className="text-gray-300">/</span> <span className="text-gray-600">Shift</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Action Form Shift */}
        <div className="lg:col-span-1 space-y-6">
           
           {!isLoading && !activeShift && (
             <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#dc3545] shadow-sm overflow-hidden">
                <div className="p-5 text-center bg-[#f8f9fa] border-b border-[#dee2e6]">
                  <div className="mx-auto w-16 h-16 bg-[#f8d7da] text-[#dc3545] rounded-full flex items-center justify-center mb-3">
                    <Lock size={32}/>
                  </div>
                  <h3 className="font-bold text-[#212529] text-xl mb-1">Shift Terkunci</h3>
                  <p className="text-[#dc3545] text-[13px] font-bold">Mesin Order Tidak Bisa Digunakan!</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#6c757d] mb-4 text-center">Buka pintu operasional dengan menginputkan Uang Modal Awal di Laci Kasir Anda pagi ini.</p>
                  <form onSubmit={handleOpenShift} className="space-y-4">
                     <div>
                       <label className="text-[13px] font-bold text-[#495057] mb-2 block">Modal Tunai Awal (Rp)</label>
                       <Input required type="number" value={startingCash} onChange={e=>setStartingCash(e.target.value)} placeholder="Contoh: 500000" className="h-[42px] font-bold text-lg text-[#007bff]" />
                     </div>
                     <button type="submit" className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-bold h-[42px] rounded-[3px] transition-colors shadow-sm uppercase tracking-wider text-sm">
                       BUKA SHIFT SEKARANG
                     </button>
                  </form>
                </div>
             </div>
           )}

           {!isLoading && activeShift && (
             <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#28a745] shadow-sm overflow-hidden">
                <div className="p-5 text-center bg-[#f8f9fa] border-b border-[#dee2e6]">
                  <div className="mx-auto w-16 h-16 bg-[#d4edda] text-[#28a745] rounded-full flex items-center justify-center mb-3">
                    <Unlock size={32}/>
                  </div>
                  <h3 className="font-bold text-[#212529] text-xl mb-1">Shift Sedang Berjalan</h3>
                  <p className="text-[#28a745] text-[13px] font-bold">Mesin Order Aktif Beroperasi.</p>
                </div>
                
                <div className="p-0">
                   <div className="flex justify-between items-center px-4 py-3 border-b border-[#dee2e6]">
                      <span className="text-[13px] font-bold text-[#6c757d]">Mulai Pada</span>
                      <span className="text-[13px] text-[#212529] font-medium">{new Date(activeShift.startTime).toLocaleTimeString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between items-center px-4 py-3 border-b border-[#dee2e6]">
                      <span className="text-[13px] font-bold text-[#6c757d]">Modal Awal</span>
                      <span className="text-[13px] text-[#212529] font-bold">Rp {activeShift.startingCash.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between items-center px-4 py-3 border-b border-[#dee2e6]">
                      <span className="text-[13px] font-bold text-[#6c757d]">+ Omzet Tunai</span>
                      <span className="text-[13px] text-[#28a745] font-bold">+ Rp {cashOrdersTotal.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between items-center px-4 py-4 bg-[#f4f6f9] border-b border-[#dee2e6]">
                      <span className="text-[14px] font-black text-[#212529]">Ekspektasi di Laci</span>
                      <span className="text-[18px] text-[#007bff] font-black">Rp {expectedCash.toLocaleString('id-ID')}</span>
                   </div>
                </div>

                <div className="p-5 bg-white">
                  <form onSubmit={handleCloseShift} className="space-y-4">
                     <div>
                       <label className="text-[13px] font-bold text-[#dc3545] mb-2 flex items-center gap-1"><AlertTriangle size={14}/> Hitung Uang Fisik Aktual (Rp)</label>
                       <Input required type="number" value={actualCash} onChange={e=>setActualCash(e.target.value)} placeholder="Jumlah riil di laci saat ini..." className="h-[42px] font-bold text-lg text-[#dc3545] border-[#dc3545] focus:ring-[#dc3545]" />
                     </div>
                     <div>
                       <label className="text-[13px] font-bold text-[#495057] mb-2 block">Catatan BAST (Opsional)</label>
                       <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border border-[#ced4da] rounded-[3px] p-2 text-sm focus:outline-none focus:border-[#80bdff] min-h-[60px]"></textarea>
                     </div>
                     <button type="submit" className="w-full bg-[#dc3545] hover:bg-[#c82333] text-white font-bold h-[42px] rounded-[3px] transition-colors shadow-sm uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                       <Calculator size={16}/> REKAP & TUTUP SHIFT
                     </button>
                  </form>
                </div>
             </div>
           )}

           {isLoading && (
              <div className="bg-white rounded-[4px] shadow-sm p-10 text-center border border-[#dee2e6]">
                 <span className="text-gray-400">Inspecting lock mechanism...</span>
              </div>
           )}

        </div>

        {/* Kolom Kanan: History Table */}
        <div className="lg:col-span-2 bg-white rounded-[4px] border-t-[3px] border-t-[#17a2b8] shadow-sm w-full overflow-hidden h-fit">
           <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#dee2e6]">
              <div className="flex items-center gap-2 text-[14px] text-[#495057]">
                 <span>Tampilkan</span>
                 <select value={itemsPerPage} onChange={e => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="border border-[#ced4da] rounded-[3px] px-2 py-1 outline-none focus:border-[#80bdff]">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                 </select>
                 <span>entri</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-[#495057]">
                 <span>Cari:</span>
                 <input type="search" value={searchTerm} onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="border border-[#ced4da] rounded-[3px] px-3 py-1 outline-none focus:border-[#80bdff]" placeholder="Kasir / Catatan..." />
              </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left text-[14px]">
               <thead className="bg-[#f8f9fa] border-b border-[#dee2e6] text-[#495057]">
                 <tr>
                   <th className="px-4 py-3 font-bold w-[40px] text-center">No.</th>
                   <th className="px-4 py-3 font-bold">Waktu Buka-Tutup</th>
                   <th className="px-4 py-3 font-bold">Kasir Penanggungjawab</th>
                   <th className="px-4 py-3 font-bold text-right">Ekspektasi Uang</th>
                   <th className="px-4 py-3 font-bold text-center">Selisih</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#dee2e6]">
                 {isLoading ? (
                   <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading Rekapitulasi Shift...</td></tr>
                 ) : paginatedHistory.length === 0 ? (
                   <tr><td colSpan={5} className="p-10 text-center text-gray-500 font-medium">Belum ada riwayat shift atau tidak cocok dengan filter pencarian.</td></tr>
                 ) : (
                   paginatedHistory.map((h, i) => (
                     <tr key={h.id} className="hover:bg-[#f2f4f5] transition-colors">
                       <td className="px-4 py-3 text-center text-gray-500 font-medium">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                       <td className="px-4 py-3">
                         <div className="flex flex-col gap-0.5">
                           <span className="text-[#212529] font-bold text-[12px] flex items-center gap-1"><Clock size={10}/> {new Date(h.startTime).toLocaleString('id-ID')}</span>
                           {h.endTime ? (
                              <span className="text-[#6c757d] font-bold text-[12px] pl-3 border-l-2 border-[#dc3545] ml-1">{new Date(h.endTime).toLocaleString('id-ID')}</span>
                           ) : (
                              <span className="text-[#17a2b8] font-bold text-[10px] uppercase ml-1 block my-0.5">SEDANG OPEN</span>
                           )}
                         </div>
                       </td>
                       <td className="px-4 py-3">
                         <span className="font-bold text-[#007bff] block text-[13px]">{h.user?.name || 'Unknown'}</span>
                         <span className="text-gray-500 text-[11px] block">{h.branch?.name}</span>
                       </td>
                       <td className="px-4 py-3 text-right">
                         <span className="block font-bold text-[13px]">Rp {(h.expectedCash || 0).toLocaleString('id-ID')}</span>
                         {h.endTime && (
                           <span className="block text-[#6c757d] text-[11px]">Aktual: Rp {(h.actualCash || 0).toLocaleString('id-ID')}</span>
                         )}
                       </td>
                       <td className="px-4 py-3 text-center">
                         {h.status === 'CLOSED' ? getDiscrepancyBadge(h.discrepancy || 0) : <span className="text-xs text-gray-400">-</span>}
                         {h.discrepancy !== 0 && h.status === 'CLOSED' && (
                            <span className={`block font-bold mt-1 text-[11px] ${h.discrepancy! > 0 ? 'text-[#17a2b8]' : 'text-[#dc3545]'}`}>
                               {h.discrepancy! > 0 ? '+' : ''}{h.discrepancy?.toLocaleString('id-ID')}
                            </span>
                         )}
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>

           {totalPages > 0 && (
              <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#dee2e6] flex flex-col sm:flex-row items-center justify-between gap-3">
                 <span className="text-[14px] text-[#212529]">
                    Menampilkan {!isLoading && filteredHistory.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} sampai {!isLoading ? Math.min(currentPage * itemsPerPage, filteredHistory.length) : 0} dari {!isLoading ? filteredHistory.length : 0} entri {searchTerm && `(difilter)`}
                 </span>
                 <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-xs font-bold rounded-[3px] border border-[#ced4da] bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">Sebelumnya</button>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-xs font-bold rounded-[3px] border border-[#ced4da] bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">Selanjutnya</button>
                 </div>
              </div>
           )}

        </div>

      </div>
    </div>
  );
}
