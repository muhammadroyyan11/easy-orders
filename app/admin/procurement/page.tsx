"use client";

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Truck, History } from 'lucide-react';

export default function ProcurementPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [tab, setTab] = useState<'NEW' | 'HISTORY'>('NEW');

  const [supplierName, setSupplierName] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [items, setItems] = useState<any[]>([{ rawMaterialId: '', qty: '', cost: '' }]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const resMats = await fetch('/api/inventory');
    const matData = await resMats.json();
    setMaterials(Array.isArray(matData) ? matData : []);

    const resPO = await fetch('/api/procurement');
    const poData = await resPO.json();
    setPurchases(Array.isArray(poData) ? poData : []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddItem = () => {
    setItems([...items, { rawMaterialId: '', qty: '', cost: '' }]);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(i => !i.rawMaterialId || !i.qty || !i.cost)) {
      alert("Pastikan semua baris item terisi dengan benar!");
      return;
    }

    setIsLoading(true);
    const res = await fetch('/api/procurement', {
      method: 'POST',
      body: JSON.stringify({ supplierName, invoiceId, items })
    });

    if (res.ok) {
       setSupplierName('');
       setInvoiceId('');
       setItems([{ rawMaterialId: '', qty: '', cost: '' }]);
       setTab('HISTORY');
       fetchData();
    } else {
       const err = await res.json();
       alert("Gagal memproses Restock: " + err.error);
    }
    setIsLoading(false);
  };

  const grandTotalNew = items.reduce((acc, curr) => acc + ((parseFloat(curr.qty)||0) * (parseFloat(curr.cost)||0)), 0);

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
         <h1 className="text-2xl text-[#212529] font-normal tracking-tight">Sistem Pembelian Gudang</h1>
         <div className="flex items-center text-[13.5px] text-[#6c757d] gap-2 mt-2 sm:mt-0">
            <span>Beranda</span> <span className="text-gray-300">/</span> <span className="text-gray-600">Procurement</span>
         </div>
      </div>

      <div className="flex overflow-hidden bg-white border border-[#dee2e6] rounded-[4px] shadow-sm w-fit mb-4">
         <button onClick={() => setTab('NEW')} className={`px-5 py-2.5 text-[14px] font-bold flex items-center gap-2 ${tab === 'NEW' ? 'bg-[#007bff] text-white' : 'text-[#495057] hover:bg-gray-50'}`}>
           <Truck size={16}/> Masukkan Nota Belanja (Restock Baru)
         </button>
         <button onClick={() => setTab('HISTORY')} className={`px-5 py-2.5 text-[14px] font-bold flex items-center gap-2 border-l border-[#dee2e6] ${tab === 'HISTORY' ? 'bg-[#17a2b8] text-white' : 'text-[#495057] hover:bg-gray-50'}`}>
           <History size={16}/> Riwayat Transaksi Grosir
         </button>
      </div>

      {tab === 'NEW' && (
        <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#007bff] shadow-sm max-w-4xl animate-in fade-in duration-300">
           <div className="px-5 py-4 border-b border-[#dee2e6] bg-[#f8f9fa]">
             <h3 className="font-bold text-[#212529] m-0">Injeksi Modal Bahan Baku</h3>
             <p className="text-[12px] text-[#6c757d] mt-1">Stok akan langsung ditambahkan ke gudang, dan HPP (Harga Modal / Unit) akan otomatis dikalkulasi menggunakan sistem titik tengah.</p>
           </div>
           <div className="p-5">
             <form onSubmit={handleSubmit} className="space-y-5">
               
               {/* Informasi Supplier */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5 border-b border-dashed border-[#dee2e6]">
                  <div>
                    <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Nama Supplier / Toko Kelontong</label>
                    <Input value={supplierName} onChange={e=>setSupplierName(e.target.value)} placeholder="Contoh: Agen Sembako Makmur" className="h-[38px] rounded-[3px] focus:border-[#80bdff] text-[13px] shadow-none"/>
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Nomer Nota Cetak (Opsional)</label>
                    <Input value={invoiceId} onChange={e=>setInvoiceId(e.target.value)} placeholder="INV-XXXXX" className="h-[38px] rounded-[3px] focus:border-[#80bdff] text-[13px] shadow-none"/>
                  </div>
               </div>

               {/* Rincian Item */}
               <div className="space-y-3">
                  <div className="flex justify-between items-center mb-2">
                     <label className="text-[13px] font-bold text-[#495057] uppercase tracking-wide">Rincian Komoditas (Items):</label>
                     <button type="button" onClick={handleAddItem} className="px-3 py-1.5 bg-[#f8f9fa] border border-[#dee2e6] text-[#212529] text-[12px] font-bold flex items-center gap-1.5 rounded hover:bg-[#e9ecef] transition-colors"><Plus size={14}/> Tambah Baris Belanja</button>
                  </div>
                  
                  {items.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-start bg-gray-50 border border-[#dee2e6] p-4 rounded-[4px]">
                       <div className="flex-1 min-w-[200px]">
                          <label className="text-[11px] font-bold text-[#6c757d] mb-1 block uppercase">Barang Dipilih</label>
                          <select required value={item.rawMaterialId} onChange={e=>handleItemChange(idx, 'rawMaterialId', e.target.value)} className="w-full h-[38px] rounded-[3px] border border-[#ced4da] px-3 text-[13px] bg-white text-[#212529] font-bold">
                             <option value="" disabled>-- Cari Barang Gudang --</option>
                             {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                       </div>
                       <div className="w-full md:w-32">
                          <label className="text-[11px] font-bold text-[#6c757d] mb-1 block uppercase">Total Masuk</label>
                          <div className="relative">
                            <Input required type="number" step="0.01" value={item.qty} onChange={e=>handleItemChange(idx, 'qty', e.target.value)} className="h-[38px] rounded-[3px] pr-10 text-[13px] font-bold text-[#007bff]" placeholder="1000"/>
                            <div className="absolute top-0 right-0 h-full px-2 flex items-center bg-gray-200 border-l border-[#ced4da] text-[10px] font-bold text-[#495057] rounded-r-[3px]">
                               {item.rawMaterialId ? materials.find(m => m.id === item.rawMaterialId)?.unit : 'Qty'}
                            </div>
                          </div>
                          {item.rawMaterialId && <p className="text-[9px] text-[#6c757d] mt-1 text-right">Saldo Saat Ini: <b>{materials.find(m => m.id === item.rawMaterialId)?.stock}</b></p>}
                       </div>
                       <div className="w-full md:w-40">
                          <label className="text-[11px] font-bold text-[#6c757d] mb-1 block uppercase">Harga per 1 Satuan</label>
                          <div className="relative">
                            <div className="absolute top-0 left-0 h-full px-2 flex items-center bg-gray-200 border-r border-[#ced4da] text-[11px] font-bold text-[#495057] rounded-l-[3px]">Rp</div>
                            <Input required type="number" step="0.01" value={item.cost} onChange={e=>handleItemChange(idx, 'cost', e.target.value)} className="h-[38px] rounded-[3px] pl-10 text-[13px]" placeholder="50"/>
                          </div>
                          {item.qty && item.cost && <p className="text-[10px] text-[#28a745] font-bold mt-1 text-right">Sub: Rp {((parseFloat(item.qty)||0) * (parseFloat(item.cost)||0)).toLocaleString('id-ID')}</p>}
                       </div>
                       <div className="pt-5">
                          {items.length > 1 && (
                            <button type="button" onClick={() => handleRemoveItem(idx)} className="h-[38px] px-3 bg-[#dc3545] text-white rounded hover:bg-[#c82333] transition-colors"><Trash2 size={16}/></button>
                          )}
                       </div>
                    </div>
                  ))}
               </div>

               {/* Aksi & Grand Total */}
               <div className="p-4 bg-[#fff3cd] border border-[#ffeeba] rounded-[4px] flex items-center justify-between text-[#856404] mt-6">
                 <div>
                   <h4 className="font-bold text-[14px] uppercase mb-0.5">Ringkasan Tagihan Masuk</h4>
                   <p className="text-[11px] opacity-80">Pastikan total sesuai dengan nota tertulis dari supplier.</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[24px] font-black tracking-tight">Rp {grandTotalNew.toLocaleString('id-ID')}</p>
                 </div>
               </div>

               <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isLoading} className="h-[44px] px-8 bg-[#007bff] text-white font-bold rounded-[3px] hover:bg-[#0069d9] transition-colors shadow-sm disabled:opacity-50 uppercase text-[14px]">
                     Sahkan Bukti Belanja
                  </button>
               </div>
             </form>
           </div>
        </div>
      )}

      {tab === 'HISTORY' && (
        <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#17a2b8] shadow-sm max-w-5xl animate-in slide-in-from-right-4 duration-300">
          <div className="p-5">
             <div className="space-y-4">
                {purchases.map(po => (
                   <div key={po.id} className="border border-[#dee2e6] rounded-[4px] overflow-hidden">
                     <div className="p-3 bg-[#f8f9fa] border-b border-[#dee2e6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-[#212529] text-[15px]">{po.supplierName || 'Distributor Misterius'} <Badge variant="outline" className="ml-2 font-mono text-[9px] bg-white">{po.invoiceId || 'TANPA-NOTA'}</Badge></h4>
                          <span className="text-[12px] text-[#6c757d] font-medium">{new Date(po.createdAt).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="text-left sm:text-right">
                           <p className="text-[11px] font-bold text-[#6c757d] uppercase">Total Disahkan</p>
                           <p className="text-[16px] font-black text-[#dc3545]">Rp {po.totalCost.toLocaleString('id-ID')}</p>
                        </div>
                     </div>
                     <div className="p-0">
                       <table className="w-full text-left text-[12px] m-0">
                         <thead className="bg-white text-[#6c757d]">
                           <tr>
                              <th className="px-4 py-2 font-bold w-1/2">Nama Material</th>
                              <th className="px-4 py-2 font-bold text-right">Injeksi (Qty)</th>
                              <th className="px-4 py-2 font-bold text-right">HPP Eksekusi</th>
                              <th className="px-4 py-2 font-bold text-right">Nominal Seri</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-dashed divide-gray-100">
                           {po.items.map((it: any) => (
                             <tr key={it.id}>
                               <td className="px-4 py-2 text-[#212529] font-semibold">{it.rawMaterial.name}</td>
                               <td className="px-4 py-2 text-right font-black text-[#007bff]">+{it.quantityPurchased} <span className="text-[10px] font-medium text-gray-500">{it.rawMaterial.unit}</span></td>
                               <td className="px-4 py-2 text-right font-bold text-[#28a745]">Rp {it.costPerUnit.toLocaleString('id-ID')} / {it.rawMaterial.unit}</td>
                               <td className="px-4 py-2 text-right text-[#495057]">Rp {it.subtotal.toLocaleString('id-ID')}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   </div>
                ))}
                {purchases.length === 0 && <div className="text-center p-10 text-gray-400">Belum ada jejak audit operasional pembelian belanja ke suplier.</div>}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
