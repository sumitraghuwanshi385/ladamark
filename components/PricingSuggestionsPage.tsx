import React, { useState, useMemo, useRef, useEffect } from 'react';
import { type LabeledItem } from './MainApplication';
import { convertPrice, formatCurrency } from './currency';

// --- ICONS ---
const DownloadIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const ChevronDownIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const PercentageIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l7.5 9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 16.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
    </svg>
);
const TagIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);
const CalculatorIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);
const ArrowUpIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>;
const ArrowDownIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

interface PricingSuggestionsPageProps {
    labeledItems: LabeledItem[];
    currency: string;
}

// --- SUB-COMPONENTS ---
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; }> = ({ icon, title, value }) => (
    <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)]/50 rounded-xl p-4 flex-grow">
        <div className="flex items-center gap-3 mb-2">
            <div className="text-[var(--accent-primary)]">{icon}</div>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{title}</p>
        </div>
        <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
);

const ToolOutput: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-[var(--text-secondary)]">{label}</span>
    <span className="font-bold text-[var(--text-primary)]">{value}</span>
  </div>
);

const ProductPriceCard: React.FC<{
    item: LabeledItem;
    isOpen: boolean;
    onToggle: () => void;
    currency: string;
}> = ({ item, isOpen, onToggle, currency }) => {
    
    const [cost, setCost] = useState('');
    const [discount, setDiscount] = useState('');

    const costValue = parseFloat(cost) || 0;
    const discountValue = parseFloat(discount) || 0;

    const convertedMin = useMemo(() => convertPrice(item.data.priceRange.min, item.data.priceRange.currency, currency), [item.data.priceRange, currency]);
    const convertedMax = useMemo(() => convertPrice(item.data.priceRange.max, item.data.priceRange.currency, currency), [item.data.priceRange, currency]);

    // Profit Margin Calculations
    const minProfit = convertedMin - costValue;
    const maxProfit = convertedMax - costValue;
    const minMargin = convertedMin > 0 ? (minProfit / convertedMin) * 100 : 0;
    const maxMargin = convertedMax > 0 ? (maxProfit / convertedMax) * 100 : 0;

    // Sale Planner Calculations
    const minSalePrice = convertedMin * (1 - discountValue / 100);
    const maxSalePrice = convertedMax * (1 - discountValue / 100);
    const minSaved = convertedMin - minSalePrice;
    const maxSaved = convertedMax - maxSalePrice;

    const textInputClass = "w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-2 px-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

    return (
        <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden transition-all duration-300">
            {/* Header / Summary View */}
            <div className="p-4">
                <div className="flex items-start gap-4 w-full">
                    <img src={item.imageUrl} alt={item.fileName} className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-[var(--background-tertiary)]"/>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-md text-[var(--text-primary)] w-full break-words whitespace-normal leading-snug">
  {item.data.productName}
</h4>
                        <p className="text-sm text-[var(--text-secondary)] break-words">Estimated Price: {formatCurrency(convertedMin, currency)} - {formatCurrency(convertedMax, currency)}</p>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border-primary)] flex justify-end">
                    <button
                        onClick={onToggle}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-300 bg-[var(--accent-bg-muted)] text-[var(--accent-text-primary)] hover:bg-[var(--accent-bg-subtle)]"
                    >
                        <span>{isOpen ? 'Hide Details' : 'View More'}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Collapsible Content */}
            {isOpen && (
                <div className="px-6 pb-6 border-t border-[var(--border-primary)] space-y-6 animate-fade-in-up" style={{animationDuration: '0.3s'}}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Estimated Price */}
                        <div className="bg-[var(--background-primary)] border border-[var(--border-secondary)]/50 rounded-xl p-4 flex flex-col">
                            <div className="flex items-center gap-3 mb-3 text-[var(--text-secondary)]">
                                <CalculatorIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                                <h5 className="font-semibold">Estimated Price</h5>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mb-3 flex-grow">This is the price range from the initial AI labeling pass.</p>
                             <div className="flex items-center bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] divide-x divide-[var(--border-secondary)]">
                                <span className="px-4 text-[var(--text-secondary)] text-sm font-medium">{currency}</span>
                                <div className="flex-1 flex items-center">
                                    <span className="text-[var(--text-muted)] text-sm font-medium px-3">MIN</span>
                                    <input type="number" readOnly value={convertedMin.toFixed(2)} className="w-full bg-transparent py-2.5 text-center font-bold text-lg focus:outline-none cursor-not-allowed" />
                                </div>
                                <div className="flex-1 flex items-center">
                                     <span className="text-[var(--text-muted)] text-sm font-medium px-3">MAX</span>
                                    <input type="number" readOnly value={convertedMax.toFixed(2)} className="w-full bg-transparent py-2.5 text-center font-bold text-lg focus:outline-none cursor-not-allowed" />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Lab */}
                        <div className="bg-[var(--background-primary)] border border-[var(--border-secondary)]/50 rounded-xl p-4 flex flex-col">
                             <div className="flex items-center gap-3 mb-3 text-[var(--text-secondary)]">
                                <CalculatorIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                                <h5 className="font-semibold">Pricing Lab</h5>
                            </div>
                            <div className="flex-grow space-y-4">
                                {/* Profit Margin Calculator */}
                                <div>
                                    <h6 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                        <PercentageIcon className="w-4 h-4 text-[var(--text-secondary)]"/>
                                        Profit Margin Calculator
                                    </h6>
                                    <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder={`Cost of Goods (${currency})`} className={textInputClass} />
                                    {cost && (
                                        <div className="mt-2 space-y-1 bg-[var(--background-tertiary)]/70 p-2 rounded-md border border-[var(--accent-primary)]/20">
                                            <ToolOutput label="Potential Profit" value={`${formatCurrency(minProfit, currency)} - ${formatCurrency(maxProfit, currency)}`} />
                                            <ToolOutput label="Profit Margin" value={`${minMargin.toFixed(1)}% - ${maxMargin.toFixed(1)}%`} />
                                        </div>
                                    )}
                                </div>
                                {/* Sale Planner */}
                                <div className="pt-3 border-t border-[var(--border-secondary)]/50">
                                     <h6 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                        <TagIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                                        Sale Planner
                                    </h6>
                                    <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount %" className={textInputClass} />
                                    {discount && (
                                        <div className="mt-2 space-y-1 bg-[var(--background-tertiary)]/70 p-2 rounded-md border border-[var(--accent-primary)]/20">
                                            <ToolOutput label="Sale Price Range" value={`${formatCurrency(minSalePrice, currency)} - ${formatCurrency(maxSalePrice, currency)}`} />
                                            <ToolOutput label="Amount Saved" value={`${formatCurrency(minSaved, currency)} - ${formatCurrency(maxSaved, currency)}`} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const PricingSuggestionsPage: React.FC<PricingSuggestionsPageProps> = ({ labeledItems, currency }) => {
    const [openItemId, setOpenItemId] = useState<string | null>(null);
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
            if (query && !item.data.productName.toLowerCase().includes(query)) {
                return false;
            }

            return true;
        });
    }, [labeledItems, categoryFilter, searchQuery, dateFilter, startDate, endDate]);

    const { highestPrice, lowestPrice } = useMemo(() => {
        if (filteredItems.length === 0) {
            return { highestPrice: 0, lowestPrice: 0 };
        }
        const prices = filteredItems.flatMap(item => {
            const min = convertPrice(item.data.priceRange.min, item.data.priceRange.currency, currency);
            const max = convertPrice(item.data.priceRange.max, item.data.priceRange.currency, currency);
            return [min, max];
        });
        return {
            highestPrice: Math.max(...prices),
            lowestPrice: Math.min(...prices.filter(p => p > 0)),
        };
    }, [filteredItems, currency]);


    const handleToggle = (itemId: string) => {
        setOpenItemId(prevId => (prevId === itemId ? null : itemId));
    };
    
    const handleExport = () => {
        const headers = ['productName', 'initialMinPrice', 'initialMaxPrice', 'currency'];
        const rows = filteredItems.map(item => [
            `"${item.data.productName.replace(/"/g, '""')}"`,
            item.data.priceRange.min,
            item.data.priceRange.max,
            currency
        ].join(','));
        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pricing_lab_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <section className="space-y-6 w-full px-2 sm:px-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                    <CalculatorIcon className="w-6 h-6 text-[var(--accent-primary)]"/>
                    Pricing Library
                </h2>
                <button onClick={handleExport} disabled={filteredItems.length === 0} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:bg-gray-500 disabled:cursor-not-allowed">
                    <DownloadIcon/>
                    Export Price Data
                </button>
            </div>
            <p className="text-md text-[var(--text-secondary)]">
                Use these practical tools to model profitability and plan sales based on your AI-suggested price estimates.
            </p>
            
            <div className="bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-2xl p-4 sm:p-6 space-y-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard icon={<ArrowUpIcon />} title="Highest Suggested Price" value={formatCurrency(highestPrice, currency)} />
                    <StatCard icon={<ArrowDownIcon />} title="Lowest Suggested Price" value={formatCurrency(lowestPrice, currency)} />
                </div>
            </div>

            <div className="bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-2xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-auto flex-grow group">
  <input
    type="search"
    placeholder="Search by product name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2.5 pl-4 pr-10 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors"
  />

  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
    <svg className="w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    className="w-full flex items-center justify-between bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-3 text-sm text-[var(--text-primary)]"
  >
    <span>{categoryFilter === 'all' ? 'All Categories' : categoryFilter}</span>
    <ChevronDownIcon className={`w-4 h-4 ${openCategory ? 'rotate-180' : ''}`} />
  </button>

  {openCategory && (
    <div className="absolute mt-2 w-full bg-[var(--background-secondary)] border rounded-xl shadow-xl z-50">
      <div onClick={() => { setCategoryFilter('all'); setOpenCategory(false); }} className="px-3 py-2 cursor-pointer hover:bg-[var(--background-hover)]">
        All Categories
      </div>

      {allCategories.map(cat => (
        <div key={cat} onClick={() => { setCategoryFilter(cat); setOpenCategory(false); }} className="px-3 py-2 cursor-pointer hover:bg-[var(--background-hover)] flex justify-between">
          <span>{cat}</span>
          {categoryFilter === cat && <span>✓</span>}
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
    className="w-full flex items-center justify-between bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-3 text-sm text-[var(--text-primary)]"
  >
    <span>{dateFilter === 'all' ? 'All Time' : dateFilter}</span>
    <ChevronDownIcon className={`w-4 h-4 ${openDate ? 'rotate-180' : ''}`} />
  </button>

  {openDate && (
    <div className="absolute mt-2 w-full bg-[var(--background-secondary)] border rounded-xl shadow-xl z-50">
      {['all','today','yesterday','custom'].map(option => (
        <div key={option} onClick={() => { setDateFilter(option); setOpenDate(false); }} className="px-3 py-2 cursor-pointer hover:bg-[var(--background-hover)] flex justify-between">
          <span>{option === 'all' ? 'All Time' : option}</span>
          {dateFilter === option && <span>✓</span>}
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
                    <p className="text-[var(--text-muted)] text-sm mt-2">Process items in the AI Labelling section to use the Pricing Lab tools here.</p>
                </div>
            ) : filteredItems.length === 0 ? (
                 <div className="text-center py-20 px-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border-primary)]">
                    <p className="text-[var(--text-secondary)] text-lg">No items match your search or filters.</p>
                    <p className="text-[var(--text-muted)] text-sm mt-2">Try a different search query or category filter.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredItems.map(item => (
                        <ProductPriceCard
                            key={item.id}
                            item={item}
                            isOpen={openItemId === item.id}
                            onToggle={() => handleToggle(item.id)}
                            currency={currency}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PricingSuggestionsPage;
