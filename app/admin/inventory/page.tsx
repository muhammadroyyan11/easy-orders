"use client";

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ArrowRight, PackageOpen, LayoutList } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function InventoryPage() {
  const [tab, setTab] = useState<'RAW' | 'RECIPE'>('RAW');
  
  const [materials, setMaterials] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string>('');

  const [formRaw, setFormRaw] = useState({ name: '', sku: '', unit: '' });
  const [formRecipe, setFormRecipe] = useState({ rawMaterialId: '', quantityUsed: '' });
  const [isLoading, setIsLoading] = useState(false);

  const fetchMaterials = async () => {
    const res = await fetch('/api/inventory');
    const data = await res.json();
    if (!res.ok || !Array.isArray(data)) console.error("Materials Error:", data);
    setMaterials(Array.isArray(data) ? data : []);
  };

  const fetchMenus = async () => {
    const res = await fetch('/api/menus');
    const data = await res.json();
    setMenus(Array.isArray(data) ? data : []);
  };

  const fetchRecipes = async (menuId: string) => {
    const res = await fetch(`/api/recipes?menuItemId=${menuId}`);
    const data = await res.json();
    setRecipes(Array.isArray(data) ? data : []);
  };

  useEffect(() => { 
    fetchMaterials(); 
    fetchMenus();
  }, []);

  useEffect(() => {
    if (selectedMenu) fetchRecipes(selectedMenu);
    else setRecipes([]);
  }, [selectedMenu]);

  const handleAddRaw = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch('/api/inventory', { method: 'POST', body: JSON.stringify(formRaw) });
    setFormRaw({ name: '', sku: '', unit: '' });
    fetchMaterials();
    setIsLoading(false);
  };

  const handleDeleteRaw = async (id: string) => {
    if (!confirm("Hapus bahan baku permanen? Pastikan tidak ada resep yang masih terikat!")) return;
    await fetch(`/api/inventory?id=${id}`, { method: 'DELETE' });
    fetchMaterials();
  };

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return alert("Pilih Menu terlebih dahulu!");
    setIsLoading(true);
    const res = await fetch('/api/recipes', { 
      method: 'POST', 
      body: JSON.stringify({ menuItemId: selectedMenu, ...formRecipe }) 
    });
    if (!res.ok) {
       const err = await res.json();
       alert(err.error);
    } else {
       setFormRecipe({ rawMaterialId: '', quantityUsed: '' });
       fetchRecipes(selectedMenu);
    }
    setIsLoading(false);
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm("Cabut komponen ini dari resep?")) return;
    await fetch(`/api/recipes?id=${id}`, { method: 'DELETE' });
    fetchRecipes(selectedMenu);
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
         <h1 className="text-2xl text-[#212529] font-normal tracking-tight">Gudang & Perakitan Resep</h1>
         <div className="flex items-center text-[13.5px] text-[#6c757d] gap-2 mt-2 sm:mt-0">
            <span>Beranda</span> <span className="text-gray-300">/</span> <span className="text-gray-600">Inventory ERP</span>
         </div>
      </div>

      <div className="flex overflow-hidden bg-white border border-[#dee2e6] rounded-[4px] shadow-sm w-fit mb-4">
         <button onClick={() => setTab('RAW')} className={`px-5 py-2.5 text-[14px] font-bold flex items-center gap-2 ${tab === 'RAW' ? 'bg-[#007bff] text-white' : 'text-[#495057] hover:bg-gray-50'}`}>
           <PackageOpen size={16}/> Basis Data Bahan Mentah
         </button>
         <button onClick={() => setTab('RECIPE')} className={`px-5 py-2.5 text-[14px] font-bold flex items-center gap-2 border-l border-[#dee2e6] ${tab === 'RECIPE' ? 'bg-[#28a745] text-white' : 'text-[#495057] hover:bg-gray-50'}`}>
           <LayoutList size={16}/> Resep Bill of Materials (BOM)
         </button>
      </div>

      {tab === 'RAW' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
           <div className="xl:col-span-1 bg-white rounded-[4px] border-t-[3px] border-t-[#007bff] shadow-sm h-fit">
              <div className="px-5 py-4 border-b border-[#dee2e6]">
                <h3 className="font-medium text-[#212529] m-0">Tambah Bahan Baku Baru</h3>
              </div>
              <div className="p-5">
                 <form onSubmit={handleAddRaw} className="space-y-4">
                    <div>
                      <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Nama Bahan (Contoh: Biji Kopi Gayo)</label>
                      <Input required value={formRaw.name} onChange={e=>setFormRaw({...formRaw, name: e.target.value})} className="h-[38px] rounded-[3px] text-[13px]"/>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Kode SKU</label>
                         <Input value={formRaw.sku} onChange={e=>setFormRaw({...formRaw, sku: e.target.value})} className="h-[38px] rounded-[3px] text-[13px]"/>
                       </div>
                       <div>
                         <label className="text-[13px] font-bold text-[#495057] mb-1.5 block">Satuan (Unit)</label>
                         <select required value={formRaw.unit} onChange={e=>setFormRaw({...formRaw, unit: e.target.value})} className="w-full h-[38px] rounded-[3px] border border-[#ced4da] px-3 text-[13px] bg-white">
                           <option value="">Pilih</option>
                           <option value="gram">Gram (g)</option>
                           <option value="ml">Mililiter (ml)</option>
                           <option value="pcs">Pcs / Buah</option>
                           <option value="pack">Pack / Sachet</option>
                         </select>
                       </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="mt-2 w-full h-[38px] bg-[#007bff] text-white font-medium rounded-[3px] hover:bg-[#0069d9] transition-colors text-[14px]">
                      Simpan ke Database
                    </button>
                 </form>
              </div>
           </div>

           <div className="xl:col-span-2 bg-white rounded-[4px] border-t-[3px] border-t-[#6c757d] shadow-sm overflow-hidden h-fit">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-[#f8f9fa] border-b border-[#dee2e6] text-[#495057]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Nama Bahan Baku</th>
                    <th className="px-5 py-3.5 font-bold">Kode SKU</th>
                    <th className="px-5 py-3.5 font-bold text-center">Satuan Stok</th>
                    <th className="px-5 py-3.5 font-bold text-right">Cadangan Gudang</th>
                    <th className="px-5 py-3.5 font-bold text-right">HPP Berbasis Restock</th>
                    <th className="px-5 py-3.5 text-right font-bold w-[70px]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee2e6]">
                  {materials.map(m => (
                    <tr key={m.id} className="hover:bg-[#f2f4f5] transition-colors">
                      <td className="px-5 py-3 text-[#212529] font-bold">{m.name}</td>
                      <td className="px-5 py-3 text-[#6c757d] text-xs font-mono">{m.sku || '-'}</td>
                      <td className="px-5 py-3 text-[#6c757d] text-center"><Badge variant="outline" className="text-[10px] rounded-[3px] px-1.5 py-0 uppercase">{m.unit}</Badge></td>
                      <td className="px-5 py-3 text-[#212529] text-right font-black">{m.stock} {m.unit}</td>
                      <td className="px-5 py-3 text-[#28a745] text-right font-bold">Rp {m.costPerUnit.toLocaleString('id-ID')} / {m.unit}</td>
                      <td className="px-5 py-3 text-right">
                         <button onClick={() => handleDeleteRaw(m.id)} className="text-[#dc3545] p-1.5 hover:bg-[#f8d7da] rounded"><Trash2 size={15}/></button>
                      </td>
                    </tr>
                  ))}
                  {materials.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada deklarasi bahan baku di gudang.</td></tr>}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {tab === 'RECIPE' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
           <div className="xl:col-span-1 bg-white rounded-[4px] shadow-sm border border-[#dee2e6] overflow-hidden h-[70vh] flex flex-col">
              <div className="p-4 border-b border-[#dee2e6] bg-[#f8f9fa]">
                 <h3 className="font-bold text-[#212529] m-0">Menu Katalog</h3>
                 <p className="text-[12px] text-[#6c757d]">Pilih menu untuk diedit resepnya</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                 {menus.map(menu => (
                    <button 
                      key={menu.id} 
                      onClick={() => setSelectedMenu(menu.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-[3px] text-[13px] font-bold flex justify-between items-center transition-colors ${selectedMenu === menu.id ? 'bg-[#007bff] text-white' : 'text-[#495057] hover:bg-[#e9ecef]'}`}
                    >
                      {menu.name}
                      {selectedMenu === menu.id && <ArrowRight size={14}/>}
                    </button>
                 ))}
              </div>
           </div>

           <div className="xl:col-span-3">
              {!selectedMenu ? (
                 <div className="h-full min-h-[400px] flex items-center justify-center bg-gray-50 border border-dashed border-[#dee2e6] rounded-[4px] text-gray-400 font-medium">
                    &larr; Pilih salah satu Menu di samping untuk merakit komposisi (*BOM*). 
                 </div>
              ) : (
                <div className="bg-white rounded-[4px] border-t-[3px] border-t-[#28a745] shadow-sm">
                   <div className="px-5 py-4 border-b border-[#dee2e6] flex justify-between flex-wrap items-center">
                     <div>
                       <h3 className="font-bold text-[#212529] text-[18px]">{menus.find(m => m.id === selectedMenu)?.name}</h3>
                       <p className="text-[13px] text-[#6c757d]">Struktur Komposisi Bahan Baku (BOM)</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[12px] font-bold text-[#6c757d] uppercase">Estimasi Modal HPP per Porsi</p>
                       <p className="text-[22px] font-black text-[#dc3545]">
                         Rp {recipes.reduce((acc, r) => acc + (r.quantityUsed * r.rawMaterial.costPerUnit), 0).toLocaleString('id-ID')}
                       </p>
                     </div>
                   </div>

                   <div className="p-5">
                      <form onSubmit={handleAddRecipe} className="flex flex-col sm:flex-row gap-3 mb-6 bg-[#f8f9fa] p-4 rounded-[4px] border border-[#dee2e6]">
                         <div className="flex-1">
                           <label className="text-[12px] font-bold text-[#495057] mb-1.5 block uppercase">Pemilihan Bahan Baku</label>
                           <select required value={formRecipe.rawMaterialId} onChange={e=>setFormRecipe({...formRecipe, rawMaterialId: e.target.value})} className="w-full h-[38px] rounded-[3px] border border-[#ced4da] px-3 text-[13px] bg-white">
                             <option value="">-- Cek Gudang --</option>
                             {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.stock} {m.unit})</option>)}
                           </select>
                         </div>
                         <div className="w-full sm:w-32">
                           <label className="text-[12px] font-bold text-[#495057] mb-1.5 block uppercase">Takaran / Isi</label>
                           <div className="relative">
                             <Input required type="number" step="0.01" value={formRecipe.quantityUsed} onChange={e=>setFormRecipe({...formRecipe, quantityUsed: e.target.value})} className="h-[38px] rounded-[3px] text-[13px] pr-10"/>
                             <div className="absolute top-0 right-0 h-full px-2 flex items-center bg-gray-100 border-l border-[#ced4da] text-[11px] font-bold text-gray-500 rounded-r-[3px]">
                               {formRecipe.rawMaterialId ? materials.find(x => x.id === formRecipe.rawMaterialId)?.unit : '?'}
                             </div>
                           </div>
                         </div>
                         <div className="flex items-end">
                           <button type="submit" disabled={isLoading} className="h-[38px] px-5 bg-[#28a745] text-white font-medium rounded-[3px] hover:bg-[#218838] transition-colors text-[13px] flex items-center gap-2">
                             <Plus size={16}/> Rakit Resep
                           </button>
                         </div>
                      </form>

                      <table className="w-full text-left text-[14px]">
                        <thead className="bg-white border-b-2 border-black text-[#212529]">
                          <tr>
                            <th className="px-3 py-2 font-bold uppercase text-[12px]">Komponen Material</th>
                            <th className="px-3 py-2 font-bold uppercase text-[12px] text-right">Takaran Terserap</th>
                            <th className="px-3 py-2 font-bold uppercase text-[12px] text-right">Estimasi Modal (HPP)/Porsi</th>
                            <th className="px-3 py-2 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dashed divide-[#dee2e6]">
                          {recipes.map(r => (
                            <tr key={r.id} className="hover:bg-[#f8f9fa]">
                              <td className="px-3 py-3 text-[#212529] font-bold flex items-center gap-2">
                                 <Badge variant="outline" className="text-[9px] bg-orange-100 text-orange-800 border-orange-200">{r.rawMaterial.unit}</Badge>
                                 {r.rawMaterial.name}
                              </td>
                              <td className="px-3 py-3 text-right font-black text-[#007bff]">{r.quantityUsed} {r.rawMaterial.unit}</td>
                              <td className="px-3 py-3 text-right font-medium text-[#6c757d]">Rp {(r.quantityUsed * r.rawMaterial.costPerUnit).toLocaleString('id-ID')}</td>
                              <td className="px-3 py-3 text-right">
                                 <button onClick={() => handleDeleteRecipe(r.id)} className="text-[#dc3545] p-1.5 hover:bg-[#f8d7da] rounded"><Trash2 size={15}/></button>
                              </td>
                            </tr>
                          ))}
                          {recipes.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">Resep belum diatur. Pemesanan menu ini belum memotong stok bahan baku manapun.</td></tr>}
                        </tbody>
                      </table>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
