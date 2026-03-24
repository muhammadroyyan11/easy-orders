"use client";

import { useEffect, useState, useRef } from 'react';
import { Clock, CheckSquare, Maximize } from 'lucide-react';

export default function KitchenDisplaySystem() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const previousPendingCountRef = useRef(0);
  const isInitialMount = useRef(true);

  // Tablet-Style Audio Alert for NEW tickets in Kitchen
  const playAlert = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log('KDS Audio blocked');
    }
  };

  const fetchKitchenOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        
        // Alert koki jika ada pesanan PAID yang baru masuk berstatus NEW
        const kitchenPending = data.filter((o: any) => o.paymentStatus === 'PAID' && o.orderStatus === 'NEW').length;
        if (!isInitialMount.current && kitchenPending > previousPendingCountRef.current) {
           playAlert();
        }
        previousPendingCountRef.current = kitchenPending;
        isInitialMount.current = false;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    const intv = setInterval(fetchKitchenOrders, 5000);
    return () => clearInterval(intv);
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    // Optimistic Touch (Instant UI response for Chef)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: newStatus } : o));
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, orderStatus: newStatus })
    });
    fetchKitchenOrders();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }
  };

  // Hanya ambil pesanan yang sudah dibayar, DAN blm diantar
  const activeKitchenTickets = orders.filter(o => o.paymentStatus === 'PAID' && o.orderStatus !== 'DELIVERED');
  
  // Sort: PREPARING first, then NEW, then oldest first
  activeKitchenTickets.sort((a, b) => {
     if (a.orderStatus === 'PREPARING' && b.orderStatus === 'NEW') return -1;
     if (a.orderStatus === 'NEW' && b.orderStatus === 'PREPARING') return 1;
     return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="w-full min-h-[calc(100vh-57px)] bg-[#111827] text-white p-4 sm:p-6 lg:p-8 flex flex-col font-sans">
      
      {/* KDS Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
         <div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
               <span className="bg-orange-500 text-white p-2 rounded-xl"><Clock size={28}/></span>
               Layar Dapur (KDS)
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Auto-Sync 5dtk. Klik kartu untuk mengubah status.</p>
         </div>
         <button onClick={toggleFullscreen} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-xl shadow-lg border border-gray-600 font-bold transition-all flex items-center gap-2 active:scale-95">
           <Maximize size={20}/> {isFullscreen ? 'Tutup Layar Penuh' : 'Layar Penuh (Tablet)'}
         </button>
      </div>

      {isLoading ? (
         <div className="flex-1 flex items-center justify-center text-gray-500 font-bold text-2xl animate-pulse">Menghubungkan ke Pemancar Dapur...</div>
      ) : activeKitchenTickets.length === 0 ? (
         <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-gray-800 rounded-3xl p-10 text-center">
            <CheckSquare size={80} className="text-gray-700 mb-6"/>
            <h2 className="text-4xl font-black text-gray-600 uppercase mb-2">Semua Pesanan Selesai</h2>
            <p className="text-xl text-gray-500 font-medium">Bebas orderan, dapur sepi.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 content-start">
            {activeKitchenTickets.map(ticket => {
               const isPreparing = ticket.orderStatus === 'PREPARING';
               const orderTime = new Date(ticket.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
               const waitTimeMins = Math.floor((new Date().getTime() - new Date(ticket.createdAt).getTime()) / 60000);
               const isLate = waitTimeMins > 15;

               return (
                 <div key={ticket.id} className={`flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all border-l-8 ${isPreparing ? 'bg-gray-800 border-l-blue-500 border border-gray-700' : isLate ? 'bg-red-950 border-l-red-500 border border-red-900 animate-pulse' : 'bg-gray-800 border-l-yellow-500 border border-gray-700'}`}>
                    
                    {/* Ticket Header */}
                    <div className={`p-4 flex justify-between items-start border-b ${isPreparing ? 'border-gray-700 bg-gray-800/50' : 'border-gray-700 bg-gray-900/30'}`}>
                       <div>
                          <span className={`text-[12px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${isPreparing ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            {isPreparing ? 'Sedang Dimasak' : 'ANTREAN BARU'}
                          </span>
                          <h2 className="text-2xl font-black text-white mt-3 truncate max-w-[200px] leading-none mb-1">{ticket.customerName}</h2>
                          <div className="font-bold text-gray-400 text-sm">#{ticket.orderNumber?.slice(-5)}</div>
                       </div>
                       
                       <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="bg-white text-black font-black text-2xl px-4 py-2 rounded-xl shadow-inner border-2 border-gray-300">
                             M-{ticket.tableNumber}
                          </div>
                          <div className={`text-sm font-bold flex items-center gap-1 ${isLate ? 'text-red-400' : 'text-gray-500'}`}>
                             <Clock size={14}/> {orderTime} ({waitTimeMins}m)
                          </div>
                       </div>
                    </div>

                    {/* Order Items (Very Large for Kitchen Reading) */}
                    <div className="p-5 flex-1 bg-gray-800">
                       <ul className="space-y-4">
                         {ticket.items.map((item: any) => (
                           <li key={item.id} className="flex items-start gap-4 pb-4 border-b border-gray-700/50 last:border-0 last:pb-0">
                              <span className="font-black text-2xl text-orange-400 min-w-[30px]">{item.quantity}x</span>
                              <div>
                                <span className="font-bold text-xl leading-tight block text-white">{item.menuItem?.name || 'Menu Terhapus'}</span>
                                {/* Note: Jika sistem punya sistem Custom Notes (Es Sedikit, dst) bisa dimunculkan di sini */}
                                {item.menuItem?.category?.name && <span className="text-gray-500 font-bold text-[11px] uppercase tracking-widest">{item.menuItem.category.name}</span>}
                              </div>
                           </li>
                         ))}
                       </ul>
                    </div>

                    {/* Touch Actions */}
                    {isPreparing ? (
                       <button onClick={() => updateOrderStatus(ticket.id, 'DELIVERED')} className="w-full p-5 bg-green-600 hover:bg-green-500 text-white font-black text-xl uppercase tracking-widest transition-colors flex items-center justify-center gap-3">
                         <CheckSquare size={24}/> Selesai & Panggil Pelayan
                       </button>
                    ) : (
                       <button onClick={() => updateOrderStatus(ticket.id, 'PREPARING')} className="w-full p-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl uppercase tracking-widest transition-colors shadow-[0_-5px_20px_rgba(37,99,235,0.2)]">
                         Mulai Memasak
                       </button>
                    )}
                 </div>
               );
            })}
         </div>
      )}
    </div>
  );
}
