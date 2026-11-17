import React from 'react';
import { Check, CheckCircle2, FileSignature, X } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { useDermaStore } from '../store/useDermaStore';

export const Module07ApprovalQueue: React.FC = () => {
  const { approvalQueue, resolveApprovalItem } = useDermaStore();

  const pendingCount = approvalQueue.filter((a) => a.status === 'Menunggu').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-teal-400">
            <span className="h-2 w-2 rounded-full bg-teal-400" aria-hidden="true" />
            <span>MODUL 07 • GOVERNANCE • ANTREAN PERSETUJUAN</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Verifikasi Voucher Lab, Konfirmasi Kultur, & Akses Data ({pendingCount} Menunggu)
          </h2>
        </div>
        <SimulationBadge />
      </div>

      <div className="space-y-3">
        {approvalQueue.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 transition hover:border-slate-700"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs font-bold text-teal-300">
                    {item.id}
                  </span>
                  <span className="rounded border border-slate-700 bg-slate-950 px-2 py-0.5 text-xs font-medium text-slate-200">
                    {item.type}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    • {item.region} • {item.submittedAt}
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-white">
                  {item.targetRef} — {item.requester}
                </h3>
                <p className="text-xs leading-relaxed text-slate-300">{item.summary}</p>

                {item.digitalSignatureHash && (
                  <p className="flex items-center gap-1.5 pt-1 font-mono text-[11px] text-emerald-300">
                    <FileSignature className="h-3.5 w-3.5" aria-hidden="true" />
                    Tanda Tangan Digital Simulasi: {item.digitalSignatureHash}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {item.status === 'Menunggu' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => resolveApprovalItem(item.id, 'Disetujui')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Setujui & Tanda Tangani
                    </button>
                    <button
                      type="button"
                      onClick={() => resolveApprovalItem(item.id, 'Ditolak')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/25"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                      Tolak
                    </button>
                  </>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold ${
                      item.status === 'Disetujui'
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                        : 'border-rose-500/40 bg-rose-500/15 text-rose-200'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
