"use client";

import { useEffect, useState, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, CheckCircle2, Clock, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const previousOrderCountRef = useRef(0);
  const isInitialMount = useRef(true);

  const playBellSound = () => {
    try {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextCtor();
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      // Sensor Bunyi "Ting-Tong" Resepsionis Klasik
      const now = ctx.currentTime;
      playTone(987.77, now, 0.4); // Nada Tinggi B5
      playTone(783.99, now + 0.3, 0.6); // Nada G5
    } catch (e) {
      console.log('Audio playback terblokir oleh Browser Auto-Play policy.');
    }
  };

  const fetchActiveOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        
        // Cek jika pesanan 'NEW' terdeteksi bertambah
        const activeNewOrders = data.filter((o: any) => o.orderStatus === 'NEW').length;
        if (!isInitialMount.current && activeNewOrders > previousOrderCountRef.current) {
           playBellSound();
        }
        previousOrderCountRef.current = activeNewOrders;
        isInitialMount.current = false;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
    const intervalId = setInterval(fetchActiveOrders, 5000); 
    return () => clearInterval(intervalId);
  }, []);

  const updateOrder = async (id: string, payload: any) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...payload } : o));
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...payload })
    });
    fetchActiveOrders();
  };

  const totalIncome = orders.filter(o => o.paymentStatus === 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalIncoming = orders.filter(o => o.orderStatus === 'NEW').length;

  const pendingOrders = orders.filter(o => o.paymentStatus === 'PENDING');
  const kitchenOrders = orders.filter(o => o.paymentStatus === 'PAID' && o.orderStatus !== 'DELIVERED');
  const completedOrders = orders.filter(o => o.orderStatus === 'DELIVERED').slice(0, 20);

  return (
    <div className="w-full p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
         <h1 className="text-2xl text-[#212529] font-normal tracking-tight">Dashboard Utama</h1>
         <div className="flex items-center text-[13.5px] text-[#6c757d] gap-2 mt-2 sm:mt-0">
            <span>Beranda</span> <span className="text-gray-300">/</span> <span className="text-gray-600">Dashboard Interaktif</span>
         </div>
      </div>

      {/* AdminLTE Small Boxes / Metrik Harian */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#17a2b8] text-white rounded-[4px] p-5 relative overflow-hidden shadow-sm hover:scale-[1.01] transition-transform">
           <div className="relative z-10">
             <h3 className="text-4xl font-bold mb-1">{totalIncoming}</h3>
             <p className="text-[15px]">Pesanan Masuk</p>
           </div>
           <Clock className="absolute text-black/10 -right-2 top-2 w-24 h-24 z-0" />
           <div className="absolute bottom-0 left-0 right-0 bg-black/10 py-1.5 text-center text-sm mt-4 hover:bg-black/20 cursor-pointer transition-colors backdrop-blur-sm">
             Lihat Antrean Dapur &rarr;
           </div>
        </div>
        
        <div className="bg-[#28a745] text-white rounded-[4px] p-5 relative overflow-hidden shadow-sm hover:scale-[1.01] transition-transform">
           <div className="relative z-10">
             <h3 className="text-4xl font-bold mb-1">{orders.filter(o => o.paymentStatus === 'PAID').length}</h3>
             <p className="text-[15px]">Transaksi Terselesaikan</p>
           </div>
           <CheckCircle2 className="absolute text-black/10 -right-2 top-2 w-24 h-24 z-0" />
           <div className="absolute bottom-0 left-0 right-0 bg-black/10 py-1.5 text-center text-sm mt-4 hover:bg-black/20 cursor-pointer transition-colors backdrop-blur-sm">
             Arsip Lunas &rarr;
           </div>
        </div>

        <div className="bg-[#ffc107] text-[#1f2d3d] rounded-[4px] p-5 relative overflow-hidden shadow-sm hover:scale-[1.01] transition-transform">
           <div className="relative z-10 pr-6">
             <h3 className="text-[28px] sm:text-[32px] font-bold mb-1 leading-tight sm:leading-none mt-1 truncate">Rp {totalIncome.toLocaleString('id-ID')}</h3>
             <p className="text-[15px] mt-1 font-medium">Laba Kotor Hari Ini</p>
           </div>
           <UtensilsCrossed className="absolute text-black/10 -right-2 top-2 w-24 h-24 z-0" />
           <div className="absolute bottom-0 left-0 right-0 bg-black/10 py-1.5 text-center text-sm mt-4 hover:bg-black/20 cursor-pointer transition-colors backdrop-blur-sm font-bold">
             Mutasi Keuangan &rarr;
           </div>
        </div>
      </div>

      {isLoading ? (
         <div className="w-full h-40 bg-gray-100 rounded animate-pulse mb-6"></div>
      ) : (
        <>
            {/* SECTION 1: MENUNGGU PEMBAYARAN (REDS) */}
            {pendingOrders.length > 0 && (
               <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#dc3545] shadow-sm mb-6 w-full animate-in fade-in duration-300">
                 <div className="px-5 py-3 border-b border-[#dee2e6] flex items-center justify-between bg-[#fff5f8]">
                   <h2 className="text-[16px] font-bold text-[#dc3545] flex items-center gap-2 m-0">
                     🚨 Menunggu Pembayaran (Tunai / Midtrans)
                   </h2>
                   <span className="bg-[#dc3545] text-white text-xs font-bold px-2.5 py-1 rounded-[3px] shadow-sm">{pendingOrders.length} Tertunda</span>
                 </div>
                 
                 <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                   {pendingOrders.map((order) => (
                      <div key={order.id} className="border border-[#f1aeb5] rounded-[4px] flex flex-col bg-white overflow-hidden shadow-sm">
                         <div className="p-3 bg-[#f8d7da] flex justify-between items-center">
                           <span className="font-bold text-[#842029] text-[13px] uppercase">#{order.orderNumber?.slice(-8) || order.id.slice(0,8)}</span>
                           <span className="text-[11px] font-bold text-[#842029] border border-[#f1aeb5] px-2 py-0.5 rounded-[3px] bg-white"><MapPin size={12} className="inline mr-1 -mt-0.5"/>MEJA {order.tableNumber}</span>
                         </div>
                         <div className="px-4 py-3 border-b border-[#f1aeb5] flex justify-between items-center bg-white shadow-sm">
                            <h3 className="font-bold text-[18px] text-[#212529] truncate">{order.customerName}</h3>
                            <span className="text-[18px] font-black text-[#dc3545]">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                         </div>
                         <div className="p-3 bg-white flex-1 max-h-[140px] overflow-y-auto">
                           <ul className="space-y-1.5">
                             {order.items.map((item: any) => (
                               <li key={item.id} className="text-[13px] flex justify-between font-medium border-b border-dashed border-[#dee2e6] pb-1.5 last:border-0 last:pb-0">
                                 <span className="text-[#212529]">{item.quantity}x {item.menuItem?.name || 'Item Terhapus'}</span>
                                 <span className="text-[#6c757d] ml-2">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                         <div className="p-4 bg-[#f8f9fa] border-t border-[#f1aeb5] flex flex-col gap-2">
                            {order.paymentMethod === 'kasir' ? (
                               <div className="flex gap-2 w-full">
                                 <button onClick={() => updateOrder(order.id, { paymentStatus: 'PAID' })} className="flex-1 bg-[#28a745] text-white py-2 rounded-[3px] hover:bg-[#218838] transition-colors shadow-sm active:scale-95 flex flex-col justify-center items-center leading-tight">
                                   <span className="font-bold text-[12px]">💰 Bayar</span>
                                   <span className="font-medium text-[9.5px] opacity-90">&rarr; Ke Dapur</span>
                                 </button>
                                 <button onClick={() => updateOrder(order.id, { paymentStatus: 'PAID', orderStatus: 'DELIVERED' })} className="flex-1 bg-[#343a40] text-white py-2 rounded-[3px] hover:bg-[#23272b] transition-colors shadow-sm active:scale-95 flex flex-col justify-center items-center leading-tight">
                                   <span className="font-bold text-[12px]">✅ Selesai Instan</span>
                                   <span className="font-medium text-[9.5px] opacity-90">(Lansung Bawa)</span>
                                 </button>
                               </div>
                            ) : (
                               <div className="w-full text-[12.5px] bg-[#f8f9fa] text-[#495057] font-bold py-2.5 rounded-[3px] flex justify-center items-center gap-2.5 border border-[#dee2e6]">
                                 <span className="relative flex h-2.5 w-2.5">
                                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007bff] opacity-75"></span>
                                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#007bff]"></span>
                                 </span>
                                 Menunggu Sinyal Otomatis...
                               </div>
                            )}
                         </div>
                      </div>
                   ))}
                 </div>
               </div>
            )}

            {/* SECTION 2: DAPUR UTAMA (BLUES) */}
            <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#007bff] shadow-sm mb-6 w-full">
               <div className="px-5 py-4 border-b border-[#dee2e6] flex items-center justify-between">
                 <h2 className="text-[16px] font-medium text-[#212529] flex items-center gap-2 m-0">
                   👨‍🍳 Antrean Dapur & Berjalan
                 </h2>
               </div>
               
               <div className="p-5">
                  {kitchenOrders.length === 0 ? (
                     <div className="text-center py-10 bg-[#f4f6f9] border border-dashed border-[#dee2e6] rounded-[4px]">
                       <p className="text-[#6c757d] font-medium">Bebas orderan, dapur sepi.</p>
                     </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                       {kitchenOrders.map((order) => (
                         <div key={order.id} className="border border-[#dee2e6] rounded-[4px] flex flex-col hover:border-[#adb5bd] transition-colors overflow-hidden bg-white">
                           
                           <div className={`p-3 border-b border-[#dee2e6] flex flex-col gap-1.5 ${order.orderStatus === 'NEW' ? 'bg-[#f8f9fa]' : 'bg-white'}`}>
                             <div className="flex justify-between items-start">
                               <span className="font-bold text-[#007bff] text-sm uppercase">#{order.orderNumber?.slice(-8) || order.id.slice(0,8)}</span>
                               <span className="text-[11px] font-bold text-gray-500 border border-gray-200 px-2 py-0.5 rounded-[3px] bg-white"><MapPin size={12} className="inline mr-1 -mt-0.5"/>MEJA {order.tableNumber}</span>
                             </div>
                             <h3 className="font-bold text-[17px] text-[#212529] truncate">{order.customerName}</h3>
                           </div>
            
                           {/* Item Lists */}
                           <div className="p-3 bg-white flex-1 min-h-[90px] max-h-[140px] overflow-y-auto">
                             <ul className="space-y-1.5">
                               {order.items.map((item: any) => (
                                 <li key={item.id} className="text-[13px] flex justify-between font-medium border-b border-dashed border-gray-100 pb-1.5 last:border-0 last:pb-0">
                                   <span className="text-[#212529]">{item.quantity}x {item.menuItem?.name || 'Item Usang'}</span>
                                   <span className="text-gray-500 ml-2">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                 </li>
                               ))}
                             </ul>
                           </div>
            
                           {/* Totals & Payment Logic */}
                           <div className="p-3 bg-[#f8f9fa] border-t border-[#dee2e6] flex flex-col gap-3">
                              <div className="flex items-center justify-between text-[13px]">
                                <div className="flex gap-1.5">
                                  <Badge className={`uppercase text-[10px] rounded-[3px] ${order.paymentStatus === 'PAID' ? 'bg-[#28a745] hover:bg-[#218838]' : 'bg-[#ffc107] text-[#1f2d3d] hover:bg-[#e0a800]'}`}>{order.paymentStatus}</Badge>
                                  <Badge variant="outline" className={`uppercase text-[10px] rounded-[3px] bg-white ${order.orderStatus === 'NEW' ? 'text-[#007bff] border-[#007bff]' : order.orderStatus === 'PREPARING' ? 'text-[#17a2b8] border-[#17a2b8]' : 'text-[#6c757d]'}`}>{order.orderStatus}</Badge>
                                </div>
                                <span className="text-[15px] font-bold text-[#212529]">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                              </div>
            
                              {/* Interactive AdminLTE Block Buttons */}
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-[#dee2e6]">
                                 {order.orderStatus === 'NEW' && (
                                   <button onClick={() => updateOrder(order.id, { orderStatus: 'PREPARING' })} className="flex-1 text-[13px] bg-[#007bff] text-white font-medium py-2 rounded-[3px] hover:bg-[#0069d9] transition-colors focus:ring-2 focus:ring-[#007bff]">
                                     Konfirmasi (Mulai Masak)
                                   </button>
                                 )}
                                 {order.orderStatus === 'PREPARING' && (
                                   <button onClick={() => updateOrder(order.id, { orderStatus: 'DELIVERED' })} className="flex-1 text-[13px] bg-[#343a40] text-white font-medium py-2 rounded-[3px] hover:bg-[#23272b] transition-colors focus:ring-2 focus:ring-[#343a40]">
                                     Selesaikan Pesanan &rarr;
                                   </button>
                                 )}
                              </div>
                           </div>
                           
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>

            {/* SECTION 3: RIWAYAT SELESAI */}
            {completedOrders.length > 0 && (
               <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#28a745] shadow-sm mt-8 w-full opacity-80 hover:opacity-100 transition-opacity">
                 <div className="px-5 py-3 border-b border-[#dee2e6] flex items-center justify-between">
                   <h2 className="text-[14.5px] font-bold text-[#28a745] flex items-center gap-2 m-0">
                     ✅ Riwayat Pesanan Selesai (Disajikan)
                   </h2>
                 </div>
                 <div className="p-5 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
                   {completedOrders.map((order) => (
                      <div key={order.id} className="border border-[#dee2e6] rounded-[4px] flex flex-col bg-[#f8f9fa] shadow-sm">
                         <div className="p-2.5 border-b border-[#dee2e6] flex justify-between items-center text-[10.5px]">
                           <span className="font-bold text-[#6c757d] uppercase">#{order.orderNumber?.slice(-8) || order.id.slice(0,8)}</span>
                           <span className="font-bold text-[#6c757d]">MEJA {order.tableNumber}</span>
                         </div>
                         <div className="p-3 flex flex-col">
                            <h3 className="font-bold text-[13px] text-[#212529] truncate mb-1">{order.customerName}</h3>
                            <span className="text-[13px] font-black text-[#28a745]">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                         </div>
                      </div>
                   ))}
                 </div>
               </div>
            )}
        </>
      )}
    </div>
  );
}
