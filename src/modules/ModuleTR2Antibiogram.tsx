import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, Download, Filter } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import {
  ANTIBIOGRAM_ANTIBIOTICS,
  ANTIBIOGRAM_BACTERIA,
  REGIONAL_ANTIBIOGRAMS,
  RESISTANCE_TREND_SERIES,
} from '../data/mockData';
import { RegionId } from '../lib/types';
import { downloadCsv } from '../lib/utils';
import { useDermaStore } from '../store/useDermaStore';

export const ModuleTR2Antibiogram: React.FC = () => {
  const { cultureRecords } = useDermaStore();
  const [region, setRegion] = useState<RegionId>('Jateng');
  const [period, setPeriod] = useState<'Q3 2026' | 'Q2 2026' | 'Q1 2026'>('Q3 2026');
  const [specimen, setSpecimen] = useState<'Semua' | 'Swab Kulit' | 'Aspirat Pustula' | 'Kerokan Dalam'>('Semua');

  const dataset = useMemo(() => {
    const base =
      REGIONAL_ANTIBIOGRAMS.find((d) => d.region === region) ?? REGIONAL_ANTIBIOGRAMS[0];

    // Factor in newly uploaded culture records for that region/specimen
    const extraUploads = cultureRecords.filter(
      (r) => r.region === region && (specimen === 'Semua' || r.specimen === specimen)
    );
    const specimenFactor = specimen === 'Semua' ? 1 : specimen === 'Swab Kulit' ? 0.65 : 0.35;
    const periodFactor = period === 'Q3 2026' ? 1 : period === 'Q2 2026' ? 0.9 : 0.8;

    const effectiveN = Math.round(base.sampleSize * specimenFactor * periodFactor) + extraUploads.length;

    return {
      ...base,
      effectiveN,
      cells: base.cells.map((cell) => {
        const adj = period === 'Q1 2026' ? -3 : period === 'Q2 2026' ? -1 : 0;
        const pct = Math.max(15, Math.min(100, cell.susceptiblePct + adj));
        return { ...cell, susceptiblePct: pct };
      }),
    };
  }, [region, period, specimen, cultureRecords]);

  const isSmallSample = dataset.effectiveN < 30;

  const getCellStyle = (pct: number) => {
    if (pct >= 80) return 'bg-emerald-500/25 text-emerald-100 border-emerald-500/40';
    if (pct >= 65) return 'bg-amber-500/25 text-amber-100 border-amber-500/40';
    return 'bg-rose-500/30 text-rose-100 border-rose-500/45';
  };

  const handleExportCsv = () => {
    const headers = ['Wilayah', 'Periode', 'Spesimen', 'Bakteri', 'Antibiotik', 'Persen_Rentan_Simulasi', 'n_Basis'];
    const rows = dataset.cells.map((c) => [
      region,
      period,
      specimen,
      c.bacteria,
      c.antibiotic,
      `${c.susceptiblePct}%`,
      dataset.effectiveN,
    ]);
    downloadCsv(`antibiogram-simulasi-${region.toLowerCase()}-${period.replace(' ', '')}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
            <span>MODUL TR-2 • PILAR TRACE • ANTIBIOGRAM LOKAL</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Heatmap Kepekaan & Tren Resistansi Regional
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <SimulationBadge />
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:border-blue-400"
          >
            <Download className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
            Ekspor CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="h-4 w-4 text-blue-400" aria-hidden="true" />
          <span>Filter Agregat:</span>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300">
          <span>Wilayah</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionId)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white"
          >
            <option value="Jateng">Jateng (n kecil)</option>
            <option value="DIY">DIY</option>
            <option value="Jabodetabek">Jabodetabek</option>
            <option value="Bali">Bali</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-300">
          <span>Periode</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white"
          >
            <option value="Q3 2026">Q3 2026</option>
            <option value="Q2 2026">Q2 2026</option>
            <option value="Q1 2026">Q1 2026</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-300">
          <span>Spesimen</span>
          <select
            value={specimen}
            onChange={(e) => setSpecimen(e.target.value as typeof specimen)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white"
          >
            <option value="Semua">Semua Spesimen</option>
            <option value="Swab Kulit">Swab Kulit</option>
            <option value="Aspirat Pustula">Aspirat Pustula</option>
            <option value="Kerokan Dalam">Kerokan Dalam</option>
          </select>
        </label>

        <span className="ml-auto font-mono text-xs text-slate-300 tabular-nums">
          Total isolat agregat: <strong className="text-white">n = {dataset.effectiveN}</strong>
        </span>
      </section>

      {/* Small Sample Warning */}
      {isSmallSample && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-amber-500/45 bg-amber-500/15 p-4 text-xs text-amber-100"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
          <div>
            <p className="font-semibold text-amber-200">
              Peringatan Sampel Kecil (n = {dataset.effectiveN} &lt; 30): sampel kecil, interpretasi hati-hati.
            </p>
            <p className="mt-1 text-amber-100/85">
              Mengacu standar pelaporan antibiogram kumulatif, angka persentase dengan jumlah isolat di bawah 30 tidak boleh disimpulkan sebagai prevalensi populasi regional secara luas.
            </p>
          </div>
        </div>
      )}

      {/* Heatmap Matrix */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Matriks Persentase Kepekaan (% Rentan / Susceptible) — {region} ({period})
            </h3>
            <p className="text-xs text-slate-400">
              Semua angka di bawah merupakan data simulasi teragregasi tanpa identitas pemilik.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <span className="h-2.5 w-2.5 rounded bg-emerald-500/60" /> ≥80% Rentan
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300">
              <span className="h-2.5 w-2.5 rounded bg-amber-500/60" /> 65–79% Sedang
            </span>
            <span className="inline-flex items-center gap-1 text-rose-300">
              <span className="h-2.5 w-2.5 rounded bg-rose-500/60" /> &lt;65% Rendah
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-separate border-spacing-1.5 text-xs">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-mono text-[11px] text-slate-400 uppercase">
                  Isolat Bakteri
                </th>
                {ANTIBIOGRAM_ANTIBIOTICS.map((ab) => (
                  <th
                    key={ab}
                    className="px-2 py-2 text-center font-medium text-slate-300"
                  >
                    {ab}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ANTIBIOGRAM_BACTERIA.map((bact) => (
                <tr key={bact}>
                  <td className="rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-3 font-medium italic text-white">
                    {bact}
                  </td>
                  {ANTIBIOGRAM_ANTIBIOTICS.map((ab) => {
                    const cell = dataset.cells.find(
                      (c) => c.bacteria === bact && c.antibiotic === ab
                    );
                    const pct = cell?.susceptiblePct ?? 70;
                    return (
                      <td
                        key={`${bact}-${ab}`}
                        className={`rounded-xl border px-2 py-3 text-center font-mono font-bold tabular-nums ${getCellStyle(
                          pct
                        )}`}
                      >
                        {pct}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trend Line Chart */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Tren Simulasi Resistansi MRSP vs Rasio Uji Kultur (6 Bulan)
            </h3>
            <p className="text-xs text-slate-400">
              Ilustrasi bagaimana peningkatan rasio kultur beriringan dengan penurunan penggunaan sefalosporin generasi ketiga.
            </p>
          </div>
          <SimulationBadge label="TREN SIMULASI" />
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RESISTANCE_TREND_SERIES} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="mrspPct"
                name="Proporsi MRSP Lokal (%)"
                stroke="#F43F5E"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="ceph3Pct"
                name="Sefalosporin Gen-3 (%)"
                stroke="#F59E0B"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cultureRatio"
                name="Rasio Kultur/Resep (%)"
                stroke="#14B8A6"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};
