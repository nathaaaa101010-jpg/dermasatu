import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Bell,
  ChevronDown,
  ClipboardCheck,
  Database,
  FileSearch,
  Flag,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Microscope,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  Ticket,
  UploadCloud,
  Users,
  Volume2,
  VolumeX,
  WifiOff,
  X,
} from 'lucide-react';
import { AuditLogModal } from '../components/AuditLogModal';
import { BrandLogo } from '../components/BrandLogo';
import { CommandPalette } from '../components/CommandPalette';
import { JourneyTracker } from '../components/JourneyTracker';
import { ClinicalDisclaimerBar } from '../components/SimulationBadge';
import { ROLE_PROFILES } from '../data/mockData';
import { ModuleId, UserRole } from '../lib/types';
import { Module01ExamCytology } from '../modules/Module01ExamCytology';
import { Module02CultureVoucher } from '../modules/Module02CultureVoucher';
import { Module03TherapyRec } from '../modules/Module03TherapyRec';
import { Module04MonitoringEval } from '../modules/Module04MonitoringEval';
import { Module05OfflineSync } from '../modules/Module05OfflineSync';
import { Module06DeviationReport } from '../modules/Module06DeviationReport';
import { Module07ApprovalQueue } from '../modules/Module07ApprovalQueue';
import { Module08UserManagement } from '../modules/Module08UserManagement';
import { ModuleHM1HomeEducation } from '../modules/ModuleHM1HomeEducation';
import { ModuleHM2TherapyReminder } from '../modules/ModuleHM2TherapyReminder';
import { ModuleTR1CultureUpload } from '../modules/ModuleTR1CultureUpload';
import { ModuleTR2Antibiogram } from '../modules/ModuleTR2Antibiogram';
import { ModuleTR3PrescriptionTrace } from '../modules/ModuleTR3PrescriptionTrace';
import { ROLE_VISIBLE_MODULES, useDermaStore } from '../store/useDermaStore';

interface NavMenuItem {
  id: ModuleId;
  label: string;
  pillarTag: string;
  icon: React.ReactNode;
  badge?: number;
}

export const DashboardPage: React.FC = () => {
  const {
    activeRole,
    activeModule,
    setRole,
    setActiveModule,
    offlineQueue,
    deviationReports,
    approvalQueue,
    notifications,
    markNotificationsRead,
    soundEnabled,
    toggleSound,
    setModal,
    cases,
    selectedCaseId,
    consentSettings,
  } = useDermaStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const visibleModules = ROLE_VISIBLE_MODULES[activeRole];
  const profile = ROLE_PROFILES[activeRole];
  const pendingApprovals = approvalQueue.filter((a) => a.status === 'Menunggu').length;
  const unreadNotifs = notifications.filter((n) => n.unread).length;
  const activeCase = cases.find((c) => c.id === selectedCaseId) ?? cases[0];

  const stewardshipItems: NavMenuItem[] = [
    {
      id: '01',
      label: '01 Pemeriksaan & Sitologi',
      pillarTag: 'Confirm',
      icon: <Microscope className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: '02',
      label: '02 Keputusan Kultur & Voucher',
      pillarTag: 'Confirm',
      icon: <Ticket className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: '03',
      label: '03 Rekomendasi Terapi (ISCAID)',
      pillarTag: 'Confirm',
      icon: <Stethoscope className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'TR-1',
      label: 'TR-1 Unggah Hasil Kultur',
      pillarTag: 'Trace',
      icon: <UploadCloud className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'TR-2',
      label: 'TR-2 Antibiogram Lokal',
      pillarTag: 'Trace',
      icon: <Database className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'TR-3',
      label: 'TR-3 Jejak Resep & Obat',
      pillarTag: 'Trace',
      icon: <Pill className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'HM-1',
      label: 'HM-1 Edukasi & Checklist Rumah',
      pillarTag: 'Home',
      icon: <Home className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'HM-2',
      label: 'HM-2 Pengingat Terapi',
      pillarTag: 'Home',
      icon: <ClipboardCheck className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: '05',
      label: '05 Input Klinik (offline-first)',
      pillarTag: 'Confirm',
      icon: <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />,
      badge: offlineQueue.length > 0 ? offlineQueue.length : undefined,
    },
  ];

  const governanceItems: NavMenuItem[] = [
    {
      id: '04',
      label: '04 Monitoring & Evaluasi',
      pillarTag: 'Gov',
      icon: <Activity className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: '06',
      label: '06 Pelaporan Penyimpangan Peresepan',
      pillarTag: 'Gov',
      icon: <Flag className="h-4 w-4 shrink-0" aria-hidden="true" />,
      badge: deviationReports.length,
    },
    {
      id: '07',
      label: '07 Antrean Persetujuan',
      pillarTag: 'Gov',
      icon: <FileSearch className="h-4 w-4 shrink-0" aria-hidden="true" />,
      badge: pendingApprovals > 0 ? pendingApprovals : undefined,
    },
    {
      id: '08',
      label: '08 Manajemen Pengguna',
      pillarTag: 'Gov',
      icon: <Users className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
  ];

  const renderMenuButton = (item: NavMenuItem) => {
    const isActive = activeModule === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          setActiveModule(item.id);
          setMobileSidebarOpen(false);
        }}
        className={`group flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
          isActive
            ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 font-semibold text-white shadow-md shadow-blue-950/50'
            : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {item.icon}
          <span className="truncate">{item.label}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {item.badge !== undefined && (
            <span
              className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums ${
                isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {item.badge}
            </span>
          )}
          {isActive && <ArrowRight className="h-3.5 w-3.5 text-white" aria-hidden="true" />}
        </div>
      </button>
    );
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case '01':
        return <Module01ExamCytology />;
      case '02':
        return <Module02CultureVoucher />;
      case '03':
        return <Module03TherapyRec />;
      case 'TR-1':
        return <ModuleTR1CultureUpload />;
      case 'TR-2':
        return <ModuleTR2Antibiogram />;
      case 'TR-3':
        return <ModuleTR3PrescriptionTrace />;
      case 'HM-1':
        return <ModuleHM1HomeEducation />;
      case 'HM-2':
        return <ModuleHM2TherapyReminder />;
      case '05':
        return <Module05OfflineSync />;
      case '04':
        return <Module04MonitoringEval />;
      case '06':
        return <Module06DeviationReport />;
      case '07':
        return <Module07ApprovalQueue />;
      case '08':
        return <Module08UserManagement />;
      default:
        return <Module01ExamCytology />;
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#090F1D] text-slate-200">
      {/* Top Sidebar Logo */}
      <div className="border-b border-slate-800/80 px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo size={32} />
            <div>
              <p className="font-display text-sm font-extrabold tracking-tight text-white">
                DERMA-SATU
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" aria-hidden="true" />
                <span className="font-mono text-[9px] font-semibold tracking-wider text-teal-300 uppercase">
                  STEWARDSHIP VETERINER
                </span>
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Tutup menu samping"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        <div>
          <p className="px-3 font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            ALUR PERJALANAN STEWARDSHIP
          </p>
          <div className="mt-2 space-y-1">
            {stewardshipItems
              .filter((item) => visibleModules.includes(item.id))
              .map(renderMenuButton)}
          </div>
        </div>

        {governanceItems.some((item) => visibleModules.includes(item.id)) && (
          <div>
            <p className="px-3 font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              GOVERNANCE & DATA ENGINE
            </p>
            <div className="mt-2 space-y-1">
              {governanceItems
                .filter((item) => visibleModules.includes(item.id))
                .map(renderMenuButton)}
            </div>
          </div>
        )}
      </div>

      {/* Role Switcher & Profile Card */}
      <div className="border-t border-slate-800/80 p-3.5 space-y-3">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            SIMULASI PERAN AKTIF
          </p>
          <div
            role="tablist"
            aria-label="Simulasi Peran Aktif"
            className="mt-2 grid grid-cols-4 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1"
          >
            {(
              [
                { id: 'klinik', label: 'Klinik' },
                { id: 'lab', label: 'Lab' },
                { id: 'regulator', label: 'Regulator' },
                { id: 'pemilik', label: 'Pemilik' },
              ] as { id: UserRole; label: string }[]
            ).map((r) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={activeRole === r.id}
                onClick={() => setRole(r.id)}
                className={`rounded-lg py-1.5 text-[10px] font-semibold transition ${
                  activeRole === r.id
                    ? 'bg-teal-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 font-display text-xs font-bold text-white">
              {profile.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">{profile.name}</p>
              <p className="truncate text-[10px] text-slate-400">{profile.institution}</p>
            </div>
          </div>
          <Link
            to="/"
            title="Keluar ke Beranda"
            aria-label="Keluar ke Beranda"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-rose-300 shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#070B14] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-slate-800/80 lg:block">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] border-r border-slate-800">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Right Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-[#070B14]/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Buka navigasi dasbor"
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-200 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setModal('commandPaletteOpen', true)}
              className="flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-left text-xs text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 shrink-0 text-teal-400" aria-hidden="true" />
                <span className="truncate">
                  Cari kasus, klinik, hasil kultur, atau antibiotik…
                </span>
              </span>
              <kbd className="hidden rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:inline">
                Ctrl K
              </kbd>
            </button>

            <div className="hidden items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] text-emerald-300 xl:flex whitespace-nowrap shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>Data Terhubung (Latensi 24ms • Simulasi)</span>
            </div>
          </div>

          {/* Right Topbar Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-700 hover:text-white sm:inline-flex whitespace-nowrap"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
              Beranda Publik
            </Link>

            <button
              type="button"
              onClick={() => setModal('auditLogOpen', true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/40 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-200 transition hover:bg-teal-500/20 whitespace-nowrap"
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Log Audit
            </button>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Matikan suara notifikasi simulasi' : 'Aktifkan suara notifikasi simulasi'}
              title={soundEnabled ? 'Suara aktif (simulasi)' : 'Suara nonaktif'}
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:border-slate-700 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-teal-400" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifDropdownOpen((v) => !v);
                  setProfileDropdownOpen(false);
                  markNotificationsRead();
                }}
                aria-label="Buka notifikasi"
                className="relative rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:border-slate-700 hover:text-white"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white">Notifikasi Sistem (Simulasi)</span>
                    <button
                      type="button"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Tutup
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="rounded-xl bg-slate-950/70 p-2.5 text-xs">
                        <p className="text-slate-200">{n.text}</p>
                        <p className="mt-1 font-mono text-[10px] text-slate-500">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen((v) => !v);
                  setNotifDropdownOpen(false);
                }}
                aria-label="Menu akun pengguna"
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white hover:border-slate-700"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500 font-display text-[11px] font-bold text-slate-950">
                  {profile.initials}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl">
                  <p className="text-xs font-bold text-white">{profile.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{profile.roleLabel}</p>
                  <div className="mt-3 border-t border-slate-800 pt-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setModal('auditLogOpen', true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-200 hover:bg-slate-800"
                    >
                      Lihat Log Audit UU PDP
                    </button>
                    <Link
                      to="/"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-rose-300 hover:bg-slate-800"
                    >
                      Kembali ke Beranda
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <ClinicalDisclaimerBar />

          <JourneyTracker />

          {/* Owner Role Case Summary Card */}
          {activeRole === 'pemilik' && (
            <section className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] font-semibold text-emerald-300 uppercase">
                    Ringkasan Status Kasus Hewan Anda (Simulasi)
                  </p>
                  <h2 className="mt-0.5 font-display text-lg font-bold text-white">
                    {activeCase.petAlias} — {activeCase.id}
                  </h2>
                  <p className="mt-1 text-xs text-slate-200">
                    Klinik Pemeriksa: {activeCase.clinicName} • Status Sitologi: {activeCase.cytologyResult} • Consent Antibiogram Anonim:{' '}
                    <strong>{consentSettings.shareCultureAnonymized ? 'Aktif' : 'Dicabut'}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModule('HM-1')}
                  className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Atur Consent & Checklist
                </button>
              </div>
            </section>
          )}

          {/* Active Module Container */}
          <div className="pt-1">{renderActiveModule()}</div>
        </main>
      </div>

      <AuditLogModal />
      <CommandPalette />
    </div>
  );
};
