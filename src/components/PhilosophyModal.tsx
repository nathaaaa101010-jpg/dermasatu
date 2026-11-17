import React from 'react';
import { X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useDermaStore } from '../store/useDermaStore';

export const PhilosophyModal: React.FC = () => {
  const { philosophyOpen, setModal } = useDermaStore();

  if (!philosophyOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="philosophy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={() => setModal('philosophyOpen', false)}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <BrandLogo size={42} />
            <div>
              <h3 id="philosophy-modal-title" className="font-display text-lg font-bold text-white">
                Filosofi Simbol DERMA-SATU
              </h3>
              <p className="text-xs text-slate-400">
                Makna visual rantai keputusan antibiotik bijak
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModal('philosophyOpen', false)}
            aria-label="Tutup modal filosofi"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="rounded-xl border border-teal-500/25 bg-teal-500/10 p-3.5">
            <p className="font-semibold text-teal-200">1. Perisai (Shield)</p>
            <p className="mt-1 text-slate-300">
              Melambangkan perlindungan kepekaan antimikroba yang tersisa serta perlindungan kesehatan hewan dan rumah tangga dalam kerangka One Health.
            </p>
          </div>
          <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 p-3.5">
            <p className="font-semibold text-blue-200">2. Lingkaran Tertutup (Closed Loop)</p>
            <p className="mt-1 text-slate-300">
              Menunjukkan rantai keputusan tertutup: konfirmasi diagnosis di klinik → data kultur menjadi antibiogram lokal → pembaruan rekomendasi terapi → pencegahan di rumah kembali memperkaya pengawasan.
            </p>
          </div>
          <div className="rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10 p-3.5">
            <p className="font-semibold text-fuchsia-200">3. Tetesan & Siluet Jejak (Dermatologi)</p>
            <p className="mt-1 text-slate-300">
              Merepresentasikan fokus spesifik pada dermatologi veteriner—terutama pioderma superfisial anjing—dengan terapi topikal antiseptik sebagai garis depan bila sesuai.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setModal('philosophyOpen', false)}
            className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
