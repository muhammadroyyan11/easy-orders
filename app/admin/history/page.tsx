"use client";

import { useEffect, useState, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { FileText, FileSpreadsheet, Filter, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useDebounce } from '@/lib/useDebounce';
import { DTWrapper, DTTop, DTBottom, DTTable, dtThClass, dtTdClass, dtTrClass, DTSortArrow } from '@/components/DataTableVanilla';

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [paymentFilter, statusFilter, debouncedSearch, itemsPerPage]);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = new URL('/api/orders', window.location.origin);
      url.searchParams.set('page', currentPage.toString());
      url.searchParams.set('limit', itemsPerPage.toString());
      url.searchParams.set('payment', paymentFilter);
      url.searchParams.set('status', statusFilter);
      if (debouncedSearch) url.searchParams.set('search', debouncedSearch);

      const res = await fetch(url.toString());
      if (res.ok) {
         const data = await res.json();
         setOrders(data.orders);
         setTotalRecords(data.totalRecords);
         setGrandTotal(data.grandTotal);
         setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, paymentFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchHistory();
    const id = setInterval(fetchHistory, 15000);
    return () => clearInterval(id);
  }, [fetchHistory]);

  const exportToExcel = async () => {
    // Generate full dataset for export by fetching without pagination limits
    setIsLoading(true);
    try {
      const url = new URL('/api/orders', window.location.origin);
      url.searchParams.set('page', '1');
      url.searchParams.set('limit', '5000'); // large limit for export
      url.searchParams.set('payment', paymentFilter);
      url.searchParams.set('status', statusFilter);
      if (debouncedSearch) url.searchParams.set('search', debouncedSearch);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Export Fetch Error');
      const data = await res.json();
      const exportOrders: any[] = data.orders;
      const exportTotal: number = data.grandTotal;

      const worksheetData = exportOrders.map(o => ({
        'ID Pesanan': o.orderNumber || o.id.slice(0, 8),
        'Tanggal Waktu': new Date(o.createdAt).toLocaleString('id-ID'),
        'Pelanggan': o.customerName,
        'Meja': o.tableNumber,
        'Metode Pembayaran': o.paymentMethod.replace('midtrans_', '').toUpperCase(),
        'Status Bayar': o.paymentStatus,
        'Status Order': o.orderStatus,
        'Nominal (Rp)': o.totalAmount
      }));

      worksheetData.push({
        'ID Pesanan': 'TOTAL KEUNTUNGAN',
        'Tanggal Waktu': '',
        'Pelanggan': '',
        'Meja': '',
        'Metode Pembayaran': '',
        'Status Bayar': '',
        'Status Order': '',
        'Nominal (Rp)': exportTotal
      });

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Laporan");
      XLSX.writeFile(workbook, `Laporan_Transaksi_Real_${new Date().getTime()}.xlsx`);
    } catch (e) {
      alert("Gagal mengekspor data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 print:p-0 print:m-0 print:w-full print:bg-white">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 print:mb-2">
         <div>
           <h1 className="text-2xl text-[#212529] font-normal tracking-tight print:text-black">Riwayat Transaksi</h1>
           <p className="text-[#6c757d] text-sm mt-1 print:hidden">Kelola, saring, dan ekspor seluruh mutasi pesanan restoran.</p>
         </div>
         <div className="flex items-center gap-2 mt-4 sm:mt-0 print:hidden">
            <button onClick={() => window.print()} className="bg-[#dc3545] hover:bg-[#c82333] text-white px-4 py-2 rounded-[3px] shadow-sm text-sm font-bold flex items-center gap-2 transition-colors">
               <FileText size={16}/> Cetak PDF / A4
            </button>
            <button onClick={exportToExcel} className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded-[3px] shadow-sm text-sm font-bold flex items-center gap-2 transition-colors">
               <FileSpreadsheet size={16}/> Export Excel Asli (.xlsx)
            </button>
         </div>
      </div>

      {/* Control Panel (Hidden on Print) */}
      <div className="bg-white p-4 rounded-[4px] shadow-sm border-t-[3px] border-t-[#17a2b8] mb-6 print:hidden">
         <div className="flex items-center gap-2 mb-4">
           <Filter size={18} className="text-[#17a2b8]" />
           <h3 className="font-bold text-[#212529]">Filter Data Laporan</h3>
         </div>
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
               <label className="block text-xs font-bold text-[#6c757d] mb-1.5 uppercase">Status Pembayaran</label>
               <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="w-full p-2 text-sm border border-[#ced4da] rounded-[3px] focus:ring-1 focus:ring-[#17a2b8] outline-none bg-white">
                 <option value="ALL">Semua Pembayaran</option>
                 <option value="PAID">Lunas (PAID)</option>
                 <option value="PENDING">Menunggu (PENDING)</option>
               </select>
            </div>
            <div className="flex-1">
               <label className="block text-xs font-bold text-[#6c757d] mb-1.5 uppercase">Status Dapur/Order</label>
               <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 text-sm border border-[#ced4da] rounded-[3px] focus:ring-1 focus:ring-[#17a2b8] outline-none bg-white">
                 <option value="ALL">Semua Status Dapur</option>
                 <option value="NEW">Antrean Baru (NEW)</option>
                 <option value="PREPARING">Sedang Dimasak (PREPARING)</option>
                 <option value="DELIVERED">Selesai/Disajikan (DELIVERED)</option>
               </select>
            </div>
            <div className="hidden sm:flex flex-col items-end justify-center px-6 border-l border-[#dee2e6]">
               <span className="text-[12px] font-bold text-[#6c757d] uppercase">Total Terfilter</span>
               <span className="text-[20px] font-black text-[#28a745]">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
         </div>
      </div>

      {/* Print Only Summary */}
      <div className="hidden print:block mb-4 pb-2 border-b-2 border-black">
         <h2 className="text-xl font-bold">Laporan Transaksi Restoran</h2>
         <p className="text-sm">Total Omzet (Sesuai Filter): <b>Rp {grandTotal.toLocaleString('id-ID')}</b></p>
         <p className="text-sm text-gray-500">Tanggal Cetak: {new Date().toLocaleString('id-ID')}</p>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[4px] shadow-sm border border-[#dee2e6] overflow-hidden print:border-none print:shadow-none p-4">
        
        <DTWrapper>
          <div className="print:hidden">
             <DTTop itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm} disabled={isLoading} />
          </div>

          <DTTable>
             <thead>
               <tr className="print:bg-gray-100">
                 <th className={`${dtThClass} w-[50px] text-center`}>#<DTSortArrow/></th>
                 <th className={dtThClass}>ID / Waktu<DTSortArrow/></th>
                 <th className={dtThClass}>Pelanggan<DTSortArrow/></th>
                 <th className={dtThClass}>Metode<DTSortArrow/></th>
                 <th className={`${dtThClass} text-center`}>Status Bayar<DTSortArrow/></th>
                 <th className={`${dtThClass} text-center`}>Status Order<DTSortArrow/></th>
                 <th className={`${dtThClass} text-right pr-[18px]`}>Nominal</th>
               </tr>
             </thead>
             <tbody>
               {isLoading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-[#007bff] font-bold border-t border-[#ddd]">Sinkronisasi Database Aktif...</td></tr>
               ) : orders.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 font-medium border-t border-[#ddd]">Tidak ada riwayat transaksi yang cocok dengan filter.</td></tr>
               ) : (
                 orders.map((order: any, index: number) => (
                    <tr key={order.id} className={`${dtTrClass} print:break-inside-avoid`}>
                     <td className={`${dtTdClass} text-center font-medium text-gray-500`}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                     </td>
                     <td className={dtTdClass}>
                       <span className="block font-bold text-[#007bff] print:text-black">
                         #{order.orderNumber?.slice(-8) || order.id.slice(0,8)}
                       </span>
                       <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                         <Clock size={12}/> {new Date(order.createdAt).toLocaleDateString('id-ID')} {new Date(order.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                       </span>
                     </td>
                     <td className={dtTdClass}>
                       <span className="block font-bold">{order.customerName}</span>
                       <span className="text-xs text-gray-500">Meja {order.tableNumber}</span>
                     </td>
                     <td className={dtTdClass}>
                       <span className="uppercase text-xs font-bold text-[#495057] bg-[#e9ecef] px-2 py-1 rounded-[3px] border border-[#ced4da] print:border-black">
                         {order.paymentMethod.replace('midtrans_', '')}
                       </span>
                     </td>
                     <td className={`${dtTdClass} text-center`}>
                       <Badge className={`uppercase text-[10px] rounded-[3px] border-0 print:border print:border-black print:text-black ${order.paymentStatus === 'PAID' ? 'bg-[#28a745] hover:bg-[#218838] text-white print:bg-transparent' : 'bg-[#dc3545] hover:bg-[#c82333] text-white print:bg-transparent'}`}>
                         {order.paymentStatus}
                       </Badge>
                     </td>
                     <td className={`${dtTdClass} text-center`}>
                       <Badge variant="outline" className={`uppercase text-[10px] rounded-[3px] print:border-black print:text-black ${order.orderStatus === 'NEW' ? 'text-[#007bff] border-[#007bff]' : order.orderStatus === 'PREPARING' ? 'text-[#17a2b8] border-[#17a2b8]' : 'text-[#6c757d] border-[#6c757d]'}`}>
                         {order.orderStatus}
                       </Badge>
                     </td>
                     <td className={`${dtTdClass} text-right font-black text-[#28a745] print:text-black`}>
                       Rp {order.totalAmount.toLocaleString('id-ID')}
                     </td>
                    </tr>
                 ))
               )}
             </tbody>
          </DTTable>
          
          {!isLoading && totalPages > 0 && (
            <div className="print:hidden">
              <DTBottom currentPage={currentPage} totalPages={totalPages} totalRecords={totalRecords} currentRecordsCount={orders.length} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} loading={isLoading} isFiltered={!!searchTerm} />
            </div>
          )}
        </DTWrapper>
      </div>
      
    </div>
  );
}
