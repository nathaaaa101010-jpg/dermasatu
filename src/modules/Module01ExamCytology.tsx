import React from 'react';
import { ArrowRight, CheckCircle2, ClipboardCheck, AlertCircle } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { PatientCase } from '../lib/types';
import { useDermaStore } from '../store/useDermaStore';

export const Module01ExamCytology: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    updateActiveCase,
    updateActiveCytology,
    setActiveModule,
  } = useDermaStore();

  const activeCase = cases.find((c) => c.id === selectedCaseId) ?? cases[0];

  const isSuggestive = activeCase.cytologyResult === 'Sugestif pioderma superfisial';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
            <span>MODUL 01 • PILAR CONFIRM • PEMERIKSAAN & SITOLOGI</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Konfirmasi Sitologi Sebelum Keputusan Antibiotik
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SimulationBadge />
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-mono text-slate-400">Pasien Aktif:</span>
            <select
              value={activeCase.id}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              aria-label="Pilih kasus pasien simulasi"
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-white focus:border-teal-400 focus:outline-none"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.petAlias}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Patient Case Form */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 lg:col-span-7">
          <h3 className="font-display text-base font-bold text-white">
            1. Data Anamnesis & Riwayat Paparan
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Identitas pemilik dipisahkan menggunakan pseudonim ({activeCase.ownerPseudonym}).
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300" htmlFor="case-breed">
                Ras & Nama Panggilan
              </label>
              <input
                id="case-breed"
                type="text"
                value={activeCase.breed}
                onChange={(e) => updateActiveCase({ breed: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300" htmlFor="case-age">
                Usia (tahun)
              </label>
              <input
                id="case-age"
                type="number"
                min={0.5}
                max={20}
                step={0.5}
                value={activeCase.ageYears}
                onChange={(e) =>
                  updateActiveCase({ ageYears: Math.max(0.5, Number(e.target.value) || 1) })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 font-mono text-sm text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300" htmlFor="case-lesion-loc">
                Lokasi Lesi Kulit
              </label>
              <input
                id="case-lesion-loc"
                type="text"
                value={activeCase.lesionLocation}
                onChange={(e) => updateActiveCase({ lesionLocation: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300" htmlFor="case-lesion-type">
                Pola Lesi Klinis
              </label>
              <select
                id="case-lesion-type"
                value={activeCase.lesionType}
                onChange={(e) =>
                  updateActiveCase({ lesionType: e.target.value as PatientCase['lesionType'] })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-teal-400 focus:outline-none"
              >
                <option value="lokalisata-ringan">Lokalisata Ringan (Fokal)</option>
                <option value="papula-pustula">Papula & Pustula Superfisial</option>
                <option value="kolaret-epidermal">Kolarete Epidermal & Krusta</option>
                <option value="rekuren-multifokal">Rekuren / Multifokal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300" htmlFor="case-betalactam">
                Durasi Beta-Laktam Sebelumnya (minggu)
              </label>
              <input
                id="case-betalactam"
                type="number"
                min={0}
                max={24}
                value={activeCase.priorBetaLactamWeeks}
                onChange={(e) =>
                  updateActiveCase({ priorBetaLactamWeeks: Math.max(0, Number(e.target.value) || 0) })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 font-mono text-sm text-white focus:border-teal-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-slate-700">
              <input
                type="checkbox"
                checked={activeCase.antibioticLast30d}
                onChange={(e) => updateActiveCase({ antibioticLast30d: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 accent-rose-500"
              />
              <span className="text-xs text-slate-200">
                Riwayat antibiotik 30 hari terakhir
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-slate-700">
              <input
                type="checkbox"
                checked={activeCase.immunomodulatorHistory}
                onChange={(e) => updateActiveCase({ immunomodulatorHistory: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 accent-rose-500"
              />
              <span className="text-xs text-slate-200">
                Riwayat terapi imunomodulator
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-slate-700">
              <input
                type="checkbox"
                checked={activeCase.treatmentFailure}
                onChange={(e) => updateActiveCase({ treatmentFailure: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 accent-rose-500"
              />
              <span className="text-xs text-slate-200">
                Gagal respons terapi empiris awal
              </span>
            </label>
          </div>
        </section>

        {/* Cytology Checklist & Output */}
        <section className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-5 lg:col-span-5">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-rose-400" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-white">
                2. Checklist Sitologi Cepat di Klinik
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Pewarnaan Diff-Quik dari impresi lesi, tape strip, atau aspirat pustula.
            </p>

            <div className="mt-4 space-y-2.5">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 hover:border-rose-500/40">
                <span className="text-sm text-slate-200">Ditemukan bakteri kokus ekstraseluler/intraseluler</span>
                <input
                  type="checkbox"
                  checked={activeCase.cytology.cocciFound}
                  onChange={(e) => updateActiveCytology({ cocciFound: e.target.checked })}
                  className="h-4 w-4 accent-rose-500"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 hover:border-rose-500/40">
                <span className="text-sm text-slate-200">Neutrofil terdegenerasi</span>
                <input
                  type="checkbox"
                  checked={activeCase.cytology.degenerateNeutrophils}
                  onChange={(e) => updateActiveCytology({ degenerateNeutrophils: e.target.checked })}
                  className="h-4 w-4 accent-rose-500"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 hover:border-rose-500/40">
                <span className="text-sm text-slate-200">Fagositosis bakteri intraseluler</span>
                <input
                  type="checkbox"
                  checked={activeCase.cytology.intracellularPhagocytosis}
                  onChange={(e) =>
                    updateActiveCytology({ intracellularPhagocytosis: e.target.checked })
                  }
                  className="h-4 w-4 accent-rose-500"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 hover:border-amber-500/40">
                <span className="text-sm text-slate-200">Ditemukan bakteri batang (rods) dominan</span>
                <input
                  type="checkbox"
                  checked={activeCase.cytology.rodsFound}
                  onChange={(e) => updateActiveCytology({ rodsFound: e.target.checked })}
                  className="h-4 w-4 accent-amber-500"
                />
              </label>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div
              className={`rounded-xl border p-4 ${
                isSuggestive
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-amber-500/40 bg-amber-500/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {isSuggestive ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                ) : (
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
                )}
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-slate-300">
                    Keluaran Interpretasi Sitologi
                  </p>
                  <p className="mt-0.5 font-display text-base font-bold text-white">
                    {activeCase.cytologyResult}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    {isSuggestive
                      ? 'Temuan kokus disertai respon neutrofil mendukung pioderma superfisial. Lanjutkan ke evaluasi kebutuhan kultur.'
                      : 'Tidak memenuhi pola kokus pioderma superfisial klasik atau ditemukan bakteri batang — pertimbangkan diagnosis banding (Malassezia, parasit, atau kultur segera).'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModule('02')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              Lanjut ke Keputusan Kultur & Voucher
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
