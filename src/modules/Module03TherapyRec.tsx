import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Stethoscope } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { calculateMrspRisk } from '../lib/utils';
import { useDermaStore } from '../store/useDermaStore';

export const Module03TherapyRec: React.FC = () => {
  const { cases, selectedCaseId, addPrescriptionLog, setActiveModule } = useDermaStore();
  const activeCase = cases.find((c) => c.id === selectedCaseId) ?? cases[0];
  const risk = calculateMrspRisk(activeCase);

  const [selectedDrugClass, setSelectedDrugClass] = useState<
    | 'Topikal Antiseptik'
    | 'Sefalosporin Gen-1'
    | 'Klindamisin/Linkosamid'
    | 'Sefalosporin Gen-3'
  >('Topikal Antiseptik');
  const [hasCulture, setHasCulture] = useState(true);
  const [batchCode, setBatchCode] = useState('BCH-CHX-9901');
  const [loggedMsg, setLoggedMsg] = useState('');

  const handleLogRx = () => {
    addPrescriptionLog({
      clinicName: activeCase.clinicName,
      region: activeCase.region,
      caseId: activeCase.id,
      drugClass: selectedDrugClass,
      durationDays: 14,
      hasCulture,
      isThirdGenCeph: selectedDrugClass === 'Sefalosporin Gen-3',
      batchCode,
      dispensedBy: 'drh. Rina Pratama, M.Sc.',
    });
    setLoggedMsg(`Jejak keputusan (${selectedDrugClass}) dicatat ke Modul TR-3 dan Log Audit.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
            <span>MODUL 03 • PILAR CONFIRM • REKOMENDASI TERAPI (ISCAID 2025)</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Pendukung Keputusan Terapi Berbasis Bukti & Skor Risiko MRSP
          </h2>
        </div>
        <SimulationBadge />
      </div>

      {/* Mandatory Warning */}
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
        <div>
          <p className="font-semibold text-amber-200">
            Pendukung keputusan, bukan pengganti penilaian dokter hewan. Verifikasi dengan pedoman ISCAID 2025 dan pedoman lokal.
          </p>
          <p className="mt-1 text-xs text-amber-100/80">
            Modul ini hanya menyajikan prinsip umum penatalaksanaan tanpa dosis spesifik. Pemilihan sediaan, dosis, dan durasi tetap menjadi tanggung jawab penuh dokter hewan pemeriksa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* MRSP Risk Score Heuristic */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-white">
                Heuristik Risiko MRSP ({activeCase.id})
              </h3>
            </div>
            <span
              className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${
                risk.level === 'Tinggi'
                  ? 'border-rose-500/40 bg-rose-500/15 text-rose-200'
                  : risk.level === 'Sedang'
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-200'
                    : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
              }`}
            >
              Risiko {risk.level} ({risk.score}/100)
            </span>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                risk.level === 'Tinggi'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : risk.level === 'Sedang'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
              }`}
              style={{ width: `${risk.score}%` }}
            />
          </div>

          <h4 className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Faktor Penentu Skor (Heuristik Edukatif):
          </h4>
          <ul className="mt-2 space-y-2 text-xs text-slate-300">
            {risk.factors.map((f) => (
              <li
                key={f}
                className="rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5"
              >
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* General Guideline Output & Rx Log Action */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-7">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-teal-400" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-white">
              Prinsip Lini Terapi Umum (Merujuk ISCAID 2025)
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 font-semibold text-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Prioritas 1: Terapi Topikal Antiseptik</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">
                Pada pioderma superfisial (terutama lesi fokal/ringan atau sebagai pendamping utama), terapi topikal antiseptik diutamakan untuk mengurangi kebutuhan antibiotik sistemik.
              </p>
            </div>

            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
              <p className="font-semibold text-blue-200">
                Prioritas 2: Sistemik Lini Pertama Hanya Bila Diperlukan & Terkonfirmasi
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">
                Pertimbangkan antibiotik sistemik lini pertama hanya jika terapi topikal tidak memadai atau lesi luas/rekuren, sambil merujuk ke profil kepekaan antibiogram lokal (Modul TR-2).
              </p>
            </div>

            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
              <p className="font-semibold text-rose-200">
                Pembatasan Ketat: Hindari Sefalosporin Gen-3 & Golongan Prioritas Tinggi
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">
                Sefalosporin generasi ketiga (yang pada studi rujukan masih mencakup 43,9% antibiotik sistemik — Santoro dkk., 2026) serta fluorokuinolon tidak digunakan secara empiris, melainkan hanya bila terbukti sensitif melalui uji kultur dan tidak ada alternatif lini pertama yang sesuai.
              </p>
            </div>
          </div>

          {/* Simulate recording decision to TR-3 */}
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/75 p-4">
            <h4 className="text-xs font-semibold text-white">
              Catat Keputusan ke Jejak Resep & Obat (TR-3)
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <select
                value={selectedDrugClass}
                onChange={(e) => setSelectedDrugClass(e.target.value as typeof selectedDrugClass)}
                aria-label="Pilih golongan terapi"
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
              >
                <option value="Topikal Antiseptik">Topikal Antiseptik</option>
                <option value="Sefalosporin Gen-1">Sefalosporin Gen-1</option>
                <option value="Klindamisin/Linkosamid">Klindamisin/Linkosamid</option>
                <option value="Sefalosporin Gen-3">Sefalosporin Gen-3 (Perlu Justifikasi)</option>
              </select>

              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                aria-label="Kode batch simulasi"
                placeholder="Kode Batch"
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-white"
              />

              <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={hasCulture}
                  onChange={(e) => setHasCulture(e.target.checked)}
                  className="accent-teal-400"
                />
                Ada hasil kultur
              </label>
            </div>

            {selectedDrugClass === 'Sefalosporin Gen-3' && !hasCulture && (
              <p className="mt-2.5 text-xs text-rose-300">
                Peringatan Stewardship: Peresepan Sefalosporin Gen-3 tanpa hasil kultur akan ditandai sebagai indikator pengawasan di Modul TR-3 dan Monev (04).
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveModule('TR-2')}
                className="text-xs font-medium text-blue-300 hover:text-blue-200 underline underline-offset-4"
              >
                Cek Antibiogram Lokal (TR-2)
              </button>
              <button
                type="button"
                onClick={handleLogRx}
                className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-teal-400"
              >
                Simpan ke Log Resep
              </button>
            </div>

            {loggedMsg && (
              <p className="mt-2.5 text-xs text-emerald-300">{loggedMsg}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
