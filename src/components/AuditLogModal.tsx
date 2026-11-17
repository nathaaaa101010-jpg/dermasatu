import React from 'react';
import { CheckCircle2, Lock, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { useDermaStore } from '../store/useDermaStore';

export const AuditLogModal: React.FC = () => {
  const { auditLogOpen, setModal, auditLogs } = useDermaStore();

  if (!auditLogOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
        {/* Dark Header */}
        <div className="flex flex-col gap-3 bg-[#0B1222] px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 id="audit-modal-title" className="font-display text-lg font-bold text-white">
                Log Audit & Jejak Kepatuhan UU PDP
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Integritas Hash 100% Valid (simulasi)
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-slate-400">
              Immutable Ledger • Terenkripsi
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal('auditLogOpen', false)}
            aria-label="Tutup modal log audit"
            className="self-start rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white sm:self-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Privacy Principles Callout */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3.5">
          <div className="flex items-start gap-2.5 text-xs text-slate-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">
                Prinsip Tata Kelola Privasi DERMA-SATU (Selaras UU PDP):
              </p>
              <p className="text-slate-600">
                Data identitas pemilik dipisahkan menggunakan <strong>pseudonim</strong> dari data hasil kultur laboratorium; antibiogram regional hanya menggunakan <strong>data teragregasi</strong>; dan pemilik dapat mengatur atau mencabut <strong>consent per jenis data</strong> secara langsung.
              </p>
            </div>
          </div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
          {auditLogs.map((log) => (
            <article
              key={log.id}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-semibold text-teal-300">
                    {log.id}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{log.roleLabel}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{log.timestampWib}</span>
              </div>

              <h3 className="mt-2 font-display text-sm font-bold text-slate-900">
                {log.action}
              </h3>

              <div className="mt-2.5 grid grid-cols-1 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 sm:grid-cols-2">
                <div>
                  <span className="text-slate-400">Pelaku:</span>{' '}
                  <span className="font-medium text-slate-800">{log.actor}</span>
                </div>
                <div>
                  <span className="text-slate-400">Sasaran Data:</span>{' '}
                  <span className="font-medium text-slate-800">{log.dataTarget}</span>
                </div>
                <div>
                  <span className="text-slate-400">IP Simulasi:</span>{' '}
                  <span className="font-mono text-slate-700">{log.ipAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400">SHA256:</span>{' '}
                  <span className="font-mono text-slate-700">{log.hashSha256}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>Kunci Publik: RSA-4096 (simulasi)</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-500">
              {auditLogs.length} entri tercatat pada sesi ini
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-700">
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
              Data Simulasi
            </span>
            <button
              type="button"
              onClick={() => setModal('auditLogOpen', false)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              Tutup Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
