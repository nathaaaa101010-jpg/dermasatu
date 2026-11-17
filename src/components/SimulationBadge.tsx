import React from 'react';
import { AlertTriangle, FlaskConical } from 'lucide-react';

export const SimulationBadge: React.FC<{ label?: string; className?: string }> = ({
  label = 'DATA SIMULASI',
  className = '',
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-md border border-amber-400/35 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-amber-300 uppercase whitespace-nowrap shrink-0 ${className}`}
  >
    <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    {label}
  </span>
);

export const ClinicalDisclaimerBar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    role="note"
    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-100 ${className}`}
  >
    <div className="flex items-center gap-2.5">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
      <span>
        <strong>Prototipe konsep.</strong> Bukan alat diagnosis atau resep. Keputusan klinis tetap pada dokter hewan. Kelayakan dan dampak DERMA-SATU masih perlu diuji.
      </span>
    </div>
    <SimulationBadge />
  </div>
);
