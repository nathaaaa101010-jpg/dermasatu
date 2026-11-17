import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Home, Lock, ShieldCheck } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { ConsentSettings } from '../lib/types';
import { useDermaStore } from '../store/useDermaStore';

export const ModuleHM1HomeEducation: React.FC = () => {
  const { homeChecklist, toggleChecklistItem, consentSettings, updateConsentSetting } =
    useDermaStore();
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>('hm-c1');

  const doneCount = homeChecklist.filter((i) => i.completed).length;
  const pct = Math.round((doneCount / homeChecklist.length) * 100);

  const consentItems: {
    key: keyof ConsentSettings;
    title: string;
    desc: string;
  }[] = [
    {
      key: 'shareCultureAnonymized',
      title: 'Sertakan hasil kultur pseudonim ke antibiogram regional',
      desc: 'Hanya mengirim jenis bakteri, wilayah, dan hasil uji kepekaan tanpa nama atau alamat Anda.',
    },
    {
      key: 'sharePrescriptionTrend',
      title: 'Izinkan data terapi anonim untuk pemantauan mutu klinik',
      desc: 'Membantu dinas dan klinik mengevaluasi penurunan penggunaan antibiotik berisiko tinggi.',
    },
    {
      key: 'enableHomeFollowUp',
      title: 'Aktifkan pengingat terapi & pemantauan kebersihan rumah',
      desc: 'Menampilkan pengingat jadwal perawatan kulit serta formulir laporan gejala.',
    },
    {
      key: 'allowLabResultToClinic',
      title: 'Bagikan hasil kultur laboratorium ke klinik pengirim',
      desc: 'Memungkinkan dokter hewan Anda meninjau hasil kepekaan secara langsung.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>MODUL HM-1 • PILAR HOME • EDUKASI & CHECKLIST RUMAH</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Pencegahan Penularan di Rumah Tangga & Kendali Consent Pemilik
          </h2>
        </div>
        <SimulationBadge />
      </div>

      {/* Education Cards in Plain Language */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <h3 className="font-display text-sm font-bold text-white">
              Mengapa Tidak Langsung Antibiotik Minum?
            </h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-200">
            Banyak infeksi kulit superfisial membaik dengan perawatan topikal (sampo/salep antiseptik) sesuai anjuran dokter hewan, tanpa perlu antibiotik minum yang memicu bakteri kebal.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
          <div className="flex items-center gap-2 text-teal-300">
            <Home className="h-4 w-4" aria-hidden="true" />
            <h3 className="font-display text-sm font-bold text-white">
              Apa Artinya Jika Hasil Menunjukkan MRSP?
            </h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            MRSP adalah bakteri kulit anjing yang kebal terhadap beberapa antibiotik umum. Anjing tetap bisa dirawat di rumah dengan menjaga kebersihan tangan, alas tidur, dan alat sisir agar tidak berpindah ke hewan lain atau anggota keluarga rentan.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
          <div className="flex items-center gap-2 text-blue-300">
            <Lock className="h-4 w-4" aria-hidden="true" />
            <h3 className="font-display text-sm font-bold text-white">
              Privasi Anda Dilindungi Pseudonim
            </h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Catatan medis rumah tangga menggunakan kode pseudonim (PM-2026-041). Data antibiogram regional hanya memakai angka gabungan tanpa nama pemilik.
          </p>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Interactive Checklist */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Checklist Kebersihan Rumah Tangga
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Centang langkah yang sudah diterapkan di rumah.
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-300 tabular-nums">
              {pct}% ({doneCount}/{homeChecklist.length})
            </span>
          </div>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-4 space-y-2.5">
            {homeChecklist.map((item) => {
              const isExpanded = expandedWhyId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition ${
                    item.completed
                      ? 'border-emerald-500/35 bg-emerald-500/10'
                      : 'border-slate-800 bg-slate-950/70'
                  }`}
                >
                  <div className="flex items-start gap-3 p-3.5">
                    <input
                      id={item.id}
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={item.id}
                        className={`block cursor-pointer text-xs font-medium ${
                          item.completed ? 'text-emerald-100' : 'text-slate-200'
                        }`}
                      >
                        {item.title}
                      </label>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-slate-400">
                          {item.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedWhyId(isExpanded ? null : item.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-300 hover:text-teal-200"
                        >
                          Mengapa ini penting?
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      {isExpanded && (
                        <p className="mt-2 rounded-lg bg-slate-950/80 p-2.5 text-xs leading-relaxed text-slate-300">
                          {item.whyImportant}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Granular Consent Management */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-white">
              Pengaturan Consent Granular (UU PDP)
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Setiap perubahan persetujuan langsung tercatat di Log Audit dan dapat dicabut kapan saja.
          </p>

          <div className="mt-4 space-y-3">
            {consentItems.map((c) => {
              const active = consentSettings[c.key];
              return (
                <div
                  key={c.key}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-white">{c.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                        {c.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      aria-label={c.title}
                      onClick={() => updateConsentSetting(c.key, !active)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition ${
                        active
                          ? 'border-emerald-400 bg-emerald-500'
                          : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px]">
                    <CheckCircle2
                      className={`h-3 w-3 ${active ? 'text-emerald-400' : 'text-slate-500'}`}
                      aria-hidden="true"
                    />
                    <span className={active ? 'text-emerald-300' : 'text-slate-400'}>
                      {active ? 'Persetujuan Aktif' : 'Persetujuan Dicabut'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
