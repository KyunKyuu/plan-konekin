const fallbackData = {
  meta: {
    title: "Komunitas Konek.in",
    group: "Versi Kelompok",
    period: "Rencana Komunitas",
    summary: "Catatan komunitas untuk membaca kondisi, menetapkan target, dan menjaga alur pembinaan."
  },
  swat: { headline: "Analisis SWAT Kelompok", note: "", items: [] },
  targets: []
};

const state = {
  data: fallbackData,
  activeView: "menu",
  activeIndex: 0,
  activeMission: "keumatan",
  activeRoadmapIndex: 0,
  activeMindmapId: "",
  mindmapQuery: "",
  mindmapFilter: "ALL",
  query: "",
  sort: "priority",
  touch: { startX: 0, startY: 0, active: false }
};

const priorityRank = { critical: 0, high: 1, medium: 2, low: 3 };
const priorityLabel = { critical: "Kritis", high: "Tinggi", medium: "Sedang", low: "Rendah" };
const stageLabel = {
  Mapping: "Pemetaan",
  Akuisisi: "Jangkauan",
  Ekspansi: "Perluasan",
  Operasi: "Gerak komunitas"
};
const swatLabel = {
  Strength: "Kekuatan",
  Weakness: "Kelemahan",
  Action: "Langkah",
  Threat: "Risiko",
  Program: "Program 1 Tahun"
};

const els = {
  title: document.querySelector("#page-title"),
  period: document.querySelector("#period"),
  summary: document.querySelector("#summary"),
  swatTitle: document.querySelector("#swat-title"),
  swatNote: document.querySelector("#swat-note"),
  swatGrid: document.querySelector("#swat-grid"),
  list: document.querySelector("#target-list"),
  reader: document.querySelector("#target-reader"),
  count: document.querySelector("#target-count"),
  search: document.querySelector("#search"),
  sort: document.querySelector("#sort"),
  prev: document.querySelector("#prev-target"),
  next: document.querySelector("#next-target"),
  menuToggle: document.querySelector("#menu-toggle"),
  mainMenu: document.querySelector("#main-menu"),
  filterToggle: document.querySelector("#filter-toggle"),
  targetFilter: document.querySelector("#target-filter"),
  startFirst: document.querySelector("#start-first-target"),
  missionTabs: document.querySelector("#mission-tabs"),
  mappingSummary: document.querySelector("#mapping-summary"),
  mappingList: document.querySelector("#mapping-list"),
  roadmapList: document.querySelector("#roadmap-list"),
  roadmapDetail: document.querySelector("#roadmap-detail"),
  prevRoadmap: document.querySelector("#prev-roadmap"),
  nextRoadmap: document.querySelector("#next-roadmap"),
  roadmapCount: document.querySelector("#roadmap-count"),
  mindmapVisual: document.querySelector("#mindmap-visual"),
  mindmapDetail: document.querySelector("#mindmap-detail"),
  mindmapSearch: document.querySelector("#mindmap-search"),
  mindmapFilter: document.querySelector("#mindmap-filter"),
  relationTable: document.querySelector("#relation-table")
};

const officerMapping = [
  {
    mission: "keumatan",
    missionName: "Pembinaan komunitas",
    purpose: "Menjaga agar orang yang sudah masuk pipeline tidak hilang, bisa dibina, dan naik tahap secara bertahap.",
    roles: [
      {
        role: "Koordinator pembinaan",
        ideal: 1,
        supports: "HK, Tarbiyah 1, Tarbiyah 2, WJ",
        mainWork: "Membagi mentor, mengecek kehadiran, dan memastikan setiap orang punya jalur lanjut.",
        priorityWhenDouble: "Dahulukan jadwal tarbiyah dan mentoring rutin. Tugas marketing bisa didelegasikan jika bentrok.",
        helpNeeded: "Butuh laporan hadir mingguan dan daftar nama yang mulai lemah.",
        risk: "Jika kosong, target tarbiyah bisa terlihat tinggi di angka tetapi turun di kehadiran."
      },
      {
        role: "Mentor / pembina kecil",
        ideal: 4,
        supports: "BBQ, Tarbiyah 1, Tarbiyah 2, Bina",
        mainWork: "Memegang kelompok kecil, follow-up personal, dan membaca hambatan peserta.",
        priorityWhenDouble: "Dahulukan orang yang sudah masuk pembinaan. Kontak baru bisa menunggu, tetapi binaan yang hilang sulit dikembalikan.",
        helpNeeded: "Butuh bahan pertemuan, jadwal tetap, dan partner follow-up.",
        risk: "Jika mentor kurang, satu penggerak memegang terlalu banyak orang dan kualitas turun."
      },
      {
        role: "PIC data binaan",
        ideal: 2,
        supports: "IGA, IDU, HK, WJ",
        mainWork: "Merapikan status nama: belum kontak, sudah kontak, siap hadir, aktif, atau perlu ditahan.",
        priorityWhenDouble: "Dahulukan update status sebelum rapat evaluasi. Tanpa data, keputusan target akan kabur.",
        helpNeeded: "Butuh format data yang sama dan akses laporan dari semua PIC.",
        risk: "Jika data tidak rapi, target berikutnya bisa salah hitung."
      },
      {
        role: "Penghubung personal",
        ideal: 5,
        supports: "HK, BBQ, Pesmas, LPK",
        mainWork: "Mengajak, mengingatkan, dan menjaga komunikasi dengan target yang sudah dekat.",
        priorityWhenDouble: "Dahulukan orang yang sudah memberi respons. Target dingin bisa masuk gelombang berikutnya.",
        helpNeeded: "Butuh daftar prioritas dan pesan pendek yang mudah dipakai.",
        risk: "Jika follow-up lambat, target yang sudah hangat bisa turun minat."
      }
    ]
  },
  {
    mission: "marketing",
    missionName: "Jangkauan / Perluasan",
    purpose: "Membuka kontak baru, memperluas jangkauan, dan memastikan pipeline awal tidak kosong.",
    roles: [
      {
        role: "Koordinator marketing",
        ideal: 1,
        supports: "IGA, IDU, ISAT, Pesmas",
        mainWork: "Menentukan kanal masuk, membagi target area, dan membaca sumber target yang paling hidup.",
        priorityWhenDouble: "Dahulukan kanal yang sedang menghasilkan nama. Ide baru ditahan dulu jika follow-up lama belum selesai.",
        helpNeeded: "Butuh rekap sumber target dan jadwal kampanye kecil.",
        risk: "Jika tidak ada koordinator, tim sibuk bergerak tetapi tidak tahu kanal mana yang efektif."
      },
      {
        role: "PIC konten dan undangan",
        ideal: 2,
        supports: "Pesmas, LPK, BBQ, Wisuda",
        mainWork: "Membuat ajakan, narasi kegiatan, dan materi sederhana yang mudah dibagikan.",
        priorityWhenDouble: "Dahulukan materi untuk kegiatan terdekat. Konten umum bisa menunggu.",
        helpNeeded: "Butuh tema kegiatan, daftar penerima, dan validasi pesan.",
        risk: "Jika pesan tidak jelas, orang awam tidak paham kenapa harus ikut."
      },
      {
        role: "PIC follow-up kontak baru",
        ideal: 4,
        supports: "IGA, IDU, ISAT, HK",
        mainWork: "Menghubungi nama baru, mencatat respons, dan mengarahkan yang siap ke pembinaan.",
        priorityWhenDouble: "Dahulukan kontak yang sudah merespons dalam 48 jam terakhir. Respons cepat lebih mudah dijaga.",
        helpNeeded: "Butuh template chat, status follow-up, dan pasangan backup.",
        risk: "Jika terlalu lambat, daftar nama besar tidak berubah menjadi target aktif."
      },
      {
        role: "PIC event / momentum",
        ideal: 2,
        supports: "Wisuda, Pesmas, LPK, BBQ",
        mainWork: "Memanfaatkan momen kegiatan untuk mengumpulkan kontak dan membuka percakapan natural.",
        priorityWhenDouble: "Dahulukan event yang sudah dekat tanggalnya. Event jauh cukup disiapkan kerangkanya.",
        helpNeeded: "Butuh rundown, daftar tamu, dan penggerak penyambut.",
        risk: "Jika event tidak diarahkan, banyak orang hadir tetapi tidak masuk pipeline."
      }
    ]
  }
];

const evaluationTypeLabel = {
  ROOT: "Root",
  BACKGROUND: "Latar Belakang",
  PROBLEM: "Masalah",
  SOLUTION: "Solusi",
  RELATION: "Benang Merah"
};

const evaluationNodes = [
  {
    id: "root",
    title: "Evaluasi Program Sales",
    type: "ROOT",
    description: "Pusat baca evaluasi program: latar belakang, masalah, solusi, role, dan benang merah gerakan.",
    rootCause: "Masalah program tidak berdiri sendiri. Ada hubungan antara pengurus, member, komunikasi, inspirasi, dan suasana gerak.",
    impact: "Tanpa peta hubungan, evaluasi mudah terasa terpisah-pisah dan tindak lanjut tidak fokus.",
    solutions: ["Baca node per kategori", "Lihat relasi masalah ke solusi", "Pilih prioritas perbaikan"],
    roles: ["URPIM", "Kaur", "Kapten", "Katim", "Member"],
    followUp: "Gunakan mindmap ini sebagai bahan evaluasi rutin sebelum menentukan program lanjutan.",
    order: 0
  },
  {
    id: "member-baru-belum-bergerak",
    title: "Member Baru Sudah Ada Tapi Belum Bergerak",
    type: "BACKGROUND",
    description: "Member baru secara jumlah sudah ada, tetapi belum otomatis aktif, belum berani mengumpulkan orang, dan belum merasa punya tanggung jawab langsung.",
    rootCause: "Member belum memahami perannya, belum terbiasa bergerak tanpa disuruh, dan pembinaan katim belum cukup kuat.",
    impact: "Jumlah member tidak otomatis menjadi kekuatan gerak. Beban sales tetap bertumpu pada orang lama.",
    solutions: ["Katim Aktif Membina Member", "Membagi Kaur Dakwah dan Kaur Bina"],
    roles: ["Katim", "Kaur Bina", "Member"],
    followUp: "Katim mulai mapping member, mengajak bertahap, dan membiasakan member membawa orang.",
    order: 1
  },
  {
    id: "pengurus-mulai-melemah",
    title: "Pengurus Mulai Melemah",
    type: "BACKGROUND",
    description: "Pengurus mulai melemah dari sisi semangat, komunikasi, kedisiplinan, dan inisiatif karena beban gerak setahun ke belakang.",
    rootCause: "Beban terlalu lama bertumpu pada pengurus, pembagian peran belum jelas, dan wadah penguatan internal belum maksimal.",
    impact: "Pembinaan member ikut melemah dan program terasa berat sebelum siap bergerak masif.",
    solutions: ["Perkuat Internal Pengurus", "Budaya Komunikasi Aktif"],
    roles: ["URPIM", "KMA", "Kaur"],
    followUp: "Dahulukan penguatan internal sebelum menekan pencarian CK secara besar.",
    order: 2
  },
  {
    id: "butuh-inspirasi",
    title: "Butuh Inspirasi dan Contoh",
    type: "BACKGROUND",
    description: "Program terasa mentok ketika pengurus merasa bergerak sendiri dan tidak punya contoh gerakan yang bisa dipelajari.",
    rootCause: "Kurang mencari arahan dari struktur atas dan kurang belajar dari tempat lain.",
    impact: "Program terasa buntu, ide terbatas, dan pengurus mudah kehilangan arah.",
    solutions: ["Aktif Mencari Arahan dan Inspirasi"],
    roles: ["URPIM", "Kaur", "Katim"],
    followUp: "Kumpulkan contoh program dari Kasi, KMA, KMU, atau KMA lain.",
    order: 3
  },
  {
    id: "komunikasi-pasif",
    title: "Komunikasi Pasif",
    type: "PROBLEM",
    description: "Komunikasi antar struktural, katim ke member, kapten ke player, dan player ke kapten masih pasif.",
    rootCause: "Informasi tertahan di orang tertentu dan tidak ada ruang report yang terlihat bersama.",
    impact: "Kendala lambat diketahui, arahan tidak merata, dan program sulit dievaluasi.",
    solutions: ["Portal Report Sales", "Budaya Komunikasi Aktif", "Aktif Mencari Arahan dan Inspirasi"],
    roles: ["URPIM", "Kapten", "Katim", "Member"],
    followUp: "Buka portal report sederhana dan biasakan laporan singkat yang bisa dibaca struktur terkait.",
    order: 4
  },
  {
    id: "member-sales-pasif",
    title: "Member Sales Pasif",
    type: "PROBLEM",
    description: "Member sales, baik senior maupun member baru, masih banyak yang belum aktif bergerak secara mandiri.",
    rootCause: "Belum terbina, belum punya contoh, belum tahu peran, dan belum merasa menjadi bagian dari perjuangan.",
    impact: "Beban program bertumpu pada sedikit orang dan gerakan tidak menyebar ke banyak titik.",
    solutions: ["Katim Aktif Membina Member", "URPIM Menjadi Contoh"],
    roles: ["Katim", "Member", "Kaur Bina"],
    followUp: "Bina member lewat tugas kecil, contoh langsung, dan report yang terlihat.",
    order: 5
  },
  {
    id: "kesadaran-mandiri-lemah",
    title: "Kesadaran Mandiri Lemah",
    type: "PROBLEM",
    description: "Sebagian anggota belum memiliki kesadaran untuk mengambil peran tanpa harus disuruh.",
    rootCause: "Terbiasa menunggu instruksi dan belum ada suasana yang membentuk tanggung jawab personal.",
    impact: "Jika tidak diingatkan, gerakan berhenti dan struktur terlihat ada tetapi fungsi tidak hidup.",
    solutions: ["URPIM Menjadi Contoh", "Katim Aktif Membina Member", "Membagi Kaur Dakwah dan Kaur Bina"],
    roles: ["URPIM", "Katim", "Kaur Bina"],
    followUp: "Bentuk kesadaran lewat contoh, pembinaan, komunikasi, dan amanah kecil.",
    order: 6
  },
  {
    id: "sulit-ck",
    title: "Sulit Mencari CK Mahasiswa Aktif",
    type: "PROBLEM",
    description: "Sales yang sudah lulus mulai kesulitan mencari CK mahasiswa aktif karena akses kampus berkurang.",
    rootCause: "Pencarian CK masih bertumpu pada orang lama yang akses kampusnya mulai terbatas.",
    impact: "CK potensial dari mahasiswa aktif tidak tergarap maksimal.",
    solutions: ["Katim Aktif Membina Member", "Portal Report Sales"],
    roles: ["Katim", "Member", "Sales Lulus"],
    followUp: "Katim membantu member yang masih dekat dengan mahasiswa aktif agar berani membawa CK.",
    order: 7
  },
  {
    id: "pengurus-overload",
    title: "Pengurus Lelah dan Overload",
    type: "PROBLEM",
    description: "Pengurus melemah karena beban gerak selama setahun ke belakang cukup berat.",
    rootCause: "Beban kerja belum terbagi rapi dan ritme penguatan internal belum cukup.",
    impact: "Komunikasi menurun, disiplin internal melemah, dan pembinaan member tidak maksimal.",
    solutions: ["Perkuat Internal Pengurus", "Budaya Komunikasi Aktif"],
    roles: ["URPIM", "KMA", "Kaur"],
    followUp: "Evaluasi beban kerja, rapikan komunikasi, dan pulihkan semangat sebelum gerak keluar masif.",
    order: 8
  },
  {
    id: "dakwah-bina-belum-terarah",
    title: "Peran Dakwah dan Bina Belum Terarah",
    type: "PROBLEM",
    description: "Fungsi arah dakwah dan pembinaan masih perlu dipisahkan agar kerja lebih fokus.",
    rootCause: "Satu orang terlalu banyak menanggung fungsi dan pembinaan member belum terpantau rapi.",
    impact: "Program bisa ramai secara aktivitas tetapi lemah secara isi dan pembentukan orang.",
    solutions: ["Membagi Kaur Dakwah dan Kaur Bina"],
    roles: ["Kaur Dakwah", "Kaur Bina"],
    followUp: "Pisahkan fokus Kaur Dakwah untuk narasi dan Kaur Bina untuk pembinaan member.",
    order: 9
  },
  {
    id: "kurang-inspirasi",
    title: "Kurang Inspirasi dan Contoh",
    type: "PROBLEM",
    description: "Program mudah terasa mentok karena kurang sumber inspirasi dan contoh gerakan.",
    rootCause: "Terlalu banyak dipikir sendiri dari nol dan jarang mencari pola yang sudah berjalan.",
    impact: "Pengurus merasa bergerak sendiri dan ide program tidak berkembang.",
    solutions: ["Aktif Mencari Arahan dan Inspirasi"],
    roles: ["URPIM", "Kaur", "Katim"],
    followUp: "Jadwalkan belajar dari Kasi, KMA, KMU, atau KMA lain.",
    order: 10
  },
  {
    id: "vibe-lemah",
    title: "Vibe Perjuangan Belum Kuat",
    type: "PROBLEM",
    description: "Gerakan masih terasa teknis dan belum cukup terasa sebagai perjuangan bersama.",
    rootCause: "Makna gerak belum cukup hidup, report kaku, dan member belum merasa dilibatkan.",
    impact: "Member merasa hanya diberi tugas dan mudah lelah karena tidak merasakan makna gerak.",
    solutions: ["Membangun Vibe Perjuangan", "Membagi Kaur Dakwah dan Kaur Bina", "URPIM Menjadi Contoh"],
    roles: ["Kaur Dakwah", "URPIM", "Katim"],
    followUp: "Buat narasi perjuangan, angkat cerita positif, dan jadikan report sebagai penguat semangat.",
    order: 11
  },
  {
    id: "perkuat-internal",
    title: "Perkuat Internal Pengurus",
    type: "SOLUTION",
    description: "Menguatkan kembali pengurus sebelum mendorong gerakan keluar secara masif.",
    rootCause: "Internal yang lemah membuat pembinaan dan pencarian CK ikut rapuh.",
    impact: "Jika dilakukan, struktur, SDM, dan wadah menjadi lebih siap untuk gerak keluar.",
    solutions: ["Rapikan komunikasi", "Kuatkan disiplin", "Perjelas pembagian peran"],
    roles: ["URPIM", "KMA", "Kaur"],
    followUp: "Hidupkan forum internal dan evaluasi beban kerja pengurus.",
    order: 12
  },
  {
    id: "portal-report",
    title: "Portal Report Sales",
    type: "SOLUTION",
    description: "Membuka komunikasi dan report sales agar informasi tidak tertahan di kapten atau orang tertentu.",
    rootCause: "Informasi lapangan tertutup dan kendala lambat diketahui.",
    impact: "Progress terlihat bersama, kendala cepat ditindaklanjuti, dan report menjadi pemantik semangat.",
    solutions: ["Report mingguan", "Status kendala", "Catatan follow-up"],
    roles: ["Kapten", "Katim", "Member"],
    followUp: "Buat format report sederhana yang bisa dibaca struktur terkait.",
    order: 13
  },
  {
    id: "katim-bina-member",
    title: "Katim Aktif Membina Member",
    type: "SOLUTION",
    description: "Katim tidak hanya bergerak sebagai sales pribadi, tetapi juga membina member agar sadar peran.",
    rootCause: "Member tidak otomatis bergerak tanpa pembinaan dan contoh.",
    impact: "Member mulai berani mengumpulkan orang dan pencarian CK tidak hanya bertumpu pada sales lama.",
    solutions: ["Katim menjadi PG", "Member menjadi PH", "Amanah kecil bertahap"],
    roles: ["Katim", "Member", "Kaur Bina"],
    followUp: "Katim mapping member dan mengawal CK sampai siap sempro.",
    order: 14
  },
  {
    id: "urpim-contoh",
    title: "URPIM Menjadi Contoh",
    type: "SOLUTION",
    description: "URPIM menjadi standar gerak lewat komunikasi aktif, disiplin report, dan inisiatif.",
    rootCause: "Kesadaran mandiri sulit terbentuk jika struktur atas tidak memberi contoh.",
    impact: "Member dan pengurus punya role model gerak yang jelas.",
    solutions: ["Aktif komunikasi", "Disiplin report", "Berinisiatif"],
    roles: ["URPIM"],
    followUp: "Tampilkan standar gerak yang bisa ditiru oleh katim dan member.",
    order: 15
  },
  {
    id: "budaya-komunikasi",
    title: "Budaya Komunikasi Aktif",
    type: "SOLUTION",
    description: "Membiasakan semua elemen untuk tidak membiarkan masalah terlalu lama.",
    rootCause: "Masalah sering tertahan karena orang menunggu ditanya atau takut menyampaikan kendala.",
    impact: "Kendala cepat terbaca dan program tidak macet diam-diam.",
    solutions: ["Cepat bertanya", "Cepat meminta arahan", "Saling mengingatkan"],
    roles: ["URPIM", "Kapten", "Katim", "Member"],
    followUp: "Buat kebiasaan laporan pendek ketika bingung, macet, atau butuh bantuan.",
    order: 16
  },
  {
    id: "cari-inspirasi",
    title: "Aktif Mencari Arahan dan Inspirasi",
    type: "SOLUTION",
    description: "Membuka sumber ide agar program tidak mentok dan pengurus tidak merasa bergerak sendiri.",
    rootCause: "Tidak semua pola harus dipikir dari nol oleh tim sendiri.",
    impact: "Program punya ide baru dan struktur tidak merasa sendirian.",
    solutions: ["Bertanya ke Kasi", "Bertanya ke KMA", "Belajar dari KMU atau KMA lain"],
    roles: ["URPIM", "Kaur", "Katim"],
    followUp: "Kumpulkan contoh program yang bisa ditiru dan disesuaikan.",
    order: 17
  },
  {
    id: "bagi-kaur",
    title: "Membagi Kaur Dakwah dan Kaur Bina",
    type: "SOLUTION",
    description: "Memisahkan fokus dakwah dan pembinaan agar kerja lebih terarah.",
    rootCause: "Arah dakwah dan pembinaan member butuh fokus yang berbeda.",
    impact: "Kaur Dakwah menjaga isi perjuangan, Kaur Bina menjaga proses pembentukan anggota.",
    solutions: ["Kaur Dakwah fokus narasi", "Kaur Bina fokus pembinaan"],
    roles: ["Kaur Dakwah", "Kaur Bina"],
    followUp: "Tentukan PIC terpisah dan indikator kerja masing-masing.",
    order: 18
  },
  {
    id: "vibe-perjuangan",
    title: "Membangun Vibe Perjuangan",
    type: "SOLUTION",
    description: "Mengubah program dari aktivitas teknis menjadi gerakan yang terasa hidup, jelas, dan bermakna.",
    rootCause: "Program yang hanya terasa tugas akan melelahkan dan tidak membentuk rasa memiliki.",
    impact: "Member merasa dilibatkan dan melihat makna di balik aktivitas sales.",
    solutions: ["Narasi perjuangan", "Report yang tidak kaku", "Cerita gerakan positif"],
    roles: ["Kaur Dakwah", "URPIM", "Katim"],
    followUp: "Bangun suasana evaluasi sebagai ruang saling menguatkan.",
    order: 19
  },
  {
    id: "rel-pengurus-internal",
    title: "Pengurus Melemah ke Penguatan Internal",
    type: "RELATION",
    description: "Pengurus perlu diperkuat sebelum membina member dan sebelum gerakan keluar dimasifkan.",
    roles: ["URPIM", "KMA", "Kaur"],
    followUp: "Prioritaskan disiplin internal sebagai dasar gerak keluar.",
    order: 20
  },
  {
    id: "rel-member-katim",
    title: "Member Baru Belum Bergerak ke Pembinaan Katim",
    type: "RELATION",
    description: "Member baru perlu diarahkan oleh katim agar sadar peran dan mulai bergerak bertahap.",
    roles: ["Katim", "Kaur Bina", "Member"],
    followUp: "Katim memberi amanah kecil dan mengawal progres member.",
    order: 21
  },
  {
    id: "rel-komunikasi-report",
    title: "Komunikasi Pasif ke Portal Report Sales",
    type: "RELATION",
    description: "Portal report membuka informasi, membuat kendala cepat terlihat, dan memudahkan tindak lanjut.",
    roles: ["Kapten", "Katim", "Member"],
    followUp: "Buat report terbuka untuk struktur terkait.",
    order: 22
  },
  {
    id: "rel-vibe-ruh",
    title: "Vibe Perjuangan sebagai Ruh Program",
    type: "RELATION",
    description: "Semua solusi perlu mengarah pada suasana gerak yang hidup agar program tidak terasa hanya sebagai tugas.",
    roles: ["Kaur Dakwah", "URPIM", "Katim"],
    followUp: "Jaga narasi dan suasana agar member merasa menjadi bagian dari perjuangan bersama.",
    order: 23
  }
];

const evaluationRelations = [
  ["Pengurus Mulai Melemah", "CAUSES", "Pengurus Lelah dan Overload"],
  ["Pengurus Lelah dan Overload", "SOLVED_BY", "Perkuat Internal Pengurus"],
  ["Member Baru Sudah Ada Tapi Belum Bergerak", "CAUSES", "Member Sales Pasif"],
  ["Member Sales Pasif", "SOLVED_BY", "Katim Aktif Membina Member"],
  ["Member Sales Pasif", "SUPPORTED_BY", "URPIM Menjadi Contoh"],
  ["Kesadaran Mandiri Lemah", "SOLVED_BY", "URPIM Menjadi Contoh"],
  ["Kesadaran Mandiri Lemah", "SUPPORTED_BY", "Katim Aktif Membina Member"],
  ["Kesadaran Mandiri Lemah", "SUPPORTED_BY", "Membagi Kaur Dakwah dan Kaur Bina"],
  ["Komunikasi Pasif", "SOLVED_BY", "Portal Report Sales"],
  ["Komunikasi Pasif", "SUPPORTED_BY", "Budaya Komunikasi Aktif"],
  ["Komunikasi Pasif", "SUPPORTED_BY", "Aktif Mencari Arahan dan Inspirasi"],
  ["Sulit Mencari CK Mahasiswa Aktif", "SOLVED_BY", "Katim Aktif Membina Member"],
  ["Sulit Mencari CK Mahasiswa Aktif", "SUPPORTED_BY", "Portal Report Sales"],
  ["Peran Dakwah dan Bina Belum Terarah", "SOLVED_BY", "Membagi Kaur Dakwah dan Kaur Bina"],
  ["Kurang Inspirasi dan Contoh", "SOLVED_BY", "Aktif Mencari Arahan dan Inspirasi"],
  ["Vibe Perjuangan Belum Kuat", "SOLVED_BY", "Membangun Vibe Perjuangan"],
  ["Vibe Perjuangan Belum Kuat", "SUPPORTED_BY", "Membagi Kaur Dakwah dan Kaur Bina"],
  ["Vibe Perjuangan Belum Kuat", "SUPPORTED_BY", "URPIM Menjadi Contoh"]
].map(([source, relation, target], index) => ({ id: `relation-${index + 1}`, source, relation, target }));

async function boot() {
  if (window.PLANNING_DATA) {
    state.data = window.PLANNING_DATA;
  } else {
    try {
      const response = await fetch("./data.json", { cache: "no-store" });
      if (response.ok) state.data = await response.json();
    } catch (error) {
      state.data = fallbackData;
    }
  }

  renderStatic();
  bindEvents();
  renderTargets();
  renderMapping();
  renderRoadmap();
  renderMindmap();
  setView(location.hash?.replace("#", "") || "menu", false);
}

function renderStatic() {
  const { meta, swat } = state.data;
  els.title.innerHTML = `<span class="community-title">Komunitas</span><span class="konek-title">Konek.in</span>`;
  els.period.textContent = meta.period;
  els.summary.textContent = meta.summary;
  els.swatTitle.textContent = swat.headline;
  els.swatNote.textContent = swat.note;

  els.swatGrid.innerHTML = swat.items.map((item, index) => `
    <details class="swat-card" style="--i:${index}" ${index === 0 ? "open" : ""}>
      <summary>
      <div class="swat-number">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <span class="swat-label">${swatLabel[item.label] || item.label}</span>
        <h3>${item.title}</h3>
      </div>
      <span class="swat-toggle" aria-hidden="true"><i></i><b>Buka</b></span>
      </summary>
      <div class="swat-body">
        ${renderSwatContent(item)}
      </div>
    </details>
  `).join("");
}

function renderSwatContent(item) {
  if (Array.isArray(item.sections)) {
    return item.sections.map((section) => `
      <section class="swat-section">
        <h4>${section.title}</h4>
        ${section.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </section>
    `).join("");
  }
  return `<p>${item.body}</p>`;
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      setView(button.dataset.view);
      closeMenu();
    });
  });

  els.menuToggle.addEventListener("click", () => {
    const isOpen = els.mainMenu.classList.toggle("open");
    els.menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  els.filterToggle.addEventListener("click", () => {
    const isOpen = els.targetFilter.classList.toggle("open");
    els.filterToggle.setAttribute("aria-expanded", String(isOpen));
  });

  els.mindmapSearch.addEventListener("input", (event) => {
    state.mindmapQuery = event.target.value.trim().toLowerCase();
    renderMindmap();
  });

  els.mindmapFilter.addEventListener("change", (event) => {
    state.mindmapFilter = event.target.value;
    renderMindmap();
  });

  els.missionTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mission]");
    if (!button) return;
    state.activeMission = button.dataset.mission;
    renderMapping();
  });

  document.addEventListener("click", (event) => {
    if (els.mainMenu.contains(event.target) || els.menuToggle.contains(event.target)) return;
    closeMenu();
  });

  els.swatGrid.addEventListener("toggle", (event) => {
    const opened = event.target;
    if (!opened.matches(".swat-card") || !opened.open) return;
    els.swatGrid.querySelectorAll(".swat-card[open]").forEach((card) => {
      if (card !== opened) card.open = false;
    });
    opened.scrollIntoView({ behavior: "smooth", block: "center" });
  }, true);

  els.search.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    state.activeIndex = 0;
    renderTargets();
  });

  els.sort.addEventListener("change", (event) => {
    state.sort = event.target.value;
    state.activeIndex = 0;
    renderTargets();
  });

  els.prev.addEventListener("click", () => moveTarget(-1));
  els.next.addEventListener("click", () => moveTarget(1));
  els.prevRoadmap.addEventListener("click", () => moveRoadmap(-1));
  els.nextRoadmap.addEventListener("click", () => moveRoadmap(1));
  els.startFirst.addEventListener("click", () => {
    state.activeIndex = 0;
    renderTargets();
    setView("target-read");
  });
  els.reader.addEventListener("touchstart", handleTouchStart, { passive: true });
  els.reader.addEventListener("touchend", handleTouchEnd, { passive: true });
  els.roadmapDetail.addEventListener("touchstart", handleTouchStart, { passive: true });
  els.roadmapDetail.addEventListener("touchend", handleTouchEnd, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (state.activeView === "target-read") {
      if (event.key === "ArrowLeft") moveTarget(-1);
      if (event.key === "ArrowRight") moveTarget(1);
    }
    if (state.activeView === "roadmap-detail") {
      if (event.key === "ArrowLeft") moveRoadmap(-1);
      if (event.key === "ArrowRight") moveRoadmap(1);
    }
  });
}

function setView(view, updateHash = true) {
  const allowed = ["menu", "swat", "targets", "target-read", "mapping", "roadmap", "roadmap-detail", "mindmap"];
  state.activeView = allowed.includes(view) ? view : "menu";
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === `screen-${state.activeView}`);
  });
  document.querySelectorAll(".dock button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.activeView || (button.dataset.view === "targets" && state.activeView === "target-read"));
  });
  if (updateHash) {
    history.replaceState(null, "", state.activeView === "menu" ? location.pathname : `#${state.activeView}`);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderRoadmap() {
  const phases = buildRoadmap();
  els.roadmapList.innerHTML = phases.map((phase, index) => `
    <button class="roadmap-card" type="button" data-roadmap-index="${index}">
      <span class="roadmap-node">${String(index + 1).padStart(2, "0")}</span>
      <span class="roadmap-card-copy">
        <span class="roadmap-period">${phase.period}</span>
        <strong>${phase.title}</strong>
        <small>${phase.focus}</small>
      </span>
      <span class="roadmap-count">${phase.programs.length} fokus</span>
    </button>
  `).join("");

  els.roadmapList.querySelectorAll("[data-roadmap-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeRoadmapIndex = Number(button.dataset.roadmapIndex);
      renderRoadmapDetail();
      setView("roadmap-detail");
    });
  });

  renderRoadmapDetail();
}

function renderRoadmapDetail() {
  const phases = buildRoadmap();
  state.activeRoadmapIndex = Math.max(0, Math.min(state.activeRoadmapIndex, phases.length - 1));
  const phase = phases[state.activeRoadmapIndex] || phases[0];
  els.roadmapDetail.innerHTML = `
    <header>
      <span class="target-index">${phase.period}</span>
      <h3>${phase.title}</h3>
      <p>${phase.focus}</p>
    </header>
      <div class="roadmap-body">
        <section>
          <h4>Program utama</h4>
          <div class="roadmap-targets">
            ${phase.programs.map((program) => `<span>${program}</span>`).join("")}
          </div>
        </section>
        <section>
          <h4>Prioritas gerak</h4>
          ${phase.priorities.map((priority) => `<p>${priority}</p>`).join("")}
        </section>
        <section>
          <h4>Target akhir triwulan</h4>
          ${phase.outcomes.map((outcome) => `<p>${outcome}</p>`).join("")}
        </section>
        <section>
          <h4>Jika meleset</h4>
          <p>${phase.fallback}</p>
        </section>
      </div>
  `;
  els.roadmapCount.textContent = `${state.activeRoadmapIndex + 1} / ${phases.length}`;
  els.prevRoadmap.disabled = state.activeRoadmapIndex === 0;
  els.nextRoadmap.disabled = state.activeRoadmapIndex === phases.length - 1;
}

function moveRoadmap(direction) {
  const total = buildRoadmap().length;
  if (!total) return;
  state.activeRoadmapIndex = Math.max(0, Math.min(state.activeRoadmapIndex + direction, total - 1));
  renderRoadmapDetail();
}

function buildRoadmap() {
  return [
    {
      period: "Triwulan 1",
      title: "Merapikan internal",
      focus: "Tiga bulan pertama dipakai untuk membenahi pengurus, komunikasi, jobdesk, data awal, ritme laporan, dan jadwal basecamp.",
      programs: ["Forum pengurus rutin", "Penegasan jobdesk", "Mapping masalah jabatan", "Data member awal", "Laporan katim", "Agenda basecamp"],
      priorities: [
        "Rapat pengurus 2 minggu sekali dengan laporan singkat dari tiap jabatan: progres, kendala, siapa yang perlu dibantu, dan rencana 2 minggu berikutnya.",
        "Setiap jabatan punya tugas utama, target kerja 3 bulan, batas wewenang, alur laporan, dan indikator sederhana.",
        "Sekretaris mulai memegang data member, mapping, rekap kehadiran, dan dokumentasi keputusan."
      ],
      outcomes: [
        "Semua pengurus tahu tugas utamanya.",
        "Forum komunikasi pengurus berjalan.",
        "Data awal member tersedia.",
        "Katim mulai aktif menghubungi member.",
        "Basecamp mulai punya jadwal tetap."
      ],
      fallback: "Jika pengurus belum stabil, kurangi jumlah agenda luar dan fokuskan energi pada rapat rutin, jobdesk, data member, dan laporan katim."
    },
    {
      period: "Triwulan 2",
      title: "Menghidupkan katim dan member",
      focus: "Setelah internal mulai rapi, fokus bergerak ke katim, member pasif, bonding per tim, update data, dan aktivasi prajurit.",
      programs: ["Penguatan katim", "Bonding per tim", "Pendekatan member pasif", "Update data member", "Basecamp rutin", "Aktivasi prajurit"],
      priorities: [
        "Katim dilatih membuka pembicaraan, mengajak tanpa memaksa, membaca member aktif/pasif/potensial, dan melaporkan kondisi member.",
        "Setiap katim menghubungi semua member minimal 1 kali per bulan dan membuat agenda bonding kecil minimal 1 kali per bulan.",
        "Data member diupdate minimal 1 bulan sekali berdasarkan laporan katim."
      ],
      outcomes: [
        "Setiap katim punya mapping member.",
        "Member pasif mulai terhubung kembali.",
        "Ada agenda kecil per tim.",
        "Muncul beberapa member potensial untuk diberi amanah."
      ],
      fallback: "Jika katim belum bergerak, kecilkan target agenda dan mulai dari kontak personal paling mudah: member yang sudah respons, dekat, atau pernah aktif."
    },
    {
      period: "Triwulan 3",
      title: "Event besar dan perluasan gerak",
      focus: "Ketika member mulai hidup, komunitas bisa membuat event besar sebagai momentum bonding, kaderisasi, dan perluasan jangkauan.",
      programs: ["Event besar", "Camping member", "Panitia campuran", "Marketing atau sales", "Aktivasi PH/PG", "Amanah kecil member"],
      priorities: [
        "Event besar dibuat sebagai alat untuk mengaktifkan member dan memperkuat struktur, bukan sekadar acara ramai.",
        "Setelah event, data kehadiran dicatat, peserta dikelompokkan, katim menghubungi ulang, dan peserta potensial diberi amanah kecil.",
        "Evaluasi event dilakukan maksimal 1 minggu setelah acara agar momentum tidak hilang."
      ],
      outcomes: [
        "Event besar terlaksana.",
        "Member lebih terikat.",
        "Ada kader baru yang mulai terlihat.",
        "Marketing mulai lebih hidup.",
        "Struktur tidak hanya diisi pengurus inti."
      ],
      fallback: "Jika event besar belum siap, ubah menjadi gathering kecil atau upgrading terbatas, tetapi tetap wajib ada data kehadiran dan tindak lanjut."
    },
    {
      period: "Triwulan 4",
      title: "Evaluasi, regenerasi, dan budaya",
      focus: "Akhir tahun dipakai untuk membaca hasil 1 tahun, memperbaiki budaya komunikasi, dan menyiapkan keberlanjutan.",
      programs: ["Evaluasi pengurus", "Evaluasi data member", "Regenerasi", "Budaya komunikasi", "Rencana tahun berikutnya"],
      priorities: [
        "Evaluasi kinerja pengurus, data member, program yang berhasil, dan program yang gagal.",
        "Siapkan kader atau pengurus berikutnya dari member yang sudah terlihat aktif dan stabil.",
        "Perbaiki budaya komunikasi supaya tahun berikutnya tidak dimulai dari nol."
      ],
      outcomes: [
        "Tim punya data perkembangan 1 tahun.",
        "Terlihat siapa pengurus yang aktif dan kurang aktif.",
        "Terlihat member yang bisa dikader.",
        "Budaya komunikasi lebih sehat.",
        "Program tahun berikutnya tidak dimulai dari nol."
      ],
      fallback: "Jika evaluasi belum lengkap, prioritaskan tiga data inti: pengurus aktif, member potensial, dan program yang paling berdampak."
    }
  ];
}

function filteredEvaluationNodes() {
  return evaluationNodes
    .filter((node) => state.mindmapFilter === "ALL" || node.type === state.mindmapFilter)
    .filter((node) => {
      if (!state.mindmapQuery) return true;
      return [
        node.title,
        evaluationTypeLabel[node.type],
        node.description,
        node.rootCause,
        node.impact,
        ...(node.solutions || []),
        ...(node.roles || [])
      ].join(" ").toLowerCase().includes(state.mindmapQuery);
    })
    .sort((a, b) => a.order - b.order);
}

function renderMindmap() {
  const nodes = filteredEvaluationNodes();
  els.mindmapVisual.innerHTML = nodes.length ? renderMindmapConnections(nodes) : `<div class="empty">Tidak ada node yang cocok.</div>`;

  els.mindmapVisual.querySelectorAll("[data-node-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeMindmapId = button.dataset.nodeId;
      renderMindmap();
    });
  });

  renderMindmapDetail();
  renderRelationTable();
}

function renderMindmapConnections(nodes) {
  const visibleTitles = new Set(nodes.map((node) => node.title));
  const matchesQuery = (relation) => !state.mindmapQuery || `${relation.source} ${relation.relation} ${relation.target}`.toLowerCase().includes(state.mindmapQuery);
  const relations = evaluationRelations.filter((relation) => (
    (visibleTitles.has(relation.source) || visibleTitles.has(relation.target) || matchesQuery(relation))
  ));

  const rootNode = evaluationNodes.find((node) => node.type === "ROOT");
  const root = rootNode && (state.mindmapFilter === "ALL" || state.mindmapFilter === "ROOT") ? `
    <button class="mindmap-root-node" type="button" data-node-id="${rootNode.id}">
      <span>${evaluationTypeLabel[rootNode.type]}</span>
      <strong>${rootNode.title}</strong>
    </button>
  ` : "";

  const groupedRelations = relations.reduce((groups, relation) => {
    if (!groups.has(relation.source)) groups.set(relation.source, []);
    groups.get(relation.source).push(relation);
    return groups;
  }, new Map());

  return `
    ${root}
    <div class="mindmap-flow-list">
      ${Array.from(groupedRelations.entries()).map(([sourceTitle, sourceRelations], index) => {
        const source = findEvaluationNodeByTitle(sourceTitle);
        if (!source) return "";
        return `
          <section class="mindmap-flow">
            <header>
              <span>Alur ${String(index + 1).padStart(2, "0")}</span>
              <b>${sourceRelations.length} relasi</b>
            </header>
            ${renderConnectionNode(source)}
            <div class="mindmap-branches">
              ${sourceRelations.map((relation) => {
                const target = findEvaluationNodeByTitle(relation.target);
                if (!target) return "";
                return `
                  <div class="mindmap-branch">
                    <span class="mindmap-line" data-relation="${relation.relation}">${formatRelationLabel(relation.relation)}</span>
                    ${renderConnectionNode(target)}
                  </div>
                `;
              }).join("")}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderConnectionNode(node) {
  return `
    <button class="mindmap-node ${node.type.toLowerCase()} ${node.id === state.activeMindmapId ? "active" : ""}" type="button" data-node-id="${node.id}">
      <span>${evaluationTypeLabel[node.type]}</span>
      <strong>${node.title}</strong>
    </button>
  `;
}

function findEvaluationNodeByTitle(title) {
  return evaluationNodes.find((node) => node.title === title);
}

function formatRelationLabel(relation) {
  const labels = {
    CAUSES: "menyebabkan",
    SOLVED_BY: "terjawab oleh",
    SUPPORTED_BY: "didukung oleh",
    RELATED_TO: "terkait"
  };
  return labels[relation] || relation;
}

function renderMindmapDetail() {
  const node = evaluationNodes.find((item) => item.id === state.activeMindmapId);
  if (!node) {
    els.mindmapDetail.classList.remove("open");
    els.mindmapDetail.innerHTML = "";
    return;
  }
  els.mindmapDetail.classList.add("open");
  els.mindmapDetail.innerHTML = `
    <div class="mindmap-popup-card">
      <button class="mindmap-close" type="button" aria-label="Tutup detail">Tutup</button>
      <span class="target-index">${evaluationTypeLabel[node.type]}</span>
      <h3>${node.title}</h3>
      <p>${node.description}</p>
      <div class="mindmap-detail-grid">
        ${renderMindmapDetailSection("Akar masalah", node.rootCause)}
        ${renderMindmapDetailSection("Dampak", node.impact)}
        ${renderMindmapDetailSection("Solusi terkait", node.solutions)}
        ${renderMindmapDetailSection("Role terkait", node.roles)}
        ${renderMindmapDetailSection("Tindak lanjut", node.followUp)}
      </div>
    </div>
  `;
  els.mindmapDetail.querySelector(".mindmap-close").addEventListener("click", () => {
    state.activeMindmapId = "";
    renderMindmapDetail();
  });
}

function renderMindmapDetailSection(title, content) {
  if (!content || (Array.isArray(content) && !content.length)) return "";
  const body = Array.isArray(content)
    ? `<div class="mindmap-tags">${content.map((item) => `<span>${item}</span>`).join("")}</div>`
    : `<p>${content}</p>`;
  return `<section><h4>${title}</h4>${body}</section>`;
}

function renderRelationTable() {
  const relationLabel = {
    CAUSES: "Menyebabkan",
    SOLVED_BY: "Dijawab oleh",
    SUPPORTED_BY: "Didukung oleh",
    RELATED_TO: "Terkait"
  };

  els.relationTable.innerHTML = evaluationRelations.map((relation) => `
    <div class="relation-row">
      <strong>${relation.source}</strong>
      <span>${relationLabel[relation.relation] || relation.relation}</span>
      <b>${relation.target}</b>
    </div>
  `).join("");
}

function renderMapping() {
  const active = officerMapping.find((item) => item.mission === state.activeMission) || officerMapping[0];
  const totalIdeal = active.roles.reduce((sum, role) => sum + role.ideal, 0);

  els.missionTabs.innerHTML = officerMapping.map((item) => `
    <button class="${item.mission === active.mission ? "active" : ""}" type="button" data-mission="${item.mission}">
      ${item.missionName}
    </button>
  `).join("");

  els.mappingSummary.innerHTML = `
    <span class="target-index">${active.missionName}</span>
    <h3>${totalIdeal} penggerak ideal</h3>
    <p>${active.purpose}</p>
  `;

  els.mappingList.innerHTML = active.roles.map((role, index) => `
    <details class="mapping-card" ${index === 0 ? "open" : ""}>
      <summary>
        <span class="mapping-no">No. ${index + 1}</span>
        <strong>${role.role}</strong>
        <span class="mapping-ideal">${role.ideal} orang</span>
      </summary>
      <div class="mapping-body">
        <section>
          <h4>Harus mengerjakan</h4>
          <p>${role.mainWork}</p>
        </section>
        <section>
          <h4>Mendukung target komunitas</h4>
          <p>${role.supports}</p>
        </section>
        <section>
          <h4>Jika rangkap jabatan</h4>
          <p>${role.priorityWhenDouble}</p>
        </section>
        <section>
          <h4>Bantuan yang dibutuhkan</h4>
          <p>${role.helpNeeded}</p>
        </section>
        <section>
          <h4>Risiko jika tidak terpenuhi</h4>
          <p>${role.risk}</p>
        </section>
      </div>
    </details>
  `).join("");
}

function closeMenu() {
  els.mainMenu.classList.remove("open");
  els.menuToggle.setAttribute("aria-expanded", "false");
}

function filteredTargets() {
  const query = state.query;
  return state.data.targets
    .filter((item) => {
      if (!query) return true;
      return `${item.name} ${stageLabel[item.stage] || item.stage} ${item.owner} ${item.reasoning} ${item.next}`.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      if (state.sort === "priority") return priorityRank[a.priority] - priorityRank[b.priority] || b.amount - a.amount;
      if (state.sort === "amount") return b.amount - a.amount;
      if (state.sort === "progress") return b.progress - a.progress;
      return a.stage.localeCompare(b.stage);
    });
}

function renderTargets() {
  const targets = filteredTargets();
  if (!targets.length) {
    els.reader.innerHTML = `<div class="empty">Tidak ada target yang cocok dengan pencarian.</div>`;
    els.list.innerHTML = "";
    els.count.textContent = "0 / 0";
    return;
  }

  state.activeIndex = Math.max(0, Math.min(state.activeIndex, targets.length - 1));
  const item = targets[state.activeIndex];

  els.reader.innerHTML = `
    <header>
      <span class="target-index">${String(state.activeIndex + 1).padStart(2, "0")} / ${String(targets.length).padStart(2, "0")}</span>
      <h3>${item.name}</h3>
      <div class="amount-focus">
        <span>Jumlah target</span>
        <strong>${item.amount}</strong>
      </div>
      <div class="target-meta-line">
        <span class="pill">${stageLabel[item.stage] || item.stage}</span>
        <span class="pill">${item.owner}</span>
        <span class="pill">Progres ${item.progress}%</span>
        <span class="pill priority ${item.priority}">Tingkat fokus: ${priorityLabel[item.priority]}</span>
      </div>
    </header>
    <div class="reading-block">
      <section>
        <h4>Alasan jumlah target</h4>
        <p>${item.quantityReasoning || buildQuantityReasoning(item)}</p>
      </section>
      <section>
        <h4>Ketergantungan target</h4>
        <p>${item.chainReasoning || buildChainReasoning(item)}</p>
      </section>
      <section>
        <h4>Rintangan yang mungkin muncul</h4>
        <p>${item.obstacle || buildObstacle(item)}</p>
      </section>
      <section>
        <h4>Jika hasil tidak sesuai target</h4>
        <p>${item.fallbackPlan || buildFallbackPlan(item)}</p>
      </section>
      <section>
        <h4>Rencana baik dan buruk</h4>
        <p>${item.scenarioPlan || buildScenarioPlan(item)}</p>
      </section>
      <section>
        <h4>Bantuan yang dibutuhkan</h4>
        <p>${item.supportNeeded || buildSupportNeeded(item)}</p>
      </section>
      <section>
        <h4>Langkah berikut</h4>
        <p>${item.next}</p>
      </section>
    </div>
  `;

  els.count.textContent = `${state.activeIndex + 1} / ${targets.length}`;
  els.prev.disabled = state.activeIndex === 0;
  els.next.disabled = state.activeIndex === targets.length - 1;

  els.list.innerHTML = targets.map((target, index) => `
    <button class="target-chip ${index === state.activeIndex ? "active" : ""}" type="button" data-index="${index}">
      <span class="chip-order">No. ${index + 1}</span>
      <span class="chip-name">${target.name}</span>
    </button>
  `).join("");

  els.list.querySelectorAll("[data-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeIndex = Number(button.dataset.index);
      renderTargets();
      setView("target-read");
    });
  });
}

function moveTarget(direction) {
  const total = filteredTargets().length;
  if (!total) return;
  state.activeIndex = Math.max(0, Math.min(state.activeIndex + direction, total - 1));
  renderTargets();
}

function handleTouchStart(event) {
  const touch = event.changedTouches[0];
  state.touch = { startX: touch.clientX, startY: touch.clientY, active: true };
}

function handleTouchEnd(event) {
  if (!state.touch.active || !["target-read", "roadmap-detail"].includes(state.activeView)) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - state.touch.startX;
  const dy = touch.clientY - state.touch.startY;
  state.touch.active = false;
  if (Math.abs(dx) < 58 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
  if (state.activeView === "target-read") moveTarget(dx < 0 ? 1 : -1);
  if (state.activeView === "roadmap-detail") moveRoadmap(dx < 0 ? 1 : -1);
}

function buildQuantityReasoning(item) {
  if (item.amount <= 5) {
    return `Jumlah ${item.amount} dipilih karena target ini butuh kontrol dekat dan pendampingan intensif. Angka kecil membuat follow-up tetap realistis, kualitas kandidat terjaga, dan evaluasi tidak membebani tim.`;
  }
  if (item.amount <= 10) {
    return `Jumlah ${item.amount} dipilih sebagai batas kerja menengah: cukup untuk menghasilkan pilihan kandidat, tetapi masih bisa dipantau satu per satu oleh PIC. Angka ini menjaga target tetap ambisius tanpa mengorbankan kualitas follow-up.`;
  }
  if (item.amount <= 15) {
    return `Jumlah ${item.amount} dipilih karena tahap ini butuh cadangan pipeline yang cukup. Tidak semua nama akan bergerak ke tahap lanjut, jadi angka ini memberi ruang seleksi sambil tetap masuk akal untuk dikerjakan dalam satu periode.`;
  }
  return `Jumlah ${item.amount} dipilih karena target ini berada di tahap pembukaan atau pengumpulan basis. Angkanya dibuat lebih besar agar setelah penyaringan, penolakan, dan perubahan prioritas, masih ada cukup kandidat yang bisa dibawa ke tahap berikutnya.`;
}

function buildChainReasoning(item) {
  const tarbiyah1 = findTarget("hk-t1")?.amount || 12;
  const iga = findTarget("iga")?.amount || 18;
  const hk = findTarget("hk")?.amount || 16;
  const bbq = findTarget("bbq")?.amount || 20;

  if (item.id === "iga") {
    return `IGA menjadi sumber awal pipeline. Jika target Tarbiyah 1 ingin dijaga sekitar ${tarbiyah1} orang, maka IGA perlu lebih besar dari angka itu karena sebagian nama biasanya berhenti di tahap kontak, seleksi, atau belum siap lanjut.`;
  }
  if (item.id === "hk") {
    return `HK bergantung pada kecukupan IGA dan IDU. Jika IGA turun di bawah ${iga}, maka target HK perlu ditinjau karena jumlah kandidat yang masuk tahap seleksi ikut berkurang.`;
  }
  if (item.id === "hk-t1") {
    return `Tarbiyah 1 bergantung langsung pada HK. Jika HK hanya terkumpul ${Math.max(10, hk - 6)} orang, target Tarbiyah 1 tidak realistis dibiarkan tetap tinggi. Target perlu mengikuti konversi dari HK yang benar-benar siap hadir rutin.`;
  }
  if (item.id === "bbq") {
    return `BBQ menjadi penyangga pembiasaan. Jika BBQ hanya bergerak sebagian dari target ${bbq}, maka target lanjut seperti binaan dan tarbiyah perlu dikurangi atau diberi waktu tambahan.`;
  }
  if (item.stage === "Tarbiyah") {
    return `Target ini bergantung pada tahap sebelumnya: mapping, kontak, dan kesiapan hadir. Jika tahap sebelumnya turun, jumlah target ini harus ikut disesuaikan agar tidak hanya besar di angka tetapi lemah di kehadiran.`;
  }
  if (item.stage === "Keuangan") {
    return `Target ini menopang eksekusi program. Jika target keuangan lemah, kegiatan seperti BBQ, Pesmas, dan LPK perlu diperkecil atau diprioritaskan ulang agar tetap berjalan.`;
  }
  return `Target ini masuk dalam rantai kerja umum: data awal, pendekatan, seleksi, lalu tindak lanjut. Jika target di tahap sebelumnya tidak tercapai, angka ${item.amount} perlu dievaluasi agar tetap realistis dan tidak memaksa tim mengejar angka kosong.`;
}

function buildObstacle(item) {
  if (item.amount >= 16) {
    return `Rintangan utama adalah kualitas data dan konsistensi follow-up. Karena jumlahnya besar, risiko paling sering adalah banyak nama tercatat tetapi tidak jelas statusnya.`;
  }
  if (item.amount <= 6) {
    return `Rintangannya adalah menemukan orang yang benar-benar cocok. Jumlah kecil bukan berarti mudah, karena biasanya target seperti ini butuh kriteria lebih ketat dan pendekatan personal.`;
  }
  return `Rintangan utama adalah menjaga ritme. Target masih mungkin dicapai, tetapi bisa turun jika PIC tidak rutin mengecek progres dan hambatan tiap nama.`;
}

function buildFallbackPlan(item) {
  if (item.amount >= 16) {
    return `Jika capaian jauh di bawah target, pecah target menjadi dua gelombang. Gelombang pertama fokus pada nama paling siap, gelombang kedua dipakai untuk data cadangan. Jangan semua dikejar sekaligus.`;
  }
  if (item.priority === "critical") {
    return `Jika tidak sesuai target, jangan langsung menurunkan standar. Kurangi jumlah sementara, tetapi naikkan intensitas pendampingan pada kandidat paling kuat agar rantai tahap berikutnya tetap hidup.`;
  }
  return `Jika target tidak tercapai, cek penyebabnya dulu: datanya kurang, pendekatannya lambat, atau PIC terlalu sedikit. Setelah itu turunkan angka sementara atau pindahkan sebagian target ke periode berikutnya.`;
}

function buildScenarioPlan(item) {
  const good = Math.max(1, Math.round(item.amount * 0.8));
  const bad = Math.max(1, Math.round(item.amount * 0.5));
  return `Rencana baik: minimal ${good} dari ${item.amount} target bergerak sesuai jalur dan siap ditindaklanjuti. Rencana buruk: jika hanya sekitar ${bad} yang bergerak, fokuskan tenaga pada nama yang paling siap dan evaluasi ulang target turunan agar tidak ikut meleset.`;
}

function buildSupportNeeded(item) {
  if (item.stage === "Keuangan") {
    return `Butuh data kontributor yang rapi, pengingat yang konsisten, dan satu orang yang memantau laporan supaya tidak tercecer.`;
  }
  if (item.stage === "Tarbiyah" || item.stage === "Pembinaan") {
    return `Butuh mentor, jadwal yang jelas, dan penghubung personal untuk memastikan peserta tidak hanya datang sekali tetapi bisa bertahan.`;
  }
  if (item.amount >= 16) {
    return `Butuh pembagian PIC per kelompok nama, format status yang sama, dan pengecekan mingguan agar jumlah besar ini tetap terbaca.`;
  }
  return `Butuh PIC yang jelas, daftar nama yang sudah diprioritaskan, dan bantuan follow-up ketika ada kandidat yang mulai respons.`;
}

function findTarget(id) {
  return state.data.targets.find((target) => target.id === id);
}

boot();
