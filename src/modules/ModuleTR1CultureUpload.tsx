import React, { useState } from 'react';
import Papa from 'papaparse';
import { CheckCircle2, FileSpreadsheet, ShieldCheck, UploadCloud } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { CultureRecord, RegionId } from '../lib/types';
import { useDermaStore } from '../store/useDermaStore';

interface ParsedCsvRow {
  sampleCode: string;
  region: RegionId;
  specimen: CultureRecord['specimen'];
  bacteria: CultureRecord['bacteria'];
  mrspDetected: boolean;
  mecAPositive: boolean;
}

const SAMPLE_CSV = `sampleCode,region,specimen,bacteria,mrspDetected,mecAPositive
SWB-DIY-2026-129,DIY,Swab Kulit,S. pseudintermedius,true,true
ASP-JTG-2026-044,Jateng,Aspirat Pustula,S. pseudintermedius,false,false
SWB-BAL-2026-019,Bali,Swab Kulit,S. aureus,false,false`;

export const ModuleTR1CultureUpload: React.FC = () => {
  const { cultureRecords, addCultureRecords } = useDermaStore();

  const [sampleCode, setSampleCode] = useState('SWB-DIY-2026-135');
  const [region, setRegion] = useState<RegionId>('DIY');
  const [specimen, setSpecimen] = useState<CultureRecord['specimen']>('Swab Kulit');
  const [bacteria, setBacteria] = useState<CultureRecord['bacteria']>('S. pseudintermedius');
  const [mrspDetected, setMrspDetected] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);
  const [csvPreview, setCsvPreview] = useState<ParsedCsvRow[]>([]);
  const [feedback, setFeedback] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked || !sampleCode.trim()) return;
    addCultureRecords([
      {
        sampleCode: sampleCode.trim(),
        region,
        specimen,
        bacteria,
        mrspDetected,
        mecAPositive: mrspDetected,
        susceptibility: {
          Oksasilin: mrspDetected ? 'R' : 'S',
          Sefaleksin: mrspDetected ? 'R' : 'S',
          Klindamisin: mrspDetected ? 'R' : 'S',
          Doksisiklin: 'S',
          Kloramfenikol: 'S',
          Mupirosin: 'S',
        },
        period: 'Q3 2026',
        consentVerified: true,
        uploadedBy: 'Lab Mikrobiologi Veteriner Nusantara (Simulasi)',
      },
    ]);
    setFeedback(`Isolat ${sampleCode} berhasil dikirim ke Antibiogram Regional (tanpa identitas pemilik).`);
    setSampleCode(`SWB-${region.slice(0, 3).toUpperCase()}-2026-${Math.floor(200 + Math.random() * 700)}`);
  };

  const parseCsvText = (csvText: string) => {
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    const rows: ParsedCsvRow[] = parsed.data
      .filter((r) => r.sampleCode)
      .map((r) => ({
        sampleCode: r.sampleCode.trim(),
        region: (['Jateng', 'DIY', 'Jabodetabek', 'Bali'].includes(r.region) ? r.region : 'DIY') as RegionId,
        specimen: (['Swab Kulit', 'Aspirat Pustula', 'Kerokan Dalam'].includes(r.specimen)
          ? r.specimen
          : 'Swab Kulit') as CultureRecord['specimen'],
        bacteria: (['S. pseudintermedius', 'S. aureus', 'Lainnya (Gram-positif)'].includes(r.bacteria)
          ? r.bacteria
          : 'S. pseudintermedius') as CultureRecord['bacteria'],
        mrspDetected: String(r.mrspDetected).toLowerCase() === 'true',
        mecAPositive: String(r.mecAPositive).toLowerCase() === 'true',
      }));
    setCsvPreview(rows);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        parseCsvText(reader.result);
      }
    };
    reader.readAsText(file);
  };

  const handlePushCsv = () => {
    if (!consentChecked || csvPreview.length === 0) return;
    addCultureRecords(
      csvPreview.map((row) => ({
        ...row,
        susceptibility: {
          Oksasilin: row.mrspDetected ? 'R' : 'S',
          Sefaleksin: row.mrspDetected ? 'R' : 'S',
          Doksisiklin: 'S',
          Mupirosin: 'S',
        },
        period: 'Q3 2026',
        consentVerified: true,
        uploadedBy: 'Unggah Batch CSV Lab (Simulasi)',
      }))
    );
    setFeedback(`${csvPreview.length} baris hasil kultur dari CSV berhasil dikirim ke Antibiogram Regional.`);
    setCsvPreview([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
            <span>MODUL TR-1 • PILAR TRACE • UNGGAH HASIL KULTUR</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Input Hasil Kultur & Uji Kepekaan Terpseudonim
          </h2>
        </div>
        <SimulationBadge />
      </div>

      {/* Explicit Consent Notice */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-1 h-4 w-4 accent-blue-400"
          />
          <div className="text-xs text-slate-200">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-400" aria-hidden="true" />
              Verifikasi Persetujuan Data Agregat (Wajib sebelum kirim)
            </span>
            <p className="mt-1 text-slate-300">
              Saya memastikan data yang diunggah hanya memuat kode sampel pseudonim, wilayah, jenis spesimen, bakteri, dan profil kepekaan—tanpa nama, alamat, atau nomor kontak pemilik hewan.
            </p>
          </div>
        </label>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-xs font-medium text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Manual Form */}
        <form
          onSubmit={handleManualSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-5"
        >
          <h3 className="font-display text-base font-bold text-white">
            Entri Manual Satu Isolat
          </h3>
          <div className="mt-4 space-y-3.5">
            <div>
              <label htmlFor="tr1-code" className="block text-xs text-slate-300">
                Kode Sampel Pseudonim
              </label>
              <input
                id="tr1-code"
                type="text"
                required
                value={sampleCode}
                onChange={(e) => setSampleCode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 font-mono text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="tr1-region" className="block text-xs text-slate-300">
                  Wilayah
                </label>
                <select
                  id="tr1-region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as RegionId)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="DIY">DIY</option>
                  <option value="Jateng">Jateng</option>
                  <option value="Jabodetabek">Jabodetabek</option>
                  <option value="Bali">Bali</option>
                </select>
              </div>
              <div>
                <label htmlFor="tr1-spec" className="block text-xs text-slate-300">
                  Jenis Spesimen
                </label>
                <select
                  id="tr1-spec"
                  value={specimen}
                  onChange={(e) => setSpecimen(e.target.value as CultureRecord['specimen'])}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option>Swab Kulit</option>
                  <option>Aspirat Pustula</option>
                  <option>Kerokan Dalam</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tr1-bact" className="block text-xs text-slate-300">
                Bakteri Teridentifikasi
              </label>
              <select
                id="tr1-bact"
                value={bacteria}
                onChange={(e) => setBacteria(e.target.value as CultureRecord['bacteria'])}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option>S. pseudintermedius</option>
                <option>S. aureus</option>
                <option>Lainnya (Gram-positif)</option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={mrspDetected}
                onChange={(e) => setMrspDetected(e.target.checked)}
                className="accent-rose-500"
              />
              Resistan Oksasilin / Fenotip MRSP atau gen mecA(+)
            </label>

            <button
              type="submit"
              disabled={!consentChecked}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <UploadCloud className="h-4 w-4" aria-hidden="true" />
              Kirim ke Antibiogram Regional
            </button>
          </div>
        </form>

        {/* CSV Upload & Preview */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-400" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-white">
                Unggah Batch CSV Laboratorium (Parser Sisi Klien)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => parseCsvText(SAMPLE_CSV)}
              className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
            >
              Muat Contoh CSV Dummy
            </button>
          </div>

          <div className="mt-4">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-5 text-center transition hover:border-blue-500/50">
              <UploadCloud className="h-7 w-7 text-blue-400" aria-hidden="true" />
              <span className="mt-2 text-xs font-medium text-slate-200">
                Pilih berkas .csv dari komputer atau klik "Muat Contoh CSV Dummy"
              </span>
              <span className="mt-1 font-mono text-[11px] text-slate-400">
                Kolom: sampleCode, region, specimen, bacteria, mrspDetected, mecAPositive
              </span>
              <input type="file" accept=".csv" onChange={handleFileChange} className="sr-only" />
            </label>
          </div>

          {csvPreview.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-white">
                Pratinjau CSV ({csvPreview.length} baris siap validasi):
              </p>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="px-3 py-2">Kode Sampel</th>
                      <th className="px-3 py-2">Wilayah</th>
                      <th className="px-3 py-2">Spesimen</th>
                      <th className="px-3 py-2">Bakteri</th>
                      <th className="px-3 py-2">MRSP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50 text-slate-200">
                    {csvPreview.map((r) => (
                      <tr key={r.sampleCode}>
                        <td className="px-3 py-2 font-mono">{r.sampleCode}</td>
                        <td className="px-3 py-2">{r.region}</td>
                        <td className="px-3 py-2">{r.specimen}</td>
                        <td className="px-3 py-2 italic">{r.bacteria}</td>
                        <td className="px-3 py-2 font-mono">
                          {r.mrspDetected ? 'Positif' : 'Negatif'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                disabled={!consentChecked}
                onClick={handlePushCsv}
                className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-40"
              >
                Kirim {csvPreview.length} Data CSV ke Antibiogram Regional
              </button>
            </div>
          )}

          {/* Recent culture log */}
          <h4 className="mt-6 font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Entri Kultur Terbaru ({cultureRecords.length})
          </h4>
          <div className="mt-2.5 space-y-2">
            {cultureRecords.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs"
              >
                <div>
                  <span className="font-mono font-semibold text-white">{rec.sampleCode}</span>
                  <span className="mx-2 text-slate-500">•</span>
                  <span className="italic text-slate-300">{rec.bacteria}</span>
                  <span className="mx-2 text-slate-500">•</span>
                  <span className="text-slate-400">{rec.region}</span>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${
                    rec.mrspDetected
                      ? 'bg-rose-500/20 text-rose-200'
                      : 'bg-emerald-500/20 text-emerald-200'
                  }`}
                >
                  {rec.mrspDetected ? 'MRSP / mecA(+)' : 'Susceptible'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
