import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertCircle, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { CLINIC_KPI_ROWS, RESISTANCE_TREND_SERIES } from '../data/mockData';
import { useDermaStore } from '../store/useDermaStore';

export const Module04MonitoringEval: React.FC = () => {
  const { cultureRatioTarget, setCultureRatioTarget } = useDermaStore();

  const totalRx = CLINIC_KPI_ROWS.reduce((acc, r) => acc + r.totalAntimicrobialRx, 0);
  const totalCultures = CLINIC_KPI_ROWS.reduce((acc, r) => acc + r.culturePerformed, 0);
  const currentCultureRatio = ((totalCultures / totalRx) * 100).toFixed(1);
  const avgCeph3 = (
    CLINIC_KPI_ROWS.reduce((acc, r) => acc + r.thirdGenCephPct, 0) / CLINIC_KPI_ROWS.length
  ).toFixed(1);
  const avgMrsp = (
    CLINIC_KPI_ROWS.reduce((acc, r) => acc + r.mrspLocalPct, 0) / CLINIC_KPI_ROWS.length
  ).toFixed(1);
  const avgAdherence = Math.round(
    CLINIC_KPI_ROWS.reduce((acc, r) => acc + r.adherencePct, 0) / CLINIC_KPI_ROWS.length
  );

  const renderStatusPill = (status: string) => {
    if (status === 'Baik') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-200">
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
          Hijau • Baik
        </span>
      );
    }
    if (status === 'Perlu Perhatian') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-200">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          Kuning • Perhatian
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-rose-200">
        <AlertCircle className="h-3 w-3" aria-hidden="true" />
        Merah • Intervensi
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-teal-400">
            <span className="h-2 w-2 rounded-full bg-teal-400" aria-hidden="true" />
            <span>MODUL 04 • MONITORING & EVALUASI BERKELANJUTAN</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Dasbor Indikator Stewardship Klinik & Wilayah
          </h2>
        </div>
        <SimulationBadge />
      </div>

      {/* Adjustable Target Slider */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/75 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-teal-400 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-white">
              Target Rasio Kultur per Peresepan Antimikroba: <span className="font-mono text-teal-300">{cultureRatioTarget}%</span>
            </p>
            <p className="text-xs text-slate-400">
              Baseline literatur: 15,3% pada 22 praktik rujukan dermatologi (Santoro dkk., 2026).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400">20%</span>
          <input
            type="range"
            min={20}
            max={80}
            value={cultureRatioTarget}
            onChange={(e) => setCultureRatioTarget(Number(e.target.value))}
            aria-label="Atur target rasio kultur per peresepan"
            className="w-44 accent-teal-400"
          />
          <span className="font-mono text-xs text-slate-400">80%</span>
        </div>
      </section>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
          <p className="text-xs text-slate-400">Rasio Kultur / Resep</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-teal-300 tabular-nums">
            {currentCultureRatio}%
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate-400">
            Baseline 15,3% • Target {cultureRatioTarget}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
          <p className="text-xs text-slate-400">Proporsi Sefalosporin Gen-3</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-amber-300 tabular-nums">
            {avgCeph3}%
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate-400">
            Baseline literatur: 43,9%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
          <p className="text-xs text-slate-400">Rata-rata MRSP Lokal</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-rose-300 tabular-nums">
            {avgMrsp}%
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate-400">
            Data simulasi teragregasi
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
          <p className="text-xs text-slate-400">Kepatuhan Terapi Rumah</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-emerald-300 tabular-nums">
            {avgAdherence}%
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate-400">
            Pelaporan aplikasi pemilik
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
          <p className="text-xs text-slate-400">Klinik Simulasi Aktif</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-white tabular-nums">
            {CLINIC_KPI_ROWS.length}
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate-400">
            DIY, Jateng, Jabodetabek, Bali
          </p>
        </div>
      </div>

      {/* Chart */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-base font-bold text-white">
            Perbandingan Tren Bulanan Rasio Kultur vs Penggunaan Sefalosporin Gen-3
          </h3>
          <SimulationBadge label="GRAFIK SIMULASI" />
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RESISTANCE_TREND_SERIES} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
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
              <Bar dataKey="cultureRatio" name="Rasio Kultur (%)" fill="#14B8A6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ceph3Pct" name="Sefalosporin Gen-3 (%)" fill="#F43F5E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Clinic Table */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
        <h3 className="mb-4 font-display text-base font-bold text-white">
          Kinerja Stewardship per Klinik Mitra (Fiktif / Simulasi)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-2.5 pr-4">Nama Klinik (Simulasi)</th>
                <th className="py-2.5 pr-4">Wilayah</th>
                <th className="py-2.5 pr-4 text-right">Rasio Kultur</th>
                <th className="py-2.5 pr-4 text-right">Sefalosporin Gen-3</th>
                <th className="py-2.5 pr-4 text-right">MRSP Lokal</th>
                <th className="py-2.5 pr-4 text-right">Kepatuhan</th>
                <th className="py-2.5">Indikator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {CLINIC_KPI_ROWS.map((row) => {
                const ratio = Math.round((row.culturePerformed / row.totalAntimicrobialRx) * 100);
                return (
                  <tr key={row.id} className="hover:bg-slate-800/30">
                    <td className="py-3 pr-4 font-medium text-white">{row.clinicName}</td>
                    <td className="py-3 pr-4 text-slate-300">{row.region}</td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">
                      {ratio}% ({row.culturePerformed}/{row.totalAntimicrobialRx})
                    </td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">
                      {row.thirdGenCephPct}%
                    </td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">
                      {row.mrspLocalPct}%
                    </td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">
                      {row.adherencePct}%
                    </td>
                    <td className="py-3">{renderStatusPill(row.status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
