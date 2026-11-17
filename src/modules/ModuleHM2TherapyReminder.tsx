import React, { useState } from 'react';
import { AlertCircle, BellRing, CalendarClock, CheckCircle2 } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { AdverseReport } from '../lib/types';
import { useDermaStore } from '../store/useDermaStore';

export const ModuleHM2TherapyReminder: React.FC = () => {
  const {
    therapySchedules,
    toggleTherapyAdherence,
    adverseReports,
    submitAdverseReport,
    cases,
    selectedCaseId,
  } = useDermaStore();

  const activeCase = cases.find((c) => c.id === selectedCaseId) ?? cases[0];
  const [simNotifBanner, setSimNotifBanner] = useState(false);

  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState<AdverseReport['severity']>('Ringan');
  const [reportSent, setReportSent] = useState(false);

  const adheredCount = therapySchedules.filter((t) => t.adhered).length;
  const adherencePct = Math.round((adheredCount / therapySchedules.length) * 100);

  const handleAdverseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom.trim()) return;
    submitAdverseReport({
      petAlias: activeCase.petAlias,
      symptom: symptom.trim(),
      severity,
    });
    setSymptom('');
    setReportSent(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>MODUL HM-2 • PILAR HOME • PENGINGAT TERAPI</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Jadwal Perawatan, Kepatuhan, & Pelaporan Efek Samping
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <SimulationBadge />
          <button
            type="button"
            onClick={() => setSimNotifBanner(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
            Uji Notifikasi Pengingat
          </button>
        </div>
      </div>

      {simNotifBanner && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-400/40 bg-teal-500/15 px-4 py-3 text-xs text-teal-100"
        >
          <div className="flex items-center gap-2.5">
            <BellRing className="h-4 w-4 text-teal-300" aria-hidden="true" />
            <span>
              <strong>Simulasi Pengingat Pemilik:</strong> Waktunya perawatan kulit topikal malam untuk {activeCase.petAlias} sesuai jadwal klinik.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSimNotifBanner(false)}
            className="rounded-lg bg-teal-500/20 px-2.5 py-1 text-[11px] font-semibold text-teal-200 hover:bg-teal-500/30"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Schedule & Adherence */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-7">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-white">
                Jadwal Terapi & Kontrol ({activeCase.petAlias})
              </h3>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-300 tabular-nums">
              Kepatuhan: {adherencePct}%
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {therapySchedules.map((sch) => (
              <div
                key={sch.id}
                className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                  sch.adhered
                    ? 'border-emerald-500/35 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] font-semibold text-teal-300">
                      {sch.timeLabel}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{sch.type}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-white">{sch.taskTitle}</p>
                  <p className="mt-1 text-xs text-slate-400">{sch.note}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleTherapyAdherence(sch.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                    sch.adhered
                      ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
                      : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400/50'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {sch.adhered ? 'Sudah Dikerjakan' : 'Tandai Selesai'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Report Adverse Effects / Worsening */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-5">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-400" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-white">
              Lapor Efek Samping atau Perburukan
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Jika muncul kemerahan baru, gatal berat, atau lesi meluas, kirim catatan segera ke klinik dokter hewan Anda.
          </p>

          <form onSubmit={handleAdverseSubmit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="ae-severity" className="block text-xs text-slate-300">
                Tingkat Kekhawatiran
              </label>
              <select
                id="ae-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AdverseReport['severity'])}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="Ringan">Ringan (pantau)</option>
                <option value="Sedang">Sedang (butuh saran klinik)</option>
                <option value="Perlu Evaluasi Klinik">Perlu Evaluasi Klinik Segera</option>
              </select>
            </div>

            <div>
              <label htmlFor="ae-symptom" className="block text-xs text-slate-300">
                Deskripsi Gejala yang Diamati
              </label>
              <textarea
                id="ae-symptom"
                rows={3}
                required
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="Contoh: Area perut masih tampak basah dan anjing sering menjilat..."
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-400"
            >
              Lapor Efek Samping atau Perburukan
            </button>

            {reportSent && (
              <p className="text-xs text-emerald-300">
                Laporan simulasi diterima oleh tim klinik dan dicatat di Log Audit.
              </p>
            )}
          </form>

          <h4 className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Riwayat Laporan Pemilik ({adverseReports.length})
          </h4>
          <div className="mt-2 space-y-2">
            {adverseReports.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-white">{r.id}</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-amber-200">
                    {r.severity}
                  </span>
                </div>
                <p className="mt-1 text-slate-300">{r.symptom}</p>
                <p className="mt-1 font-mono text-[10px] text-slate-500">
                  {r.date} • {r.status}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
