/**
 * RSVP BACKEND HARDENED — Undangan Cika & Uddin
 * ------------------------------------------------------------------
 * CARA PASANG (URL /exec TIDAK berubah, undangan tidak perlu diedit):
 * 1. Buka script.google.com → project Apps Script RSVP yang sekarang.
 * 2. Ganti seluruh isi Code.gs dengan file ini.
 * 3. SESUAIKAN dua konstanta SHEET_NAME & KOLOM di bawah dengan sheet-mu
 *    (lihat urutan kolom di sheet yang sudah berisi data).
 * 4. Deploy → Manage deployments → ✏️ edit → Version: "New version" → Deploy.
 *    (JANGAN buat deployment baru — itu yang membuat URL berubah.)
 * 5. Tes: buka undangan, kirim satu RSVP, cek masuk sheet.
 *
 * Yang ditambahkan dibanding versi polos:
 * - Validasi server: nama 1–60 char, jumlah 1–5, status whitelist,
 *   ucapan maks 300 char → data sampah ditolak sebelum masuk sheet.
 * - LockService: dua kiriman bersamaan tidak saling menimpa baris.
 * - Rate limit global: maks 20 kiriman/menit → banjir spam tertahan.
 * - Counter di-cache 60 detik → hemat kuota baca saat ramai.
 * Kontrak respons TIDAK berubah: POST → {"result":"success"},
 * GET → {"hadir":n,"tidak":n,"ragu":n}.
 */

var SHEET_NAME = 'Sheet1';        // <-- nama tab sheet RSVP-mu
// Urutan kolom saat appendRow — SESUAIKAN dengan sheet yang sudah ada:
// default: A=Timestamp, B=Nama, C=Jumlah, D=Status, E=Ucapan
var STATUS_COLUMN = 4;            // kolom D (1-indexed) berisi status

var STATUS_SAH = ['Hadir', 'Tidak Hadir', 'Ragu'];
var MAX_PER_MENIT = 20;

function doPost(e) {
  var out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  try {
    var data = JSON.parse(e.postData.contents);

    // --- validasi (tolak diam-diam: balas error tanpa menyentuh sheet) ---
    var nama = String(data.nama || '').trim().slice(0, 60);
    var jumlah = parseInt(data.jumlah, 10);
    var status = String(data.status || '');
    var ucapan = String(data.ucapan || '').trim().slice(0, 300);
    if (!nama) throw new Error('nama kosong');
    if (!(jumlah >= 1 && jumlah <= 5)) throw new Error('jumlah tidak sah');
    if (STATUS_SAH.indexOf(status) === -1) throw new Error('status tidak sah');

    // --- rate limit global sederhana ---
    var cache = CacheService.getScriptCache();
    var n = parseInt(cache.get('rsvp_menit_ini') || '0', 10);
    if (n >= MAX_PER_MENIT) throw new Error('terlalu ramai, coba lagi');
    cache.put('rsvp_menit_ini', String(n + 1), 60);

    // --- tulis dengan lock agar aman dari kiriman bersamaan ---
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      sheet.appendRow([new Date(), nama, jumlah, status, ucapan]);
      cache.remove('rsvp_counter'); // counter berubah, buang cache
    } finally {
      lock.releaseLock();
    }

    return out.setContent(JSON.stringify({ result: 'success' }));
  } catch (err) {
    return out.setContent(JSON.stringify({ result: 'error', message: String(err.message || err) }));
  }
}

function doGet() {
  var out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  var cache = CacheService.getScriptCache();
  var cached = cache.get('rsvp_counter');
  if (cached) return out.setContent(cached);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var last = sheet.getLastRow();
  var hadir = 0, tidak = 0, ragu = 0;
  if (last >= 2) {
    var statuses = sheet.getRange(2, STATUS_COLUMN, last - 1, 1).getValues();
    statuses.forEach(function (row) {
      var s = String(row[0]);
      if (s === 'Hadir') hadir++;
      else if (s === 'Tidak Hadir') tidak++;
      else if (s === 'Ragu') ragu++;
    });
  }
  var body = JSON.stringify({ hadir: hadir, tidak: tidak, ragu: ragu });
  cache.put('rsvp_counter', body, 60);
  return out.setContent(body);
}
