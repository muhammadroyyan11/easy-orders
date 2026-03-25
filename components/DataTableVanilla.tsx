import React from 'react';

export function DTWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full text-[#333] text-[15px] font-sans pb-4 bg-transparent">{children}</div>;
}

export function DTTop({
  itemsPerPage, setItemsPerPage,
  searchTerm, setSearchTerm,
  disabled
}: any) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-2 pb-3 mb-1 gap-4">
      <div className="flex items-center">
        <label className="text-[15px] text-[#333] font-normal cursor-pointer">
          Show{' '}
          <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))} disabled={disabled}
                  className="mx-1 border border-[#aaa] bg-white rounded-[3px] p-[2px_5px] outline-none text-[14px]">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          {' '}entries
        </label>
      </div>
      <div className="flex items-center">
        <label className="text-[15px] text-[#333] font-normal">
          Search: 
          <input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} disabled={disabled}
                 className="ml-2 border border-[#aaa] rounded-[3px] p-[4px_6px] outline-none text-[14px] font-sans bg-white focus:border-[#666]" />
        </label>
      </div>
    </div>
  );
}

export function DTBottom({
  currentPage, totalPages, totalRecords, currentRecordsCount, setCurrentPage, itemsPerPage, loading, isFiltered
}: any) {
  const start = totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const end = totalRecords > 0 ? start + currentRecordsCount - 1 : 0;

  const pages = [];
  let s = Math.max(1, currentPage - 2);
  let e = Math.min(totalPages, currentPage + 2);
  
  if (currentPage - 1 <= 2) { e = Math.min(totalPages, 5); }
  if (totalPages - currentPage <= 2) { s = Math.max(1, totalPages - 4); }
  
  for(let i = s; i <= e; i++) pages.push(i);

  const getPageBtnClass = (active: boolean, disabled: boolean) => {
    if (disabled) return "px-[1em] py-[0.5em] text-[#666] border border-transparent rounded-[2px] cursor-not-allowed select-none opacity-50";
    if (active) return "px-[1em] py-[0.5em] text-[#333] border border-[#979797] rounded-[2px] bg-gradient-to-b from-white to-[#dcdcdc] font-normal select-none relative z-10 shadow-[inner_0_0_3px_rgba(0,0,0,0.1)]";
    return "px-[1em] py-[0.5em] text-[#333] border border-transparent rounded-[2px] transition-colors cursor-pointer hover:border-[#111] hover:bg-gradient-to-b hover:from-[#585858] hover:to-[#111] hover:text-white select-none relative z-0";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-3 pt-4 border-t border-[#111] mt-0 text-[15px] text-[#333]">
       <div className="mb-2 md:mb-0 pt-[0.2em]" aria-live="polite">
          Showing {start} to {end} of {totalRecords} entries {isFiltered ? '(filtered)' : ''}
       </div>
       <div className="flex gap-[2px] pt-[0.25em]">
          <span onClick={() => !loading && currentPage > 1 && setCurrentPage(currentPage - 1)}
                className={getPageBtnClass(false, currentPage <= 1 || loading)}>Previous</span>
          
          <span className="flex">
            {s > 1 && (
              <span className="flex">
                <span onClick={() => !loading && setCurrentPage(1)} className={getPageBtnClass(false, loading)}>1</span>
                {s > 2 && <span className="px-[0.5em] py-[0.5em] text-[#333]">…</span>}
              </span>
            )}
            
            {pages.map(p => (
              <span key={p} onClick={() => !loading && setCurrentPage(p)} className={getPageBtnClass(p === currentPage, loading)}>
                {p}
              </span>
            ))}
            
            {e < totalPages && (
              <span className="flex">
                {e < totalPages - 1 && <span className="px-[0.5em] py-[0.5em] text-[#333]">…</span>}
                <span onClick={() => !loading && setCurrentPage(totalPages)} className={getPageBtnClass(false, loading)}>{totalPages}</span>
              </span>
            )}
          </span>

          <span onClick={() => !loading && currentPage < totalPages && setCurrentPage(currentPage + 1)}
                className={getPageBtnClass(false, currentPage >= totalPages || loading)}>Next</span>
       </div>
    </div>
  );
}

export function DTTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full clear-both border-collapse text-[15px] text-[#333] border-b-[1px] border-[#111] mb-[10px]">
      {children}
    </table>
  );
}

export const dtThClass = "p-[10px_18px] border-b-[1px] border-[#111] font-bold text-left cursor-pointer relative pr-[30px] select-none";
export const dtTdClass = "p-[8px_10px] border-t border-[#ddd]";
export const dtTrClass = "odd:bg-[#f9f9f9] even:bg-white hover:bg-[#f6f6f6] transition-colors";

export function DTSortArrow() {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30 text-[9px] flex flex-col leading-[0.8] scale-y-75 cursor-pointer">
      <span>▲</span>
      <span>▼</span>
    </div>
  );
}
