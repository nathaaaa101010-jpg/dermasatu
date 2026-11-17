export type UserRole = 'klinik' | 'lab' | 'regulator' | 'pemilik';

export type PillarId = 'confirm' | 'trace' | 'home';

export type PillarStatus = 'SELESAI' | 'AKTIF SEKARANG' | 'TAHAP BERIKUTNYA';

export type ModuleId =
  | '01'
  | '02'
  | '03'
  | 'TR-1'
  | 'TR-2'
  | 'TR-3'
  | 'HM-1'
  | 'HM-2'
  | '05'
  | '04'
  | '06'
  | '07'
  | '08';

export interface PatientCase {
  id: string;
  petAlias: string;
  ownerPseudonym: string;
  breed: string;
  ageYears: number;
  lesionLocation: string;
  lesionType: 'papula-pustula' | 'kolaret-epidermal' | 'rekuren-multifokal' | 'lokalisata-ringan';
  antibioticLast30d: boolean;
  immunomodulatorHistory: boolean;
  priorBetaLactamWeeks: number;
  treatmentFailure: boolean;
  cytology: {
    cocciFound: boolean;
    degenerateNeutrophils: boolean;
    intracellularPhagocytosis: boolean;
    rodsFound: boolean;
  };
  cytologyResult: 'Sugestif pioderma superfisial' | 'Perlu evaluasi lain' | 'Belum dievaluasi';
  clinicName: string;
  region: RegionId;
  updatedAt: string;
}

export type RegionId = 'Jateng' | 'DIY' | 'Jabodetabek' | 'Bali';

export interface VoucherRequest {
  id: string;
  caseId: string;
  clinicName: string;
  petAlias: string;
  reason: string;
  status: 'Diajukan' | 'Disetujui' | 'Terpakai' | 'Ditolak';
  subsidyAmountIdr: number;
  requestedAt: string;
  labPartner: string;
}

export interface CultureRecord {
  id: string;
  sampleCode: string;
  region: RegionId;
  specimen: 'Swab Kulit' | 'Aspirat Pustula' | 'Kerokan Dalam';
  bacteria: 'S. pseudintermedius' | 'S. aureus' | 'Lainnya (Gram-positif)';
  mrspDetected: boolean;
  mecAPositive: boolean;
  susceptibility: Record<string, 'R' | 'I' | 'S'>;
  period: 'Q1 2026' | 'Q2 2026' | 'Q3 2026';
  consentVerified: boolean;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AntibiogramCell {
  bacteria: string;
  antibiotic: string;
  susceptiblePct: number;
  n: number;
}

export interface PrescriptionLog {
  id: string;
  date: string;
  clinicName: string;
  region: RegionId;
  caseId: string;
  drugClass:
    | 'Topikal Antiseptik'
    | 'Sefalosporin Gen-1'
    | 'Klindamisin/Linkosamid'
    | 'Sefalosporin Gen-3'
    | 'Fluorokuinolon'
    | 'Tetrasiklin';
  durationDays: number;
  hasCulture: boolean;
  isThirdGenCeph: boolean;
  batchCode: string;
  dispensedBy: string;
}

export interface HomeChecklistItem {
  id: string;
  title: string;
  category: 'Kebersihan Tangan' | 'Linen & Tempat Tidur' | 'Alat Grooming' | 'Kontak Rentan';
  completed: boolean;
  whyImportant: string;
}

export interface TherapyScheduleItem {
  id: string;
  timeLabel: string;
  taskTitle: string;
  type: 'Topikal' | 'Oral' | 'Kontrol';
  adhered: boolean;
  note: string;
}

export interface AdverseReport {
  id: string;
  date: string;
  petAlias: string;
  symptom: string;
  severity: 'Ringan' | 'Sedang' | 'Perlu Evaluasi Klinik';
  status: 'Diterima Klinik' | 'Dalam Tinjauan';
}

export interface ClinicKpiRow {
  id: string;
  clinicName: string;
  region: RegionId;
  totalAntimicrobialRx: number;
  culturePerformed: number;
  thirdGenCephPct: number;
  mrspLocalPct: number;
  adherencePct: number;
  status: 'Baik' | 'Perlu Perhatian' | 'Prioritas Intervensi';
}

export interface OfflineSyncItem {
  id: string;
  type: 'Sitologi Klinik' | 'Log Resep' | 'Permintaan Voucher';
  summary: string;
  clinicName: string;
  capturedAt: string;
  payloadSizeKb: number;
}

export interface DeviationReport {
  id: string;
  submittedAt: string;
  region: RegionId;
  category:
    | 'Peresepan Sefalosporin Gen-3 Tanpa Kultur'
    | 'Penjualan Antibiotik Tanpa Resep Dokter Hewan'
    | 'Ketidaksesuaian Pencatatan Batch'
    | 'Lainnya';
  description: string;
  status: 'Terkirim (Anonim)' | 'Ditindaklanjuti Dinas' | 'Selesai Verifikasi';
}

export interface ApprovalQueueItem {
  id: string;
  type: 'Voucher Uji Lab' | 'Akses Antibiogram Agregat' | 'Konfirmasi Hasil Kultur';
  requester: string;
  targetRef: string;
  region: RegionId;
  summary: string;
  submittedAt: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  digitalSignatureHash?: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  role: UserRole;
  institution: string;
  region: RegionId;
  accessScope: string;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  roleLabel: string;
  dataTarget: string;
  timestampWib: string;
  ipAddress: string;
  hashSha256: string;
  pillar?: PillarId;
}

export interface ConsentSettings {
  shareCultureAnonymized: boolean;
  sharePrescriptionTrend: boolean;
  enableHomeFollowUp: boolean;
  allowLabResultToClinic: boolean;
}
