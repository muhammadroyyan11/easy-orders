"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from 'qrcode.react';
import { Printer, QrCode as QrIcon } from 'lucide-react';

export default function TablesAdmin() {
  const [tableCount, setTableCount] = useState<number>(6);

  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://resto.com';

  const printQRCodes = () => window.print();

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end print:hidden mb-4">
        <div>
          <h1 className="text-2xl text-[#212529] font-normal tracking-tight">Generate Kode Akses Meja</h1>
          <div className="flex items-center text-[13.5px] text-[#6c757d] gap-2 mt-2">
            <span>Beranda</span> <span className="text-gray-300">/</span> <span className="text-gray-600">Terminal Cetak</span>
         </div>
        </div>
        <button onClick={printQRCodes} className="h-[38px] px-5 w-full sm:w-auto bg-[#343a40] text-white font-medium rounded-[3px] hover:bg-[#23272b] flex justify-center items-center gap-2 transition-colors">
          <Printer size={16} /> Render Cetakan Fisis
        </button>
      </div>

      <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#6c757d] shadow-sm w-full print:hidden">
         <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-[#f8f9fa] rounded-full text-gray-600 shrink-0 hidden sm:block border border-[#dee2e6]"><QrIcon size={20}/></div>
          <div className="flex-1">
             <label className="text-[14px] font-bold text-[#212529] block">Jumlah Alokasi Meja Publik</label>
             <p className="text-[13px] text-[#6c757d] mt-1">Estimasi meja aktif operasional restoran saat ini untuk output massal.</p>
          </div>
          <Input 
            type="number" min={1} max={200} value={tableCount} 
            onChange={(e) => setTableCount(Number(e.target.value) || 1)} 
            className="w-full sm:w-32 h-[44px] font-bold text-lg text-center bg-[#f8f9fa] border-[#ced4da] rounded-[3px]"
          />
         </div>
      </div>

      {/* Mesin Cetak Viewport Terlarang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-2 print:grid-cols-2 print:gap-10 print:p-0 w-full">
        {tables.map(num => {
          const tableUrl = `${baseUrl}/?table=${num}`;
          return (
             <div key={num} className="bg-white border border-[#dee2e6] rounded-[4px] p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden print:shadow-none print:break-inside-avoid print:border-2 print:border-black">
               <div className="absolute top-0 left-0 right-0 bg-[#007bff] h-1.5"></div>
               <h3 className="font-bold text-[18px] text-[#212529] mt-2 mb-1 uppercase tracking-wider">Akses Langsung</h3>
               <p className="text-[12px] text-[#6c757d] mb-6">Pindai lensa gawai ke sini</p>
               
               <div className="bg-white p-2 rounded border border-[#dee2e6] mb-5">
                 <QRCodeSVG value={tableUrl} size={140} bgColor={"#ffffff"} fgColor={"#212529"} level={"H"} includeMargin={false} />
               </div>

               <div className="bg-[#343a40] text-white px-6 py-1.5 rounded-[3px] font-bold text-lg tracking-wide mb-2 shadow-sm w-full">
                 MEJA {num}
               </div>
               
               <p className="text-[9px] text-[#adb5bd] font-mono mt-1 break-all px-2 leading-tight">{tableUrl}</p>
             </div>
          )
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 15mm; }
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
