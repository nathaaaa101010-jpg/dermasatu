import React, { useState } from 'react';
import { Calculator, CheckCircle2, FileCheck2, GitBranch, Ticket } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { formatIdr } from '../lib/utils';
import { useDermaStore } from '../store/useDermaStore';

export const Module02CultureVoucher: React.FC = () => {
  const { cases, selectedCaseId, vouchers, requestVoucher, setActiveModule } = useDermaStore();
  const activeCase = cases.find((c) => c.id === selectedCaseId) ?? cases[0];

  // Decision tree evaluation
  const reasons: string[] = [];
  if (activeCase.antibioticLast30d) reasons.push('Paparan antimikroba dalam 30 hari terakhir');
  if (activeCase.immunomodulatorHistory) reasons.push('Riwayat penggunaan imunomodulator');
  if (activeCase.lesionType === 'rekuren-multifokal') reasons.push('Lesi rekuren atau multifokal');
  if (activeCase.treatmentFailure) reasons.push('Kegagalan respons terapi empiris sebelumnya');
  if (activeCase.cytology.rodsFound) reasons.push('Ditemukan bakteri batang pada sitologi');

  const cultureRecommended = reasons.length > 0;

  // Cost-benefit calculator state
  const [cultureFee, setCultureFee] = useState(320000);
  const [voucherSubsidy, setVoucherSubsidy] = useState(225000);
  const [failedEmpiricalCost, setFailedEmpiricalCost] = useState(480000);
  const [repeatVisits, setRepeatVisits] = useState(2);
  const [visitFee, setVisitFee] = useState(125000);

  const ownerNetCultureCost = Math.max(0, cultureFee - voucherSubsidy);
  const totalFailedPathCost = failedEmpiricalCost + repeatVisits * visitFee;
  const estimatedNetSaving = totalFailedPathCost - ownerNetCultureCost;

  const [labPartner, setLabPartner] = useState('Lab Mikrobiologi Veteriner Nusantara');
  const [submittedNote, setSubmittedNote] = useState('');

  const handleClaimVoucher = () => {
    requestVoucher({
      caseId: activeCase.id,
      clinicName: activeCase.clinicName,
      petAlias: activeCase.petAlias,
      reason: reasons.length > 0 ? reasons.join('; ') : 'Konfirmasi diagnostik pencegahan eskalasi',
      subsidyAmountIdr: voucherSubsidy,
      labPartner,
    });
    setSubmittedNote(`Pengajuan voucher untuk kasus ${activeCase.id} berhasil masuk ke Antrean Persetujuan.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
            <span>MODUL 02 • PILAR CONFIRM • KEPUTUSAN KULTUR & VOUCHER</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Pohon Keputusan Uji Kultur & Insentif Voucher Lab
          </h2>
        </div>
        <SimulationBadge />
      </div>

      {/* Decision Tree Output */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                cultureRecommended
                  ? 'border-rose-500/40 bg-rose-500/15 text-rose-300'
                  : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
              }`}
            >
              <GitBranch className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-xs text-slate-400">
                Evaluasi Kasus {activeCase.id} ({activeCase.petAlias})
              </p>
              <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                {cultureRecommended
                  ? 'Kultur & Uji Kepekaan Disarankan'
                  : 'Kultur Belum Wajib — Prioritaskan Terapi Topikal & Pantau'}
              </h3>
              {cultureRecommended ? (
                <ul className="mt-2.5 space-y-1 text-xs text-rose-100">
                  {reasons.map((r) => (
                    <li key={r} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-rose-400" aria-hidden="true" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-slate-300">
                  Tidak ada pemicu risiko tinggi. Bila tidak membaik dalam 7–14 hari, lakukan kultur bakteri.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModule('03')}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:border-teal-400 whitespace-nowrap shrink-0"
          >
            Lihat Rekomendasi Terapi →
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Voucher Claim & Status List */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-6">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-rose-400" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-white">
              Klaim Voucher Subsidi Uji Lab
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Mengatasi hambatan biaya kultur (baseline literatur hanya 15,3% kasus memakai kultur — Santoro dkk., 2026).
          </p>

          <div className="mt-4 space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div>
              <label htmlFor="lab-partner-select" className="block text-xs font-medium text-slate-300">
                Laboratorium Mitra Tujuan (Simulasi)
              </label>
              <select
                id="lab-partner-select"
                value={labPartner}
                onChange={(e) => setLabPartner(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              >
                <option>Lab Mikrobiologi Veteriner Nusantara</option>
                <option>Lab Diagnostik Veteriner Sehat</option>
                <option>Lab Patologi Klinis Fauna</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="text-xs text-slate-300">
                Estimasi subsidi voucher:{' '}
                <strong className="font-mono text-teal-300">{formatIdr(voucherSubsidy)}</strong>
              </div>
              <button
                type="button"
                onClick={handleClaimVoucher}
                className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                Ajukan Voucher Kultur
              </button>
            </div>

            {submittedNote && (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                {submittedNote}
              </p>
            )}
          </div>

          <h4 className="mt-5 font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Riwayat Voucher Klinik (Simulasi)
          </h4>
          <div className="mt-2.5 space-y-2.5">
            {vouchers.map((v) => (
              <div
                key={v.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{v.id}</span>
                    <span className="text-xs text-slate-400">• {v.caseId} ({v.petAlias})</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{v.labPartner}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-slate-200 tabular-nums">
                    {formatIdr(v.subsidyAmountIdr)}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                      v.status === 'Terpakai'
                        ? 'border-teal-500/40 bg-teal-500/15 text-teal-200'
                        : v.status === 'Disetujui'
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                          : v.status === 'Ditolak'
                            ? 'border-rose-500/40 bg-rose-500/15 text-rose-200'
                            : 'border-amber-500/40 bg-amber-500/15 text-amber-200'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost-Benefit Calculator */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-6">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-teal-400" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-white">
              Kalkulator Biaya Kultur vs Kegagalan Terapi
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Ubah parameter simulasi di bawah untuk melihat perbandingan biaya bersih bagi pemilik hewan.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="calc-culture" className="block text-xs text-slate-300">
                Tarif Kultur & Uji Kepekaan (Rp)
              </label>
              <input
                id="calc-culture"
                type="number"
                step={25000}
                value={cultureFee}
                onChange={(e) => setCultureFee(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="calc-subsidy" className="block text-xs text-slate-300">
                Subsidi Voucher DERMA-SATU (Rp)
              </label>
              <input
                id="calc-subsidy"
                type="number"
                step={25000}
                value={voucherSubsidy}
                onChange={(e) => setVoucherSubsidy(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="calc-failed" className="block text-xs text-slate-300">
                Biaya Antibiotik Empiris Gagal/Berulang (Rp)
              </label>
              <input
                id="calc-failed"
                type="number"
                step={25000}
                value={failedEmpiricalCost}
                onChange={(e) => setFailedEmpiricalCost(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="calc-visits" className="block text-xs text-slate-300">
                Kunjungan Ulang Akibat Gagal Terapi (kali)
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  id="calc-visits"
                  type="number"
                  min={0}
                  max={10}
                  value={repeatVisits}
                  onChange={(e) => setRepeatVisits(Math.max(0, Number(e.target.value) || 0))}
                  className="w-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white tabular-nums"
                />
                <input
                  type="number"
                  aria-label="Biaya per kunjungan ulang"
                  step={25000}
                  value={visitFee}
                  onChange={(e) => setVisitFee(Math.max(0, Number(e.target.value) || 0))}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <p className="text-[11px] text-slate-400">Beban Pemilik Setelah Voucher</p>
              <p className="mt-1 font-mono text-lg font-bold text-teal-300 tabular-nums">
                {formatIdr(ownerNetCultureCost)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <p className="text-[11px] text-slate-400">Potensi Biaya Gagal Terapi</p>
              <p className="mt-1 font-mono text-lg font-bold text-rose-300 tabular-nums">
                {formatIdr(totalFailedPathCost)}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <p className="text-[11px] text-emerald-200">Estimasi Penghematan</p>
              <p className="mt-1 font-mono text-lg font-bold text-emerald-300 tabular-nums">
                {estimatedNetSaving >= 0 ? formatIdr(estimatedNetSaving) : `-${formatIdr(Math.abs(estimatedNetSaving))}`}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-slate-400">
            <FileCheck2 className="h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
            <span>
              Angka perhitungan di atas adalah simulasi ekonomi mikro untuk ilustrasi insentif voucher, bukan tarif resmi klinik.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
