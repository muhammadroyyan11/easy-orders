import { Search, Share2, ChevronLeft } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32 animate-in fade-in duration-300">
      
      {/* Skeleton Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Skeleton Resto Banner */}
      <div className="relative w-full h-[180px] lg:h-[220px] bg-gray-200 animate-pulse"></div>

      {/* Skeleton Info Panel */}
      <div className="px-4 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex flex-col items-center">
          <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3" />
          <div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse mb-4" />
          <div className="flex gap-4">
             <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
             <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
             <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Skeleton Categories */}
      <div className="px-4 lg:px-8 mt-6">
        <div className="flex gap-3 overflow-hidden">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse shrink-0" />
           ))}
        </div>
      </div>

      {/* Skeleton Menu Items (Grid layout matching desktop rules) */}
      <div className="px-4 lg:px-8 mt-6 flex-1">
        <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
               <div className="w-[100px] h-[100px] bg-gray-200 rounded-xl animate-pulse shrink-0" />
               <div className="flex-1 flex flex-col justify-between py-1">
                 <div>
                   <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-2" />
                   <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse mb-1" />
                   <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                 </div>
                 <div className="flex justify-between items-center mt-3">
                   <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                   <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
