import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { auth } from '../firebase';
import { type AISpeedMode, type LabeledItem, type AiResponseData, type Attribute, type ToastMessage } from './MainApplication';
import { type Plan, QUEUE_LIMITS } from './plans';
import ConfirmationModal from './ConfirmationModal';
import { convertPrice } from './currency';

// --- ICONS ---
const CheckCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 6h18" />
  </svg>
);
const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ReanalyzeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4" />
    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
  </svg>
);
const InfoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const AILabellingIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10l3-3 3 3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l3 3 3-3" />
  </svg>
);
const PlusCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ExportIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const SaveIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);
const DollarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// --- TYPES & STATUS ---
type AnalysisStatus = { status: 'loading' | 'success' | 'error'; error?: string; };
type FileAnalysis = { file: File; status: AnalysisStatus; result?: AiResponseData };

// --- COLOR UTILS & SHARED STYLES ---
const attributeColors = ['#4ade80', '#fb7185', '#60a5fa', '#a78bfa', '#818cf8', '#22d3ee', '#f43f5e', '#2dd4bf'];
const getColorForKey = (key: string): string => {
  if (!key) return '#71717a';
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const index = Math.abs(hash % attributeColors.length);
  return attributeColors[index];
};

const seoColorMap: { [key: string]: string } = {
  '#4ade80': 'bg-green-900/50 text-green-300 border-green-500/30 hover:bg-green-900',
  '#fb7185': 'bg-pink-900/50 text-pink-300 border-pink-500/30 hover:bg-pink-900',
  '#60a5fa': 'bg-blue-900/50 text-blue-300 border-blue-500/30 hover:bg-blue-900',
  '#a78bfa': 'bg-purple-900/50 text-purple-300 border-purple-500/30 hover:bg-purple-900',
  '#818cf8': 'bg-indigo-900/50 text-indigo-300 border-indigo-500/30 hover:bg-indigo-900',
  '#22d3ee': 'bg-cyan-900/50 text-cyan-300 border-cyan-500/30 hover:bg-cyan-900',
  '#f43f5e': 'bg-rose-900/50 text-rose-300 border-rose-500/30 hover:bg-rose-900',
  '#2dd4bf': 'bg-teal-900/50 text-teal-300 border-teal-500/30 hover:bg-teal-900',
};
const getSeoColorClasses = (key: string) => {
  const baseColor = getColorForKey(key);
  return seoColorMap[baseColor] || 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700';
};

// --- HELPER & CHILD COMPONENTS ---
export const Toast: React.FC<{ toast: ToastMessage; onClose: (id: number) => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const baseClasses = "flex items-center justify-between p-4 rounded-lg text-white shadow-lg backdrop-blur-sm animate-fade-in-up";
  const typeClasses = toast.type === 'success'
    ? 'bg-green-600/90 border-green-500'
    : 'bg-red-600/90 border-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span className="font-medium text-sm">{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="ml-4 p-1 rounded-full hover:bg-black/20 transition-colors">
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const Tooltip: React.FC<{ content: React.ReactNode; children: React.ReactNode }> = ({ content, children }) => (
  <div className="relative group flex items-center">
    {children}
    <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] text-[var(--text-primary)] text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
      {content}
    </div>
  </div>
);

const DuplicateBanner: React.FC<{ count: number; onRemove: () => void; onProceed: () => void; }> = ({ count, onRemove, onProceed }) => {
  if (count === 0) return null;
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-3">
        <span className="text-yellow-400">⚠️</span>
        <div>
          <h4 className="font-bold text-yellow-300">{count} Duplicate Image{count > 1 ? 's' : ''} Found</h4>
          <p className="text-sm text-yellow-400/80">Some uploaded images may already be labeled.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={onProceed} className="px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-300 bg-gray-600 text-white hover:bg-gray-500">
          Proceed with All
        </button>
        <button onClick={onRemove} className="px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-300 bg-red-600 text-white hover:bg-red-500">
          Remove All Duplicates
        </button>
      </div>
    </div>
  );
};

const EditableAttributeRow: React.FC<{
  attribute: Attribute;
  onUpdate: (updatedAttr: Attribute) => void;
  onDelete: () => void;
  showConfidenceScore: boolean;
}> = ({ attribute, onUpdate, onDelete, showConfidenceScore }) => {
  const [key, setKey] = useState(attribute.key);
  const [value, setValue] = useState(attribute.value);

  const handleBlur = (field: 'key' | 'value') => {
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();
    if (field === 'key' && trimmedKey === '') {
      setKey(attribute.key);
      return;
    }
    if (field === 'value' && trimmedValue === '') {
      setValue(attribute.value);
      return;
    }
    onUpdate({ ...attribute, key: trimmedKey, value: trimmedValue });
  };

  return (
    <div className="flex items-center gap-2 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg text-sm transition-all duration-300 focus-within:border-[var(--accent-primary)] focus-within:shadow-md">
      <div style={{ backgroundColor: getColorForKey(key) }} className="w-1.5 h-10 flex-shrink-0 rounded-l-md"></div>
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onBlur={() => handleBlur('key')}
        className="flex-1 bg-transparent p-2 font-semibold text-[var(--text-primary)] focus:outline-none min-w-0"
        placeholder="Attribute Key"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => handleBlur('value')}
        className="flex-[2] bg-transparent p-2 text-[var(--text-secondary)] focus:outline-none min-w-0"
        placeholder="Attribute Value"
      />
      {showConfidenceScore && (
        <span className="text-xs font-mono px-3 py-1 bg-[var(--accent-bg-muted)] rounded-md text-[var(--accent-text-primary)] font-semibold mx-1">
          {(attribute.confidence * 100).toFixed(0)}%
        </span>
      )}
      <button onClick={onDelete} className="p-2 mr-1 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
        <TrashIcon />
      </button>
    </div>
  );
};

const AnalysisResultCard: React.FC<{
  result: AiResponseData;
  onResultChange: (newResult: AiResponseData) => void;
  onConfirm: () => void;
  onReanalyze: () => void;
  showConfidenceScore: boolean;
  onOpenDeleteModal: (config: { title: string, message: string, onConfirm: () => void }) => void;
  currency: string;
}> = ({ result, onResultChange, onConfirm, onReanalyze, showConfidenceScore, onOpenDeleteModal, currency }) => {

  const convertedMin = useMemo(() => convertPrice(result.priceRange.min, 'USD', currency), [result.priceRange.min, currency]);
  const convertedMax = useMemo(() => convertPrice(result.priceRange.max, 'USD', currency), [result.priceRange.max, currency]);

  const [minPrice, setMinPrice] = useState(convertedMin.toFixed(2));
  const [maxPrice, setMaxPrice] = useState(convertedMax.toFixed(2));

  useEffect(() => {
    setMinPrice(convertedMin.toFixed(2));
    setMaxPrice(convertedMax.toFixed(2));
  }, [convertedMin, convertedMax]);

  const handleFieldChange = (field: keyof AiResponseData, value: any) => {
    onResultChange({ ...result, [field]: value });
  };

  const handleAttributeUpdate = (updatedAttr: Attribute) => {
    const newAttributes = result.attributes.map(attr => attr.id === updatedAttr.id ? updatedAttr : attr);
    handleFieldChange('attributes', newAttributes);
  };

  const handleAddAttribute = () => {
    const newAttribute: Attribute = { id: Date.now(), key: '', value: '', confidence: 1.0 };
    handleFieldChange('attributes', [...result.attributes, newAttribute]);
  };

  const handleDeleteAttribute = (id: number) => {
    const attrToDelete = result.attributes.find(a => a.id === id);
    onOpenDeleteModal({
      title: 'Delete Attribute?',
      message: `Are you sure you want to delete the "${attrToDelete?.key || 'this'}" attribute?`,
      onConfirm: () => handleFieldChange('attributes', result.attributes.filter(attr => attr.id !== id)),
    });
  };

  const handlePriceBlur = (field: 'min' | 'max') => {
    const valueInUserCurrency = parseFloat(field === 'min' ? minPrice : maxPrice) || 0;
    const valueInUSD = convertPrice(valueInUserCurrency, currency, 'USD');

    onResultChange({
      ...result,
      priceRange: {
        ...result.priceRange,
        [field]: valueInUSD,
        currency: 'USD'
      },
    });
  };

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    if (field === 'min') setMinPrice(value);
    else setMaxPrice(value);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !result.seoKeywords.includes(newTag)) {
        onResultChange({ ...result, seoKeywords: [...result.seoKeywords, newTag] });
        e.currentTarget.value = '';
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onResultChange({ ...result, seoKeywords: result.seoKeywords.filter(k => k !== tagToRemove) });
  };

  const inputClass = "w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-4 text-[var(--text-primary)] font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition";

  return (
    <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-4 sm:p-6 space-y-6 animate-fade-in-up">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1.5 block">Product Name</label>
          <input value={result.productName} onChange={e => handleFieldChange('productName', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1.5 block">Description</label>
          <textarea value={result.description} onChange={e => handleFieldChange('description', e.target.value)} rows={3} className={`${inputClass} font-normal text-sm`} />
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1.5 block">Category</label>
          <div className="flex items-center gap-2">
            <input value={result.category.value} onChange={e => handleFieldChange('category', { ...result.category, value: e.target.value })} className={inputClass} />
            {showConfidenceScore && (
              <span className="text-xs font-mono px-3 py-1.5 bg-[var(--accent-bg-muted)] rounded-lg text-[var(--accent-text-primary)] font-semibold">
                {(result.category.confidence * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-[var(--text-primary)] mb-2">
            <DollarIcon className="w-5 h-5 text-[var(--accent-primary)]" />
            SUGGESTED PRICE
          </label>
          <div className="flex items-stretch bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg overflow-hidden has-[:focus-within]:ring-1 has-[:focus-within]:ring-[var(--accent-primary)] has-[:focus-within]:border-[var(--accent-primary)] transition-all">
            <div className="flex items-center px-4 bg-[var(--background-hover)] border-r border-[var(--border-secondary)]">
              <span className="font-semibold text-sm text-[var(--text-secondary)]">{currency}</span>
            </div>
            <div className="flex-1 flex items-center justify-between px-4">
              <span className="text-sm font-medium text-[var(--text-muted)]">MIN</span>
              <input
                type="number"
                value={minPrice}
                onChange={e => handlePriceChange('min', e.target.value)}
                onBlur={() => handlePriceBlur('min')}
                className="w-24 bg-transparent p-2 text-lg font-bold text-right text-[var(--text-primary)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
            </div>
            <div className="flex-1 flex items-center justify-between border-l border-[var(--border-secondary)] px-4">
              <span className="text-sm font-medium text-[var(--text-muted)]">MAX</span>
              <input
                type="number"
                value={maxPrice}
                onChange={e => handlePriceChange('max', e.target.value)}
                onBlur={() => handlePriceBlur('max')}
                className="w-24 bg-transparent p-2 text-lg font-bold text-right text-[var(--text-primary)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--text-primary)]">Attributes</h3>
          <button onClick={handleAddAttribute} className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors">
            <PlusCircleIcon /> Add Attribute
          </button>
        </div>
        <div className="space-y-2">
          {result.attributes.map(attr => (
            <EditableAttributeRow
              key={attr.id}
              attribute={attr}
              onUpdate={handleAttributeUpdate}
              onDelete={() => handleDeleteAttribute(attr.id)}
              showConfidenceScore={showConfidenceScore}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--text-primary)] mb-2">SEO Keywords</h3>
        <div className="p-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg flex flex-wrap gap-2">
          {result.seoKeywords.map(kw => (
            <div key={kw} className={`inline-flex items-center gap-1.5 text-xs font-medium pl-2.5 pr-1 py-1 rounded-full border transition-colors max-w-full ${getSeoColorClasses(kw)}`}>
              <span className="truncate" title={kw}>{kw}</span>
              <button onClick={() => handleRemoveTag(kw)} className="p-0.5 rounded-full text-white/70 hover:bg-red-500/50 hover:text-white transition-colors flex-shrink-0">
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
          <input
            type="text"
            onKeyDown={handleAddTag}
            placeholder="+ Add tag & press Enter"
            className="bg-transparent focus:outline-none text-xs text-[var(--text-muted)] placeholder:text-[var(--accent-primary)]/70 p-1 focus:ring-1 focus:ring-[var(--accent-primary)] rounded-sm min-w-[120px] flex-grow"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-[var(--border-primary)]">
        <button onClick={onReanalyze} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-hover)]">
          <ReanalyzeIcon className="w-5 h-5" /> Re-analyze
        </button>
        <button onClick={onConfirm} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-base font-bold rounded-lg transition-colors bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]">
          <CheckCircleIcon /> Confirm & Save
        </button>
      </div>
    </div>
  );
};

const AnalysisSkeletonLoader: React.FC = () => (
  <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-4 sm:p-6 space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-4 bg-[var(--background-tertiary)] rounded w-1/4"></div>
      <div className="h-10 bg-[var(--background-tertiary)] rounded w-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-[var(--background-tertiary)] rounded w-1/4"></div>
      <div className="h-20 bg-[var(--background-tertiary)] rounded w-full"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-[var(--background-tertiary)] rounded w-1/3 mb-2"></div>
      <div className="h-12 bg-[var(--background-tertiary)] rounded w-full"></div>
      <div className="h-12 bg-[var(--background-tertiary)] rounded w-full"></div>
      <div className="h-12 bg-[var(--background-tertiary)] rounded w-full"></div>
    </div>
    <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-primary)]">
      <div className="h-12 bg-[var(--background-tertiary)] rounded w-32"></div>
      <div className="h-12 bg-[var(--background-tertiary)] rounded w-40"></div>
    </div>
  </div>
);

const FileCard: React.FC<{
  analysis: FileAnalysis;
  onRemove: () => void;
  onConfirmLabeling: (file: File, data: AiResponseData) => Promise<void>;
  onReanalyze: () => void;
  onUpdateResult: (newResult: AiResponseData) => void;
  duplicateItem?: LabeledItem;
  showConfidenceScore: boolean;
  onOpenDeleteModal: (config: { title: string, message: string, onConfirm: () => void }) => void;
  currency: string;
}> = React.memo(({ analysis, onRemove, onConfirmLabeling, onReanalyze, onUpdateResult, duplicateItem, showConfidenceScore, onOpenDeleteModal, currency }) => {
  const { file, status, result } = analysis;
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(imageUrl), [imageUrl]);

  return (
    <div className="bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-2xl p-4 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3 flex-shrink-0">
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[var(--background-tertiary)] sticky top-24 relative">
          <img src={imageUrl} alt={file.name} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {duplicateItem && (
              <Tooltip content="This image seems to be a duplicate.">
                <span className="text-yellow-400 bg-yellow-900/50 rounded-full p-1.5">
                  <InfoIcon className="w-5 h-5" />
                </span>
              </Tooltip>
            )}
            <button onClick={onRemove} className="p-2 bg-red-600/80 text-white rounded-full transition-colors hover:bg-red-500 backdrop-blur-sm">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="mt-3 text-sm text-[var(--text-muted)] text-center truncate" title={file.name}>{file.name}</div>
      </div>

      <div className="w-full lg:w-2/3">
        {status.status === 'loading' && <AnalysisSkeletonLoader />}
        {status.status === 'error' && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-red-400">
            <p>Error: {status.error}</p>
            <button onClick={onReanalyze} className="px-4 py-2 bg-red-500/20 rounded-md">Try Again</button>
          </div>
        )}
        {status.status === 'success' && result && (
          <AnalysisResultCard
            result={result}
            onResultChange={onUpdateResult}
            onConfirm={() => onConfirmLabeling(file, result)}
            onReanalyze={onReanalyze}
            showConfidenceScore={showConfidenceScore}
            onOpenDeleteModal={onOpenDeleteModal}
            currency={currency}
          />
        )}
      </div>
    </div>
  );
});

const FileDropzone: React.FC<{ onFileSelect: (files: FileList | null) => void, plan: Plan, availableQuota: number }> = ({ onFileSelect, plan, availableQuota }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const handleClick = () => fileInputRef.current?.click();
  const uploadLimit = QUEUE_LIMITS[plan];

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`cursor-pointer p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-colors duration-300 ${isDragging ? 'border-[var(--accent-primary)] bg-[var(--accent-bg-muted)]' : 'border-[var(--border-secondary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-bg-muted)]'}`}
    >
      <input ref={fileInputRef} type="file" multiple accept="image/png, image/jpeg, image/webp" onChange={(e) => onFileSelect(e.target.files)} className="hidden" />
      <AILabellingIcon className="w-12 h-12 text-[var(--accent-primary)] mb-4" />
      <p className="font-bold text-lg text-[var(--text-primary)]">Drag & drop images here</p>
      <p className="text-sm text-[var(--text-secondary)] mt-1">or click to browse. Up to {uploadLimit} images at a time.</p>
      <p className="text-xs text-[var(--text-muted)] mt-2 bg-[var(--background-tertiary)] px-3 py-1 rounded-full border border-[var(--border-primary)]">
        You are on the <span className="font-bold text-[var(--text-primary)] capitalize">{plan}</span> plan.
        You can process <span className="font-bold text-[var(--text-primary)]">{availableQuota}</span> more images today.
      </p>
    </div>
  );
};

const AIToolkit: React.FC<{
  queueStatus: { total: number; analyzed: number; errors: number };
  onSaveAll: () => void;
  onReanalyzeAll: () => void;
  onExportAll: () => void;
  onCancelAll: () => void;
  isProcessing: boolean;
}> = ({ queueStatus, onSaveAll, onReanalyzeAll, onExportAll, onCancelAll, isProcessing }) => {
  const { total, analyzed, errors } = queueStatus;
  const isComplete = total > 0 && (analyzed + errors) === total;

  const processingStyles = isProcessing ? 'opacity-50 shadow-lg' : '';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        <div>
          <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">Queue Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-secondary)]">Total Items</span>
              <span className="font-semibold text-[var(--text-primary)]">{total}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-secondary)]">Analyzed</span>
              <span className="font-semibold text-green-400">{analyzed}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-secondary)]">Remaining</span>
              <span className="font-semibold text-yellow-400">{total - analyzed - errors}</span>
            </div>
          </div>
          <div className="w-full bg-[var(--background-tertiary)] rounded-full h-2.5 mt-4">
            <div className="bg-[var(--accent-primary)] h-2.5 rounded-full" style={{ width: total > 0 ? `${(analyzed / total) * 100}%` : '0%' }}></div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">Bulk Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onSaveAll}
              disabled={!isComplete || analyzed === 0}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-colors bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:bg-gray-500 disabled:cursor-not-allowed ${processingStyles}`}
            >
              <SaveIcon /> Save All ({analyzed})
            </button>
            <button
              onClick={onReanalyzeAll}
              disabled={isProcessing || total === 0}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors bg-[var(--background-hover)] text-[var(--text-primary)] hover:bg-[var(--border-secondary)] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed ${processingStyles}`}
            >
              <ReanalyzeIcon /> Re-analyze All
            </button>
            <button
              onClick={onExportAll}
              disabled={!isComplete || analyzed === 0}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors bg-[var(--background-hover)] text-[var(--text-primary)] hover:bg-[var(--border-secondary)] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed ${processingStyles}`}
            >
              <ExportIcon /> Export All ({analyzed})
            </button>
            <button
              onClick={onCancelAll}
              disabled={total === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-red-600/10 text-red-500 hover:bg-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon /> Cancel & Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
interface AILabellingPageProps {
  pendingFiles: File[];
  onFileSelect: (files: FileList | null) => void;
  onRemovePendingFile: (file: File) => void;
  onConfirmLabeling: (file: File, data: AiResponseData) => Promise<void>;
  onCancelAll: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  duplicates: Map<string, LabeledItem>;
  onRemoveAllDuplicates: () => void;
  onProceedWithAll: () => void;
  aiSpeedMode: AISpeedMode;
  showConfidenceScore: boolean;
  plan: Plan;
  availableQuota: number;
  currency: string;
}

const AILabellingPage: React.FC<AILabellingPageProps> = ({
  pendingFiles, onFileSelect, onRemovePendingFile, onConfirmLabeling, onCancelAll, showToast,
  duplicates, onRemoveAllDuplicates, onProceedWithAll,
  aiSpeedMode, showConfidenceScore, plan, availableQuota, currency
}) => {

  const [analyses, setAnalyses] = useState<Map<string, FileAnalysis>>(new Map());
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

  const openDeleteModal = useCallback((config: { title: string, message: string, onConfirm: () => void }) => {
    setModalConfig({ ...config, isOpen: true });
  }, []);

  const closeDeleteModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // ✅ BACKEND-BASED analysis (Gemini is called on server)
  const analyzeImage = useCallback(async (file: File, isReanalysis = false) => {
    const fileId = file.name + file.lastModified;
    setAnalyses(prev => new Map(prev).set(fileId, { file, status: { status: 'loading' } }));

    const duplicateItem = duplicates.get(fileId);
    if (duplicateItem && !isReanalysis) {
      setTimeout(() => {
        setAnalyses(prev => new Map(prev).set(fileId, { file, status: { status: 'success' }, result: duplicateItem.data }));
        showToast(`Loaded existing data for ${file.name}`, 'success');
      }, 500);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in to analyze images.");

      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append("image", file);
      formData.append("speedMode", aiSpeedMode); // "normal" | "fast"

      const resp = await fetch(`${BACKEND_URL}/api/label`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const json = await resp.json();

      if (!resp.ok || !json?.ok) {
        throw new Error(json?.error || "Labeling failed");
      }

      const data: AiResponseData = json.data;

      if (data.priceRange) data.priceRange.currency = 'USD';
      data.attributes = (data.attributes || []).map((attr, index) => ({ ...attr, id: Date.now() + index }));

      setAnalyses(prev => new Map(prev).set(fileId, { file, status: { status: 'success' }, result: data }));
    } catch (err: any) {
      console.error("AI Analysis Error:", err);
      const errorMessage = err?.message || "An unknown error occurred.";
      setAnalyses(prev => new Map(prev).set(fileId, { file, status: { status: 'error', error: errorMessage } }));
      showToast(`Analysis failed for ${file.name}.`, 'error');
    }
  }, [aiSpeedMode, showToast, duplicates]);

  useEffect(() => {
    const currentAnalysisIds = new Set(analyses.keys());
    const pendingFileIds = new Set(pendingFiles.map(file => file.name + file.lastModified));

    pendingFiles.forEach(file => {
      const fileId = file.name + file.lastModified;
      if (!currentAnalysisIds.has(fileId)) {
        analyzeImage(file);
      }
    });

    const idsToRemove = Array.from(currentAnalysisIds).filter(id => !pendingFileIds.has(id));

    if (idsToRemove.length > 0) {
      setAnalyses(prevAnalyses => {
        const newAnalyses = new Map(prevAnalyses);
        idsToRemove.forEach(id => newAnalyses.delete(id));
        return newAnalyses;
      });
    }
  }, [pendingFiles, analyzeImage, analyses]);

  const handleReanalyze = (file: File) => analyzeImage(file, true);

  const handleUpdateResult = (file: File, newResult: AiResponseData) => {
    const fileId = file.name + file.lastModified;
    setAnalyses(prev => new Map(prev).set(fileId, { file, status: { status: 'success' }, result: newResult }));
  };

  const handleRemoveFileClick = (file: File) => {
    openDeleteModal({
      title: 'Remove Image?',
      message: `Are you sure you want to remove "${file.name}" from the queue? Analysis will be stopped.`,
      onConfirm: () => onRemovePendingFile(file),
    });
  };

  const handleCancelAllClick = () => {
    if (analyses.size === 0) return;
    openDeleteModal({
      title: 'Clear Queue?',
      message: `Are you sure you want to remove all ${analyses.size} items from the queue? This cannot be undone.`,
      onConfirm: () => {
        onCancelAll();
        setAnalyses(new Map());
      },
    });
  };

  const handleSaveAll = async () => {
    const promises: Promise<void>[] = [];
    analyses.forEach((analysis) => {
      if (analysis.status.status === 'success' && analysis.result) {
        promises.push(onConfirmLabeling(analysis.file, analysis.result));
      }
    });
    await Promise.all(promises);
    showToast(`Saved ${promises.length} items to your catalog.`, 'success');
    setAnalyses(new Map());
  };

  const handleReanalyzeAll = () => {
    analyses.forEach(analysis => analyzeImage(analysis.file, true));
    showToast('Re-analyzing all items in the queue.', 'success');
  };

  const handleExportAll = () => {
    const itemsToExport: LabeledItem[] = [];
    analyses.forEach(analysis => {
      if (analysis.status.status === 'success' && analysis.result) {
        itemsToExport.push({
          id: crypto.randomUUID(),
          fileName: analysis.file.name,
          imageUrl: '',
          imageHash: '',
          data: analysis.result,
          date: new Date().toISOString()
        });
      }
    });

    if (itemsToExport.length === 0) {
      showToast('No successfully analyzed items to export.', 'error');
      return;
    }

    const headers = ['productName', 'description', 'category', 'price_min', 'price_max', 'attributes', 'seo_keywords'];
    const rows = itemsToExport.map(item => [
      `"${item.data.productName.replace(/"/g, '""')}"`,
      `"${item.data.description.replace(/"/g, '""')}"`,
      item.data.category.value,
      item.data.priceRange.min,
      item.data.priceRange.max,
      `"${item.data.attributes.map(a => `${a.key}:${a.value}`).join(';')}"`,
      `"${item.data.seoKeywords.join(',')}"`
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ladamark_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const queueStatus = useMemo(() => {
    let analyzed = 0;
    let errors = 0;
    analyses.forEach(a => {
      if (a.status.status === 'success') analyzed++;
      else if (a.status.status === 'error') errors++;
    });
    return { total: analyses.size, analyzed, errors };
  }, [analyses]);

  const isProcessing = useMemo(() => {
    const { total, analyzed, errors } = queueStatus;
    return total > 0 && (analyzed + errors) < total;
  }, [queueStatus]);

  return (
    <section>
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => {
          modalConfig.onConfirm();
          closeDeleteModal();
        }}
        title={modalConfig.title}
        message={modalConfig.message}
      />

      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <AILabellingIcon className="w-6 h-6 text-[var(--accent-primary)]" />
          AI Labelling Queue
        </h2>
      </div>

      <DuplicateBanner count={duplicates.size} onRemove={onRemoveAllDuplicates} onProceed={onProceedWithAll} />

      <div className="mt-6 space-y-8">
        <FileDropzone onFileSelect={onFileSelect} plan={plan} availableQuota={availableQuota} />

        {analyses.size > 0 && (
          <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-5">
            <AIToolkit
              queueStatus={queueStatus}
              onSaveAll={handleSaveAll}
              onReanalyzeAll={handleReanalyzeAll}
              onExportAll={handleExportAll}
              onCancelAll={handleCancelAllClick}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {analyses.size > 0 && (
          <div className="space-y-6">
            {Array.from(analyses.values()).map(analysis => (
              <FileCard
                key={analysis.file.name + analysis.file.lastModified}
                analysis={analysis}
                onRemove={() => handleRemoveFileClick(analysis.file)}
                onConfirmLabeling={onConfirmLabeling}
                onReanalyze={() => handleReanalyze(analysis.file)}
                onUpdateResult={(newResult) => handleUpdateResult(analysis.file, newResult)}
                duplicateItem={duplicates.get(analysis.file.name + analysis.file.lastModified)}
                showConfidenceScore={showConfidenceScore}
                onOpenDeleteModal={openDeleteModal}
                currency={currency}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AILabellingPage;