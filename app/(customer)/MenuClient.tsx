"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, MenuItem } from "@/store/useCart";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Minus, Star, MapPin, ReceiptText } from "lucide-react";

export default function MenuClient({ categories, menuItems }: { categories: any[], menuItems: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const cart = useCart();
  const totalItems = cart.getTotalItems();
  const totalPrice = cart.getTotalPrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-32 animate-in fade-in duration-300">
      
      {/* Restaurant Info Header */}
      <div className="px-4 lg:px-10 pt-6 pb-6 border-b-[6px] border-gray-100">
        <h1 className="text-[22px] lg:text-[30px] font-extrabold text-gray-900 mb-1.5 lg:mb-2 leading-tight">Resto Modern - Cabang Utama</h1>
        <p className="text-sm lg:text-base text-gray-500 mb-4 lg:mb-5">Aneka Nasi, Cepat Saji, Minuman</p>
        
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] lg:text-[14px] font-medium text-gray-700">
          <div className="flex items-center gap-1.5">
            <Star className="w-[15px] lg:w-[18px] h-[15px] lg:h-[18px] text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-gray-900">4.8</span>
            <span className="text-gray-400 font-normal">(1rb+ Rating)</span>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md">
            <MapPin className="w-[15px] lg:w-[18px] h-[15px] lg:h-[18px]" />
            <span className="font-bold">Pilih Meja di Checkout</span>
          </div>
        </div>
      </div>

      {/* Sticky Category Tabs */}
      <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max px-2 lg:px-8">
            <button
               className={`px-4 lg:px-7 py-3.5 lg:py-4 text-[14px] lg:text-[15px] font-bold border-b-[3px] transition-colors ${
                 activeCategory === 'all'
                   ? "border-primary text-primary" 
                   : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
               }`}
               onClick={() => setActiveCategory('all')}
            >
              Semua Menu
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 lg:px-7 py-3.5 lg:py-4 text-[14px] lg:text-[15px] font-bold border-b-[3px] transition-colors ${
                  activeCategory === cat.id 
                    ? "border-primary text-primary" 
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* Menu List Grid for Desktop / Col for Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-6 sm:p-6 lg:p-8">
        {filteredItems.map((item) => {
          const cartItem = cart.items.find(i => i.id === item.id);
          const quantity = cartItem?.quantity || 0;

          return (
          <div key={item.id} className="flex flex-row p-4 border-b sm:border border-gray-100 sm:rounded-2xl sm:shadow-sm bg-white hover:bg-gray-50/50 transition-all sm:hover:shadow-md sm:hover:-translate-y-0.5">
            {/* Image Left */}
            <div className="w-[110px] lg:w-[130px] h-[110px] lg:h-[130px] shrink-0 rounded-xl overflow-hidden bg-gray-100 mr-4 lg:mr-5 relative border border-gray-100/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </div>
            
            {/* Info Right */}
            <div className="flex flex-col flex-1 justify-between py-0.5 min-w-0">
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h3 className="font-bold text-[15px] lg:text-[17px] leading-snug text-gray-900 pr-2">{item.name}</h3>
                </div>
                {item.popular && (
                  <span className="inline-block bg-primary/10 text-primary px-1.5 py-0.5 mb-1.5 rounded text-[10px] lg:text-[11px] font-extrabold uppercase tracking-wide">
                    Paling Laris
                  </span>
                )}
                <p className="text-[13px] lg:text-[14px] text-gray-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
              
              <div className="flex items-end justify-between mt-2">
                <span className="font-extrabold text-[15px] lg:text-[18px] text-gray-900 tracking-tight">
                  {formatPrice(item.price)}
                </span>
                
                {quantity === 0 ? (
                  <button 
                    onClick={() => cart.addItem(item)}
                    className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-primary text-white hover:bg-primary/90 active:scale-90 transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-[18px] h-[18px] lg:w-[20px] lg:h-[20px]" strokeWidth={2.5} />
                  </button>
                ) : (
                  <div className="flex items-center gap-3 lg:gap-4">
                    <button 
                      onClick={() => cart.decreaseQuantity(item.id)}
                      className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-primary text-primary hover:bg-primary/10 active:scale-90 transition-all shrink-0"
                    >
                      <Minus className="w-4 h-4 lg:w-4 lg:h-4" strokeWidth={2.5} />
                    </button>
                    <span className="font-bold text-[14px] lg:text-[16px] w-4 text-center text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => cart.addItem(item)}
                      className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary text-white hover:bg-primary/90 active:scale-90 transition-all shadow-sm shrink-0"
                    >
                      <Plus className="w-4 h-4 lg:w-4 lg:h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Bottom Floating Cart Overlay */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center lg:justify-end bg-gradient-to-t from-white/95 via-white/80 to-transparent pb-5 pt-12 px-4 pointer-events-none animate-in slide-in-from-bottom-10 fade-in duration-300 lg:bg-none lg:pr-10 lg:pb-10">
          <div className="w-full max-w-xl lg:max-w-[380px] flex items-center justify-between bg-primary text-white rounded-full pl-6 pr-2.5 py-2 pointer-events-auto shadow-[0_8px_30px_rgba(238,77,45,0.4)] hover:bg-[#df4425] transition-transform cursor-pointer ring-4 ring-white lg:ring-2 lg:hover:scale-105 group">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ReceiptText className="w-6 h-6 lg:w-7 lg:h-7" />
                <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] lg:text-[11px] font-bold px-1.5 py-0.5 rounded-full border-2 border-primary">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] lg:text-[15px] font-extrabold tracking-tight">{totalItems} Item Menu</span>
                <span className="text-[12px] lg:text-[13px] opacity-90 font-medium">Rp {formatPrice(totalPrice).replace('Rp', '').trim()}</span>
              </div>
            </div>
            <Link href="/cart" className="bg-white text-primary px-5 lg:px-6 py-2.5 lg:py-3 rounded-full text-[14px] lg:text-[15px] font-bold shadow-sm group-hover:bg-gray-50 active:scale-95 transition-transform">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
