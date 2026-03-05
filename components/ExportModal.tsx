import React, { useState } from 'react';
import { auth } from '../firebase';
import { type Plan } from './plans';
import { type LabeledItem } from './MainApplication';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const ExportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  itemsToExport: LabeledItem[];
}> = ({ isOpen, onClose, plan, itemsToExport }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleExportCsv = async () => {
    try {
      setLoading(true);
      setError('');

      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');

      const token = await user.getIdToken();

      const resp = await fetch(`${BACKEND_URL}/api/export-csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: itemsToExport.map(i => i.id) }),
      });

      // If blocked by limit, backend returns JSON error
      const contentType = resp.headers.get('content-type') || '';
      if (!resp.ok) {
        if (contentType.includes('application/json')) {
          const j = await resp.json();
          throw new Error(j?.error || 'Export failed');
        }
        throw new Error('Export failed');
      }

      const csvText = await resp.text();
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ladamark_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl w-full max-w-lg m-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Export Data (CSV)</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
        </div>

        <p className="text-sm text-[var(--text-secondary)]">
          You are exporting <span className="font-bold">{itemsToExport.length}</span> item(s).
        </p>

        {plan === 'free' && (
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Free plan limit: <span className="font-semibold">5 exports/day</span> (CSV only).
          </p>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--background-tertiary)] text-[var(--text-primary)] hover:bg-[var(--background-hover)]"
          >
            Cancel
          </button>

          <button
            onClick={handleExportCsv}
            disabled={loading || itemsToExport.length === 0}
            className="px-5 py-2 text-sm font-bold rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;