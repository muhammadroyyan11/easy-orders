"use client";

import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Award, Receipt } from 'lucide-react';

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .finally(() => setIsLoading(false));
  }, []);

  const analyticsData = useMemo(() => {
    if (!orders.length) return null;

    // Kriteria pencapaian: Uang sudah diterima (PAID) dan Menu disajikan selesai (DELIVERED)
    // Atau minimal PAID untuk menghitung total uang yang sudah masuk ke kas.
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');

    // 1. Line Chart Data: Omzet per Tanggal
    const revenueMap: Record<string, number> = {};
    
    // Sort array by createdAt ascending so the line chart moves left to right perfectly
    const chronologicalOrders = [...paidOrders].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    chronologicalOrders.forEach(o => {
      const dateKey = new Date(o.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
      revenueMap[dateKey] = (revenueMap[dateKey] || 0) + o.totalAmount;
    });

    const revenueData = Object.keys(revenueMap).map(key => ({
      name: key,
      omzet: revenueMap[key]
    })).slice(-7); // Ambil 7 hari terakhir agar rapi di monitor

    // 2. Bar Chart Data: Top Menu Paling Laris
    const menuMap: Record<string, number> = {};
    paidOrders.forEach(o => {
      o.items.forEach((item: any) => {
        const title = item.menuItem?.name || 'Item Terhapus';
        menuMap[title] = (menuMap[title] || 0) + item.quantity;
      });
    });

    const topMenus = Object.keys(menuMap)
      .map(key => ({ name: key, porsi: menuMap[key] }))
      .sort((a, b) => b.porsi - a.porsi)
      .slice(0, 5); // 5 Rank teratas

    const totalOmzet = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return { revenueData, topMenus, totalOmzet };
  }, [orders]);

  if (isLoading) return <div className="p-8 text-center text-gray-500 font-bold text-lg animate-pulse">Menambang Data Intelijen Bisnis...</div>;
  if (!analyticsData) return <div className="p-8 text-center text-gray-500">Belum ada cukup data pembukuan untuk dianalisis.</div>;

  return (
    <div className="p-4 sm:p-6 w-full font-sans bg-[#f4f6f9] min-h-[calc(100vh-57px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-300">
         <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-2xl font-black text-[#212529] tracking-tight flex items-center gap-3">
               <TrendingUp className="text-[#007bff]"/> Intelijen Bisnis & Statistik
            </h1>
            <p className="text-[#6c757d] mt-1 text-[15px]">Laporan Visual dan Pemetaan Produk Terlaris secara Real-Time.</p>
         </div>
         <div className="mt-4 sm:mt-0 px-6 py-3 bg-white rounded-[4px] border-l-4 border-[#28a745] shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-12 h-12 bg-[#28a745]/10 rounded-full flex items-center justify-center text-[#28a745]"><Receipt size={24}/></div>
            <div>
               <p className="text-[12px] font-bold text-[#6c757d] uppercase tracking-wider">Total Pendapatan (Gross)</p>
               <p className="text-2xl font-black text-[#212529] tracking-tighter">Rp {analyticsData.totalOmzet.toLocaleString('id-ID')}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Line Chart: Omzet Harian */}
         <div className="bg-white p-6 rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#dee2e6] animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-[15px] font-bold text-[#495057] mb-6 uppercase flex items-center gap-2">
              <TrendingUp size={18} className="text-[#007bff]"/> Grafik Omzet Harian (7 Hari Terakhir)
            </h2>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.revenueData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6c757d'}} tickMargin={12} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#6c757d'}} axisLine={false} tickLine={false} tickFormatter={(value) => `Rp ${(value/1000)}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                    labelStyle={{color: '#212529', fontWeight: 'bold'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Line type="monotone" dataKey="omzet" stroke="#007bff" strokeWidth={4} dot={{r: 5, fill: '#007bff', strokeWidth: 2, stroke:'#fff'}} activeDot={{ r: 8, fill: '#0056b3' }} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Bar Chart: Best Sellers */}
         <div className="bg-white p-6 rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#dee2e6] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <h2 className="text-[15px] font-bold text-[#495057] mb-6 uppercase flex items-center gap-2">
              <Award size={18} className="text-[#ffc107]"/> 5 Menu Paling Laris (Super Stars)
            </h2>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.topMenus} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 12, fill: '#495057', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value: number) => [`${value} Porsi Terjual`, 'Volume']} 
                    cursor={{fill: '#f8f9fa'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="porsi" fill="#17a2b8" radius={[0, 4, 4, 0]} barSize={26} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
}
