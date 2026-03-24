"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, Trash2, Wallet, UserCircle, MapPinHouse, CreditCard, ReceiptText, Loader2 } from "lucide-react";

export default function CartCheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  
  // Formulir state
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [payment, setPayment] = useState("kasir");
  const [ovoPhone, setOvoPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  const subtotal = cart.getTotalPrice();
  const taxAmount = subtotal * 0.1;
  const grandTotal = subtotal + taxAmount;

  const handleCheckout = async () => {
    if (!name || name.length < 2) {
      alert("Nama pemesan wajib diisi dengan benar.");
      return;
    }
    if (!table) {
      alert("Nomor meja/area wajib diisi.");
      return;
    }

    if (payment === 'midtrans_ovo' && (!ovoPhone || ovoPhone.length < 9)) {
      alert("Mohon masukkan Nomor HP OVO yang valid terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    cart.setOrderDetails({ name, table, paymentMethod: payment });

    // JIKA BAYAR KASIR (Offline) - Lewati Midtrans, langsung pindah ke Success Page
    if (payment === 'kasir') {
      setTimeout(() => router.push("/success"), 1000);
      return;
    }

    // JIKA BAYAR ONLINE (Midtrans Gateway)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          table,
          paymentMethod: payment,
          ovoPhone: payment === 'midtrans_ovo' ? ovoPhone : undefined,
          items: cart.items,
          totalAmount: grandTotal
        })
      });

      const data = await response.json();
      if (data.success) {
        
        // INTERCEPT DEEPLINK (GoPay / DANA) ke Aplikasi Mereka Langsung
        if (data.deepLinkUrl) {
          window.location.href = data.deepLinkUrl;
          return; // Stop disini karena pindah aplikasi
        }

        // Bawa pelanggan ke Success Page internal kita lengkap dengan Data QR, OVO Push, atau VA
        let successUrl = `/success?order_id=${data.orderId}&method=${payment}&table=${encodeURIComponent(table)}&name=${encodeURIComponent(name)}`;
        if (data.qrUrl) successUrl += `&qr=${encodeURIComponent(data.qrUrl)}`;
        if (data.vaNumber) successUrl += `&va=${data.vaNumber}&bank=${data.bankName}`;
        if (data.isPush) successUrl += `&push=ovo`; // Tanda bahwa Midtrans sudah mengirim ke aplikasi OVO
        router.push(successUrl);
      } else {
        alert("Gagal memproses pembayaran: " + (data.error || "Cek konfigurasi Server Key Midtrans Anda."));
        setIsSubmitting(false);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in fade-in bg-white max-w-2xl mx-auto w-full">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-dashed border-gray-200">
          <Wallet className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-900">Keranjang Masih Kosong</h2>
        <p className="text-gray-500 mb-8 text-center text-sm max-w-[250px]">Anda belum memilih menu apapun. Yuk, lihat kembali katalog kami!</p>
        <Button onClick={() => router.push('/')} className="rounded-full px-8 h-12 shadow-md hover:bg-primary/90 font-bold">Lihat Katalog Menu</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-36 animate-in slide-in-from-right-8 duration-300 relative z-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 lg:px-8 py-5 flex items-center gap-3 shadow-sm">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors active:scale-95">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-[17px] lg:text-[20px] font-bold text-gray-900 shrink-0">Ringkasan Checkout</h1>
      </div>

      <div className="p-4 lg:p-8 space-y-6 max-w-3xl mx-auto w-full">
        
        {/* Rincian Pesanan */}
        <section className="bg-white rounded-[20px] p-5 lg:p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <h2 className="text-[16px] font-bold text-gray-900 mb-5 flex items-center gap-2.5">
            <ReceiptText className="w-5 h-5 text-primary" /> Pesanan Anda
          </h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-[65px] h-[65px] shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-start gap-3">
                    <span className="font-bold text-[14px] text-gray-900 leading-snug">{item.name}</span>
                    <span className="font-extrabold text-[14px] text-gray-900 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[12px] text-gray-500 font-medium bg-gray-50 px-2.5 py-0.5 rounded-md border border-gray-200">
                      {item.quantity}x @ {formatPrice(item.price)}
                    </span>
                    <button 
                      onClick={() => !isSubmitting && cart.removeItem(item.id)} 
                      disabled={isSubmitting}
                      className="text-red-500 bg-red-50 p-2 rounded-full hover:bg-red-100 active:scale-90 transition-all disabled:opacity-50 disabled:active:scale-100"
                    >
                      <Trash2 className="w-[14px] h-[14px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-5 border-t border-dashed border-gray-200 bg-gray-50 -mx-5 lg:-mx-6 px-6 -mb-5 lg:-mb-6 pb-5 lg:pb-6 rounded-b-[20px] space-y-2.5">
            <div className="flex justify-between items-center text-[13px] font-medium text-gray-500">
              <span>Subtotal Menu</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-medium text-gray-500">
              <span>Pajak Restoran (10%)</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200/60">
              <span className="font-bold text-gray-800 text-[15px]">Total Pembayaran</span>
              <span className="font-extrabold text-[18px] lg:text-[22px] text-primary tracking-tight">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </section>

        {/* Form Data Pelanggan */}
        <section className="bg-white rounded-[20px] p-5 lg:p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <h2 className="text-[16px] font-bold text-gray-900 mb-5 flex items-center gap-2.5">
            <UserCircle className="w-5 h-5 text-primary" /> Data Pelanggan
          </h2>
          <div className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-gray-700 text-[13px] font-bold">Nama Pemesan <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Contoh: Budi Santoso" 
                className="rounded-xl border-gray-200 bg-white focus-visible:ring-primary h-[50px] text-[15px] shadow-sm font-medium" 
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="table" className="text-gray-700 text-[13px] font-bold">Lokasi Meja / Area <span className="text-red-500">*</span></Label>
              <div className="relative">
                <MapPinHouse className="absolute left-4 top-[15px] w-[20px] h-[20px] text-gray-400" />
                <Input 
                  id="table" 
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Contoh: Meja 12" 
                  className="rounded-xl border-gray-200 bg-white focus-visible:border-primary focus-visible:ring-primary h-[50px] text-[15px] shadow-sm font-bold pl-11" 
                />
              </div>
              <p className="text-[12px] text-gray-400 mt-1.5 font-medium">*Silakan masukkan nomor meja/area tempat Anda duduk dengan benar.</p>
            </div>
          </div>
        </section>

        {/* Metode Pembayaran */}
        <section className="bg-white rounded-[20px] p-5 lg:p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <h2 className="text-[16px] font-bold text-gray-900 mb-5 flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-primary" /> Metode Pembayaran <span className="text-red-500">*</span>
          </h2>
          <RadioGroup value={payment} onValueChange={setPayment} disabled={isSubmitting} className="space-y-3">
            {[
              { id: 'kasir', name: 'Bayar Langsung ke Kasir', desc: 'Bayar tunai/debit di meja kasir setelah selesai makan' },
              { id: 'midtrans_gopay', name: 'GoPay', desc: 'Akan langsung memanggil Aplikasi Gojek/GoPay' },
              { id: 'midtrans_dana', name: 'DANA', desc: 'Akan langsung dialihkan ke checkout web/app DANA' },
              { id: 'midtrans_ovo', name: 'OVO', desc: 'Kirim notifikasi otomatis ke HP Anda' },
              { id: 'midtrans_qris', name: 'QRIS Lainya', desc: 'Scan barcode via Aplikasi M-Banking / LinkAja' },
              { id: 'midtrans_va', name: 'Transfer Bank (VA)', desc: 'BCA, Mandiri, BNI, BRI, Permata, dll via Midtrans.' }
            ].map(method => (
              <div 
                key={method.id} 
                onClick={() => !isSubmitting && setPayment(method.id)}
                className={`relative flex flex-col p-4 rounded-xl border ${payment === method.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-gray-100 bg-white hover:bg-gray-50/50'} transition-all shadow-sm cursor-pointer select-none`}
              >
                <div className="flex items-start w-full pointer-events-none">
                  <RadioGroupItem value={method.id} id={method.id} className="mt-0.5 mr-3.5 text-primary border-gray-300 shrink-0" />
                  <div className="flex-1">
                    <span className={`block font-bold text-[14px] mb-1 leading-snug ${payment === method.id ? 'text-primary' : 'text-gray-900'}`}>{method.name}</span>
                    <span className={`block text-[12px] font-medium ${payment === method.id ? 'text-primary/70' : 'text-gray-500'}`}>{method.desc}</span>
                  </div>
                </div>

                {/* Input Ekstra Khusus OVO jika dipilih */}
                {method.id === 'midtrans_ovo' && payment === 'midtrans_ovo' && (
                  <div className="mt-4 pl-8 pr-1 cursor-auto" onClick={(e) => e.stopPropagation()}>
                    <p className="text-[12px] font-bold text-gray-700 mb-2">Nomor HP OVO <span className="text-red-500">*</span></p>
                    <Input 
                      placeholder="Contoh: 08123456789" 
                      value={ovoPhone} 
                      onChange={e => setOvoPhone(e.target.value)} 
                      disabled={isSubmitting}
                      className="h-10 rounded-lg text-[13px] bg-white border-gray-200 focus-visible:ring-primary shadow-sm" 
                    />
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>
        </section>
      </div>

      {/* Floating Checkout Action */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:p-6 border-t border-gray-100 shadow-[0_-8px_20px_rgba(0,0,0,0.03)] flex justify-center pb-8 sm:pb-6 bg-white/95 backdrop-blur-md">
        <Button 
          onClick={handleCheckout}
          disabled={isSubmitting || cart.items.length === 0}
          className="w-full max-w-2xl rounded-full h-[54px] lg:h-[60px] text-[16px] lg:text-[17px] font-bold shadow-[0_4px_14px_rgba(238,77,45,0.4)] hover:bg-[#df4425] active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Memproses Pesanan Anda...
            </>
          ) : (
            `Pesan & Bayar • ${formatPrice(grandTotal)}`
          )}
        </Button>
      </div>
    </div>
  );
}
