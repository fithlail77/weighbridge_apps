import pptxgen from "pptxgenjs";

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Antigravity Pair Programmer";
pptx.company = "Weighbridge Automation";
pptx.title = "Panduan Menjalankan Sistem Jembatan Timbang";

// Palette
const BG_DARK = "0F172A";       // Slate 900
const CARD_BG = "1E293B";       // Slate 800
const CARD_LINE = "334155";     // Slate 700
const TEXT_LIGHT = "F8FAFC";    // Slate 50
const TEXT_MUTED = "94A3B8";    // Slate 400
const GREEN_ACCENT = "10B981";  // Emerald 500
const BLUE_ACCENT = "38BDF8";   // Sky 400
const PURPLE_ACCENT = "A855F7"; // Purple 500
const FONT_FAMILY = "Segoe UI";

function addBackground(slide) {
  slide.background = { color: BG_DARK };
}

function addHeader(slide, title, category = "WEIGHBRIDGE APPS") {
  // Category / Pill
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.4,
    w: 11.5,
    h: 0.35,
    fontFace: FONT_FAMILY,
    fontSize: 11,
    bold: true,
    color: GREEN_ACCENT,
    margin: 0
  });

  // Main Title
  slide.addText(title, {
    x: 0.8,
    y: 0.75,
    w: 11.5,
    h: 0.7,
    fontFace: FONT_FAMILY,
    fontSize: 24,
    bold: true,
    color: TEXT_LIGHT,
    margin: 0
  });
}

// =============================================================
// SLIDE 1: Cover
// =============================================================
const slide1 = pptx.addSlide();
addBackground(slide1);

// Left Decorative Accent Bar
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8,
  y: 1.8,
  w: 0.12,
  h: 3.8,
  fill: { color: GREEN_ACCENT },
  line: { color: GREEN_ACCENT }
});

slide1.addText("LARAVEL 11/12 • WEBSOCKET REVERB • PYTHON SERIAL READER", {
  x: 1.1,
  y: 1.8,
  w: 11.0,
  h: 0.4,
  fontFace: FONT_FAMILY,
  fontSize: 13,
  bold: true,
  color: BLUE_ACCENT,
  margin: 0
});

slide1.addText(
  "Panduan Arsitektur & Cara Menjalankan\nSistem Jembatan Timbang (Weighbridge)",
  {
    x: 1.1,
    y: 2.3,
    w: 11.0,
    h: 1.8,
    fontFace: FONT_FAMILY,
    fontSize: 34,
    bold: true,
    color: TEXT_LIGHT,
    margin: 0
  }
);

slide1.addText(
  "Monitoring Berat Timbangan Real-time dari Indikator Fisik / Serial Port ke Web Browser",
  {
    x: 1.1,
    y: 4.2,
    w: 11.0,
    h: 0.6,
    fontFace: FONT_FAMILY,
    fontSize: 16,
    color: TEXT_MUTED,
    margin: 0
  }
);

// Badge / Footer Pill
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1,
  y: 5.6,
  w: 5.8,
  h: 0.55,
  fill: { color: CARD_BG },
  line: { color: CARD_LINE, width: 1 },
  radius: 0.1
});

slide1.addText("Dokumentasi Operasional, Layanan Terminal & Troubleshooting", {
  x: 1.3,
  y: 5.6,
  w: 5.4,
  h: 0.55,
  fontFace: FONT_FAMILY,
  fontSize: 12,
  bold: true,
  color: GREEN_ACCENT,
  align: "left",
  valign: "middle",
  margin: 0
});

// =============================================================
// SLIDE 2: Arsitektur & Alur Kerja
// =============================================================
const slide2 = pptx.addSlide();
addBackground(slide2);
addHeader(slide2, "Arsitektur Sistem & Aliran Data Real-time", "ARSITEKTUR");

const flowCards = [
  {
    step: "1. Indikator Fisik / Simulator",
    color: PURPLE_ACCENT,
    items: [
      { b: "Sumber Data: ", t: "Indikator timbangan atau simulator Python." },
      { b: "Media: ", t: "Kabel Serial RS232 / Virtual COM Port." },
      { b: "Format: ", t: "Data mentah ASCII (contoh: ST,GS,+ 12500 kg)." },
      { b: "Frekuensi: ", t: "Memancarkan stream data 2-5x per detik." }
    ]
  },
  {
    step: "2. Python Serial Reader",
    color: BLUE_ACCENT,
    items: [
      { b: "Skrip: ", t: "reader.py membaca COM7 (Baudrate 9600)." },
      { b: "Anti-Lag: ", t: "Buffer flush untuk mengambil baris data teranyar." },
      { b: "Regex Parsing: ", t: "Mengekstrak angka berat sesuai merk di JSON." },
      { b: "HTTP Forward: ", t: "Mengirim POST JSON ke endpoint Laravel." }
    ]
  },
  {
    step: "3. Laravel Backend Server",
    color: GREEN_ACCENT,
    items: [
      { b: "API Target: ", t: "POST /api/timbangan/update." },
      { b: "Database: ", t: "Menyimpan nilai ke tabel weighings (ID 1)." },
      { b: "Event Broadcast: ", t: "Memicu WeightUpdated (ShouldBroadcastNow)." },
      { b: "Channel: ", t: "Menyiarkan ke channel 'weighbridge-channel'." }
    ]
  },
  {
    step: "4. Reverb & Web Display",
    color: BLUE_ACCENT,
    items: [
      { b: "WebSocket: ", t: "Laravel Reverb bertindak sebagai WS server (port 8080)." },
      { b: "Frontend: ", t: "Laravel Echo + Pusher JS di timbangan.blade.php." },
      { b: "User Display: ", t: "Angka KG di halaman web update instan." },
      { b: "Zero Refresh: ", t: "Layar bergerak dinamis tanpa refresh browser." }
    ]
  }
];

const cW = 2.78;
const cH = 5.2;
const gap = 0.2;
const startX = 0.8;

flowCards.forEach((card, idx) => {
  const xPos = startX + idx * (cW + gap);
  slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos,
    y: 1.6,
    w: cW,
    h: cH,
    fill: { color: CARD_BG },
    line: { color: CARD_LINE, width: 1 },
    radius: 0.1
  });

  slide2.addText(card.step, {
    x: xPos + 0.2,
    y: 1.8,
    w: cW - 0.4,
    h: 0.6,
    fontFace: FONT_FAMILY,
    fontSize: 15,
    bold: true,
    color: card.color,
    margin: 0
  });

  const textRuns = [];
  card.items.forEach((item) => {
    textRuns.push({
      text: item.b,
      options: { bold: true, color: TEXT_LIGHT, fontSize: 11, fontFace: FONT_FAMILY }
    });
    textRuns.push({
      text: item.t + "\n\n",
      options: { bold: false, color: TEXT_MUTED, fontSize: 11, fontFace: FONT_FAMILY }
    });
  });

  slide2.addText(textRuns, {
    x: xPos + 0.2,
    y: 2.5,
    w: cW - 0.4,
    h: 4.1,
    margin: 0
  });
});

// =============================================================
// SLIDE 3: Prasyarat Lingkungan
// =============================================================
const slide3 = pptx.addSlide();
addBackground(slide3);
addHeader(slide3, "Prasyarat Lingkungan (Environment Prerequisites)", "PERSIAPAN");

const preCards = [
  {
    title: "Database PostgreSQL",
    color: BLUE_ACCENT,
    items: [
      { b: "Status Service: ", t: "PostgreSQL harus aktif di background (Port 5432)." },
      { b: "Nama Database: ", t: "weighbridge_db (sesuai konfigurasi .env)." },
      { b: "Kredensial Default: ", t: "User: postgres | Password: postgres123." },
      { b: "Tabel Weighings: ", t: "Dibuat otomatis lewat perintah 'php artisan migrate'." }
    ]
  },
  {
    title: "Python & Driver Serial",
    color: GREEN_ACCENT,
    items: [
      { b: "Runtime: ", t: "Python 3.10 atau versi lebih baru terinstal." },
      { b: "Dependensi Wajib: ", t: "Jalankan 'pip install pyserial requests'." },
      { b: "Hardware: ", t: "Kabel serial USB-to-RS232 terhubung ke timbangan fisik." },
      { b: "Simulasi Virtual: ", t: "Gunakan software com0com (pasangan port virtual COM6 <-> COM7) jika tanpa alat." }
    ]
  },
  {
    title: "Konfigurasi & Frontend",
    color: PURPLE_ACCENT,
    items: [
      { b: "config_timbangan.json: ", t: "Pastikan 'port' mengarah ke port penerima (COM7)." },
      { b: "WebSocket Broadcast: ", t: "Pastikan BROADCAST_CONNECTION=reverb aktif di .env." },
      { b: "Node.js & Vite: ", t: "Node.js aktif untuk menjalankan build aset front-end (npm run dev)." }
    ]
  }
];

const cW3 = 3.77;
preCards.forEach((card, idx) => {
  const xPos = startX + idx * (cW3 + gap);
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos,
    y: 1.6,
    w: cW3,
    h: cH,
    fill: { color: CARD_BG },
    line: { color: CARD_LINE, width: 1 },
    radius: 0.1
  });

  slide3.addText(card.title, {
    x: xPos + 0.25,
    y: 1.85,
    w: cW3 - 0.5,
    h: 0.5,
    fontFace: FONT_FAMILY,
    fontSize: 16,
    bold: true,
    color: card.color,
    margin: 0
  });

  const textRuns = [];
  card.items.forEach((item) => {
    textRuns.push({
      text: item.b,
      options: { bold: true, color: TEXT_LIGHT, fontSize: 12, fontFace: FONT_FAMILY }
    });
    textRuns.push({
      text: item.t + "\n\n",
      options: { bold: false, color: TEXT_MUTED, fontSize: 12, fontFace: FONT_FAMILY }
    });
  });

  slide3.addText(textRuns, {
    x: xPos + 0.25,
    y: 2.5,
    w: cW3 - 0.5,
    h: 4.1,
    margin: 0
  });
});

// =============================================================
// SLIDE 4: Langkah Eksekusi (5 Terminal)
// =============================================================
const slide4 = pptx.addSlide();
addBackground(slide4);
addHeader(slide4, "Langkah Menjalankan Layanan (5 Terminal)", "EKSEKUSI");

const terminals = [
  {
    term: "Terminal 1: Laravel Web Server",
    cmd: "php artisan serve",
    desc: "Menyediakan HTTP Server dan API endpoint /api/timbangan/update. Akses tampilan antarmuka di http://127.0.0.1:8000.",
    color: BLUE_ACCENT
  },
  {
    term: "Terminal 2: Laravel Reverb (WebSocket)",
    cmd: "php artisan reverb:start",
    desc: "Server WebSocket lokal yang menyiarkan mutasi data berat dari API langsung ke browser di port 8080 tanpa delay.",
    color: GREEN_ACCENT
  },
  {
    term: "Terminal 3: Vite Dev Server",
    cmd: "npm run dev",
    desc: "Menghubungkan pustaka JavaScript klien Laravel Echo & Pusher serta styling Tailwind CSS ke browser.",
    color: PURPLE_ACCENT
  },
  {
    term: "Terminal 4: Python Serial Reader",
    cmd: "python reader.py",
    desc: "Membaca aliran data timbangan dari port COM7, membersihkan buffer anti-lag, dan mem-POST angka KG ke Laravel.",
    color: BLUE_ACCENT
  },
  {
    term: "Terminal 5: Python Simulator (Opsional)",
    cmd: "python simulator.py",
    desc: "Dijalankan jika pengujian dilakukan tanpa timbangan fisik. Mengirimkan variasi angka berat ke COM6.",
    color: GREEN_ACCENT
  }
];

const tW = 5.7;
const tH = 2.45;
const gridCoords = [
  { x: 0.8, y: 1.6 },
  { x: 6.8, y: 1.6 },
  { x: 0.8, y: 4.35 },
  { x: 6.8, y: 4.35 }
];

// Display 4 main cards in grid
for (let i = 0; i < 4; i++) {
  const item = terminals[i];
  const { x, y } = gridCoords[i];

  slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w: tW,
    h: tH,
    fill: { color: CARD_BG },
    line: { color: CARD_LINE, width: 1 },
    radius: 0.1
  });

  slide4.addText(item.term, {
    x: x + 0.25,
    y: y + 0.2,
    w: tW - 0.5,
    h: 0.35,
    fontFace: FONT_FAMILY,
    fontSize: 14,
    bold: true,
    color: item.color,
    margin: 0
  });

  // Command Box Shape
  slide4.addShape(pptx.shapes.RECTANGLE, {
    x: x + 0.25,
    y: y + 0.65,
    w: tW - 0.5,
    h: 0.45,
    fill: { color: "0B1120" },
    line: { color: CARD_LINE, width: 1 }
  });

  slide4.addText(`$ ${item.cmd}`, {
    x: x + 0.4,
    y: y + 0.65,
    w: tW - 0.8,
    h: 0.45,
    fontFace: "Consolas",
    fontSize: 12,
    bold: true,
    color: GREEN_ACCENT,
    valign: "middle",
    margin: 0
  });

  slide4.addText(item.desc, {
    x: x + 0.25,
    y: y + 1.25,
    w: tW - 0.5,
    h: 1.0,
    fontFace: FONT_FAMILY,
    fontSize: 11,
    color: TEXT_MUTED,
    margin: 0
  });
}

// =============================================================
// SLIDE 5: File Kunci & Konfigurasi
// =============================================================
const slide5 = pptx.addSlide();
addBackground(slide5);
addHeader(slide5, "Peta File Kunci & Konfigurasi Indikator", "STRUKTUR FILE");

const fileCards = [
  {
    title: "config_timbangan.json",
    color: BLUE_ACCENT,
    items: [
      { b: "port: ", t: "Menentukan COM port sumber (misal 'COM7')." },
      { b: "baud_rate: ", t: "Kecepatan transfer serial (default: 9600)." },
      { b: "api_url: ", t: "Target endpoint API Laravel untuk update." },
      { b: "patterns: ", t: "Array regex untuk parsing ragam merk: Indikator Tipe 1 (Raw), Tipe 2 (Status), & Tipe 3 (Logistik)." }
    ]
  },
  {
    title: "reader.py & Simulator",
    color: GREEN_ACCENT,
    items: [
      { b: "reader.py: ", t: "Script serial reader dengan algoritma penanganan buffer backlog agar tidak terjadi delay penimbangan." },
      { b: "simulator.py: ", t: "Simulasi fluktuasi berat realistis format ST,GS,+." },
      { b: "simulator_indikator1.py: ", t: "Simulasi format data mentah digit (+003840014)." },
      { b: "File Text TXT: ", t: "Contoh log stream nyata (indikator_JETTY, pam1, wb02)." }
    ]
  },
  {
    title: "Komponen Laravel Core",
    color: PURPLE_ACCENT,
    items: [
      { b: "WeighingController: ", t: "Validasi angka berat dan pemanggilan updateOrInsert tabel weighings." },
      { b: "WeightUpdated: ", t: "Broadcast event ke channel 'weighbridge-channel'." },
      { b: "timbangan.blade.php: ", t: "Tampilan dashboard display indikator live." },
      { b: "echo.js: ", t: "Konektor WebSockets listener di frontend." }
    ]
  }
];

fileCards.forEach((card, idx) => {
  const xPos = startX + idx * (cW3 + gap);
  slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos,
    y: 1.6,
    w: cW3,
    h: cH,
    fill: { color: CARD_BG },
    line: { color: CARD_LINE, width: 1 },
    radius: 0.1
  });

  slide5.addText(card.title, {
    x: xPos + 0.25,
    y: 1.85,
    w: cW3 - 0.5,
    h: 0.5,
    fontFace: FONT_FAMILY,
    fontSize: 16,
    bold: true,
    color: card.color,
    margin: 0
  });

  const textRuns = [];
  card.items.forEach((item) => {
    textRuns.push({
      text: item.b,
      options: { bold: true, color: TEXT_LIGHT, fontSize: 12, fontFace: FONT_FAMILY }
    });
    textRuns.push({
      text: item.t + "\n\n",
      options: { bold: false, color: TEXT_MUTED, fontSize: 12, fontFace: FONT_FAMILY }
    });
  });

  slide5.addText(textRuns, {
    x: xPos + 0.25,
    y: 2.5,
    w: cW3 - 0.5,
    h: 4.1,
    margin: 0
  });
});

// =============================================================
// SLIDE 6: Troubleshooting & Tips
// =============================================================
const slide6 = pptx.addSlide();
addBackground(slide6);
addHeader(slide6, "Panduan Troubleshooting & Penanganan Kendala", "TROUBLESHOOTING");

const troubleCards = [
  {
    title: "1. Serial Port Error / Access Denied",
    color: PURPLE_ACCENT,
    items: [
      { b: "Gejala: ", t: "ERROR HARDWARE: Port COM7 tidak ditemukan atau sedang dipakai aplikasi lain." },
      { b: "Penyebab: ", t: "Port sedang terkunci oleh serial monitor lain (Putty, Arduino, terminal reader sebelumnya), atau kabel USB terlepas." },
      { b: "Solusi: ", t: "Tutup program serial lain, periksa Device Manager Windows untuk nomor COM aktif, lalu update config_timbangan.json." }
    ]
  },
  {
    title: "2. Angka Web Tetap 0.00 KG (WebSocket)",
    color: BLUE_ACCENT,
    items: [
      { b: "Gejala: ", t: "Terminal reader.py sukses mengirim data (status 200), namun angka di layar web tidak bergerak." },
      { b: "Penyebab: ", t: "Layanan 'php artisan reverb:start' belum berjalan atau aset Echo di browser belum termuat." },
      { b: "Solusi: ", t: "Jalankan Reverb di terminal terpisah, pastikan 'npm run dev' aktif, dan cek F12 Console browser untuk pesan terhubung." }
    ]
  },
  {
    title: "3. Format String Tidak Cocok (None)",
    color: GREEN_ACCENT,
    items: [
      { b: "Gejala: ", t: "Aliran serial masuk namun reader.py tidak menemukan angka berat valid." },
      { b: "Penyebab: ", t: "Indikator fisik menggunakan format keluaran string berbeda dengan ketiga pola regex bawaan." },
      { b: "Solusi: ", t: "Periksa teks RAW di terminal, lalu tambahkan aturan regex baru ke array patterns di config_timbangan.json." }
    ]
  }
];

troubleCards.forEach((card, idx) => {
  const xPos = startX + idx * (cW3 + gap);
  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos,
    y: 1.6,
    w: cW3,
    h: cH,
    fill: { color: CARD_BG },
    line: { color: CARD_LINE, width: 1 },
    radius: 0.1
  });

  slide6.addText(card.title, {
    x: xPos + 0.25,
    y: 1.85,
    w: cW3 - 0.5,
    h: 0.5,
    fontFace: FONT_FAMILY,
    fontSize: 15,
    bold: true,
    color: card.color,
    margin: 0
  });

  const textRuns = [];
  card.items.forEach((item) => {
    textRuns.push({
      text: item.b,
      options: { bold: true, color: TEXT_LIGHT, fontSize: 12, fontFace: FONT_FAMILY }
    });
    textRuns.push({
      text: item.t + "\n\n",
      options: { bold: false, color: TEXT_MUTED, fontSize: 12, fontFace: FONT_FAMILY }
    });
  });

  slide6.addText(textRuns, {
    x: xPos + 0.25,
    y: 2.5,
    w: cW3 - 0.5,
    h: 4.1,
    margin: 0
  });
});

// Save Presentation
const outputFile = "Panduan_Menjalankan_Weighbridge_Apps.pptx";
pptx.writeFile({ fileName: outputFile })
  .then(() => {
    console.log(`PPTX Berhasil Dibuat: ${outputFile}`);
  })
  .catch((err) => {
    console.error("Gagal membuat PPTX:", err);
    process.exit(1);
  });
