import React, { useState, useMemo, useEffect, useRef } from 'react';
import { type LabeledItem, type AiResponseData } from './MainApplication';
import ConfirmationModal from './ConfirmationModal';

const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const SeoTagIcon = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);
const XIcon = ({className = "w-3 h-3"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const DownloadIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

const attributeColors = ['bg-green-400', 'bg-pink-400', 'bg-blue-400', 'bg-purple-400', 'bg-indigo-400', 'bg-cyan-400', 'bg-rose-400', 'bg-teal-400'];
const getColorForKey = (key: string) => {
    if (!key) return 'bg-zinc-500';
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = key.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }
    const index = Math.abs(hash % attributeColors.length);
    return attributeColors[index];
};

const seoColorMap: { [key: string]: string } = {
    'bg-green-400': 'bg-green-900/50 text-green-300 border-green-500/30 hover:bg-green-900',
    'bg-pink-400': 'bg-pink-900/50 text-pink-300 border-pink-500/30 hover:bg-pink-900',
    'bg-blue-400': 'bg-blue-900/50 text-blue-300 border-blue-500/30 hover:bg-blue-900',
    'bg-purple-400': 'bg-purple-900/50 text-purple-300 border-purple-500/30 hover:bg-purple-900',
    'bg-indigo-400': 'bg-indigo-900/50 text-indigo-300 border-indigo-500/30 hover:bg-indigo-900',
    'bg-cyan-400': 'bg-cyan-900/50 text-cyan-300 border-cyan-500/30 hover:bg-cyan-900',
    'bg-rose-400': 'bg-rose-900/50 text-rose-300 border-rose-500/30 hover:bg-rose-900',
    'bg-teal-400': 'bg-teal-900/50 text-teal-300 border-teal-500/30 hover:bg-teal-900',
};
const getSeoColorClasses = (key: string) => {
    const baseColor = getColorForKey(key);
    return seoColorMap[baseColor] || 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700';
};


const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; }> = ({ icon, title, value }) => (
    <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)]/50 rounded-xl p-4 flex-grow">
        <div className="flex items-center gap-3 mb-2">
            <div className="text-[var(--accent-primary)]">{icon}</div>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{title}</p>
        </div>
        <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
);


const ProductSeoCard: React.FC<{
    item: LabeledItem;
    onAddTag: (itemId: string, tag: string) => void;
    onRemoveTagClick: (itemId: string, tag: string) => void;
}> = ({ item, onAddTag, onRemoveTagClick }) => {
    
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = e.currentTarget.value.trim();
            if (newTag && !item.data.seoKeywords.includes(newTag)) {
                onAddTag(item.id, newTag);
                e.currentTarget.value = '';
            }
        }
    };

    return (
        <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-4 flex flex-col sm:flex-row items-start gap-4 w-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-shadow)]">
            <img src={item.imageUrl} alt={item.fileName} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-[var(--background-tertiary)]"/>
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-md text-[var(--text-primary)] w-full break-words whitespace-normal leading-snug" title={item.data.productName}>{item.data.productName}</h4>
                <p className="text-sm text-[var(--text-muted)] mt-1">
    {(item.data.seoKeywords || []).length} SEO tag{(item.data.seoKeywords || []).length !== 1 ? 's' : ''} generated
</p>
                <div className="flex flex-wrap items-start gap-2 mt-2 w-full">
                    {(item.data.seoKeywords || []).map(kw => (
                         <div key={kw} className={`inline-flex items-center gap-1.5 text-xs font-medium pl-2.5 pr-1 py-1 rounded-full border transition-colors max-w-full break-words ${getSeoColorClasses(kw)}`}>
                            <span className="truncate" title={kw}>{kw}</span>
                            <button onClick={() => onRemoveTagClick(item.id, kw)} className="p-0.5 rounded-full text-[var(--text-muted)] hover:bg-red-500/20 hover:text-red-300 transition-colors flex-shrink-0"><XIcon /></button>
                        </div>
                    ))}
                     <input 
                        type="text" 
                        onKeyDown={handleAddTag}
                        placeholder="+ Add tag" 
                        className="bg-transparent focus:outline-none text-xs text-[var(--text-muted)] placeholder:text-[var(--accent-primary)]/70 p-1 focus:ring-1 focus:ring-[var(--accent-primary)] rounded-sm min-w-[80px] flex-grow"
                    />
                </div>
            </div>
        </div>
    );
};


const SeoTagsPage: React.FC<{ 
    labeledItems: LabeledItem[];
    onUpdateItem: (itemId: string, updatedData: AiResponseData) => void;
    addToast: (message: string, type?: 'success' | 'error') => void;
}> = ({ labeledItems, onUpdateItem, addToast }) => {
    const [searchQuery, setSearchQuery] = useState('');
const [openCategory, setOpenCategory] = useState(false);
const [openDate, setOpenDate] = useState(false);

const categoryRef = useRef<HTMLDivElement>(null);
const dateRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
      setOpenCategory(false);
    }
    if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
      setOpenDate(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const allCategories = useMemo(() => Array.from(new Set(labeledItems.map(item => item.data.category?.value || 'Uncategorized'))).sort(), [labeledItems]);

    const filteredItems = useMemo(() => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        return labeledItems.filter(item => {
            const itemDateParts = item.date.split('/');
            const itemDateStr = `${itemDateParts[2]}-${itemDateParts[0].padStart(2, '0')}-${itemDateParts[1].padStart(2, '0')}`;

            if (dateFilter === 'today' && itemDateStr !== todayStr) return false;
            if (dateFilter === 'yesterday' && itemDateStr !== yesterdayStr) return false;
            if (dateFilter === 'custom' && startDate && endDate) {
                if (itemDateStr < startDate || itemDateStr > endDate) return false;
            }

            if (categoryFilter !== 'all' && (item.data.category?.value || 'Uncategorized') !== categoryFilter) {
                return false;
            }
            
            const query = searchQuery.toLowerCase();
            if (query && !(
                item.data.productName.toLowerCase().includes(query) ||
                (item.data.seoKeywords || []).some(kw => kw.toLowerCase().includes(query))
            )) {
                return false;
            }

            return true;
        });
    }, [labeledItems, categoryFilter, searchQuery, dateFilter, startDate, endDate]);

    const totalSeoTags = useMemo(() => {
        return filteredItems.reduce((acc, item) => acc + (item.data.seoKeywords || []).length, 0);

    }, [filteredItems]);
    
    const getStatTitle = () => {
        switch(dateFilter) {
            case 'today': return "Today's Total SEO Tags";
            case 'yesterday': return "Yesterday's Total SEO Tags";
            case 'custom': return "Tags in Custom Range";
            default: return "Total SEO Tags Generated";
        }
    };

    const handleAddTag = (itemId: string, tag: string) => {
        const itemToUpdate = labeledItems.find(item => item.id === itemId);
        if (itemToUpdate) {
            const updatedData = {
                ...itemToUpdate.data,
                seoKeywords: [...itemToUpdate.data.seoKeywords, tag]
            };
            onUpdateItem(itemId, updatedData);
            addToast('SEO tag added.', 'success');
        }
    };

    const handleRemoveTag = (itemId: string, tag: string) => {
        const itemToUpdate = labeledItems.find(item => item.id === itemId);
        if (itemToUpdate) {
             const updatedData = {
                ...itemToUpdate.data,
                seoKeywords: itemToUpdate.data.seoKeywords.filter(k => k !== tag)
            };
            onUpdateItem(itemId, updatedData);
            addToast('SEO tag removed.', 'success');
        }
    };

    const handleRemoveTagClick = (itemId: string, tag: string) => {
        setModalConfig({
            isOpen: true,
            title: 'Remove SEO Tag?',
            message: `Are you sure you want to remove the tag "${tag}"?`,
            onConfirm: () => {
                handleRemoveTag(itemId, tag);
                setModalConfig({ ...modalConfig, isOpen: false });
            },
        });
    };

    const handleExport = () => {
        let csvContent = "data:text/csv;charset=utf-8,Product Name,SEO Keywords\n";
        filteredItems.forEach(item => {
            const keywords = `"${(item.data.seoKeywords || []).join(', ')}"`;
            const productName = `"${item.data.productName.replace(/"/g, '""')}"`;
            csvContent += `${productName},${keywords}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "seo_tags_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="space-y-6 w-full px-2 sm:px-4 md:px-6">
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                    <SeoTagIcon className="w-6 h-6 text-[var(--accent-primary)]" />
                    SEO Library
                </h2>
                 <button onClick={handleExport} disabled={filteredItems.length === 0} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:bg-gray-500 disabled:cursor-not-allowed">
                    <DownloadIcon/>
                    Export SEO Data
                </button>
            </div>
             <p className="text-md text-[var(--text-secondary)]">
                Review and manage AI-suggested SEO tags for your products to improve discoverability on marketplaces and search engines.
            </p>

            <div className="bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-2xl p-4 sm:p-6 space-y-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Summary</h3>
                <div className="flex gap-4">
                    <StatCard icon={<SeoTagIcon className="w-5 h-5"/>} title={getStatTitle()} value={totalSeoTags.toLocaleString()} />
                </div>
            </div>
            
            <div className="bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-2xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-auto flex-grow group">
  <input
    type="search"
    placeholder="Search by product name or tag..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2.5 pl-4 pr-10 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors"
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
                    <div ref={categoryRef} className="relative w-full md:w-56">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setOpenCategory(prev => !prev);
    }}
    className="w-full flex items-center justify-between bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-3 text-sm text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition"
  >
    <span>{categoryFilter === 'all' ? 'All Categories' : categoryFilter}</span>
    <ChevronDownIcon className={`w-4 h-4 transition ${openCategory ? 'rotate-180' : ''}`} />
  </button>

  {openCategory && (
    <div className="absolute mt-2 w-full bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
      
      <div
        onClick={() => {
          setCategoryFilter('all');
          setOpenCategory(false);
        }}
        className="px-3 py-2 text-sm cursor-pointer hover:bg-[var(--background-hover)]"
      >
        All Categories
      </div>

      {allCategories.map(cat => (
        <div
          key={cat}
          onClick={() => {
            setCategoryFilter(cat);
            setOpenCategory(false);
          }}
          className="px-3 py-2 text-sm cursor-pointer hover:bg-[var(--background-hover)]"
        >
          <div className="flex justify-between">
            <span>{cat}</span>
            {categoryFilter === cat && <span>✓</span>}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
                    <div ref={dateRef} className="relative w-full md:w-56">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setOpenDate(prev => !prev);
    }}
    className="w-full flex items-center justify-between bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-3 text-sm text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition"
  >
    <span className="capitalize">
      {dateFilter === 'all' ? 'All Time' : dateFilter}
    </span>
    <ChevronDownIcon className={`w-4 h-4 transition ${openDate ? 'rotate-180' : ''}`} />
  </button>

  {openDate && (
    <div className="absolute mt-2 w-full bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
      
      {['all', 'today', 'yesterday', 'custom'].map(option => (
        <div
          key={option}
          onClick={() => {
            setDateFilter(option);
            setOpenDate(false);
          }}
          className="px-3 py-2 text-sm cursor-pointer hover:bg-[var(--background-hover)] capitalize"
        >
          <div className="flex justify-between">
            <span>{option === 'all' ? 'All Time' : option}</span>
            {dateFilter === option && <span>✓</span>}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
                </div>
                 {dateFilter === 'custom' && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 animate-fade-in-up" style={{animationDuration: '0.3s'}}>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full sm:w-auto bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2 px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors" />
                        <span className="text-[var(--text-muted)]">to</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full sm:w-auto bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2 px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors" />
                    </div>
                )}
            </div>

            {labeledItems.length === 0 ? (
                 <div className="text-center py-20 px-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border-primary)]">
                    <p className="text-[var(--text-secondary)] text-lg">No labeled items found.</p>
                    <p className="text-[var(--text-muted)] text-sm mt-2">Process items in the AI Labelling section to manage their SEO tags here.</p>
                </div>
            ) : filteredItems.length === 0 ? (
                 <div className="text-center py-20 px-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border-primary)]">
                    <p className="text-[var(--text-secondary)] text-lg">No items match your search or filters.</p>
                    <p className="text-[var(--text-muted)] text-sm mt-2">Try adjusting your search query or category filter.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredItems.map(item => (
                        <ProductSeoCard key={item.id} item={item} onAddTag={handleAddTag} onRemoveTagClick={handleRemoveTagClick} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default SeoTagsPage;
