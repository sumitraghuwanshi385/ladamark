import React, { useState, useMemo, useEffect, useRef } from 'react';
import { type LabeledItem } from './MainApplication';
import ConfirmationModal from './ConfirmationModal';

// --- ICONS --
const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const HistoryIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 8l0 4l2 2" />
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
    </svg>
);
const TrashIcon: React.FC<{className?: string}> = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const ReanalyzeIcon: React.FC<{className?: string}> = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/></svg>;
const TagIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>;
const TopCategoryIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const CalendarIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;


// --- TYPES & UTILS ---
type StatusType = 'Labeled' | 'Needs Review' | 'Incomplete';
interface HistoryPageProps {
    labeledItems: LabeledItem[];
    onDeleteItems: (ids: string[]) => void;
    onReanalyzeItem: (id: string) => void;
}

const getAvgConfidence = (item: LabeledItem): number => {
    if (!item.data.attributes || item.data.attributes.length === 0) return 0;
    const total = item.data.attributes.reduce((acc, attr) => acc + attr.confidence, 0);
    return total / item.data.attributes.length;
};

const getStatus = (item: LabeledItem): { type: StatusType, color: string } => {
    const avgConfidence = getAvgConfidence(item);
    if (avgConfidence >= 0.9) return { type: 'Labeled', color: 'bg-green-500/20 text-green-300' };
    if (avgConfidence >= 0.7) return { type: 'Needs Review', color: 'bg-yellow-500/20 text-yellow-300' };
    return { type: 'Incomplete', color: 'bg-red-500/20 text-red-300' };
};

// --- SUB-COMPONENTS ---
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; description?: string; }> = ({ icon, title, value, description }) => (
    <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)]/50 rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg hover:border-[var(--border-primary)] hover:-translate-y-0.5">
        <div className="flex items-center gap-3">
            <div className="text-[var(--accent-primary)]">{icon}</div>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{title}</p>
        </div>
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        {description && <p className="text-xs text-[var(--text-muted)]">{description}</p>}
    </div>
);


const HistoryTableRow: React.FC<{ item: LabeledItem, onDelete: () => void, onReanalyze: (id: string) => void }> = ({ item, onDelete, onReanalyze }) => {
    const status = getStatus(item);
    return (
        <tr className="border-b border-[var(--border-primary)] hover:bg-[var(--background-secondary)] transition-colors">
            <td className="p-4">
                <div className="group relative w-12 h-12 flex-shrink-0">
                    <img src={item.imageUrl} alt={item.fileName} className="w-12 h-12 object-cover rounded-md bg-[var(--background-tertiary)]"/>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none rounded-md">
                        <img src={item.imageUrl} alt={item.fileName} className="w-32 h-32 object-contain transform scale-50 group-hover:scale-100 transition-transform duration-300"/>
                    </div>
                </div>
            </td>
            <td className="p-4 font-medium text-[var(--text-primary)] max-w-xs truncate" title={item.data.productName}>
                <a href="#" className="hover:underline hover:text-[var(--accent-primary)]">{item.data.productName}</a>
            </td>
            <td className="p-4 text-[var(--text-secondary)]">{item.date}</td>
            <td className="p-4">
                <span className={`px-2 py-1 text-xs font-bold rounded-md capitalize ${status.color}`}>{status.type}</span>
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    <button title="Re-analyze" onClick={() => onReanalyze(item.id)} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--accent-bg-muted)] hover:text-[var(--accent-text-primary)] transition-colors"><ReanalyzeIcon /></button>
                    <button title="Delete" onClick={onDelete} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-red-600/10 hover:text-red-500 transition-colors"><TrashIcon /></button>
                </div>
            </td>
        </tr>
    );
};


// --- MAIN PAGE COMPONENT ---
const HistoryPage: React.FC<HistoryPageProps> = ({ labeledItems, onDeleteItems, onReanalyzeItem }) => {
    const [searchQuery, setSearchQuery] = useState('');
const [openStatus, setOpenStatus] = useState(false);
const [openDate, setOpenDate] = useState(false);

const statusRef = useRef<HTMLDivElement>(null);
const dateRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
      setOpenStatus(false);
    }
    if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
      setOpenDate(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

    const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; onConfirm?: () => void; }>({ isOpen: false });

    const filteredItems = useMemo(() => {
        return labeledItems.filter(item => {
            // Status filter
            if (statusFilter !== 'all' && getStatus(item).type !== statusFilter) return false;
            
            // Date filter
            if (dateFilter !== 'all') {
                const itemDateParts = item.date.split('/');
                if (itemDateParts.length !== 3) return false;
                const itemDateStr = `${itemDateParts[2]}-${itemDateParts[0].padStart(2, '0')}-${itemDateParts[1].padStart(2, '0')}`;
                
                const now = new Date();
                const todayStr = now.toISOString().split('T')[0];

                if (dateFilter === 'today') {
                    if (itemDateStr !== todayStr) return false;
                } else if (dateFilter === 'yesterday') {
                    const yesterday = new Date();
                    yesterday.setDate(now.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];
                    if (itemDateStr !== yesterdayStr) return false;
                } else if (dateFilter === '7d') {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(now.getDate() - 6);
                    if (itemDateStr < sevenDaysAgo.toISOString().split('T')[0]) return false;
                } else if (dateFilter === '30d') {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(now.getDate() - 29);
                    if (itemDateStr < thirtyDaysAgo.toISOString().split('T')[0]) return false;
                } else if (dateFilter === 'custom' && startDate && endDate) {
                    if (itemDateStr < startDate || itemDateStr > endDate) return false;
                }
            }
            
            // Search query filter
            const query = searchQuery.toLowerCase();
            if (query) {
                const nameMatch = item.data.productName.toLowerCase().includes(query);
                const tagMatch = item.data.attributes.some(attr => `${attr.key} ${attr.value}`.toLowerCase().includes(query));
                if (!nameMatch && !tagMatch) return false;
            }
            
            return true;
        });
    }, [labeledItems, searchQuery, statusFilter, dateFilter, startDate, endDate]);

    const stats = useMemo(() => {
        const tagCounts = filteredItems
            .flatMap(item => item.data.attributes.map(attr => attr.value))
            .reduce((acc, tag) => {
                acc[tag] = (acc[tag] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const topTag = Object.keys(tagCounts).length > 0
            ? Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'N/A';
        
        const categoryCounts = filteredItems.reduce((acc, item) => {
            const category = item.data.category?.value || 'Uncategorized';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const mostUsedCategory = Object.keys(categoryCounts).length > 0
            ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'N/A';

        return { topTag, mostUsedCategory };
    }, [filteredItems]);


    const handleDelete = (itemId: string) => {
        setModalConfig({
            isOpen: true,
            onConfirm: () => {
                onDeleteItems([itemId]);
                setModalConfig({ isOpen: false });
            },
        });
    };

    const filterDescription = useMemo(() => {
        const count = filteredItems.length;
        if (dateFilter === 'yesterday') {
            return `${count} label${count !== 1 ? 's' : ''} generated yesterday.`;
        }
        if (dateFilter === 'custom' && startDate && endDate) {
            return `${count} label${count !== 1 ? 's' : ''} generated from ${startDate} to ${endDate}.`;
        }
        return null;
    }, [filteredItems.length, dateFilter, startDate, endDate]);

    const getStatTitle = () => {
        switch(dateFilter) {
            case 'today': return "Labeled Today";
            case 'yesterday': return "Labeled Yesterday";
            case '7d': return "Labeled Last 7 Days";
            case '30d': return "Labeled Last 30 Days";
            case 'custom': return "Labels in Range";
            default: return "Total Labeled";
        }
    };
    
    const FilterSelect: React.FC<{value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode}> = ({ value, onChange, children }) => (
        <select value={value} onChange={onChange} className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-md py-2 px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]">
            {children}
        </select>
    );

    return (
        <section className="space-y-4">
             <ConfirmationModal
                isOpen={modalConfig.isOpen ?? false}
                onClose={() => setModalConfig({ isOpen: false })}
                onConfirm={modalConfig.onConfirm ?? (() => {})}
                title="Delete this item?"
                message="This will permanently delete the labeled item from your history. This action cannot be undone."
            />
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                <HistoryIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                Label Activity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard 
                    icon={<CalendarIcon />}
                    title={getStatTitle()}
                    value={filteredItems.length}
                />
                <StatCard 
                    icon={<TagIcon />}
                    title="Top Tag"
                    value={stats.topTag}
                    description="Most frequent tag in selection"
                />
                 <StatCard 
                    icon={<TopCategoryIcon />}
                    title="Most Used Category"
                    value={stats.mostUsedCategory}
                    description="Most frequent category in selection"
                />
            </div>
            
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">

{/* SEARCH */}
<div className="relative flex-grow group">
  <input
    type="text"
    placeholder="Search by product name or tag..."
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
    className="w-full bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-md py-2 pl-4 pr-10 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
  />

  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
    <svg
      className="w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  </div>
</div>

{/* DROPDOWNS */}
<div className="flex items-center gap-2 w-full sm:w-auto">

{/* STATUS */}
<div ref={statusRef} className="relative w-full sm:w-48">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setOpenStatus(prev => !prev);
    }}
    className="w-full flex items-center justify-between bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-sm text-[var(--text-primary)]"
  >
    <span>{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
    <ChevronDownIcon className={`w-4 h-4 transition ${openStatus ? 'rotate-180' : ''}`} />
  </button>

  {openStatus && (
    <div className="absolute mt-2 w-full bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl shadow-xl z-50">
      {['all','Labeled','Needs Review','Incomplete'].map(opt => (
        <div
          key={opt}
          onClick={() => {
            setStatusFilter(opt as any);
            setOpenStatus(false);
          }}
          className="px-3 py-2 text-sm cursor-pointer hover:bg-[var(--background-hover)]"
        >
          <div className="flex justify-between">
            <span>{opt === 'all' ? 'All Status' : opt}</span>
            {statusFilter === opt && <span>✓</span>}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

{/* DATE */}
<div ref={dateRef} className="relative w-full sm:w-48">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setOpenDate(prev => !prev);
    }}
    className="w-full flex items-center justify-between bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-sm text-[var(--text-primary)]"
  >
    <span>{dateFilter === 'all' ? 'All Time' : dateFilter}</span>
    <ChevronDownIcon className={`w-4 h-4 transition ${openDate ? 'rotate-180' : ''}`} />
  </button>

  {openDate && (
    <div className="absolute mt-2 w-full bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl shadow-xl z-50">
      {['all','today','yesterday','7d','30d','custom'].map(opt => (
        <div
          key={opt}
          onClick={() => {
            setDateFilter(opt);
            setOpenDate(false);
          }}
          className="px-3 py-2 text-sm cursor-pointer hover:bg-[var(--background-hover)] capitalize"
        >
          <div className="flex justify-between">
            <span>
              {opt === 'all' ? 'All Time' :
               opt === '7d' ? 'Last 7 Days' :
               opt === '30d' ? 'Last 30 Days' : opt}
            </span>
            {dateFilter === opt && <span>✓</span>}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

</div>
</div>
                {dateFilter === 'custom' && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 animate-fade-in-up" style={{animationDuration: '0.3s'}}>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full sm:w-auto bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-lg py-2 px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors" />
                        <span className="text-[var(--text-muted)]">to</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full sm:w-auto bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-lg py-2 px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors" />
                    </div>
                )}
                 {filterDescription && (
                    <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
                        <p className="text-sm text-[var(--text-secondary)] font-semibold text-center">{filterDescription}</p>
                    </div>
                )}
            </div>

            <div className="overflow-hidden border border-[var(--border-primary)] rounded-2xl bg-[var(--background-primary)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--background-secondary)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="p-4">Image Preview</th>
                                <th scope="col" className="p-4">Product Name</th>
                                <th scope="col" className="p-4">Labeled Date</th>
                                <th scope="col" className="p-4">Status</th>
                                <th scope="col" className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <HistoryTableRow key={item.id} item={item} onDelete={() => handleDelete(item.id)} onReanalyze={onReanalyzeItem} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 px-6">
                                        <p className="text-[var(--text-secondary)] text-lg">No history found.</p>
                                        <p className="text-[var(--text-muted)] text-sm mt-2">Try adjusting your filters or search query.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default HistoryPage;
