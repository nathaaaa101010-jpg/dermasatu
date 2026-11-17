import React, { useState } from 'react';
import { CheckCircle2, Flag, Shield } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { DeviationReport, RegionId } from '../lib/types';
import { useDermaStore } from '../store/useDermaStore';

export const Module06DeviationReport: React.FC = () => {
  const { deviationReports, submitDeviationReport } = useDermaStore();
  const [region, setRegion] = useState<RegionId>('DIY');
  const [category, setCategory] = useState<DeviationReport['category']>(
    'Peresepan Sefalosporin Gen-3 Tanpa Kultur'
  );
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    submitDeviationReport({
      region,
      category,
      description: description.trim(),
    });
    setDescription('');
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-teal-400">
            <span className="h-2 w-2 rounded-full bg-teal-400" aria-hidden="true" />
            <span>MODUL 06 • GOVERNANCE • PELAPORAN PENYIMPANGAN PERESEPAN</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Kanal Pelaporan Anonim & Pemantauan Tiket Pengawasan
          </h2>
        </div>
        <SimulationBadge />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-5"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-400" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-white">
              Kirim Laporan Penyimpangan (Anonim)
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Identitas pelapor tidak disimpan pada tiket publik; hanya ringkasan indikasi untuk audit regulator.
          </p>

          <div className="mt-4 space-y-3.5">
            <div>
              <label htmlFor="dev-region" className="block text-xs text-slate-300">
                Wilayah Kejadian
              </label>
              <select
                id="dev-region"
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionId)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="DIY">DIY</option>
                <option value="Jateng">Jateng</option>
                <option value="Jabodetabek">Jabodetabek</option>
                <option value="Bali">Bali</option>
              </select>
            </div>

            <div>
              <label htmlFor="dev-cat" className="block text-xs text-slate-300">
                Kategori Penyimpangan
              </label>
              <select
                id="dev-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as DeviationReport['category'])}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option>Peresepan Sefalosporin Gen-3 Tanpa Kultur</option>
                <option>Penjualan Antibiotik Tanpa Resep Dokter Hewan</option>
                <option>Ketidaksesuaian Pencatatan Batch</option>
                <option>Lainnya</option>
              </select>
            </div>

            <div>
              <label htmlFor="dev-desc" className="block text-xs text-slate-300">
                Uraian Temuan (Jangan cantumkan nama asli individu)
              </label>
              <textarea
                id="dev-desc"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan pola peresepan atau distribusi obat yang perlu diaudit..."
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-400"
            >
              <Flag className="h-4 w-4" aria-hidden="true" />
              Kirim Tiket Anonim
            </button>

            {submitted && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Tiket anonim berhasil dibuat dan tercatat di Log Audit.
              </p>
            )}
          </div>
        </form>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-7">
          <h3 className="font-display text-base font-bold text-white">
            Daftar Tiket Penyimpangan ({deviationReports.length})
          </h3>
          <div className="mt-4 space-y-3">
            {deviationReports.map((rep) => (
              <article
                key={rep.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs font-bold text-teal-300">
                      {rep.id}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{rep.region}</span>
                  </div>
                  <span
                    className={`rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
                      rep.status === 'Selesai Verifikasi'
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                        : rep.status === 'Ditindaklanjuti Dinas'
                          ? 'border-blue-500/40 bg-blue-500/15 text-blue-200'
                          : 'border-amber-500/40 bg-amber-500/15 text-amber-200'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>
                <h4 className="mt-2 text-sm font-semibold text-white">{rep.category}</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{rep.description}</p>
                <p className="mt-2 font-mono text-[11px] text-slate-500">{rep.submittedAt}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
