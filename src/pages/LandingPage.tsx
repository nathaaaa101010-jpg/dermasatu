import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CornerDownLeft,
  Home,
  LayoutDashboard,
  Maximize2,
  Menu,
  Microscope,
  Play,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { JourneyTracker } from '../components/JourneyTracker';
import { PhilosophyModal } from '../components/PhilosophyModal';
import { SimulationBadge } from '../components/SimulationBadge';
import {
  COMPARISON_ROWS,
  HERO_STATS,
  JATENG_DIY_CAVEAT,
  LITERATURE_CARDS,
  REFERENCES_LIST,
} from '../data/literatureData';
import { ANTIBIOGRAM_ANTIBIOTICS, REGIONAL_ANTIBIOGRAMS } from '../data/mockData';
import { PillarId, UserRole } from '../lib/types';
import { useDermaStore } from '../store/useDermaStore';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { setRole, openPillar, setModal } = useDermaStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const enterDashboardAs = (role: UserRole, pillar?: PillarId) => {
    setRole(role);
    if (pillar) {
      openPillar(pillar);
    }
    navigate('/dashboard');
  };

  const handleFullscreenDemo = async () => {
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen may be restricted in iframe; proceed to dashboard seamlessly
    }
    enterDashboardAs('klinik');
  };

  const previewDataset = REGIONAL_ANTIBIOGRAMS[0];
  const previewAb = ANTIBIOGRAM_ANTIBIOTICS.slice(0, 5);

  const workflowStages = [
    {
      num: '01',
      title: 'Periksa & Konfirmasi',
      desc: 'Sitologi kulit cepat di klinik terlebih dahulu. Voucher subsidi kultur aktif bila ada faktor risiko atau kegagalan terapi.',
      accent: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    },
    {
      num: '02',
      title: 'Kumpulkan & Satukan Data',
      desc: 'Hasil kultur laboratorium diunggah dengan pseudonim pemilik untuk membangun antibiogram lokal regional yang mutakhir.',
      accent: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
    },
    {
      num: '03',
      title: 'Putuskan & Resepkan',
      desc: 'Rekomendasi terapi merujuk ISCAID 2025 & antibiogram lokal; pencatatan golongan, durasi, dan kode batch obat keras.',
      accent: 'border-teal-500/40 bg-teal-500/10 text-teal-300',
    },
    {
      num: '04',
      title: 'Cegah & Umpan Balik',
      desc: 'Edukasi kebersihan rumah tangga, pengingat kepatuhan, pemantauan hasil klinis, dan umpan balik ke basis data pengawasan.',
      accent: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    },
  ];

  const fadeUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4 },
      };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070B14]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg"
          >
            <BrandLogo size={34} />
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              DERMA-SATU
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex">
            <a href="#fitur-utama" className="hover:text-teal-300 transition whitespace-nowrap shrink-0">
              Fitur Utama
            </a>
            <a href="#data-literatur" className="hover:text-teal-300 transition whitespace-nowrap shrink-0">
              Data Literatur
            </a>
            <a href="#alur-kerja" className="hover:text-teal-300 transition whitespace-nowrap shrink-0">
              Alur Kerja
            </a>
            <a href="#arsitektur-sistem" className="hover:text-teal-300 transition whitespace-nowrap shrink-0">
              Arsitektur Sistem
            </a>
          </nav>

          <div className="hidden items-center gap-2.5 md:flex shrink-0">
            <button
              type="button"
              onClick={handleFullscreenDemo}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-teal-400/60 hover:text-white whitespace-nowrap shrink-0"
            >
              <Maximize2 className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
              Demo Layar Penuh
            </button>
            <button
              type="button"
              onClick={() => enterDashboardAs('regulator')}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:text-white whitespace-nowrap shrink-0"
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => enterDashboardAs('klinik')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:opacity-95 whitespace-nowrap shrink-0"
            >
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
              Akses Dasbor
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Buka menu navigasi"
            className="rounded-xl border border-slate-800 p-2 text-slate-200 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3 text-sm text-slate-200">
              <a href="#fitur-utama" onClick={() => setMobileMenuOpen(false)}>Fitur Utama</a>
              <a href="#data-literatur" onClick={() => setMobileMenuOpen(false)}>Data Literatur</a>
              <a href="#alur-kerja" onClick={() => setMobileMenuOpen(false)}>Alur Kerja</a>
              <a href="#arsitektur-sistem" onClick={() => setMobileMenuOpen(false)}>Arsitektur Sistem</a>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleFullscreenDemo}
                  className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium"
                >
                  Demo Layar Penuh
                </button>
                <button
                  type="button"
                  onClick={() => enterDashboardAs('klinik')}
                  className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950"
                >
                  Akses Dasbor
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-slate-800/80 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.14),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(217,70,239,0.08),_transparent_50%)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
              {/* Left Hero Copy */}
              <div className="flex flex-col justify-center lg:col-span-7">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-500/35 bg-teal-500/10 px-3.5 py-1 text-xs font-medium text-teal-300">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Platform Stewardship Antibiotik Dermatologi Veteriner
                </div>

                <h1
                  className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[54px] lg:leading-[1.08]"
                  style={{ textWrap: 'balance' }}
                >
                  <span className="bg-gradient-to-r from-white via-teal-200 to-fuchsia-300 bg-clip-text text-transparent">
                    Satu Rantai Keputusan Antibiotik Bijak
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  Model stewardship dermatologi veteriner tertutup (closed-loop) berbasis data untuk pioderma superfisial anjing. DERMA-SATU menghubungkan insentif uji laboratorium, antibiogram regional, pedoman klinis ISCAID 2025, penelusuran resep, dan pencegahan lintas sektor di rumah pemilik.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => enterDashboardAs('klinik')}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                  >
                    Buka Dasbor
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <a
                    href="#arsitektur-sistem"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-teal-400/60"
                  >
                    Diagram Arsitektur
                  </a>
                  <button
                    type="button"
                    onClick={handleFullscreenDemo}
                    className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-500/35 bg-fuchsia-500/10 px-4 py-3 text-sm font-semibold text-fuchsia-200 transition hover:bg-fuchsia-500/20"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    Mode Demo
                  </button>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Prototipe konsep lomba. Bukan alat diagnosis klinis atau peresepan. Kelayakan dan dampak DERMA-SATU masih perlu diuji.
                </p>
              </div>

              {/* Right Hero Control Center Card */}
              <div className="lg:col-span-5">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-[#0B1222]/90 p-6 shadow-2xl">
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4">
                      <div>
                        <p className="font-mono text-[11px] font-semibold tracking-wider text-teal-400 uppercase">
                          Pusat Kendali DERMA-SATU
                        </p>
                        <h2 className="mt-0.5 font-display text-lg font-bold text-white">
                          Status 3 Pilar Stewardship
                        </h2>
                      </div>
                      <SimulationBadge label="PROTOTIPE" />
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Microscope className="h-4 w-4 text-rose-300" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-bold text-white">CONFIRM</p>
                            <p className="text-[11px] text-slate-300">Sitologi & Voucher Kultur</p>
                          </div>
                        </div>
                        <span className="rounded-full border border-amber-400/50 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amber-200">
                          AKTIF SEKARANG
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Activity className="h-4 w-4 text-blue-300" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-bold text-white">TRACE</p>
                            <p className="text-[11px] text-slate-300">Antibiogram & Jejak Resep</p>
                          </div>
                        </div>
                        <span className="rounded-full border border-blue-400/40 bg-blue-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-blue-200">
                          TERINTEGRASI
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Home className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-bold text-white">HOME</p>
                            <p className="text-[11px] text-slate-300">Pencegahan & Consent UU PDP</p>
                          </div>
                        </div>
                        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-200">
                          SIAP PICU
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-800 pt-4">
                    <p className="text-xs font-semibold text-slate-300">
                      Pilih peran demo untuk langsung masuk:
                    </p>
                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      {(
                        [
                          { id: 'klinik', label: 'Klinik' },
                          { id: 'lab', label: 'Laboratorium' },
                          { id: 'regulator', label: 'Regulator' },
                          { id: 'pemilik', label: 'Pemilik' },
                        ] as { id: UserRole; label: string }[]
                      ).map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => enterDashboardAs(r.id)}
                          className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-100 transition hover:border-teal-400 hover:bg-slate-800"
                        >
                          <span>{r.label}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Literature Stat Strip */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4"
                >
                  <p className="font-mono text-2xl font-bold text-white tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-200">{stat.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{stat.detail}</p>
                  <p className="mt-2 font-mono text-[11px] text-teal-300">{stat.citation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BROWSER MOCKUP PREVIEW */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1222] shadow-2xl"
          >
            {/* Browser Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-300">
                  derma-satu.id/dasbor
                </span>
              </div>
              <SimulationBadge />
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-4">
                  <p className="text-xs text-slate-400">Rasio Kultur vs Peresepan (Simulasi)</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-teal-300 tabular-nums">
                    37,3%
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Baseline literatur: 15,3% (Santoro dkk., 2026)
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-4">
                  <p className="text-xs text-slate-400">Proporsi Sefalosporin Gen-3 (Simulasi)</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-amber-300 tabular-nums">
                    27,8%
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Baseline literatur: 43,9% (Santoro dkk., 2026)
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-4">
                  <p className="text-xs text-slate-400">Tren MRSP Lokal DIY (Simulasi)</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-rose-300 tabular-nums">
                    33,3%
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    n = 42 isolat kulit teragregasi Q3 2026
                  </p>
                </div>
              </div>

              {/* Mini Antibiogram Preview */}
              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-white">
                    Pratinjau Antibiogram Lokal DIY (% Rentan — DATA SIMULASI)
                  </p>
                  <button
                    type="button"
                    onClick={() => enterDashboardAs('lab', 'trace')}
                    className="text-xs font-semibold text-teal-300 hover:text-teal-200"
                  >
                    Buka Antibiogram Lengkap →
                  </button>
                </div>
                <table className="w-full min-w-[600px] border-separate border-spacing-1 text-xs">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="py-1.5 text-left">Isolat</th>
                      {previewAb.map((ab) => (
                        <th key={ab} className="px-2 py-1.5 text-center font-medium">
                          {ab}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['S. pseudintermedius', 'S. aureus'].map((bact) => (
                      <tr key={bact}>
                        <td className="py-2 pr-3 font-medium italic text-slate-200">{bact}</td>
                        {previewAb.map((ab) => {
                          const cell = previewDataset.cells.find(
                            (c) => c.bacteria === bact && c.antibiotic === ab
                          );
                          const pct = cell?.susceptiblePct ?? 70;
                          const cls =
                            pct >= 80
                              ? 'bg-emerald-500/25 text-emerald-200'
                              : pct >= 65
                                ? 'bg-amber-500/20 text-amber-200'
                                : 'bg-rose-500/25 text-rose-200';
                          return (
                            <td
                              key={`${bact}-${ab}`}
                              className={`rounded-lg py-2 text-center font-mono font-bold tabular-nums ${cls}`}
                            >
                              {pct}%
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION: DATA LITERATUR */}
        <section id="data-literatur" className="border-y border-slate-800/80 bg-slate-950/60 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-semibold tracking-wider text-teal-400 uppercase">
                Landasan Masalah Empiris
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                Mengapa Stewardship Dermatologi Veteriner Mendesak
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Seluruh angka epidemiologi dan peresepan di bawah ini dikutip langsung dari literatur ilmiah yang terverifikasi, tanpa penambahan angka di luar rujukan.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {LITERATURE_CARDS.map((card) => (
                <article
                  key={card.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/75 p-6"
                >
                  <p className="font-mono text-2xl font-extrabold text-teal-300 tabular-nums sm:text-3xl">
                    {card.metric}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">
                    {card.subtitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.body}</p>
                  <p className="mt-4 font-mono text-xs text-slate-400">
                    Sumber: {card.citation}
                  </p>
                </article>
              ))}
            </div>

            {/* Yellow Callout for Jateng & DIY Caveat */}
            <div
              role="note"
              className="mt-6 rounded-2xl border border-amber-400/50 bg-amber-500/15 p-5 text-amber-100"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-base font-bold text-amber-200">
                    {JATENG_DIY_CAVEAT.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-amber-50">{JATENG_DIY_CAVEAT.finding}</p>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-amber-200">
                    {JATENG_DIY_CAVEAT.warning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: ALUR PERJALANAN STEWARDSHIP BERKELANJUTAN */}
        <section id="fitur-utama" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold tracking-wider text-teal-400 uppercase">
              Tiga Pilar Terpadu
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Alur Perjalanan Stewardship Berkelanjutan
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              DERMA-SATU menjadikan satu pasien/rumah tangga sebagai unit perjalanan tertutup: mulai dari konfirmasi sitologi dan voucher kultur (CONFIRM), konversi hasil kultur menjadi antibiogram lokal serta jejak resep (TRACE), hingga pencegahan penularan di rumah tanpa mengorbankan privasi (HOME).
            </p>
          </div>

          <div className="mt-8">
            <JourneyTracker
              onSelectPillar={(pillar) => {
                enterDashboardAs(
                  pillar === 'home' ? 'pemilik' : pillar === 'trace' ? 'lab' : 'klinik',
                  pillar
                );
              }}
            />
          </div>
        </section>

        {/* SECTION: 4 TAHAP ALUR KERJA (CLOSED LOOP) */}
        <section id="alur-kerja" className="border-y border-slate-800/80 bg-slate-950/70 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-semibold tracking-wider text-teal-400 uppercase">
                Siklus Closed-Loop
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                4 Tahap Alur Kerja Rantai Keputusan Tertutup
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                Umpan balik dari Tahap 04 (pemantauan hasil & rumah tangga) kembali memperkaya Tahap 02 (antibiogram & pengawasan regional).
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflowStages.map((st) => (
                <article
                  key={st.num}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
                >
                  <div>
                    <span
                      className={`inline-block rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${st.accent}`}
                    >
                      Tahap {st.num}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-white">{st.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{st.desc}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Closed-loop Return Connector Bar from 04 back to 02 */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-teal-500/35 bg-teal-500/10 px-5 py-3.5 text-xs text-teal-100">
              <CornerDownLeft className="h-4 w-4 text-teal-300 shrink-0" aria-hidden="true" />
              <span>
                <strong>Umpan Balik Tertutup (Tahap 04 → Tahap 02):</strong> Hasil pemantauan klinis, kepatuhan rumah, dan luaran terapi kembali memperbarui basis data antibiogram & evaluasi stewardship regional.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: MENGAPA BERBEDA (KEBARUAN + TABEL PERBANDINGAN) */}
        <section id="arsitektur-sistem" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold tracking-wider text-teal-400 uppercase">
              Kebaruan & Perbandingan
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Mengapa DERMA-SATU Berbeda
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              DERMA-SATU bukan metode diagnostik laboratorium atau terapi antimikroba baru, melainkan model stewardship veteriner tertutup yang menghubungkan insentif lab, data resistansi regional, keputusan klinis, penelusuran obat, dan pencegahan lintas sektor di rumah pemilik.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/75">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/90 text-slate-300">
                <tr>
                  <th className="px-5 py-3.5 font-display text-sm">Program / Pendekatan</th>
                  <th className="px-4 py-3.5">Aturan Klinis</th>
                  <th className="px-4 py-3.5">Insentif Lab</th>
                  <th className="px-4 py-3.5">Antibiogram Lokal</th>
                  <th className="px-4 py-3.5">Pencegahan Rumah</th>
                  <th className="px-5 py-3.5">Catatan Kesenjangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.initiative}
                    className={row.highlighted ? 'bg-teal-500/10' : 'hover:bg-slate-800/30'}
                  >
                    <td className="px-5 py-4 font-display text-sm font-bold text-white">
                      <div className="flex items-center gap-2">
                        {row.highlighted && (
                          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" aria-hidden="true" />
                        )}
                        <span>{row.initiative}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">{row.clinicalRules}</td>
                    <td className="px-4 py-4">{row.labIncentive}</td>
                    <td className="px-4 py-4">{row.localAntibiogram}</td>
                    <td className="px-4 py-4">{row.householdPrevention}</td>
                    <td className="px-5 py-4 text-slate-300">{row.limitation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs font-medium text-amber-200">
            Catatan ilmiah: DERMA-SATU adalah model konseptual dan prototipe antarmuka. Kelayakan dan dampak DERMA-SATU masih perlu diuji melalui studi implementasi lapangan.
          </p>
        </section>

        {/* SECTION: FILOSOFI DESAIN */}
        <section className="border-t border-slate-800/80 bg-slate-950/60 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/75 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setModal('philosophyOpen', true)}
                  aria-label="Klik logo DERMA-SATU untuk melihat penjelasan filosofi desain"
                  className="group flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-teal-500/35 bg-slate-950 transition hover:scale-105 hover:border-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <BrandLogo size={54} />
                </button>
                <div>
                  <p className="font-mono text-xs font-semibold tracking-wider text-teal-400 uppercase">
                    Filosofi Desain
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-white">
                    Perisai, Lingkaran Tertutup, & Tetesan Dermatologi
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    Perisai melambangkan perlindungan kepekaan obat, lingkaran menandai rantai keputusan tertutup, dan tetesan/jejak merepresentasikan dermatologi veteriner. Klik ikon logo untuk membuka rincian makna simbol.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModal('philosophyOpen', true)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:border-teal-400 whitespace-nowrap shrink-0"
              >
                Buka Makna Simbol
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: RUJUKAN ILMIAH */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-teal-400" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-white">Rujukan Ilmiah</h2>
          </div>
          <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {REFERENCES_LIST.map((ref, idx) => (
              <li
                key={ref.id}
                className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 text-xs leading-relaxed text-slate-300"
              >
                <span className="font-mono font-bold text-teal-300">[{idx + 1}]</span>{' '}
                {ref.citation}
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={26} />
            <span className="font-display text-sm font-bold text-white">DERMA-SATU</span>
          </div>
          <div className="flex flex-wrap gap-5 text-xs text-slate-400">
            <a href="#fitur-utama" className="hover:text-white">Fitur Utama</a>
            <a href="#data-literatur" className="hover:text-white">Data Literatur</a>
            <a href="#alur-kerja" className="hover:text-white">Alur Kerja</a>
            <button
              type="button"
              onClick={() => enterDashboardAs('klinik')}
              className="text-teal-300 hover:text-teal-200"
            >
              Dasbor Prototipe
            </button>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 DERMA-SATU. Prototipe konsep untuk keperluan lomba. Bukan alat diagnosis klinis.
          </p>
        </div>
      </footer>

      <PhilosophyModal />
    </div>
  );
};
