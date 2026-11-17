export interface LiteratureStat {
  id: string;
  value: string;
  title: string;
  detail: string;
  citation: string;
  accent: 'coral' | 'blue' | 'amber' | 'teal';
}

export const HERO_STATS: LiteratureStat[] = [
  {
    id: 'rx-rate',
    value: '54,9%',
    title: 'Kasus Diresepkan Antimikroba',
    detail: 'Dari 550 kasus di 22 praktik rujukan dermatologi.',
    citation: 'Santoro dkk., 2026',
    accent: 'coral',
  },
  {
    id: 'culture-rate',
    value: '15,3%',
    title: 'Kultur Sebelum Antimikroba',
    detail: 'Hanya 15,3% kondisi yang diobati antimikroba memakai kultur.',
    citation: 'Santoro dkk., 2026',
    accent: 'amber',
  },
  {
    id: 'ceph3-rate',
    value: '43,9%',
    title: 'Proporsi Sefalosporin Gen-3',
    detail: 'Cakupan sefalosporin generasi ketiga dari antibiotik sistemik anjing.',
    citation: 'Santoro dkk., 2026',
    accent: 'blue',
  },
  {
    id: 'mrsp-asia',
    value: '30,7%',
    title: 'Prevalensi MRSP (Asia)',
    detail: 'IK 95%: 21,3–42,1%; heterogenitas tinggi I² = 93,85% (14 studi).',
    citation: 'Afshar dkk., 2026',
    accent: 'teal',
  },
];

export const LITERATURE_CARDS = [
  {
    id: 'lit-1',
    metric: '54,9% vs 15,3%',
    subtitle: 'Kesenjangan Peresepan & Uji Kultur',
    body: 'Di 22 praktik rujukan dermatologi, antimikroba diresepkan pada 54,9% dari 550 kasus, sedangkan kultur bakteri hanya dipakai pada 15,3% kondisi yang diobati antimikroba. Sefalosporin generasi ketiga mencakup 43,9% antibiotik sistemik pada praktik yang sama.',
    citation: 'Santoro dkk., 2026',
  },
  {
    id: 'lit-2',
    metric: '30,7%',
    subtitle: 'Prevalensi Gabungan MRSP Pioderma Asia',
    body: 'Meta-analisis 14 studi Asia menemukan prevalensi gabungan MRSP pada pioderma anjing sebesar 30,7% (IK 95%: 21,3–42,1) dengan heterogenitas sangat tinggi (I² = 93,85%), menegaskan pentingnya data resistansi regional.',
    citation: 'Afshar dkk., 2026',
  },
  {
    id: 'lit-3',
    metric: '48,1% → 60,7%',
    subtitle: 'Lonjakan Risiko Akibat Paparan Antimikroba',
    body: 'Resistansi metisilin tercatat 48,1% pada isolat kulit dan telinga, dan meningkat menjadi 60,7% apabila anjing menerima antimikroba dalam satu bulan terakhir.',
    citation: 'Zur dkk., 2016',
  },
  {
    id: 'lit-4',
    metric: '80% RS vs 0% Klinik Hewan',
    subtitle: 'Kesenjangan Tata Kelola AMR & Beban Manusia',
    body: 'Target nasional menetapkan 80% rumah sakit menjalankan pengendalian AMR pada 2029, tanpa target setara bagi klinik hewan (Kemenkes RI, 2026). Pada manusia, AMR memicu 1,14 juta kematian atributabel dan 4,71 juta terkait pada 2021; proyeksi 39,1 juta pada 2025–2050 (GBD 2021 AMR Collaborators, 2024), dengan estimasi Indonesia 36.500 atributabel dan 147.000 terkait (Kemenkes RI, 2025).',
    citation: 'Kemenkes RI, 2025 & 2026; GBD 2021 AMR Collaborators, 2024',
  },
];

export const JATENG_DIY_CAVEAT = {
  title: 'Catatan Metodologis Wajib: Temuan Isolat Jawa Tengah & DIY (Alhadz dkk., 2026)',
  finding: 'Di Jawa Tengah dan DIY, dari 14 isolat klinis Staphylococcus pseudintermedius, 13 di antaranya membawa gen mecA (Alhadz dkk., 2026).',
  warning:
    'CATATAN PENTING: Angka 13 dari 14 isolat ini BUKAN prevalensi MRSP pada pioderma anjing dan BUKAN prevalensi nasional. Sampel berasal dari berbagai lokasi tubuh dan spesies dengan ukuran sampel kecil (n = 14).',
};

export const COMPARISON_ROWS = [
  {
    initiative: 'Pedoman ISCAID 2025',
    clinicalRules: 'Ya — standar terapi topikal & lini pertama berbasis bukti',
    labIncentive: 'Tidak ada skema voucher/subsidi lab',
    localAntibiogram: 'Tidak menyediakan jaringan data resistansi lokal',
    householdPrevention: 'Terbatas pada konsultasi di klinik',
    limitation: 'Aturan klinis kuat, namun tanpa insentif diagnostik dan umpan balik data lokal.',
  },
  {
    initiative: 'Program Stewardship 135 Klinik Australia',
    clinicalRules: 'Ya — audit dan umpan balik pola peresepan',
    labIncentive: 'Parsial / bergantung biaya pemilik',
    localAntibiogram: 'Pelaporan terpusat tingkat jaringan klinik',
    householdPrevention: 'Tidak menyentuh protokol pencegahan rumah tangga',
    limitation: 'Berhasil menekan peresepan, tetapi belum memutus rantai paparan di rumah tangga.',
  },
  {
    initiative: 'Stewardship RS Hewan Tokyo',
    clinicalRules: 'Ya — pembatasan antimikroba kritis di rumah sakit',
    labIncentive: 'Fasilitas kultur internal RS rujukan',
    localAntibiogram: 'Terbatas pada satu rumah sakit rujukan',
    householdPrevention: 'Tidak mencakup pemantauan rumah tangga berkelanjutan',
    limitation: 'Penggunaan antimikroba turun >50%, tetapi proporsi stafilokokus resistan metisilin tetap ~50%.',
  },
  {
    initiative: 'DERMA-SATU (Model Konsep)',
    clinicalRules: 'Terintegrasi alur sitologi + pedoman ISCAID 2025',
    labIncentive: 'Voucher uji kultur terhubung verifikasi klinis',
    localAntibiogram: 'Antibiogram regional teragregasi & penelusuran resep',
    householdPrevention: 'Protokol rumah tangga, edukasi, pengingat, & consent granular',
    limitation: 'Prototipe rantai tertutup (closed-loop). Kelayakan dan dampak DERMA-SATU masih perlu diuji.',
    highlighted: true,
  },
];

export const REFERENCES_LIST = [
  {
    id: 'ref-1',
    citation:
      'Afshar, M., dkk. (2026). Meta-analisis prevalensi methicillin-resistant Staphylococcus pseudintermedius (MRSP) pada pioderma anjing di Asia (14 studi; prevalensi gabungan 30,7%, IK 95%: 21,3–42,1; I² = 93,85%).',
  },
  {
    id: 'ref-2',
    citation:
      'Alhadz, A., dkk. (2026). Deteksi gen mecA pada isolat klinis Staphylococcus pseudintermedius di Jawa Tengah dan DIY (13 dari 14 isolat membawa mecA; sampel multi-spesies & multi-lokasi tubuh).',
  },
  {
    id: 'ref-3',
    citation:
      'GBD 2021 AMR Collaborators. (2024). Global burden of bacterial antimicrobial resistance 1990–2021: a systematic analysis with forecasts to 2050. The Lancet (1,14 juta kematian atributabel; 4,71 juta terkait pada 2021; proyeksi 39,1 juta pada 2025–2050).',
  },
  {
    id: 'ref-4',
    citation:
      'Kementerian Kesehatan Republik Indonesia (Kemenkes RI). (2025 & 2026). Estimasi beban AMR Indonesia (36.500 kematian atributabel dan 147.000 terkait) serta target operasional nasional pengendalian AMR pada 80% rumah sakit tahun 2029.',
  },
  {
    id: 'ref-5',
    citation:
      'Santoro, D., dkk. (2026). Pola peresepan antimikroba dan penggunaan kultur bakteri pada 22 praktik rujukan dermatologi veteriner (550 kasus; 54,9% peresepan antimikroba; 15,3% konfirmasi kultur; 43,9% sefalosporin generasi ketiga).',
  },
  {
    id: 'ref-6',
    citation:
      'Zur, G., dkk. (2016). Faktor risiko resistansi metisilin pada isolat kulit dan telinga anjing (48,1% keseluruhan; meningkat menjadi 60,7% dengan riwayat paparan antimikroba dalam 1 bulan terakhir).',
  },
];
