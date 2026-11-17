import React, { useState } from 'react';
import { CheckCircle2, CloudOff, Plus, RefreshCw, Wifi } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { OfflineSyncItem } from '../lib/types';
import { useDermaStore } from '../store/useDermaStore';

export const Module05OfflineSync: React.FC = () => {
  const { offlineQueue, addOfflineItem, syncOfflineQueue } = useDermaStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const [itemType, setItemType] = useState<OfflineSyncItem['type']>('Sitologi Klinik');
  const [summary, setSummary] = useState('');

  const handleAddQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;
    addOfflineItem({
      type: itemType,
      summary: summary.trim(),
      clinicName: 'Klinik Hewan Satwa Harmoni',
      payloadSizeKb: Math.floor(8 + Math.random() * 12),
    });
    setSummary('');
    setSyncMessage('');
  };

  const handleSync = () => {
    if (offlineQueue.length === 0 || isSyncing) return;
    setIsSyncing(true);
    setSyncMessage('');
    window.setTimeout(() => {
      const count = syncOfflineQueue();
      setIsSyncing(false);
      setSyncMessage(`${count} paket data berhasil disinkronkan ke server simulasi dan dicatat di Log Audit.`);
    }, 1100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
            <span>MODUL 05 • PILAR CONFIRM • INPUT KLINIK (OFFLINE-FIRST)</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Pencatatan Lapangan & Antrean Sinkronisasi Offline-First
          </h2>
        </div>
        <SimulationBadge />
      </div>

      {/* Offline Status Banner */}
      <section
        className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
          offlineQueue.length > 0
            ? 'border-amber-500/40 bg-amber-500/10'
            : 'border-emerald-500/40 bg-emerald-500/10'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              offlineQueue.length > 0
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {offlineQueue.length > 0 ? (
              <CloudOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Wifi className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="font-display text-base font-bold text-white">
              {offlineQueue.length > 0
                ? `Offline — ${offlineQueue.length} data menunggu sinkronisasi`
                : 'Semua Data Tersinkronisasi (0 Antrean Lokal)'}
            </p>
            <p className="mt-0.5 text-xs text-slate-300">
              Dirancang agar klinik tetap dapat mencatat sitologi dan resep saat koneksi internet tidak stabil.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={offlineQueue.length === 0 || isSyncing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} aria-hidden="true" />
          {isSyncing ? 'Menyinkronkan…' : 'Sinkronkan'}
        </button>
      </section>

      {syncMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-xs text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{syncMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Add Offline Entry */}
        <form
          onSubmit={handleAddQueue}
          className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-5"
        >
          <h3 className="font-display text-base font-bold text-white">
            Simulasi Input Saat Offline
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Tambahkan catatan baru ke penyangga lokal sebelum sinkronisasi.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="off-type" className="block text-xs text-slate-300">
                Jenis Catatan
              </label>
              <select
                id="off-type"
                value={itemType}
                onChange={(e) => setItemType(e.target.value as OfflineSyncItem['type'])}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="Sitologi Klinik">Sitologi Klinik</option>
                <option value="Log Resep">Log Resep</option>
                <option value="Permintaan Voucher">Permintaan Voucher</option>
              </select>
            </div>

            <div>
              <label htmlFor="off-summary" className="block text-xs text-slate-300">
                Ringkasan Data Kasus
              </label>
              <textarea
                id="off-summary"
                rows={3}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Contoh: KAS-2026-089 • Sitologi menunjukkan kokus (+), saran topikal antiseptik"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Simpan ke Antrean Lokal
            </button>
          </div>
        </form>

        {/* Queue List */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-7">
          <h3 className="font-display text-base font-bold text-white">
            Antrean Lokal Menunggu Sinkronisasi ({offlineQueue.length})
          </h3>
          {offlineQueue.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
              Tidak ada data tertunda di buffer lokal. Tambahkan entri simulasi di panel kiri untuk menguji ulang antrean offline.
            </div>
          ) : (
            <div className="mt-4 space-y-2.5">
              {offlineQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/75 p-3.5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-200">
                        {item.id}
                      </span>
                      <span className="text-xs font-semibold text-white">{item.type}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">{item.summary}</p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">
                      {item.clinicName} • {item.capturedAt}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {item.payloadSizeKb} KB
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
