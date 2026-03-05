import React, { useState, useMemo, useRef, useEffect } from 'react';
import { type LabeledItem, type AiResponseData, type Attribute } from './MainApplication';
import ConfirmationModal from './ConfirmationModal';

// --- ICONS ---
const ControlsIcon = ({className="w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.75h18M3 12h18M3 19.25h18M8.25 2.75v4M15.75 10v4M12 17.25v4" /></svg>;
const ChevronDownIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const EditIcon = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const TrashIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 6h18" /></svg>;


// --- TYPES ---
interface AttributesLibraryPageProps {
    labeledItems: LabeledItem[];
    onUpdateItem: (itemId: string, updatedData: AiResponseData) => void;
    addToast: (message: string, type?: 'success' | 'error') => void;
}

// --- COLOR UTILS ---
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


const EditableAttribute: React.FC<{
    attribute: Attribute;
    onUpdate: (field: 'key' | 'value', newValue: string) => void;
    onDelete: () => void;
}> = ({ attribute, onUpdate, onDelete }) => {
    const [isEditingKey, setIsEditingKey] = useState(false);
    const [isEditingValue, setIsEditingValue] = useState(false);
    const [key, setKey] = useState(attribute.key);
    const [value, setValue] = useState(attribute.value);
    const keyInputRef = useRef<HTMLInputElement>(null);
    const valueInputRef = useRef<HTMLInputElement>(null);

    const handleSave = (field: 'key' | 'value') => {
        if (field === 'key') {
            onUpdate('key', key);
            setIsEditingKey(false);
        } else {
            onUpdate('value', value);
            setIsEditingValue(false);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'key' | 'value') => {
        if (e.key === 'Enter') handleSave(field);
        if (e.key === 'Escape') {
            if (field === 'key') {
                setKey(attribute.key);
                setIsEditingKey(false);
            } else {
                setValue(attribute.value);
                setIsEditingValue(false);
            }
        }
    };

    useEffect(() => {
        if (isEditingKey) keyInputRef.current?.focus();
    }, [isEditingKey]);
    
    useEffect(() => {
        if (isEditingValue) valueInputRef.current?.focus();
    }, [isEditingValue]);


    return (
        <div className="flex items-stretch bg-[var(--background-primary)] rounded-lg border border-[var(--border-secondary)]/50 overflow-hidden">
            <div className={`w-1.5 flex-shrink-0 ${getColorForKey(attribute.key)}`}></div>
            <div className="flex-grow flex items-center gap-2 p-1.5 pl-2 min-w-0">
                <div className="flex-1 flex items-center gap-1 min-w-0">
                    {isEditingKey ? (
                        <input
                            ref={keyInputRef}
                            type="text"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            onBlur={() => handleSave('key')}
                            onKeyDown={(e) => handleKeyDown(e, 'key')}
                            className="w-full bg-transparent p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-sm font-semibold"
                        />
                    ) : (
                        <div onClick={() => setIsEditingKey(true)} className="flex items-center gap-1 p-1 cursor-pointer group w-full min-w-0">
                        <span className="text-sm font-semibold text-[var(--text-primary)] truncate" title={key}>{key}:</span>
                        <EditIcon className="w-3 h-3 text-[var(--accent-primary)]/70 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                    )}
                </div>
                <div className="flex-1 flex items-center gap-1 min-w-0">
                    {isEditingValue ? (
                        <input
                            ref={valueInputRef}
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={() => handleSave('value')}
                            onKeyDown={(e) => handleKeyDown(e, 'value')}
                            className="w-full bg-transparent p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] text-sm"
                        />
                    ) : (
                        <div onClick={() => setIsEditingValue(true)} className="flex items-center gap-1 p-1 cursor-pointer group w-full min-w-0">
                            <span className="text-sm text-[var(--text-secondary)] truncate" title={value}>{value}</span>
                            <EditIcon className="w-3 h-3 text-[var(--accent-primary)]/70 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                    )}
                </div>
                <div className="text-xs font-mono px-2 py-1 bg-[var(--accent-bg-muted)] rounded text-[var(--accent-text-primary)] font-semibold flex-shrink-0">
                    {(attribute.confidence * 100).toFixed(0)}%
                </div>
            </div>
             <button onClick={onDelete} className="p-2 ml-1 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors flex-shrink-0">
                <TrashIcon />
            </button>
        </div>
    );
};


const ProductAttributesCard: React.FC<{
    item: LabeledItem;
    onUpdateItem: (itemId: string, updatedData: AiResponseData) => void;
    onOpenConfirmModal: (config: { title: string; message: string; onConfirm: () => void; }) => void;
}> = ({ item, onUpdateItem, onOpenConfirmModal }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const attributes = item.data.attributes;
    const displayedAttributes = isExpanded ? attributes : attributes.slice(0, 5);

    const handleAttributeUpdate = (attributeId: number, field: 'key' | 'value', newValue: string) => {
        const updatedAttributes = item.data.attributes.map(attr => 
            attr.id === attributeId ? { ...attr, [field]: newValue } : attr
        );
        onUpdateItem(item.id, { ...item.data, attributes: updatedAttributes });
    };

    const handleAttributeDelete = (attributeId: number) => {
        const attrToDelete = attributes.find(a => a.id === attributeId);
        onOpenConfirmModal({
            title: 'Delete Attribute?',
            message: `Are you sure you want to delete the "${attrToDelete?.key || 'this'}" attribute? This action cannot be undone.`,
            onConfirm: () => {
                const updatedAttributes = attributes.filter(attr => attr.id !== attributeId);
                onUpdateItem(item.id, { ...item.data, attributes: updatedAttributes });
            }
        });
    };

    return (
        <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent-shadow)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={item.imageUrl} alt={item.fileName} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-[var(--background-tertiary)]"/>
                <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-md text-[var(--text-primary)] truncate">{item.data.productName}</h4>
                    <p className="text-sm text-[var(--text-muted)]">
                        {attributes.length} attribute{attributes.length !== 1 ? 's' : ''} generated
                    </p>
                </div>
            </div>
            
            <div className={`mt-4 space-y-2 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px]' : 'max-h-[205px]'}`}>
                {displayedAttributes.map(attr => (
                    <EditableAttribute 
                        key={attr.id} 
                        attribute={attr} 
                        onUpdate={(field, newValue) => handleAttributeUpdate(attr.id, field, newValue)}
                        onDelete={() => handleAttributeDelete(attr.id)}
                    />
                ))}
            </div>

            {attributes.length > 5 && (
                <div className="mt-4 pt-3 border-t border-[var(--border-primary)] flex justify-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-300 bg-[var(--accent-bg-muted)] text-[var(--accent-text-primary)] hover:bg-[var(--accent-bg-subtle)]"
                    >
                        <span>{isExpanded ? 'View Less' : `View ${attributes.length - 5} More`}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            )}
        </div>
    );
};


const AttributesLibraryPage: React.FC<AttributesLibraryPageProps> = ({ labeledItems, onUpdateItem, addToast }) => {
    const [searchQuery, setSearchQuery] = useState('');
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
            // Date filter
            const itemDateParts = item.date.split('/');
            const itemDateStr = `${itemDateParts[2]}-${itemDateParts[0].padStart(2, '0')}-${itemDateParts[1].padStart(2, '0')}`;

            if (dateFilter === 'today' && itemDateStr !== todayStr) return false;
            if (dateFilter === 'yesterday' && itemDateStr !== yesterdayStr) return false;
            if (dateFilter === 'custom' && startDate && endDate) {
                if (itemDateStr < startDate || itemDateStr > endDate) return false;
            }

            // Category filter
            if (categoryFilter !== 'all' && (item.data.category?.value || 'Uncategorized') !== categoryFilter) {
                return false;
            }

            // Search query filter
            const query = searchQuery.toLowerCase();
            if (query && !(
                item.data.productName.toLowerCase().includes(query) ||
                item.data.attributes.some(attr => 
                    attr.key.toLowerCase().includes(query) || attr.value.toLowerCase().includes(query)
                )
            )) {
                return false;
            }

            return true;
        });
    }, [labeledItems, searchQuery, categoryFilter, dateFilter, startDate, endDate]);
    
    const totalAttributes = useMemo(() => {
        return filteredItems.reduce((acc, item) => acc + item.data.attributes.length, 0);
    }, [filteredItems]);
    
    const getStatTitle = () => {
        switch(dateFilter) {
            case 'today': return "Today's Total Attributes";
            case 'yesterday': return "Yesterday's Total Attributes";
            case 'custom': return "Attributes in Custom Range";
            default: return "Total Attributes Generated";
        }
    };

    const handleUpdateAndToast = (itemId: string, updatedData: AiResponseData) => {
        onUpdateItem(itemId, updatedData);
        addToast('Attribute updated successfully.');
    };

    const openConfirmModal = (config: { title: string; message: string; onConfirm: () => void; }) => {
        setModalConfig({ ...config, isOpen: true });
    };

    return (
        <section className="space-y-6 max-w-5xl mx-auto">
             <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={() => {
                    modalConfig.onConfirm();
                    addToast('Attribute deleted successfully.');
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                }}
                title={modalConfig.title}
                message={modalConfig.message}
            />
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                <ControlsIcon className="w-6 h-6 text-[var(--accent-primary)]" /> Attributes Library
            </h2>
            <p className="text-md text-[var(--text-secondary)] max-w-3xl">
                View and manage all labeled attributes extracted from your images. Click on any attribute key or value to edit it directly.
            </p>

            <div className="bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-2xl p-4 sm:p-6 space-y-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Summary</h3>
                <div className="flex gap-4">
                    <StatCard icon={<ControlsIcon className="w-5 h-5"/>} title={getStatTitle()} value={totalAttributes.toLocaleString()} />
                </div>
            </div>

            <div className="bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-2xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <input
                        type="search"
                        placeholder="Search by product name or attribute..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-auto flex-grow bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors"
                    />
                     <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full md:w-auto bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-3 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors"
                    >
                        <option value="all">All Categories</option>
                        {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full md:w-auto bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-3 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
                 {dateFilter === 'custom' && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 animate-fade-in-up" style={{animationDuration: '0.3s'}}>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full sm:w-auto bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2 px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors" />
                        <span className="text-[var(--text-muted)]">to</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full sm:w-auto bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2 px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors" />
                    </div>
                )}
            </div>
            
            {filteredItems.length === 0 ? (
                 <div className="text-center py-20 px-6 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border-primary)]">
                    <p className="text-[var(--text-secondary)] text-lg">
                        {labeledItems.length > 0 ? 'No items match your search or filters.' : 'No labeled items yet.'}
                    </p>
                    <p className="text-[var(--text-muted)] text-sm mt-2">
                        {labeledItems.length > 0 ? 'Try different search terms.' : 'Process items in the AI Labelling section to see their attributes here.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredItems.map(item => (
                        <ProductAttributesCard key={item.id} item={item} onUpdateItem={handleUpdateAndToast} onOpenConfirmModal={openConfirmModal} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default AttributesLibraryPage;
