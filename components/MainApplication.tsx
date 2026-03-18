import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AppHeader from './AppHeader';
import Dashboard from './Dashboard';
import AILabellingPage from './AILabellingPage';
import CatalogPage from './CatalogPage';
import AttributesLibraryPage from './AttributesLibraryPage';
import SeoTagsPage from './SeoTagsPage';
import PricingSuggestionsPage from './PricingSuggestionsPage';
import SettingsPage from './SettingsPage';
import Sidebar from './Sidebar';
import HistoryPage from './HistoryPage';
import { Toast } from './AILabellingPage';
import { type InfoModalView, type UserProfile } from '../App';
import PaymentDetailsPage from './PaymentDetailsPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TermsPage from './TermsPage';
import ChangePasswordPage from './ChangePasswordPage';
import { type Plan, PLAN_LIMITS, QUEUE_LIMITS } from './plans';

import { auth, db } from '../firebase';
import {
collection,
doc,
onSnapshot,
orderBy,
query,
serverTimestamp,
updateDoc,
} from 'firebase/firestore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const formatDate = (date: Date) => {
const d = new Date(date);
const month = String(d.getMonth() + 1).padStart(2, '0');
const day = String(d.getDate()).padStart(2, '0');
const year = d.getFullYear();
return ${month}/${day}/${year};
};

export const getFileHash = async (file: File): Promise<string> => {
const buffer = await file.arrayBuffer();
const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
const hashArray = Array.from(new Uint8Array(hashBuffer));
return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const urlToFile = async (url: string, filename: string): Promise<File> => {
const resp = await fetch(url);
if (!resp.ok) throw new Error('Failed to fetch image for re-analysis.');
const blob = await resp.blob();
const type = blob.type || 'image/jpeg';
return new File([blob], filename, { type });
};

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
const [storedValue, setStoredValue] = useState<T>(() => {
try {
const item = window.localStorage.getItem(key);
return item ? JSON.parse(item) : initialValue;
} catch (error) {
console.error(error);
return initialValue;
}
});

const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
try {
setStoredValue(currentValue => {
const valueToStore = value instanceof Function ? value(currentValue) : value;
window.localStorage.setItem(key, JSON.stringify(valueToStore));
return valueToStore;
});
} catch (error) {
console.error(error);
}
};
return [storedValue, setValue];
};

export type View =
| 'dashboard'
| 'catalog'
| 'ai-labelling'
| 'attributes'
| 'seo'
| 'pricing'
| 'history'
| 'controls'
| 'payment-details'
| 'privacy-policy'
| 'terms-of-service'
| 'change-password';

export type AISpeedMode = 'normal' | 'fast';

// --- SHARED TYPES ---
export type Attribute = { id: number; key: string; value: string; confidence: number; };
export type PriceRange = { min: number; max: number; currency: string; };
export type AiResponseData = {
productName: string;
description: string;
priceRange: PriceRange;
category: { value: string, confidence: number };
attributes: Attribute[];
seoKeywords: string[];
};

export type LabeledItem = {
id: string;
fileName: string;
imageUrl: string;     // Cloudinary URL
imageHash: string;
data: AiResponseData;
date: string;
imagePublicId?: string;
};

export type ToastMessage = { id: number; message: string; type: 'success' | 'error' };

interface MainApplicationProps {
onLogout: () => void;
theme: 'light' | 'dark';
setTheme: (theme: 'light' | 'dark') => void;
onOpenInfoModal: (view: InfoModalView) => (e: React.MouseEvent) => void;
profile: UserProfile;
setProfile: (p: UserProfile) => void;
currency: string;
setCurrency: (c: string) => void;
plan: Plan;
categoryFilter: string;
setCategoryFilter: (filter: string) => void;
}

const MainApplication: React.FC<MainApplicationProps> = ({
onLogout, theme, setTheme, onOpenInfoModal, profile, setProfile, currency, setCurrency, plan,
categoryFilter, setCategoryFilter
}) => {
const [view, setView] = useState<View>('dashboard');
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [pendingFiles, setPendingFiles] = useState<File[]>([]);

const [labeledItems, setLabeledItems] = useState<LabeledItem[]>([]);
const [toasts, setToasts] = useState<ToastMessage[]>([]);
const [duplicates, setDuplicates] = useState<Map<string, LabeledItem>>(new Map());

const [aiSpeedMode, setAiSpeedMode] = useLocalStorage<AISpeedMode>('ai-speed-mode', 'normal');
const [showConfidenceScore, setShowConfidenceScore] = useLocalStorage<boolean>('show-confidence-score', true);

const [usage, setUsage] = useLocalStorage('usage-tracker', {
daily: { date: '', count: 0 },
monthly: { month: '', count: 0 }
});

const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
const newToast = { id: Date.now(), message, type };
setToasts(prev => [newToast, ...prev.slice(0, 2)]);
}, []);

const removeToast = (id: number) => {
setToasts(toasts => toasts.filter(t => t.id !== id));
};

// Load labeled items from Firestore (live)
useEffect(() => {
const user = auth.currentUser;
if (!user) return;

const q = query(  
  collection(db, 'users', user.uid, 'labeledImages'),  
  orderBy('createdAt', 'desc')  
);  

const unsub = onSnapshot(  
  q,  
  (snap) => {  
    const items: LabeledItem[] = snap.docs.map((d) => {  
      const x = d.data() as any;  
      return {  
        id: d.id,  
        fileName: x.fileName || '',  
        imageUrl: x.imageUrl || '',  
        imageHash: x.imageHash || '',  
        data: x.data,  
        date: x.date || '',  
        imagePublicId: x.imagePublicId,  
      };  
    });  
    setLabeledItems(items);  
  },  
  (err) => {  
    console.error(err);  
    addToast('Failed to load history from cloud.', 'error');  
  }  
);  

return () => unsub();

}, [addToast]);

// Sync usage from Firestore user doc
useEffect(() => {
const user = auth.currentUser;
if (!user) return;

const unsub = onSnapshot(  
  doc(db, 'users', user.uid),  
  (snap) => {  
    const data = snap.data() as any;  
    if (data?.usage?.daily && data?.usage?.monthly) {  
      setUsage({  
        daily: { date: data.usage.daily.date || '', count: Number(data.usage.daily.count || 0) },  
        monthly: { month: data.usage.monthly.month || '', count: Number(data.usage.monthly.count || 0) },  
      });  
    }  
  },  
  (err) => console.error('Usage sync error:', err)  
);  

return () => unsub();

}, [setUsage]);

const getAvailableQuota = useCallback(() => {
const limits = PLAN_LIMITS[plan];
const now = new Date();
const todayStr = now.toISOString().split('T')[0];
const currentMonthStr = todayStr.substring(0, 7);

let currentUsage = usage;  
if (usage.daily.date !== todayStr) {  
  currentUsage = { ...currentUsage, daily: { date: todayStr, count: 0 } };  
}  
if (usage.monthly.month !== currentMonthStr) {  
  currentUsage = { ...currentUsage, monthly: { month: currentMonthStr, count: 0 } };  
}  

if (currentUsage.daily.date !== usage.daily.date || currentUsage.monthly.month !== usage.monthly.month) {  
  setUsage(currentUsage);  
}  

const dailyAvailable = limits.daily - currentUsage.daily.count;  
const monthlyAvailable = limits.monthly - currentUsage.monthly.count;  

return Math.max(0, Math.min(dailyAvailable, monthlyAvailable));

}, [plan, usage, setUsage]);

const handleFileSelect = async (files: FileList | null) => {
if (!files || files.length === 0) return;

const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));  
if (fileArray.length === 0) {  
  addToast('No valid image files selected.', 'error');  
  return;  
}  

const availableSlots = getAvailableQuota();  
const maxQueueSize = QUEUE_LIMITS[plan];  
const queueLimit = maxQueueSize - pendingFiles.length;  
const processableCount = Math.min(availableSlots, queueLimit);  

if (fileArray.length > processableCount) {  
  addToast(`You can only add ${processableCount} more images due to queue and plan limits.`, 'error');  
}  

const filesToProcess = fileArray.slice(0, processableCount);  

if (filesToProcess.length > 0) {  
  const existingHashes = new Map(labeledItems.map(item => [item.imageHash, item]));  
  const hashPromises = filesToProcess.map(file => getFileHash(file));  
  const hashes = await Promise.all(hashPromises);  

  const newDuplicates = new Map<string, LabeledItem>();  

  hashes.forEach((hash, index) => {  
    const existingItem = existingHashes.get(hash);  
    if (existingItem) {  
      const file = filesToProcess[index];  
      const fileId = file.name + file.lastModified;  
      newDuplicates.set(fileId, existingItem);  
    }  
  });  

  setPendingFiles(prev => [...prev, ...filesToProcess]);  

  if (newDuplicates.size > 0) {  
    setDuplicates(prev => new Map([...prev, ...newDuplicates]));  
  }  

  setView('ai-labelling');  
}

};

const handleRemoveAllDuplicates = () => {
const duplicateFileIds = new Set(duplicates.keys());
setPendingFiles(prev => prev.filter(file => !duplicateFileIds.has(file.name + file.lastModified)));
setDuplicates(new Map());
addToast(${duplicateFileIds.size} duplicate(s) removed from queue., 'success');
};

const handleProceedWithAll = () => {
setDuplicates(new Map());
addToast('Duplicate flags cleared. Proceeding with all items.', 'success');
};

const handleRemovePendingFile = (fileToRemove: File) => {
const fileId = fileToRemove.name + fileToRemove.lastModified;
setPendingFiles(files => files.filter(file => file !== fileToRemove));
setDuplicates(prev => {
const newMap = new Map(prev);
if (newMap.has(fileId)) newMap.delete(fileId);
return newMap;
});
};

const handleCancelAll = useCallback(() => {
if (pendingFiles.length > 0) {
setPendingFiles([]);
setDuplicates(new Map());
addToast('Labelling queue cleared.');
}
}, [pendingFiles.length, addToast]);

// SAVE = call backend -> Cloudinary upload + Firestore save
const handleConfirmLabeling = async (file: File, data: AiResponseData): Promise<void> => {
const user = auth.currentUser;
if (!user) {
addToast('You must be logged in to save items.', 'error');
return;
}

const token = await user.getIdToken();  

const formData = new FormData();  
formData.append('image', file);  
formData.append('data', JSON.stringify(data));  
formData.append('fileName', file.name);  
formData.append('date', formatDate(new Date()));  

const resp = await fetch(`${BACKEND_URL}/api/save-labeled`, {  
  method: 'POST',  
  headers: { Authorization: `Bearer ${token}` },  
  body: formData,  
});  

const json = await resp.json();  
if (!resp.ok || !json?.ok) {  
  throw new Error(json?.error || 'Save failed');  
}  

handleRemovePendingFile(file);  
addToast('Saved to cloud catalog.', 'success');

};

const handleLogoutAndCloseSidebar = () => {
setIsSidebarOpen(false);
onLogout();
};

// ✅ Delete from backend -> Firestore + Cloudinary both
const handleDeleteItems = async (itemIdsToDelete: string[]) => {
const user = auth.currentUser;
if (!user) return;

const token = await user.getIdToken();  

const resp = await fetch(`${BACKEND_URL}/api/delete-items`, {  
  method: 'POST',  
  headers: {  
    'Content-Type': 'application/json',  
    Authorization: `Bearer ${token}`,  
  },  
  body: JSON.stringify({ ids: itemIdsToDelete }),  
});  

const json = await resp.json();  
if (!resp.ok || !json?.ok) {  
  addToast(json?.error || 'Delete failed', 'error');  
  return;  
}  

addToast(`${itemIdsToDelete.length} item(s) deleted successfully.`, 'success');

};

const handleUpdateItem = async (itemId: string, updatedData: AiResponseData) => {
const user = auth.currentUser;
if (!user) return;

await updateDoc(doc(db, 'users', user.uid, 'labeledImages', itemId), {  
  data: updatedData,  
  updatedAt: serverTimestamp(),  
});  

addToast('Item updated successfully.', 'success');

};

// ✅ Clear history from backend -> Firestore + Cloudinary both
const handleClearCache = useCallback(async () => {
const user = auth.currentUser;
if (!user) return;

const token = await user.getIdToken();  

const resp = await fetch(`${BACKEND_URL}/api/clear-history`, {  
  method: 'POST',  
  headers: { Authorization: `Bearer ${token}` },  
});  

const json = await resp.json();  
if (!resp.ok || !json?.ok) {  
  addToast(json?.error || 'Failed to clear history', 'error');  
  return;  
}  

addToast('All cloud history has been cleared.', 'success');

}, [addToast]);

const handleReanalyzeItem = useCallback(async (itemId: string) => {
const itemToReanalyze = labeledItems.find(item => item.id === itemId);
if (!itemToReanalyze) {
addToast('Item not found for re-analysis.', 'error');
return;
}

const availableQuota = getAvailableQuota();  
if (availableQuota < 1) {  
  addToast(`You have no available labels left on the ${plan} plan today.`, 'error');  
  return;  
}  

try {  
  const file = await urlToFile(itemToReanalyze.imageUrl, itemToReanalyze.fileName);  

  setPendingFiles(prev => [...prev, file]);  
  setView('ai-labelling');  
  addToast(`Moved '${itemToReanalyze.fileName}' to the AI Labelling queue.`, 'success');  
} catch (e: any) {  
  console.error(e);  
  addToast(e?.message || 'Could not process image for re-analysis.', 'error');  
}

}, [labeledItems, addToast, setPendingFiles, setView, getAvailableQuota, plan]);

const userQuota = useMemo(() => {
const limits = PLAN_LIMITS[plan];
const now = new Date();
const todayStr = now.toISOString().split('T')[0];
const currentMonthStr = todayStr.substring(0, 7);

const currentDaily = usage.daily.date === todayStr ? usage.daily.count : 0;  
const currentMonthly = usage.monthly.month === currentMonthStr ? usage.monthly.count : 0;  

return {  
  daily: { used: currentDaily, limit: limits.daily },  
  monthly: { used: currentMonthly, limit: limits.monthly }  
};

}, [plan, usage]);

const handleSelectCategory = (category: string) => {
setCategoryFilter(category);
setView('catalog');
};

const renderView = () => {
switch (view) {
case 'dashboard':
return <Dashboard  
labeledItems={labeledItems}  
setView={setView}  
onSelectCategory={handleSelectCategory}  
/>;
case 'catalog':
return <CatalogPage  
labeledItems={labeledItems}  
onDeleteItems={handleDeleteItems}  
categoryFilter={categoryFilter}  
setCategoryFilter={setCategoryFilter}  
plan={plan}  
/>;
case 'history':
return <HistoryPage labeledItems={labeledItems} onDeleteItems={handleDeleteItems} onReanalyzeItem={handleReanalyzeItem} />;
case 'ai-labelling':
return <AILabellingPage  
pendingFiles={pendingFiles}  
onFileSelect={handleFileSelect}  
onRemovePendingFile={handleRemovePendingFile}  
onConfirmLabeling={handleConfirmLabeling}  
onCancelAll={handleCancelAll}  
showToast={addToast}  
duplicates={duplicates}  
onRemoveAllDuplicates={handleRemoveAllDuplicates}  
onProceedWithAll={handleProceedWithAll}  
aiSpeedMode={aiSpeedMode}  
showConfidenceScore={showConfidenceScore}  
plan={plan}  
availableQuota={getAvailableQuota()}  
currency={currency}  
/>;
case 'attributes':
return <AttributesLibraryPage labeledItems={labeledItems} onUpdateItem={handleUpdateItem} addToast={addToast} />;
case 'seo':
return <SeoTagsPage labeledItems={labeledItems} onUpdateItem={handleUpdateItem} addToast={addToast} />;
case 'pricing':
return <PricingSuggestionsPage labeledItems={labeledItems} currency={currency} />;
case 'payment-details':
return <PaymentDetailsPage setView={setView} plan={plan} quota={userQuota} currency={currency} />;
case 'change-password':
return <ChangePasswordPage setView={setView} addToast={addToast} />;
case 'privacy-policy':
return <PrivacyPolicyPage setView={setView} />;
case 'terms-of-service':
return <TermsPage setView={setView} />;
case 'controls':
return <SettingsPage  
theme={theme}  
setTheme={setTheme}  
onClearCache={handleClearCache}  
onLogout={onLogout}  
labeledItems={labeledItems}  
currency={currency}  
setCurrency={setCurrency}  
onOpenInfoModal={onOpenInfoModal}  
profile={profile}  
setProfile={setProfile}  
addToast={addToast}  
setView={setView}  
aiSpeedMode={aiSpeedMode}  
setAiSpeedMode={setAiSpeedMode}  
showConfidenceScore={showConfidenceScore}  
setShowConfidenceScore={setShowConfidenceScore}  
plan={plan}  
quota={userQuota}  
/>;
default:
return <Dashboard  
labeledItems={labeledItems}  
setView={setView}  
onSelectCategory={handleSelectCategory}  
/>;
}
};

return (
<div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">
<div className="fixed bottom-0 right-0 p-8 z-[100] space-y-2 w-full max-w-md">
{toasts.map(toast => <Toast key={toast.id} toast={toast} onClose={removeToast} />)}
</div>

{isSidebarOpen && (  
    <Sidebar  
      view={view}  
      setView={(v: View) => setView(v)}  
      onClose={() => setIsSidebarOpen(false)}  
      labeledItemsCount={labeledItems.length}  
      pendingFilesCount={pendingFiles.length}  
      onLogout={handleLogoutAndCloseSidebar}  
      userName={profile.name}  
      plan={plan}  
    />  
  )}  

  <AppHeader  
    onMenuClick={() => setIsSidebarOpen(true)}  
    onLogout={onLogout}  
    setView={setView}  
    theme={theme}  
    setTheme={setTheme}  
    profile={profile}  
    quota={userQuota}  
  />  

  <main className="container mx-auto px-6 pt-20 pb-12">  
    {renderView()}  
  </main>  
</div>

);
};

export default MainApplication;