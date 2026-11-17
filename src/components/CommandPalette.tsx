import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { ANTIBIOGRAM_ANTIBIOTICS, CLINIC_KPI_ROWS } from '../data/mockData';
import { ModuleId } from '../lib/types';
import { ROLE_VISIBLE_MODULES, useDermaStore } from '../store/useDermaStore';

const MODULE_ITEMS: { id: ModuleId; label: string; group: string }[] = [
  { id: '01', label: '01 Pemeriksaan & Sitologi', group: 'Confirm' },
  { id: '02', label: '02 Keputusan Kultur & Voucher', group: 'Confirm' },
  { id: '03', label: '03 Rekomendasi Terapi (ISCAID 2025)', group: 'Confirm' },
  { id: 'TR-1', label: 'TR-1 Unggah Hasil Kultur', group: 'Trace' },
  { id: 'TR-2', label: 'TR-2 Antibiogram Lokal', group: 'Trace' },
  { id: 'TR-3', label: 'TR-3 Jejak Resep & Obat', group: 'Trace' },
  { id: 'HM-1', label: 'HM-1 Edukasi & Checklist Rumah', group: 'Home' },
  { id: 'HM-2', label: 'HM-2 Pengingat Terapi', group: 'Home' },
  { id: '05', label: '05 Input Klinik (Offline-First)', group: 'Confirm' },
  { id: '04', label: '04 Monitoring & Evaluasi', group: 'Governance' },
  { id: '06', label: '06 Pelaporan Penyimpangan Peresepan', group: 'Governance' },
  { id: '07', label: '07 Antrean Persetujuan', group: 'Governance' },
  { id: '08', label: '08 Manajemen Pengguna', group: 'Governance' },
];

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setModal,
    activeRole,
    setActiveModule,
    cases,
    setSelectedCaseId,
    cultureRecords,
  } = useDermaStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setModal('commandPaletteOpen', !commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setModal('commandPaletteOpen', false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [commandPaletteOpen, setModal]);

  const allowedModules = ROLE_VISIBLE_MODULES[activeRole];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list: { id: string; title: string; subtitle: string; onSelect: () => void }[] = [];

    MODULE_ITEMS.filter((m) => allowedModules.includes(m.id)).forEach((m) => {
      if (!q || m.label.toLowerCase().includes(q) || m.group.toLowerCase().includes(q)) {
        list.push({
          id: `mod-${m.id}`,
          title: m.label,
          subtitle: `Modul • ${m.group}`,
          onSelect: () => {
            setActiveModule(m.id);
            setModal('commandPaletteOpen', false);
          },
        });
      }
    });

    cases.forEach((c) => {
      if (
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.petAlias.toLowerCase().includes(q) ||
        c.clinicName.toLowerCase().includes(q)
      ) {
        list.push({
          id: `case-${c.id}`,
          title: `${c.id} — ${c.petAlias}`,
          subtitle: `Kasus • ${c.clinicName}`,
          onSelect: () => {
            setSelectedCaseId(c.id);
            if (allowedModules.includes('01')) setActiveModule('01');
            setModal('commandPaletteOpen', false);
          },
        });
      }
    });

    CLINIC_KPI_ROWS.forEach((cl) => {
      if (!q || cl.clinicName.toLowerCase().includes(q) || cl.region.toLowerCase().includes(q)) {
        list.push({
          id: `clinic-${cl.id}`,
          title: cl.clinicName,
          subtitle: `Klinik Simulasi • ${cl.region}`,
          onSelect: () => {
            if (allowedModules.includes('04')) setActiveModule('04');
            else if (allowedModules.includes('TR-2')) setActiveModule('TR-2');
            setModal('commandPaletteOpen', false);
          },
        });
      }
    });

    cultureRecords.forEach((k) => {
      if (!q || k.sampleCode.toLowerCase().includes(q) || k.bacteria.toLowerCase().includes(q)) {
        list.push({
          id: `klt-${k.id}`,
          title: `${k.sampleCode} (${k.bacteria})`,
          subtitle: `Hasil Kultur • ${k.region}`,
          onSelect: () => {
            if (allowedModules.includes('TR-1')) setActiveModule('TR-1');
            else if (allowedModules.includes('TR-2')) setActiveModule('TR-2');
            setModal('commandPaletteOpen', false);
          },
        });
      }
    });

    ANTIBIOGRAM_ANTIBIOTICS.forEach((ab) => {
      if (q && ab.toLowerCase().includes(q)) {
        list.push({
          id: `ab-${ab}`,
          title: ab,
          subtitle: 'Antibiotik pada Antibiogram Lokal',
          onSelect: () => {
            if (allowedModules.includes('TR-2')) setActiveModule('TR-2');
            setModal('commandPaletteOpen', false);
          },
        });
      }
    });

    return list.slice(0, 12);
  }, [query, allowedModules, cases, cultureRecords, setActiveModule, setModal, setSelectedCaseId]);

  if (!commandPaletteOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian Cepat Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/75 px-4 pt-20 backdrop-blur-sm"
      onClick={() => setModal('commandPaletteOpen', false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
          <Search className="h-4 w-4 text-teal-400" aria-hidden="true" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kasus, klinik, hasil kultur, modul, atau antibiotik…"
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setModal('commandPaletteOpen', false)}
            aria-label="Tutup pencarian"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              Tidak ada hasil untuk "{query}" pada peran aktif saat ini.
            </p>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onSelect}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition hover:bg-slate-800/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{item.title}</p>
                  <p className="truncate text-xs text-slate-400">{item.subtitle}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
