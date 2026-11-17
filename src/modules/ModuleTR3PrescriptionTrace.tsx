import React, { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, CheckCircle2, PackageCheck, Search } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { useDermaStore } from '../store/useDermaStore';

const CLASS_COLORS: Record<string, string> = {
  'Topikal Antiseptik': '#10B981',
  'Sefalosporin Gen-1': '#3B82F6',
  'Klindamisin/Linkosamid': '#14B8A6',
  'Sefalosporin Gen-3': '#F43F5E',
  'Fluorokuinolon': '#F59E0B',
  'Tetrasiklin': '#8B5CF6',
};

export const ModuleTR3PrescriptionTrace: React.FC = () => {
  const { prescriptionLogs } = useDermaStore();
  const [selectedBatch, setSelectedBatch] = useState(
    prescriptionLogs[2]?.batchCode ?? 'BCH-CVF-1102'
  );
  const [filterOnlyNoCulture, setFilterOnlyNoCulture] = useState(false);

  const filteredLogs = useMemo(
    () =>
      filterOnlyNoCulture
        ? prescriptionLogs.filter((l) => !l.hasCulture)
        : prescriptionLogs,
    [prescriptionLogs, filterOnlyNoCulture]
  );

  const donutData = useMemo(() => {
    const counts: Record<string, number> = {};
    prescriptionLogs.forEach((p) => {
      counts[p.drugClass] = (counts[p.drugClass] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: CLASS_COLORS[name] ?? '#64748B',
    }));
  }, [prescriptionLogs]);

  const batchLog =
    prescriptionLogs.find((p) => p.batchCode === selectedBatch) ?? prescriptionLogs[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
            <span>MODUL TR-3 • PILAR TRACE • JEJAK RESEP & OBAT</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Penelusuran Peresepan Antibiotik & Batch Obat Keras Veteriner
          </h2>
        </div>
        <SimulationBadge />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Donut Chart */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-5">
          <h3 className="font-display text-base font-bold text-white">
            Proporsi Golongan Terapi Tercatat
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Memantau proporsi topikal dibanding sistemik dan sefalosporin generasi ketiga.
          </p>

          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-lg bg-slate-950/70 px-2.5 py-1.5 text-xs">
                <span className="flex items-center gap-2 truncate text-slate-200">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="truncate">{d.name}</span>
                </span>
                <span className="font-mono font-bold text-white tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Batch Traceability Mockup */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-blue-400" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-white">
                Mockup Alur Pelacakan Batch Obat Keras & Resep Dokter Hewan
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                aria-label="Pilih kode batch untuk dilacak"
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-xs text-white"
              >
                {prescriptionLogs.map((p) => (
                  <option key={p.id} value={p.batchCode}>
                    {p.batchCode} ({p.drugClass})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {batchLog && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <p className="font-mono text-[11px] text-slate-400 uppercase">1. Distributor Terdaftar</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  PT Distribusi Obat Hewan Nusantara (Simulasi)
                </p>
                <p className="mt-1 font-mono text-xs text-teal-300">Batch: {batchLog.batchCode}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <p className="font-mono text-[11px] text-slate-400 uppercase">2. Klinik Penerima</p>
                <p className="mt-1 text-sm font-semibold text-white">{batchLog.clinicName}</p>
                <p className="mt-1 text-xs text-slate-400">Wilayah {batchLog.region}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <p className="font-mono text-[11px] text-slate-400 uppercase">3. Verifikasi Resep</p>
                <p className="mt-1 text-sm font-semibold text-white">{batchLog.dispensedBy}</p>
                <p className="mt-1 font-mono text-xs text-slate-300">
                  {batchLog.id} • Kasus {batchLog.caseId}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-300">
            Alur pelacakan batch membantu regulator mengaudit kesesuaian distribusi obat keras veteriner dengan resep dokter hewan berizin serta mendeteksi pola peresepan tanpa uji kultur.
          </div>
        </section>
      </div>

      {/* Prescriptions Table */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-base font-bold text-white">
            Log Peresepan & Pemberian Terapi ({filteredLogs.length})
          </h3>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={filterOnlyNoCulture}
              onChange={(e) => setFilterOnlyNoCulture(e.target.checked)}
              className="accent-rose-500"
            />
            Hanya tampilkan peresepan tanpa kultur
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-2.5 pr-4">Tanggal</th>
                <th className="py-2.5 pr-4">Klinik (Simulasi)</th>
                <th className="py-2.5 pr-4">Golongan</th>
                <th className="py-2.5 pr-4">Durasi</th>
                <th className="py-2.5 pr-4">Status Kultur</th>
                <th className="py-2.5">Penanda Pengawasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-3 pr-4 font-mono text-slate-300 whitespace-nowrap">{log.date}</td>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-white">{log.clinicName}</p>
                    <p className="font-mono text-[11px] text-slate-400">{log.id} • {log.batchCode}</p>
                  </td>
                  <td className="py-3 pr-4 font-medium">{log.drugClass}</td>
                  <td className="py-3 pr-4 font-mono tabular-nums">{log.durationDays} hari</td>
                  <td className="py-3 pr-4">
                    {log.hasCulture ? (
                      <span className="inline-flex items-center gap-1 text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Ada Kultur
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 font-mono text-[11px] text-amber-200">
                        Tanpa Kultur
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    {log.isThirdGenCeph ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 font-mono text-[11px] font-semibold text-rose-200">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        Sefalosporin Gen-3
                      </span>
                    ) : (
                      <span className="text-slate-400">Sesuai alur</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
