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
  roadmapCount: document.querySelector("#roadmap-count")
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
  const allowed = ["menu", "swat", "targets", "target-read", "mapping", "roadmap", "roadmap-detail"];
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
