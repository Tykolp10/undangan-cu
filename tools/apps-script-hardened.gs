/**
 * BACKEND RSVP — Undangan Cika & Uddin (HARDENED)
 * Terikat ke Google Sheet (Extensions > Apps Script)
 * -----------------------------------------------------------------
 * Pengganti langsung Code.gs versi awal — kolom, nama sheet, dan
 * bentuk respons SAMA PERSIS, jadi undangan tidak perlu diubah.
 *
 * CARA PASANG:
 * 1. Ganti seluruh isi Code.gs dengan file ini.
 * 2. Deploy > Manage deployments > ✏️ edit > Version: "New version"
 *    > Deploy. (JANGAN "New deployment" — itu mengubah URL /exec.)
 * 3. Tes kirim 1 RSVP dari undangan, cek masuk sheet.
 *
 * Tambahan dibanding versi awal:
 * - Validasi: nama wajib & maks 60 char, jumlah harus 1-5, status
 *   harus salah satu nilai sah, ucapan maks 300 char.
 * - Rate limit global: maks 20 kiriman/menit (rem banjir spam).
 * - Counter doGet di-cache 60 detik (hemat kuota baca saat ramai),
 *   otomatis di-refresh tiap ada RSVP baru masuk.
 */

const SHEET_NAME = 'RSVP';
const STATUS_SAH = ['Hadir', 'Tidak Hadir', 'Ragu'];
const MAX_PER_MENIT = 20;

// Terima kiriman RSVP dari undangan -> validasi -> simpan ke Sheet
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // --- validasi dulu, sebelum menyentuh lock/sheet ---
    const nama   = String(data.nama || '').trim().slice(0, 60);
    const jumlah = parseInt(data.jumlah, 10);
    const status = String(data.status || '').trim();
    const ucapan = String(data.ucapan || '').trim().slice(0, 300);
    if (!nama) throw new Error('nama kosong');
    if (!(jumlah >= 1 && jumlah <= 5)) throw new Error('jumlah tidak sah');
    if (STATUS_SAH.indexOf(status) === -1) throw new Error('status tidak sah');

    // --- rem banjir: maks MAX_PER_MENIT kiriman per menit (global) ---
    const cache = CacheService.getScriptCache();
    const n = parseInt(cache.get('rsvp_menit_ini') || '0', 10);
    if (n >= MAX_PER_MENIT) throw new Error('terlalu ramai, coba lagi sebentar');
    cache.put('rsvp_menit_ini', String(n + 1), 60);

    // --- tulis dengan lock (cegah tabrakan saat submit bersamaan) ---
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      sheet.appendRow([
        new Date(),
        nama,
        jumlah,
        status,   // "Hadir" | "Tidak Hadir" | "Ragu"
        ucapan
      ]);
      cache.remove('rsvp_counter'); // counter berubah -> buang cache
    } finally {
      lock.releaseLock();
    }

    return jsonOut({ result: 'success' });
  } catch (err) {
    return jsonOut({ result: 'error', message: String(err) });
  }
}

// Kembalikan rekap jumlah kehadiran (untuk counter di undangan)
function doGet() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('rsvp_counter');
  if (cached) {
    return ContentService.createTextOutput(cached)
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();

  let hadir = 0, tidak = 0, ragu = 0;
  for (let i = 1; i < rows.length; i++) {      // lewati header (baris 0)
    const status = String(rows[i][3]).trim();
    if (status === 'Hadir') hadir++;
    else if (status === 'Tidak Hadir') tidak++;
    else if (status === 'Ragu') ragu++;
  }

  const body = JSON.stringify({ hadir: hadir, tidak: tidak, ragu: ragu });
  cache.put('rsvp_counter', body, 60);
  return ContentService.createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
