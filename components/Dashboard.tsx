





import React, { useMemo } from 'react';
import { type LabeledItem } from './MainApplication';

// --- ICONS ---
const ImageIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;
const CheckCircleIcon = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ExclamationCircleIcon = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AlertTriangleIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.007H12v-.007z" /></svg>;
const CalculatorIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);
const CatalogSnapshotIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 18V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 18V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const SeoTagIcon = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);
const DashboardIcon = ({ className = "w-6 h-6" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;


// Redesigned simple icons
const AvgConfidenceIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const HighConfidenceIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>;
const TopCategoryIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const ControlsIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.75h18M3 12h18M3 19.25h18M8.25 2.75v4M15.75 10v4M12 17.25v4" /></svg>;


const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; colorClass: string; }> = ({ icon, title, value, colorClass }) => (
    <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--shadow-primary)] hover:-translate-y-1">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
    </div>
);

const ActivityItem: React.FC<{ item: LabeledItem; onReview: () => void }> = ({ item, onReview }) => {
    const avgConfidence = useMemo(() => {
        if (!item.data.attributes || item.data.attributes.length === 0) return 0;
        const total = item.data.attributes.reduce((acc, attr) => acc + attr.confidence, 0);
        return total / item.data.attributes.length;
    }, [item.data.attributes]);

    const status = avgConfidence >= 0.9 ? { text: 'Approved', color: 'text-green-400', icon: <CheckCircleIcon className="w-4 h-4" /> } : { text: 'Needs Review', color: 'text-yellow-400', icon: <ExclamationCircleIcon className="w-4 h-4" /> };

    return (
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--background-tertiary)] transition-colors">
            <img src={item.imageUrl} alt={item.fileName} className="w-10 h-10 object-cover rounded-md flex-shrink-0 bg-[var(--background-tertiary)]" />
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{item.data.productName}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.date}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                <span className={status.color}>{status.icon}</span>
                <span className={status.color}>{status.text}</span>
            </div>
            <div className="hidden md:block text-sm font-semibold text-[var(--text-primary)] w-20 text-center">
                {(avgConfidence * 100).toFixed(1)}%
            </div>
            <button onClick={onReview} className="text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors pr-2">
                Review
            </button>
        </div>
    );
};

type View = 'dashboard' | 'catalog' | 'ai-labelling' | 'attributes' | 'seo' | 'pricing' | 'history' | 'controls';

const InfoStat: React.FC<{ icon: React.ReactNode, label: string, value: string | number, isButton?: boolean, onClick?: () => void }> = ({ icon, label, value, isButton = false, onClick }) => {
    const content = (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
            </div>
            <span className="text-lg font-bold text-[var(--text-primary)] truncate max-w-[120px] sm:max-w-[150px]">{value}</span>
        </div>
    );

    if (isButton && onClick) {
        return (
            <button onClick={onClick} className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)]/50 rounded-xl p-3 flex items-center transition-all hover:bg-[var(--background-hover)] hover:border-[var(--border-secondary)]">
                {content}
            </button>
        );
    }
    
    return (
        <div className="bg-[var(--background-tertiary)] border border-[var(--border-secondary)]/50 rounded-xl p-3 flex items-center">
            {content}
        </div>
    );
};


const CatalogSnapshotWidget: React.FC<{ stats: ReturnType<typeof useMemoStats>; setView: (view: View) => void; onSelectCategory: (category: string) => void; }> = ({ stats, setView, onSelectCategory }) => {
    const { lowConfidenceItems, highConfidenceItems, mostCommonCategory } = stats;

    const ToolButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void; }> = ({ icon, text, onClick }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 text-left p-2.5 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--background-hover)] border border-[var(--border-secondary)] hover:border-[var(--accent-primary)]/50 transition-all duration-300 group"
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-[var(--background-primary)] text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors">
                {icon}
            </div>
            <span className="font-semibold text-sm text-[var(--text-primary)]">{text}</span>
        </button>
    );

    return (
        <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 h-full flex flex-col">
            {/* Top Section */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 text-[var(--accent-primary)]">
                    <CatalogSnapshotIcon />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    Catalog Snapshot
                </h3>
            </div>
            
            {/* Middle Section: Stats */}
            <div className="space-y-3">
                <InfoStat 
                    icon={<AlertTriangleIcon className="w-5 h-5 text-yellow-500" />} 
                    label="Low Confidence" 
                    value={lowConfidenceItems} 
                />
                <InfoStat 
                    icon={<HighConfidenceIcon className="w-5 h-5 text-green-500" />} 
                    label="High Confidence" 
                    value={highConfidenceItems}
                />
                <InfoStat 
                    icon={<TopCategoryIcon className="w-5 h-5 text-blue-400" />} 
                    label="Top Category" 
                    value={mostCommonCategory || 'N/A'} 
                    isButton={!!mostCommonCategory}
                    onClick={() => mostCommonCategory && onSelectCategory(mostCommonCategory)}
                />
            </div>
            
            <div className="flex-grow" />

            {/* Bottom Section: Tools */}
            <div className="pt-6 mt-6 border-t border-[var(--border-primary)] space-y-2">
                <ToolButton 
                    icon={<ControlsIcon className="w-5 h-5"/>} 
                    text="Attributes Library" 
                    onClick={() => setView('attributes')} 
                />
                <ToolButton 
                    icon={<SeoTagIcon className="w-5 h-5"/>} 
                    text="SEO Library" 
                    onClick={() => setView('seo')} 
                />
                 <ToolButton 
                    icon={<CalculatorIcon className="w-5 h-5"/>} 
                    text="Pricing Library" 
                    onClick={() => setView('pricing')} 
                />
            </div>
        </div>
    );
};


const useMemoStats = (labeledItems: LabeledItem[]) => {
    return useMemo(() => {
        const allAttributes = labeledItems.flatMap(i => i.data.attributes);
        const attributesGenerated = allAttributes.length;
        const seoTagsGenerated = labeledItems.flatMap(i => i.data.seoKeywords).length;
        
        const confidence = allAttributes.length > 0
            ? (allAttributes.reduce((sum, attr) => sum + attr.confidence, 0) / allAttributes.length) * 100
            : 0;
            
        const highConfidenceItems = labeledItems.filter(item => {
            if (!item.data.attributes || item.data.attributes.length === 0) return false;
            const avgConf = (item.data.attributes.reduce((sum, attr) => sum + attr.confidence, 0) / item.data.attributes.length);
            return avgConf >= 0.9;
        }).length;

        const lowConfidenceItems = labeledItems.filter(item => {
             if (!item.data.attributes || item.data.attributes.length === 0) return true;
             const avgConf = (item.data.attributes.reduce((sum, attr) => sum + attr.confidence, 0) / item.data.attributes.length);
             return avgConf < 0.9;
        }).length;
        
        const categoryCounts = labeledItems.reduce((acc, item) => {
            const category = item.data.category?.value;
            if (category) {
                acc[category] = (acc[category] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);
        
        const mostCommonCategory = Object.keys(categoryCounts).length > 0 ? 
            Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0] : null;

        return {
            totalLabelled: labeledItems.length,
            attributesGenerated,
            seoTagsGenerated,
            confidence: confidence,
            highConfidenceItems,
            lowConfidenceItems,
            mostCommonCategory,
        };
    }, [labeledItems]);
};


const Dashboard: React.FC<{
    labeledItems: LabeledItem[];
    setView: (view: View) => void;
    onSelectCategory: (category: string) => void;
}> = ({ labeledItems, setView, onSelectCategory }) => {
    
    const stats = useMemoStats(labeledItems);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                    <DashboardIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                    Dashboard
                </h1>
                <p className="text-md text-[var(--text-secondary)]">Welcome back, here's your workspace overview.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <StatCard icon={<ImageIcon />} title="Total Labelled" value={stats.totalLabelled.toString()} colorClass="bg-blue-500/20 text-blue-400" />
                <StatCard icon={<ControlsIcon className="w-6 h-6"/>} title="Attributes Generated" value={stats.attributesGenerated.toString()} colorClass="bg-pink-500/20 text-pink-400" />
                <StatCard icon={<SeoTagIcon className="w-6 h-6"/>} title="SEO Tags Generated" value={stats.seoTagsGenerated.toString()} colorClass="bg-yellow-500/20 text-yellow-400" />
                <StatCard icon={<AvgConfidenceIcon />} title="Avg. Confidence" value={`${stats.confidence.toFixed(1)}%`} colorClass="bg-green-500/20 text-green-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-4 space-y-2 flex flex-col">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] px-2">Recent Labelling</h3>
                    <div className="flex-grow divide-y divide-[var(--border-primary)]">
                         {labeledItems.length > 0 ? (
                            labeledItems.slice(0, 5).map(item => <ActivityItem key={item.id} item={item} onReview={() => setView('catalog')} />)
                         ) : (
                             <div className="text-center py-16 text-[var(--text-secondary)] flex flex-col items-center justify-center h-full">
                                <p>No Recent Labelling.</p>
                                <p className="text-sm">Upload an image to begin.</p>
                            </div>
                         )}
                    </div>
                     {labeledItems.length > 5 && <button onClick={() => setView('history')} className="w-full text-center py-2 text-sm font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-bg-muted)] rounded-lg transition-colors">View All Activity</button>}
                </div>
                
                <div className="lg:col-span-1">
                    <CatalogSnapshotWidget stats={stats} setView={setView} onSelectCategory={onSelectCategory} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;