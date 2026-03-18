Catalog page - import React, { useState, useMemo, useEffect, useRef } from 'react';
import { type LabeledItem, type AiResponseData, type Attribute } from './MainApplication';
import { type Plan } from './plans';
import ExportModal from './ExportModal';
import ConfirmationModal from './ConfirmationModal';

// --- ICONS ---
const CatalogIcon = ({className = "w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>;
const TrashIcon = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const ExportIcon = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const ReanalyzeIcon = ({className = "w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/></svg>;
const ChevronDownIcon = ({className="w-5 h-5"}) => <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>;
const PriceRangeIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const SeoTagIcon = ({className = "w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a1.8095 1.8095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>;
const ControlsIcon = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.75h18M3 12h18M3 19.25h18M8.25 2.75v4M15.75 10v4M12 17.25v4" /></svg>;
const FileTextIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const SearchIcon = ({className="w-5 h-5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

// --- TYPES & UTILS ---
interface CatalogPageProps {
labeledItems: LabeledItem[];
onDeleteItems: (ids: string[]) => void;
categoryFilter: string;
setCategoryFilter: (filter: string) => void;
plan: Plan;
}

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

// --- CHILD COMPONENTS ---
const CatalogCard: React.FC<{
item: LabeledItem;
isSelected: boolean;
onToggleSelect: (isSelected: boolean) => void;
}> = ({ item, isSelected, onToggleSelect }) => {
const [isExpanded, setIsExpanded] = useState(false);
const { productName, description, priceRange, category, attributes, seoKeywords } = item.data;

return (  
    <div className={`relative bg-[var(--background-primary)] border rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[var(--accent-shadow)]/50 hover:-translate-y-1 ${isSelected ? 'border-[var(--accent-primary)]/80' : 'border-[var(--border-primary)]'}`}>  
        <div className="absolute top-3 right-3 z-10">  
            <input   
                type="checkbox"   
                checked={isSelected}   
                onChange={(e) => onToggleSelect(e.target.checked)}   
                className="h-5 w-5 rounded-md border-2 border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-offset-0 bg-[var(--background-secondary)] cursor-pointer shadow-sm"  
            />  
        </div>  

        <div className="aspect-[4/3] w-full bg-[var(--background-tertiary)]">  
            <img src={item.imageUrl} alt={productName} className="w-full h-full object-cover" />  
        </div>  

        <div className="p-4">  
            <p className="text-sm font-semibold text-[var(--accent-text-primary)]">{category.value}</p>  
            <h3 className="text-lg font-bold text-[var(--text-primary)] truncate mt-1" title={productName}>{productName}</h3>  
            <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2 h-10">{description}</p>  
        </div>  

        {isExpanded && (  
            <div className="p-4 border-t border-[var(--border-primary)] space-y-4 animate-fade-in-up" style={{animationDuration: '0.3s'}}>  
                <div>  
                    <h4 className="text-xs font-semibold uppercase text-[var(--text-muted)] flex items-center gap-2 mb-2"><PriceRangeIcon /> Price Suggestion</h4>  
                    <p className="font-semibold text-lg text-[var(--text-primary)]">{priceRange.currency} {priceRange.min} - {priceRange.max}</p>  
                </div>  
                <div>  
                    <h4 className="text-xs font-semibold uppercase text-[var(--text-muted)] flex items-center gap-2 mb-2"><ControlsIcon /> Attributes</h4>  
                    <div className="space-y-1">  
                        {attributes.map(attr => (  
                            <div key={attr.id} className="flex items-stretch bg-[var(--background-tertiary)] rounded-md overflow-hidden border border-[var(--border-secondary)]/30">  
                                <div className={`w-1 flex-shrink-0 ${getColorForKey(attr.key)}`}></div>  
                                <div className="flex justify-between text-sm p-1.5 flex-grow min-w-0">  
                                    <span className="font-medium text-[var(--text-secondary)] pl-1 truncate" title={attr.key}>{attr.key}</span>  
                                    <span className="text-[var(--text-primary)] truncate" title={attr.value}>{attr.value}</span>  
                                </div>  
                            </div>  
                        ))}  
                    </div>  
                </div>  
                 <div>  
                    <h4 className="text-xs font-semibold uppercase text-[var(--text-muted)] flex items-center gap-2 mb-2"><SeoTagIcon /> SEO Keywords</h4>  
                    <div className="flex flex-wrap gap-2">  
                        {seoKeywords.map(kw => (  
                            <span key={kw} className={`text-xs font-medium px-2 py-1 rounded-full border transition-colors ${getSeoColorClasses(kw)}`}>{kw}</span>  
                        ))}  
                    </div>  
                </div>  
                <div>  
                    <h4 className="text-xs font-semibold uppercase text-[var(--text-muted)] flex items-center gap-2 mb-2"><FileTextIcon /> Full Description</h4>  
                    <p className="text-sm text-[var(--text-secondary)] prose dark:prose-invert max-w-none prose-sm">{description}</p>  
                </div>  
            </div>  
        )}  
          
        <div className="border-t border-[var(--border-primary)] p-2 flex justify-center">  
             <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors px-3 py-1 rounded-md hover:bg-[var(--accent-bg-muted)] w-full justify-center">  
                <span>{isExpanded ? 'Hide' : 'Show'} Details</span>  
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />  
             </button>  
        </div>  
    </div>  
);

};

const BulkActionBar: React.FC<{
selectedCount: number;
onDeselectAll: () => void;
onDelete: () => void;
onExport: () => void;
}> = ({ selectedCount, onDeselectAll, onDelete, onExport }) => (
<div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl mx-auto p-2">
<div className="bg-[var(--background-secondary)]/80 backdrop-blur-lg border border-[var(--border-primary)] rounded-xl shadow-2xl shadow-[var(--shadow-primary)] flex items-center justify-between p-2 pl-4 animate-fade-in-up" style={{animationDuration: '0.3s'}}>
<div className="flex items-center gap-4">
<span className="font-bold text-sm text-[var(--text-primary)]">{selectedCount} selected</span>
<button onClick={onDeselectAll} className="text-sm font-semibold text-[var(--accent-primary)] hover:underline">Deselect All</button>
</div>
<div className="flex items-center gap-2">
<button onClick={onExport} className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-md transition-colors bg-[var(--background-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--background-hover)]">
<ExportIcon /> Export
</button>
<button onClick={onDelete} className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors bg-red-600/10 text-red-500 hover:bg-red-600/20 font-bold">
<TrashIcon /> Delete
</button>
</div>
</div>
</div>
);

const CatalogPage: React.FC<CatalogPageProps> = ({ labeledItems, onDeleteItems, categoryFilter, setCategoryFilter, plan }) => {
const [searchQuery, setSearchQuery] = useState('');
const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
const [isExportModalOpen, setIsExportModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

const allCategories = useMemo(() => Array.from(new Set(labeledItems.map(item => item.data.category?.value || 'Uncategorized'))).sort(), [labeledItems]);  

const filteredItems = useMemo(() => {  
    return labeledItems.filter(item => {  
        const query = searchQuery.toLowerCase();  
        if (query && !(item.data.productName.toLowerCase().includes(query) || item.data.attributes.some(a => a.value.toLowerCase().includes(query)))) return false;  
          
        const itemCategory = item.data.category?.value || 'Uncategorized';  
        if (categoryFilter !== 'all' && itemCategory !== categoryFilter) return false;  
          
        return true;  
    });  
}, [labeledItems, searchQuery, categoryFilter]);  
  
const groupedItems = useMemo(() => {  
    const groups: Record<string, LabeledItem[]> = {};  
    filteredItems.forEach(item => {  
        const category = item.data.category?.value || 'Uncategorized';  
        if (!groups[category]) groups[category] = [];  
        groups[category].push(item);  
    });  
    return groups;  
}, [filteredItems]);  

const handleToggleCategorySelected = (categoryItems: LabeledItem[], isSelected: boolean) => {  
    const itemIds = categoryItems.map(i => i.id);  
    setSelectedItems(prev => {  
        const newSet = new Set(prev);  
        if (isSelected) {  
            itemIds.forEach(id => newSet.add(id));  
        } else {  
            itemIds.forEach(id => newSet.delete(id));  
        }  
        return newSet;  
    });  
};  
  
const handleToggleItemSelected = (itemId: string, isSelected: boolean) => {  
    setSelectedItems(prev => {  
        const newSet = new Set(prev);  
        if (isSelected) newSet.add(itemId);  
        else newSet.delete(itemId);  
        return newSet;  
    });  
};  

const handleBulkDelete = () => {  
    setIsDeleteModalOpen(true);  
};  

const confirmBulkDelete = () => {  
    onDeleteItems(Array.from(selectedItems));  
    setSelectedItems(new Set());  
    setIsDeleteModalOpen(false);  
};  

const handleBulkExport = () => {  
    setIsExportModalOpen(true);  
};  

const toggleCategoryCollapse = (category: string) => {  
    setCollapsedCategories(prev => {  
        const newSet = new Set(prev);  
        if (newSet.has(category)) newSet.delete(category);  
        else newSet.add(category);  
        return newSet;  
    });  
};  
  
const numSelected = selectedItems.size;  

return (  
    <section className="space-y-4">  
         <ConfirmationModal  
            isOpen={isDeleteModalOpen}  
            onClose={() => setIsDeleteModalOpen(false)}  
            onConfirm={confirmBulkDelete}  
            title={`Delete ${selectedItems.size} items?`}  
            message="This will permanently delete the selected items. This action cannot be undone."  
        />  
        {isExportModalOpen && (  
            <ExportModal  
                isOpen={isExportModalOpen}  
                onClose={() => setIsExportModalOpen(false)}  
                plan={plan}  
                itemsToExport={labeledItems.filter(item => selectedItems.has(item.id))}  
            />  
        )}  
        {numSelected > 0 && <BulkActionBar selectedCount={numSelected} onDeselectAll={() => setSelectedItems(new Set())} onDelete={handleBulkDelete} onExport={handleBulkExport} />}  

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">  
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">  
                <CatalogIcon className="w-5 h-5 text-[var(--accent-primary)]" /> Catalog <span className="text-base font-normal text-[var(--text-secondary)]">({labeledItems.length})</span>  
            </h2>  
            <div className="flex items-center gap-2">  
                 <div className="relative flex-grow sm:flex-grow-0">  
                    <input  
                        type="search"  
                        placeholder="Search catalog..."  
                        value={searchQuery}  
                        onChange={e => setSearchQuery(e.target.value)}  
                        className="w-full sm:w-64 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg py-2.5 pl-4 pr-10 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors"  
                    />  
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">  
                        <SearchIcon className="text-[var(--text-muted)] w-4 h-4" />  
                    </div>  
                </div>  
                 <select   
                    value={categoryFilter}  
                    onChange={(e) => setCategoryFilter(e.target.value)}  
                    className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg py-2.5 px-3 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors"  
                 >  
                    <option value="all">All Categories</option>  
                    {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}  
                </select>  
            </div>  
        </div>  

        {Object.keys(groupedItems).length === 0 ? (  
             <div className="text-center py-20 px-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border-primary)] flex flex-col items-center gap-4">  
                <CatalogIcon className="w-16 h-16 text-[var(--text-muted)] opacity-50"/>  
                <p className="text-[var(--text-secondary)] text-lg font-semibold">  
                    {searchQuery || categoryFilter !== 'all' ? 'No items match your filters.' : 'Your catalog is empty.'}  
                </p>  
                <p className="text-[var(--text-muted)] text-sm max-w-md">  
                    {searchQuery || categoryFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Try uploading some images in the AI Labelling section to get started.'}  
                </p>  
            </div>  
        ) : (  
            <div className="space-y-8">  
                {Object.entries(groupedItems).map(([category, items]) => {  
                    const areAllInCategorySelected = items.length > 0 && items.every(item => selectedItems.has(item.id));  
                    const isCollapsed = collapsedCategories.has(category);  
                    return (  
                        <div key={category}>  
                            <div className="flex items-center justify-between mb-4">  
                                <div className="flex items-center gap-3">  
                                    <input type="checkbox" onChange={(e) => handleToggleCategorySelected(items, e.target.checked)} checked={areAllInCategorySelected} className="h-5 w-5 rounded border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] bg-[var(--background-primary)] cursor-pointer"/>  
                                    <h3 className="font-bold text-[var(--text-primary)] text-lg capitalize">{category}</h3>  
                                    <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-bg-muted)] text-[var(--accent-text-primary)]">{items.length}</span>  
                                </div>  
                                <button onClick={() => toggleCategoryCollapse(category)} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">  
                                    <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>  
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />  
                                </button>  
                            </div>  
                            {!isCollapsed && (  
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">  
                                    {items.map(item => (  
                                        <CatalogCard  
                                            key={item.id}  
                                            item={item}  
                                            isSelected={selectedItems.has(item.id)}  
                                            onToggleSelect={(isSelected) => handleToggleItemSelected(item.id, isSelected)}  
                                        />  
                                    ))}  
                                </div>  
                            )}  
                        </div>  
                    );  
                })}  
            </div>  
        )}  
    </section>  
);

};

export default CatalogPage;