import React from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Home,
  Map,
  Microscope,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useDermaStore } from '../store/useDermaStore';
import { PillarId, PillarStatus } from '../lib/types';

interface JourneyTrackerProps {
  onSelectPillar?: (pillar: PillarId) => void;
  compact?: boolean;
}

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({ onSelectPillar, compact = false }) => {
  const {
    cases,
    selectedCaseId,
    vouchers,
    cultureRecords,
    homeChecklist,
    getPillarStatuses,
    openPillar,
    roadmapModalOpen,
    triggerEngineModalOpen,
    setModal,
  } = useDermaStore();

  const statuses = getPillarStatuses();
  const activeCase = cases.find((c) => c.id === selectedCaseId) ?? cases[0];
  const checklistDone = homeChecklist.filter((i) => i.completed).length;

  const handleOpenPillar = (pillar: PillarId) => {
    if (onSelectPillar) {
      onSelectPillar(pillar);
    } else {
      openPillar(pillar);
    }
  };

  const pillars: {
    id: PillarId;
    label: string;
    title: string;
    desc: string;
    chips: string[];
    metric: string;
    icon: React.ReactNode;
    gradientClass: string;
    borderClass: string;
    chipClass: string;
  }[] = [
    {
      id: 'confirm',
      label: 'PILAR 1 • KONFIRMASI',
      title: 'CONFIRM',
      desc: 'Konfirmasi diagnosis terjangkau sebelum peresepan melalui sitologi cepat, alur ISCAID 2025, dan voucher kultur.',
      chips: ['Sitologi Dulu', 'Voucher Kultur', 'Alur ISCAID 2025'],
      metric: `Kasus aktif: ${activeCase.id} (${vouchers.length} voucher)`,
      icon: <Microscope className="h-5 w-5 text-rose-200" aria-hidden="true" />,
      gradientClass: 'from-rose-500/20 via-red-600/15 to-slate-900/90',
      borderClass: 'border-rose-500/35 hover:border-rose-400/60',
      chipClass: 'border-rose-400/30 bg-rose-500/15 text-rose-100',
    },
    {
      id: 'trace',
      label: 'PILAR 2 • PENELUSURAN',
      title: 'TRACE',
      desc: 'Data kultur klinik teragregasi menjadi antibiogram lokal yang memperbarui rekomendasi terapi dan jejak resep.',
      chips: ['Antibiogram Lokal', 'Lini Terapi Dinamis', 'Jejak Resep'],
      metric: `${cultureRecords.length} isolat tervalidasi • 4 wilayah`,
      icon: <Activity className="h-5 w-5 text-blue-200" aria-hidden="true" />,
      gradientClass: 'from-blue-500/20 via-blue-700/15 to-slate-900/90',
      borderClass: 'border-blue-500/35 hover:border-blue-400/60',
      chipClass: 'border-blue-400/30 bg-blue-500/15 text-blue-100',
    },
    {
      id: 'home',
      label: 'PILAR 3 • RUMAH TANGGA',
      title: 'HOME',
      desc: 'Temuan risiko MRSP memicu edukasi kebersihan rumah, pengingat terapi, dan kendali consent granular tanpa membuka privasi.',
      chips: ['Edukasi Pemilik', 'Consent Granular', 'Pengingat Terapi'],
      metric: `Checklist rumah: ${checklistDone}/${homeChecklist.length} selesai`,
      icon: <Home className="h-5 w-5 text-emerald-200" aria-hidden="true" />,
      gradientClass: 'from-emerald-500/20 via-emerald-700/15 to-slate-900/90',
      borderClass: 'border-emerald-500/35 hover:border-emerald-400/60',
      chipClass: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
    },
  ];

  const renderStatusBadge = (status: PillarStatus) => {
    if (status === 'SELESAI') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-emerald-200 whitespace-nowrap shrink-0">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
          SELESAI
        </span>
      );
    }
    if (status === 'AKTIF SEKARANG') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-amber-200 whitespace-nowrap shrink-0">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
          AKTIF SEKARANG
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full border border-slate-600/60 bg-slate-800/80 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-slate-300 whitespace-nowrap shrink-0">
        TAHAP BERIKUTNYA
      </span>
    );
  };

  return (
    <section
      aria-label="Stewardship Journey Tracker"
      className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0B1222]/95 p-5 sm:p-6 shadow-2xl shadow-black/40"
    >
      {/* Header Row */}
      <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-mono text-xs font-bold tracking-[0.18em] text-teal-400 uppercase">
              STEWARDSHIP JOURNEY TRACKER
            </h2>
            <span className="font-mono text-[11px] text-slate-400">
              • Unit Perjalanan: Pasien {activeCase.id}
            </span>
          </div>
          <p className="mt-1 font-display text-lg sm:text-xl font-bold text-white">
            Satu Rantai Keputusan Stewardship (Confirm → Trace → Home)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setModal('roadmapModalOpen', true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-teal-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 whitespace-nowrap shrink-0"
          >
            <Map className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
            Panduan Roadmap
          </button>
          <button
            type="button"
            onClick={() => setModal('triggerEngineModalOpen', true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-fuchsia-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 whitespace-nowrap shrink-0"
          >
            <Cpu className="h-3.5 w-3.5 text-fuchsia-400" aria-hidden="true" />
            Data & Trigger Engine
          </button>
        </div>
      </div>

      {/* 3 Pillar Cards with Gradient Connectors */}
      <div className={`mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 relative ${compact ? '' : ''}`}>
        {pillars.map((pillar, idx) => {
          const status = statuses[pillar.id];
          return (
            <div key={pillar.id} className="relative flex flex-col">
              {/* Connector line on desktop between cards */}
              {idx < pillars.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute top-1/2 -right-6 z-10 h-[2px] w-6 -translate-y-1/2 bg-gradient-to-r from-rose-400/60 via-blue-400/70 to-emerald-400/60"
                />
              )}

              <article
                className={`flex h-full flex-col justify-between rounded-2xl border bg-gradient-to-br p-5 transition duration-200 hover:-translate-y-0.5 ${pillar.gradientClass} ${pillar.borderClass}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
                      {pillar.label}
                    </span>
                    {renderStatusBadge(status)}
                  </div>

                  <div className="mt-3.5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60">
                      {pillar.icon}
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-white">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {pillar.desc}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {pillar.chips.map((chip) => (
                      <span
                        key={chip}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${pillar.chipClass}`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/10 pt-3.5">
                  <span className="font-mono text-[11px] text-slate-300 truncate">
                    {pillar.metric}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenPillar(pillar.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 whitespace-nowrap shrink-0"
                  >
                    Buka Pilar
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {/* Panduan Roadmap Modal */}
      {roadmapModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="roadmap-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 id="roadmap-modal-title" className="font-display text-lg font-bold text-white">
                  Panduan Roadmap Rantai Keputusan Tertutup
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Urutan alur stewardship berbasis pasien dari klinik hingga rumah tangga pemilik
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal('roadmapModalOpen', false)}
                aria-label="Tutup panduan roadmap"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ol className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-3.5">
                <strong className="text-rose-200">1. CONFIRM (Modul 01–03):</strong> Lakukan sitologi kulit terlebih dahulu, evaluasi kriteria kultur ISCAID 2025, ajukan voucher subsidi bila berisiko tinggi, dan gunakan rekomendasi topikal/lini pertama secara bijak.
              </li>
              <li className="rounded-xl border border-blue-500/25 bg-blue-500/10 p-3.5">
                <strong className="text-blue-200">2. TRACE (Modul TR-1 s.d. TR-3):</strong> Laboratorium mengunggah hasil kultur terpseudonim, memperbarui antibiogram regional, dan mencatat jejak resep serta batch obat.
              </li>
              <li className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3.5">
                <strong className="text-emerald-200">3. HOME (Modul HM-1 & HM-2):</strong> Pemilik menerima edukasi higienitas, checklist rumah, pengingat terapi, serta kendali penuh atas persetujuan (consent) data UU PDP.
              </li>
            </ol>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setModal('roadmapModalOpen', false)}
                className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data & Trigger Engine Modal */}
      {triggerEngineModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="trigger-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-teal-400" />
                <h3 id="trigger-modal-title" className="font-display text-lg font-bold text-white">
                  Data & Trigger Engine (Simulasi Aturan)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModal('triggerEngineModalOpen', false)}
                aria-label="Tutup modal trigger engine"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                <p className="font-mono text-xs text-rose-300">Pemicu CONFIRM → Voucher Kultur</p>
                <p className="mt-1">
                  Otomatis menyarankan kultur & membuka kelayakan voucher bila pasien memiliki riwayat antibiotik 30 hari terakhir, imunomodulator, lesi rekuren, atau kegagalan terapi.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                <p className="font-mono text-xs text-blue-300">Pemicu TRACE → Pembaruan Antibiogram</p>
                <p className="mt-1">
                  Setiap unggahan hasil kultur dengan consent terverifikasi hanya mengirim variabel bakteri, wilayah, jenis spesimen, dan profil kepekaan (tanpa nama pemilik). Bila n &lt; 30, peringatan sampel kecil aktif otomatis.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                <p className="font-mono text-xs text-emerald-300">Pemicu HOME → Protokol Pencegahan Rumah</p>
                <p className="mt-1">
                  Deteksi risiko MRSP tinggi atau gen mecA(+) memicu paket edukasi kebersihan rumah tangga dan pencatatan kepatuhan dosis tanpa mengekspos identitas ke pihak luar.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setModal('triggerEngineModalOpen', false)}
                className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400"
              >
                Tutup Ringkasan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
