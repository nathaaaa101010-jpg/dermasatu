import { create } from 'zustand';
import {
  INITIAL_ADVERSE_REPORTS,
  INITIAL_APPROVAL_QUEUE,
  INITIAL_AUDIT_LOGS,
  INITIAL_CULTURE_RECORDS,
  INITIAL_DEVIATION_REPORTS,
  INITIAL_HOME_CHECKLIST,
  INITIAL_MANAGED_USERS,
  INITIAL_OFFLINE_QUEUE,
  INITIAL_PRESCRIPTION_LOGS,
  INITIAL_THERAPY_SCHEDULE,
  INITIAL_VOUCHERS,
  ROLE_PROFILES,
  SAMPLE_CASES,
} from '../data/mockData';
import {
  AdverseReport,
  ApprovalQueueItem,
  AuditLogEntry,
  ConsentSettings,
  CultureRecord,
  DeviationReport,
  HomeChecklistItem,
  ManagedUser,
  ModuleId,
  OfflineSyncItem,
  PatientCase,
  PillarId,
  PillarStatus,
  PrescriptionLog,
  TherapyScheduleItem,
  UserRole,
  VoucherRequest,
} from '../lib/types';
import { formatWibNow, generateDummySha256, generateLogId } from '../lib/utils';

export const ROLE_VISIBLE_MODULES: Record<UserRole, ModuleId[]> = {
  klinik: ['01', '02', '03', 'TR-1', 'TR-2', 'HM-2', '05'],
  lab: ['TR-1', 'TR-2', '07', '04'],
  regulator: ['TR-2', 'TR-3', '04', '06', '07', '08'],
  pemilik: ['HM-1', 'HM-2'],
};

function readInitialRole(): UserRole {
  try {
    const saved = window.localStorage.getItem('derma_satu_role');
    if (saved === 'klinik' || saved === 'lab' || saved === 'regulator' || saved === 'pemilik') {
      return saved;
    }
  } catch {
    // Ignore storage restriction
  }
  return 'klinik';
}

interface DermaState {
  activeRole: UserRole;
  activeModule: ModuleId;
  cases: PatientCase[];
  selectedCaseId: string;
  vouchers: VoucherRequest[];
  cultureRecords: CultureRecord[];
  prescriptionLogs: PrescriptionLog[];
  homeChecklist: HomeChecklistItem[];
  therapySchedules: TherapyScheduleItem[];
  adverseReports: AdverseReport[];
  consentSettings: ConsentSettings;
  offlineQueue: OfflineSyncItem[];
  deviationReports: DeviationReport[];
  approvalQueue: ApprovalQueueItem[];
  managedUsers: ManagedUser[];
  auditLogs: AuditLogEntry[];
  cultureRatioTarget: number;
  soundEnabled: boolean;
  pillarProgress: Record<PillarId, boolean>;
  notifications: { id: string; text: string; time: string; unread: boolean }[];

  // Modals
  auditLogOpen: boolean;
  commandPaletteOpen: boolean;
  philosophyOpen: boolean;
  roadmapModalOpen: boolean;
  triggerEngineModalOpen: boolean;

  // Actions
  setRole: (role: UserRole) => void;
  setActiveModule: (moduleId: ModuleId) => void;
  openPillar: (pillar: PillarId) => void;
  setSelectedCaseId: (caseId: string) => void;
  updateActiveCase: (patch: Partial<PatientCase>) => void;
  updateActiveCytology: (patch: Partial<PatientCase['cytology']>) => void;
  requestVoucher: (req: Omit<VoucherRequest, 'id' | 'requestedAt' | 'status'>) => void;
  addCultureRecords: (records: Omit<CultureRecord, 'id' | 'uploadedAt'>[]) => void;
  addPrescriptionLog: (log: Omit<PrescriptionLog, 'id' | 'date'>) => void;
  toggleChecklistItem: (id: string) => void;
  toggleTherapyAdherence: (id: string) => void;
  submitAdverseReport: (report: Omit<AdverseReport, 'id' | 'date' | 'status'>) => void;
  updateConsentSetting: (key: keyof ConsentSettings, value: boolean) => void;
  addOfflineItem: (item: Omit<OfflineSyncItem, 'id' | 'capturedAt'>) => void;
  syncOfflineQueue: () => number;
  submitDeviationReport: (report: Omit<DeviationReport, 'id' | 'submittedAt' | 'status'>) => void;
  resolveApprovalItem: (id: string, decision: 'Disetujui' | 'Ditolak') => void;
  addManagedUser: (user: Omit<ManagedUser, 'id'>) => void;
  toggleUserActive: (id: string) => void;
  setCultureRatioTarget: (val: number) => void;
  toggleSound: () => void;
  markNotificationsRead: () => void;
  setModal: (
    modal: 'auditLogOpen' | 'commandPaletteOpen' | 'philosophyOpen' | 'roadmapModalOpen' | 'triggerEngineModalOpen',
    open: boolean
  ) => void;
  appendAuditLog: (action: string, dataTarget: string, pillar?: PillarId) => void;
  getPillarStatuses: () => Record<PillarId, PillarStatus>;
}

export const useDermaStore = create<DermaState>((set, get) => {
  const initialRole = readInitialRole();

  return {
    activeRole: initialRole,
    activeModule: ROLE_PROFILES[initialRole].defaultModule,
    cases: SAMPLE_CASES,
    selectedCaseId: SAMPLE_CASES[0].id,
    vouchers: INITIAL_VOUCHERS,
    cultureRecords: INITIAL_CULTURE_RECORDS,
    prescriptionLogs: INITIAL_PRESCRIPTION_LOGS,
    homeChecklist: INITIAL_HOME_CHECKLIST,
    therapySchedules: INITIAL_THERAPY_SCHEDULE,
    adverseReports: INITIAL_ADVERSE_REPORTS,
    consentSettings: {
      shareCultureAnonymized: true,
      sharePrescriptionTrend: true,
      enableHomeFollowUp: true,
      allowLabResultToClinic: true,
    },
    offlineQueue: INITIAL_OFFLINE_QUEUE,
    deviationReports: INITIAL_DEVIATION_REPORTS,
    approvalQueue: INITIAL_APPROVAL_QUEUE,
    managedUsers: INITIAL_MANAGED_USERS,
    auditLogs: INITIAL_AUDIT_LOGS,
    cultureRatioTarget: 45,
    soundEnabled: false,
    pillarProgress: {
      confirm: false,
      trace: false,
      home: false,
    },
    notifications: [
      {
        id: 'n-1',
        text: 'Voucher VCR-2601 menunggu persetujuan verifikasi',
        time: '5 menit lalu',
        unread: true,
      },
      {
        id: 'n-2',
        text: '3 data klinik offline siap disinkronkan',
        time: '18 menit lalu',
        unread: true,
      },
      {
        id: 'n-3',
        text: 'Antibiogram Jateng memiliki n < 30 (sampel kecil)',
        time: '1 jam lalu',
        unread: false,
      },
    ],

    auditLogOpen: false,
    commandPaletteOpen: false,
    philosophyOpen: false,
    roadmapModalOpen: false,
    triggerEngineModalOpen: false,

    setRole: (role) => {
      try {
        window.localStorage.setItem('derma_satu_role', role);
      } catch {
        // Ignore
      }
      const allowed = ROLE_VISIBLE_MODULES[role];
      const currentMod = get().activeModule;
      const nextMod = allowed.includes(currentMod) ? currentMod : ROLE_PROFILES[role].defaultModule;
      set({ activeRole: role, activeModule: nextMod });
      get().appendAuditLog(
        `Pergantian Simulasi Peran ke ${ROLE_PROFILES[role].roleLabel}`,
        `Sesi Demo • ${ROLE_PROFILES[role].institution}`
      );
    },

    setActiveModule: (moduleId) => set({ activeModule: moduleId }),

    openPillar: (pillar) => {
      const role = get().activeRole;
      const allowed = ROLE_VISIBLE_MODULES[role];
      const pillarTargets: Record<PillarId, ModuleId[]> = {
        confirm: ['01', '02', '03', '05'],
        trace: ['TR-1', 'TR-2', 'TR-3'],
        home: ['HM-1', 'HM-2'],
      };
      const firstAllowed = pillarTargets[pillar].find((m) => allowed.includes(m));
      if (firstAllowed) {
        set({ activeModule: firstAllowed });
      } else {
        set({ activeModule: allowed[0] });
      }
    },

    setSelectedCaseId: (caseId) => set({ selectedCaseId: caseId }),

    updateActiveCase: (patch) => {
      const { cases, selectedCaseId } = get();
      const updated = cases.map((c) =>
        c.id === selectedCaseId ? { ...c, ...patch, updatedAt: formatWibNow() } : c
      );
      set({ cases: updated });
    },

    updateActiveCytology: (patch) => {
      const { cases, selectedCaseId } = get();
      const updated = cases.map((c) => {
        if (c.id !== selectedCaseId) return c;
        const nextCyto = { ...c.cytology, ...patch };
        const suggestive =
          nextCyto.cocciFound &&
          !nextCyto.rodsFound &&
          (nextCyto.degenerateNeutrophils || nextCyto.intracellularPhagocytosis);
        return {
          ...c,
          cytology: nextCyto,
          cytologyResult: (suggestive ? 'Sugestif pioderma superfisial' : 'Perlu evaluasi lain') as PatientCase['cytologyResult'],
          updatedAt: formatWibNow(),
        };
      });
      set((s) => ({
        cases: updated,
        pillarProgress: { ...s.pillarProgress, confirm: true },
      }));
      get().appendAuditLog(
        'Pembaruan Checklist Sitologi Klinik',
        `Kasus ${selectedCaseId}`,
        'confirm'
      );
    },

    requestVoucher: (req) => {
      const newVoucher: VoucherRequest = {
        ...req,
        id: `VCR-${Math.floor(2602 + Math.random() * 900)}`,
        status: 'Diajukan',
        requestedAt: formatWibNow(),
      };
      const newApproval: ApprovalQueueItem = {
        id: `APR-${Math.floor(704 + Math.random() * 200)}`,
        type: 'Voucher Uji Lab',
        requester: req.clinicName,
        targetRef: `${newVoucher.id} (${req.caseId})`,
        region: 'DIY',
        summary: `Subsidi kultur Rp${req.subsidyAmountIdr.toLocaleString('id-ID')} — ${req.reason}`,
        submittedAt: formatWibNow(),
        status: 'Menunggu',
      };
      set((s) => ({
        vouchers: [newVoucher, ...s.vouchers],
        approvalQueue: [newApproval, ...s.approvalQueue],
        pillarProgress: { ...s.pillarProgress, confirm: true },
      }));
      get().appendAuditLog(
        'Pengajuan Voucher Uji Lab',
        `${newVoucher.id} • Kasus ${req.caseId}`,
        'confirm'
      );
    },

    addCultureRecords: (records) => {
      const nowStr = formatWibNow();
      const created: CultureRecord[] = records.map((r, idx) => ({
        ...r,
        id: `KLT-${Math.floor(9020 + Math.random() * 900 + idx)}`,
        uploadedAt: nowStr,
      }));
      set((s) => ({
        cultureRecords: [...created, ...s.cultureRecords],
        pillarProgress: { ...s.pillarProgress, trace: true },
      }));
      get().appendAuditLog(
        `Unggah ${created.length} Hasil Kultur ke Antibiogram Regional (Pseudonim)`,
        created.map((c) => c.sampleCode).join(', '),
        'trace'
      );
    },

    addPrescriptionLog: (log) => {
      const newLog: PrescriptionLog = {
        ...log,
        id: `RSP-${Math.floor(4405 + Math.random() * 500)}`,
        date: new Intl.DateTimeFormat('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(new Date()),
      };
      set((s) => ({
        prescriptionLogs: [newLog, ...s.prescriptionLogs],
        pillarProgress: { ...s.pillarProgress, trace: true },
      }));
      get().appendAuditLog(
        'Pencatatan Jejak Resep Antibiotik',
        `${newLog.id} • ${newLog.drugClass} (Batch ${newLog.batchCode})`,
        'trace'
      );
    },

    toggleChecklistItem: (id) => {
      set((s) => {
        const next = s.homeChecklist.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        );
        const completedCount = next.filter((i) => i.completed).length;
        return {
          homeChecklist: next,
          pillarProgress: { ...s.pillarProgress, home: completedCount >= 3 },
        };
      });
      get().appendAuditLog(
        'Pembaruan Checklist Pencegahan Rumah Tangga',
        `Item ${id} • Pseudonim PM-2026-041`,
        'home'
      );
    },

    toggleTherapyAdherence: (id) => {
      set((s) => ({
        therapySchedules: s.therapySchedules.map((t) =>
          t.id === id ? { ...t, adhered: !t.adhered } : t
        ),
        pillarProgress: { ...s.pillarProgress, home: true },
      }));
      get().appendAuditLog(
        'Pencatatan Kepatuhan Jadwal Terapi',
        `Jadwal ${id} • Pseudonim PM-2026-041`,
        'home'
      );
    },

    submitAdverseReport: (report) => {
      const newReport: AdverseReport = {
        ...report,
        id: `AE-${Math.floor(103 + Math.random() * 800)}`,
        date: new Intl.DateTimeFormat('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(new Date()),
        status: 'Diterima Klinik',
      };
      set((s) => ({
        adverseReports: [newReport, ...s.adverseReports],
      }));
      get().appendAuditLog(
        'Pelaporan Efek Samping / Perburukan Klinis oleh Pemilik',
        `${newReport.id} • ${report.petAlias}`,
        'home'
      );
    },

    updateConsentSetting: (key, value) => {
      set((s) => ({
        consentSettings: { ...s.consentSettings, [key]: value },
      }));
      const labelMap: Record<keyof ConsentSettings, string> = {
        shareCultureAnonymized: 'Berbagi Data Kultur Anonim ke Antibiogram',
        sharePrescriptionTrend: 'Berbagi Tren Resep Anonim untuk Monev',
        enableHomeFollowUp: 'Pengingat & Pemantauan Terapi Rumah Tangga',
        allowLabResultToClinic: 'Akses Hasil Lab ke Klinik Pengirim',
      };
      get().appendAuditLog(
        value ? `Pemilik Mengaktifkan Consent: ${labelMap[key]}` : `Pemilik Mencabut Consent: ${labelMap[key]}`,
        'Preferensi Consent UU PDP • PM-2026-041',
        'home'
      );
    },

    addOfflineItem: (item) => {
      const created: OfflineSyncItem = {
        ...item,
        id: `OFF-${Math.floor(10 + Math.random() * 89)}`,
        capturedAt: formatWibNow(),
      };
      set((s) => ({ offlineQueue: [created, ...s.offlineQueue] }));
    },

    syncOfflineQueue: () => {
      const count = get().offlineQueue.length;
      if (count === 0) return 0;
      set({ offlineQueue: [] });
      get().appendAuditLog(
        `Sinkronisasi Antrean Offline-First (${count} Paket Data)`,
        `Buffer Klinik Lokal → Data Engine`,
        'confirm'
      );
      return count;
    },

    submitDeviationReport: (report) => {
      const created: DeviationReport = {
        ...report,
        id: `DEV-${Math.floor(305 + Math.random() * 600)}`,
        submittedAt: formatWibNow(),
        status: 'Terkirim (Anonim)',
      };
      set((s) => ({ deviationReports: [created, ...s.deviationReports] }));
      get().appendAuditLog(
        'Laporan Anonim Penyimpangan Peresepan Diterima',
        `${created.id} • Wilayah ${report.region}`,
        'trace'
      );
    },

    resolveApprovalItem: (id, decision) => {
      const target = get().approvalQueue.find((a) => a.id === id);
      const sigHash = generateDummySha256(`${id}-${decision}-${Date.now()}`);
      set((s) => ({
        approvalQueue: s.approvalQueue.map((item) =>
          item.id === id ? { ...item, status: decision, digitalSignatureHash: sigHash } : item
        ),
        vouchers:
          target?.type === 'Voucher Uji Lab'
            ? s.vouchers.map((v) =>
                target.targetRef.startsWith(v.id) ? { ...v, status: decision } : v
              )
            : s.vouchers,
      }));
      get().appendAuditLog(
        `${decision === 'Disetujui' ? 'Persetujuan' : 'Penolakan'} Antrean (${target?.type ?? id})`,
        `${target?.targetRef ?? id} • Sig: ${sigHash}`
      );
    },

    addManagedUser: (user) => {
      const created: ManagedUser = {
        ...user,
        id: `USR-${Math.floor(10 + Math.random() * 89)}`,
      };
      set((s) => ({ managedUsers: [created, ...s.managedUsers] }));
      get().appendAuditLog(
        'Penambahan Akun Pengguna RBAC',
        `${created.name} (${created.role.toUpperCase()})`
      );
    },

    toggleUserActive: (id) => {
      const target = get().managedUsers.find((u) => u.id === id);
      set((s) => ({
        managedUsers: s.managedUsers.map((u) =>
          u.id === id ? { ...u, active: !u.active } : u
        ),
      }));
      if (target) {
        get().appendAuditLog(
          `${target.active ? 'Penonaktifan' : 'Pengaktifan'} Akun Pengguna`,
          `${target.name} (${target.id})`
        );
      }
    },

    setCultureRatioTarget: (val) => set({ cultureRatioTarget: val }),

    toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

    markNotificationsRead: () =>
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, unread: false })),
      })),

    setModal: (modal, open) => set({ [modal]: open } as Partial<DermaState>),

    appendAuditLog: (action, dataTarget, pillar) => {
      const role = get().activeRole;
      const profile = ROLE_PROFILES[role];
      const timestampWib = formatWibNow();
      const id = generateLogId();
      const entry: AuditLogEntry = {
        id,
        action,
        actor: profile.name,
        roleLabel: profile.roleLabel,
        dataTarget,
        timestampWib,
        ipAddress: `10.24.${role === 'klinik' ? '14' : role === 'lab' ? '18' : role === 'regulator' ? '19' : '22'}.${Math.floor(11 + Math.random() * 80)}`,
        hashSha256: generateDummySha256(`${id}|${action}|${dataTarget}|${timestampWib}`),
        pillar,
      };
      set((s) => ({ auditLogs: [entry, ...s.auditLogs] }));
    },

    getPillarStatuses: () => {
      const { pillarProgress } = get();
      const confirmDone = pillarProgress.confirm;
      const traceDone = pillarProgress.trace;
      const homeDone = pillarProgress.home;

      const confirm: PillarStatus = confirmDone ? 'SELESAI' : 'AKTIF SEKARANG';
      const trace: PillarStatus = traceDone
        ? 'SELESAI'
        : confirmDone
          ? 'AKTIF SEKARANG'
          : 'TAHAP BERIKUTNYA';
      const home: PillarStatus = homeDone
        ? 'SELESAI'
        : traceDone
          ? 'AKTIF SEKARANG'
          : 'TAHAP BERIKUTNYA';

      return { confirm, trace, home };
    },
  };
});
