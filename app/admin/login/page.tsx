"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh(); 
    } else {
      const data = await res.json();
      setError(data.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[1rem] shadow-[0_0_50px_0_rgba(82,63,105,0.05)] p-10 sm:p-12 border border-gray-100/50">
        
        <div className="text-center mb-10">
           <h1 className="text-[28px] font-black text-[#181c32] tracking-tight mb-2 flex items-center justify-center gap-2">
             <span className="w-10 h-10 rounded-lg bg-[#009ef7] flex items-center justify-center text-white text-xl shadow-[0_0_15px_rgba(0,158,247,0.4)]">R</span>
             RestoAdmin
           </h1>
           <p className="text-[#a1a5b7] font-semibold text-[13px]">Akses Dasbor Kasir Kelas Enterprise</p>
        </div>

        {error && (
          <div className="bg-[#fff5f8] text-[#f1416c] p-4 rounded-lg text-sm font-bold mb-8 text-center border border-[#f1416c]/20 animate-in fade-in zoom-in-95 duration-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
           <div>
             <label className="text-[13px] font-bold text-[#3f4254] mb-2.5 block">Alamat Surel Resmi</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a1a5b7]"><Mail size={18}/></div>
                <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@resto.com" className="w-full h-[50px] bg-[#f5f8fa] border-none text-[14px] text-[#3f4254] rounded-xl focus:ring-2 focus:ring-[#009ef7] pl-12 transition-all font-semibold placeholder:text-[#a1a5b7]" />
             </div>
           </div>
           
           <div>
             <div className="flex justify-between items-center mb-2.5">
                 <label className="text-[13px] font-bold text-[#3f4254]">Kata Sandi</label>
                 <span className="text-[12px] font-bold text-[#009ef7] hover:text-[#0095e8] cursor-pointer transition-colors">Lupa Sandi?</span>
             </div>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a1a5b7]"><Lock size={18}/></div>
                <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••••" className="w-full h-[50px] bg-[#f5f8fa] border-none text-[14px] text-[#3f4254] rounded-xl focus:ring-2 focus:ring-[#009ef7] pl-12 transition-all font-semibold placeholder:text-[#a1a5b7]" />
             </div>
           </div>
           
           <button type="submit" disabled={loading} className="w-full h-[52px] bg-[#009ef7] text-white font-bold rounded-xl hover:bg-[#0095e8] transition-colors mt-6 flex justify-center items-center shadow-[0_4px_14px_0_rgba(0,158,247,0.39)] hover:shadow-[0_6px_20px_rgba(0,158,247,0.23)] hover:-translate-y-px disabled:opacity-70 text-[15px]">
              {loading ? <Loader2 className="animate-spin" size={20}/> : "Buka Portal"}
           </button>
        </form>

        <div className="mt-10 pt-6 border-t border-dashed border-gray-200/80">
          <p className="text-[11px] text-[#a1a5b7] font-semibold text-center leading-relaxed">
            Sistem MVP otomatis menyuntikkan ID ini:<br/>
            E: <strong className="text-[#3f4254]">admin@resto.com</strong> &nbsp; | &nbsp; P: <strong className="text-[#3f4254]">password123</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
