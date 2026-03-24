"use client";

import { useEffect, useState, Suspense } from "react";
import { useCart } from "@/store/useCart";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const cart = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackToMenu = () => {
    cart.clearCart();
    router.push("/");
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  if (!mounted) return null;

  // Mendapatkan Data (Bisa dari Session Zustand jika browser tetap, ATAU dari query URL hasil Return Xendit)
  const urlName = searchParams.get('name');
  const urlTable = searchParams.get('table');
  const urlMethod = searchParams.get('method');
  const qrUrl = searchParams.get('qr');
  const vaNumber = searchParams.get('va');
  const bankName = searchParams.get('bank');
  const orderId = searchParams.get('order_id') || `#ORD-${(Math.floor(1000 + Math.random() * 9000))}`;

  const name = cart.orderDetails?.name || urlName;
  const table = cart.orderDetails?.table || urlTable;
  const paymentMethod = cart.orderDetails?.paymentMethod || urlMethod || 'midtrans_qris';

  // Fallback kosong 
  if (cart.items.length === 0 && (!name || !table)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
        <h1 className="text-xl font-bold mb-4 text-gray-900">Sesi Telah Berakhir</h1>
        <p className="text-sm text-gray-500 mb-8">Keranjang Anda kosong atau pesanan sudah selesai.</p>
        <Button onClick={() => router.push("/")} className="rounded-full shadow-lg h-12 px-8 font-bold">Kembali ke Menu Awal</Button>
      </div>
    );
  }

  const paymentLabels: Record<string, string> = {
    kasir: "Bayar Tunai di Kasir",
    midtrans_qris: "QRIS",
    midtrans_gopay: "GoPay",
    midtrans_dana: "DANA",
    midtrans_ovo: "OVO",
    midtrans_ewallet: "E-Wallet Terhubung",
    midtrans_va: "Virtual Account"
  };

  const subtotal = cart.getTotalPrice() || 0; 
  const taxAmount = subtotal * 0.1;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] relative sm:border-x w-full mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl shadow-sm animate-in fade-in duration-500 pb-12 overflow-hidden">
      
      {/* Decorative Top Background */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 relative z-10 w-full max-w-[400px] mx-auto">
        
        {/* Success Animated Icon */}
        <div className="w-[100px] h-[100px] bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm border-[6px] border-green-50 animate-in zoom-in-50 duration-700 delay-150">
          <CheckCircle2 className="w-14 h-14 text-green-500" strokeWidth={2.5} />
        </div>

        <h1 className="text-[26px] font-extrabold text-gray-900 mb-2 text-center tracking-tight leading-tight">Pesanan<br/>Telah Tercatat!</h1>
        <p className="text-gray-500 text-center text-[14px] font-medium leading-relaxed mb-8 px-2">
          Hai <strong className="text-primary">{name?.split(' ')[0] || "Kak"}</strong>, dapur kami akan memproses pesanan Anda sesaat setelah pembayaran diselesaikan.
        </p>

        {/* E-Receipt Ticket Design */}
        <div className="bg-white w-full rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative mb-10">
          
          {/* Ticket Header Area */}
          <div className="bg-primary/5 px-6 py-5 border-b-2 border-dashed border-gray-200 relative">
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#fafafa] rounded-full border-r border-t border-gray-100"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#fafafa] rounded-full border-l border-t border-gray-100"></div>
            
            <div className="flex justify-between items-center mb-2.5">
              <span className="font-bold text-gray-800 flex items-center gap-1.5 text-[15px] bg-white px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
                <Store className="w-4 h-4 text-primary" /> {table?.toUpperCase().includes('MEJA') ? table : `Meja ${table}`}
              </span>
              <span className="text-[12px] font-extrabold px-2 py-1.5 bg-primary text-white rounded shadow-sm tracking-wider">
                {orderId}
              </span>
            </div>
            <p className="text-gray-600 text-[13px] font-semibold flex items-center justify-between">
              <span>Metode Bayar:</span>
              <span className="text-primary">{paymentLabels[paymentMethod] || paymentMethod.toUpperCase()}</span>
            </p>
          </div>

          {/* Custom QR / VA / OVO Push Payment Native View Gateway */}
          {(qrUrl || vaNumber || searchParams.get('push') === 'ovo') && (
            <div className="px-6 pb-2 pt-6 flex flex-col items-center border-b border-gray-50 bg-white">
              {searchParams.get('push') === 'ovo' ? (
                <div className="w-full bg-purple-50/40 border border-purple-100 rounded-xl p-5 text-center mb-3 shadow-sm">
                  <p className="text-[30px] mb-2 leading-none">📲</p>
                  <p className="text-[13px] font-extrabold text-purple-700 mb-2 uppercase">Cek Aplikasi OVO Anda!</p>
                  <p className="text-[11px] text-purple-600/90 font-medium px-2 leading-relaxed">Kami telah mengirimkan instruksi tagihan ke Aplikasi OVO di HP Anda. Segera selesaikan pembayaran dalam 30 detik untuk memproses menu.</p>
                </div>
              ) : qrUrl ? (
                <>
                  <p className="text-[14px] font-extrabold text-gray-800 mb-3 uppercase tracking-wide">Scan {paymentLabels[paymentMethod] || 'QR Code'} Berikut</p>
                  <div className="w-48 h-48 bg-white border-4 border-primary rounded-2xl overflow-hidden shadow-sm p-1.5 mb-3 select-none pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={decodeURIComponent(qrUrl)} alt={`QR ${paymentMethod}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium text-center pb-2">Buka Aplikasi {paymentLabels[paymentMethod] || 'M-Banking / E-Wallet'} Anda dan scan kode untuk bayar.</p>
                </>
              ) : vaNumber ? (
                <div className="w-full bg-blue-50/40 border border-blue-100 rounded-xl p-5 text-center mb-3">
                  <p className="text-[13px] font-extrabold text-gray-600 mb-2 uppercase">Kode Pembayaran {bankName?.toUpperCase()}</p>
                  <p className="text-[26px] font-black text-blue-700 tracking-wider mb-1">{vaNumber}</p>
                  <p className="text-[11px] text-blue-500/80 font-semibold uppercase">Salin Nomor Virtual Account</p>
                </div>
              ) : null}
            </div>
          )}

          {/* Ticket Items List */}
          <div className="px-6 py-6">
            <div className="space-y-4 mb-4 max-h-[25vh] overflow-y-auto pr-1">
              {cart.items.length > 0 ? cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4 border-b border-gray-50 pb-3.5 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-gray-800 leading-snug">{item.name}</span>
                    <span className="text-[12px] text-gray-500 font-medium">{item.quantity} rincian item</span>
                  </div>
                  <span className="text-[14px] font-extrabold text-gray-900 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              )) : (
                <div className="text-center text-sm text-gray-400 py-2">Membaca detail tagihan Xendit yang dikonfirmasi...</div>
              )}
            </div>

            {/* Calculations Area */}
            {grandTotal > 0 && (
              <div className="border-t-[2px] border-dotted border-gray-200 pt-4 mt-2 mb-4 space-y-2">
                <div className="flex justify-between items-center text-[13px] text-gray-500 font-medium px-1">
                  <span>Subtotal Menu</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] text-gray-500 font-medium px-1">
                  <span>Pajak Restoran (10%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
              </div>
            )}

            <div className="border-t-[2.5px] border-dashed border-gray-200 pt-5 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Status Tagihan</span>
                {paymentMethod !== 'kasir' ? (
                   <span className="text-[10px] text-green-700 font-extrabold bg-green-50 px-2 py-1.5 rounded w-max border border-green-200 shadow-sm">✅ LUNAS (MIDTRANS)</span>
                ) : (
                   <span className="text-[10px] text-amber-700 font-extrabold bg-amber-50 px-2 py-1.5 rounded w-max border border-amber-200 shadow-sm">💰 BAYAR DI KASIR MUKA</span>
                )}
              </div>
              {grandTotal > 0 && <span className="text-[24px] font-extrabold text-primary tracking-tight">{formatPrice(grandTotal)}</span>}
            </div>
          </div>
          
          <div className="h-4 w-full" style={{ backgroundImage: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.02) 50%), linear-gradient(-135deg, transparent 50%, rgba(0,0,0,0.02) 50%)", backgroundSize: "16px 16px", backgroundPosition: "bottom" }}></div>
        </div>

        {/* Action Bottom */}
        <Button 
          onClick={handleBackToMenu}
          className="w-full h-14 rounded-2xl text-[16px] font-extrabold shadow-[0_4px_20px_rgba(238,77,45,0.3)] bg-primary hover:bg-[#df4425] active:scale-[0.98] transition-all border border-transparent"
        >
          Selesai & Tutup E-Receipt
        </Button>
        <p className="text-[12px] text-gray-400 mt-4 text-center font-medium opacity-80">
          Sistem Pembayaran ini terenkripsi dan diverifikasi oleh Midtrans.
        </p>

      </div>
    </div>
  );
}

const SuccessSkeleton = () => (
  <div className="flex flex-col min-h-screen bg-[#fafafa] relative sm:border-x w-full mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl shadow-sm pb-12 overflow-hidden items-center justify-center px-5 py-12">
    <div className="w-[100px] h-[100px] bg-gray-200 rounded-full animate-pulse mb-6" />
    <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-3" />
    <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse mb-10" />
    <div className="bg-white w-full h-[400px] rounded-3xl animate-pulse border border-gray-100 shadow-sm" />
  </div>
);

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}
