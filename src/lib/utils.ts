import { PatientCase } from './types';

export function formatWibNow(): string {
  const now = new Date();
  const datePart = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(now);
  const timePart = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(now);
  return `${datePart}, ${timePart} WIB`;
}

export function generateDummySha256(seed: string): string {
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  const partA = (h1 >>> 0).toString(16).padStart(8, '0');
  const partB = (h2 >>> 0).toString(16).padStart(8, '0');
  const partC = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  return `${partA}${partB}...${partC}`;
}

export function generateLogId(): string {
  const num = Math.floor(10000 + Math.random() * 89999);
  return `LOG-${num}`;
}

export function formatIdr(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface MrspRiskAssessment {
  score: number;
  level: 'Rendah' | 'Sedang' | 'Tinggi';
  factors: string[];
}

export function calculateMrspRisk(patient: PatientCase): MrspRiskAssessment {
  let score = 15;
  const factors: string[] = [];

  if (patient.antibioticLast30d) {
    score += 35;
    factors.push('Paparan antimikroba dalam 30 hari terakhir (literatur menunjukkan kenaikan resistansi metisilin dari 48,1% menjadi 60,7% — Zur dkk., 2016)');
  }
  if (patient.priorBetaLactamWeeks >= 2) {
    score += 20;
    factors.push(`Riwayat paparan beta-laktam berulang (${patient.priorBetaLactamWeeks} minggu)`);
  }
  if (patient.immunomodulatorHistory) {
    score += 15;
    factors.push('Riwayat penggunaan imunomodulator');
  }
  if (patient.treatmentFailure || patient.lesionType === 'rekuren-multifokal') {
    score += 15;
    factors.push('Riwayat kegagalan terapi empiris atau lesi rekuren multifokal');
  }

  const clamped = Math.min(95, score);
  const level: 'Rendah' | 'Sedang' | 'Tinggi' =
    clamped >= 65 ? 'Tinggi' : clamped >= 40 ? 'Sedang' : 'Rendah';

  if (factors.length === 0) {
    factors.push('Tidak ada faktor risiko utama yang tercatat; tetap konfirmasi dengan sitologi sebelum keputusan terapi.');
  }

  return { score: clamped, level, factors };
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escapeCell = (val: string | number) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((r) => r.map(escapeCell).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
