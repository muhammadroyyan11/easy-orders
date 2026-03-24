export default function CartLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-36 animate-in fade-in duration-300 relative z-50">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 lg:px-8 py-5 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse shrink-0" />
        <div className="h-6 w-48 bg-gray-200 rounded-md animate-pulse" />
      </div>

      <div className="p-4 lg:p-8 space-y-6 max-w-3xl mx-auto w-full">
        {/* Rincian Pesanan Skeleton */}
        <section className="bg-white rounded-[20px] p-5 lg:p-6 shadow-sm border border-gray-100">
           <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-5" />
           <div className="space-y-4">
             {[1, 2].map(i => (
               <div key={i} className="flex gap-4">
                 <div className="w-[65px] h-[65px] bg-gray-200 rounded-xl animate-pulse shrink-0" />
                 <div className="flex-1 flex flex-col justify-between py-1">
                   <div className="flex justify-between">
                     <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                     <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                   </div>
                   <div className="flex justify-between items-center mt-auto">
                     <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                     <div className="h-7 w-7 bg-gray-200 rounded-full animate-pulse" />
                   </div>
                 </div>
               </div>
             ))}
           </div>
           
           {/* Total Calculations Block Skeleton */}
           <div className="mt-6 pt-5 border-t border-dashed border-gray-200 space-y-3">
              <div className="flex justify-between"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"/><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"/></div>
              <div className="flex justify-between"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"/><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"/></div>
              <div className="flex justify-between pt-3"><div className="h-5 w-32 bg-gray-200 rounded animate-pulse"/><div className="h-6 w-24 bg-gray-200 rounded animate-pulse"/></div>
           </div>
        </section>

        {/* Data Pelanggan Form Skeleton */}
        <section className="bg-white rounded-[20px] p-5 lg:p-6 shadow-sm border border-gray-100">
           <div className="h-5 w-36 bg-gray-200 rounded-md animate-pulse mb-5" />
           <div className="space-y-5">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2.5 animate-pulse" />
                <div className="h-[50px] w-full bg-gray-200 rounded-xl animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2.5 animate-pulse" />
                <div className="h-[50px] w-full bg-gray-200 rounded-xl animate-pulse" />
              </div>
           </div>
        </section>
      </div>

      {/* Floating Action Checkout Button Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:p-6 border-t border-gray-100 bg-white/95 flex justify-center pb-8 sm:pb-6">
         <div className="w-full max-w-2xl h-[54px] lg:h-[60px] bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
