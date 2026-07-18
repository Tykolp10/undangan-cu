/**
 * SCRIPT UTAMA — Undangan Fajar & Rizka
 * Mengontrol logika inisialisasi, personalisasi tamu,
 * pemutaran lagu latar, pembukaan Cover/Gate,
 * serta pengisian dinamis seluruh section undangan (Mempelai, Acara, Hadiah, RSVP, Penutup).
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof CONFIG === 'undefined') {
    console.error('Konfigurasi CONFIG tidak ditemukan di config.js');
    return;
  }

  // 1. Inisialisasi Konten Cover & Personalisasi Tamu
  initCover();

  // 2. Inisialisasi Section 2 & 3 (Pembuka + Mempelai)
  initCouple();

  // 3. Inisialisasi Section 4 (Acara & Countdown)
  initEventsAndCountdown();

  // 4. Inisialisasi Section 5, 6, & 7 (Gifts, RSVP, Penutup)
  initGifts();
  initRSVP();
  initClosing();

  // 5. Efek Scroll Reveal & Audit Visibilitas Konten
  setupScrollReveal();
  checkConditionalVisibility();

  // 6. Setup Alur Buka Undangan (Gate Opening)
  setupGateOpening();
});

/**
 * Membaca konfigurasi dari CONFIG dan query string untuk menginisialisasi cover.
 */
function initCover() {
  const basmallahEl = document.getElementById('gate-basmallah');
  const openingLineEl = document.getElementById('gate-opening-line');
  const greetingEl = document.getElementById('gate-greeting');
  const titleEl = document.getElementById('gate-title');
  const dateEl = document.getElementById('gate-date');
  const btnOpenEl = document.getElementById('btn-open');
  const gateEl = document.getElementById('gate');

  if (basmallahEl) basmallahEl.textContent = CONFIG.cover.basmallah || '';
  if (openingLineEl) openingLineEl.textContent = CONFIG.cover.openingLine || '';
  if (greetingEl) greetingEl.textContent = CONFIG.cover.greeting || 'The Wedding of';
  if (titleEl) titleEl.textContent = CONFIG.cover.monogram || CONFIG.couple.shortName || 'Fajar & Rizka';
  if (dateEl) dateEl.textContent = CONFIG.couple.dateDisplay || '';
  if (btnOpenEl) btnOpenEl.textContent = CONFIG.cover.buttonText || 'Buka Undangan';

  if (gateEl && CONFIG.cover.bgImage) {
    gateEl.style.backgroundImage = `url('${CONFIG.cover.bgImage}')`;
  }

  const urlParams = new URLSearchParams(window.location.search);
  let guestName = urlParams.get('to');

  const guestNameEl = document.getElementById('guest-name');
  if (guestNameEl) {
    if (guestName) {
      guestName = guestName.trim();
      guestNameEl.textContent = guestName;
    } else {
      guestNameEl.textContent = CONFIG.cover.defaultGuest || 'Tamu Undangan';
    }
  }
}

/**
 * Inisialisasi Section 2 (Pembuka + Ayat) dan Section 3 (Mempelai)
 */
function initCouple() {
  // --- Section 2: Ayat ---
  const quoteArabic = document.getElementById('quote-arabic');
  const quoteText = document.getElementById('quote-text');
  const quoteSource = document.getElementById('quote-source');
  if (quoteArabic) quoteArabic.textContent = CONFIG.quote.arabic || '';
  if (quoteText) quoteText.textContent = CONFIG.quote.text || '';
  if (quoteSource) quoteSource.textContent = CONFIG.quote.source || '';

  // --- Section 3: Mempelai ---
  const groomPhoto = document.getElementById('groom-photo');
  const groomFullname = document.getElementById('groom-fullname');
  const groomParents = document.getElementById('groom-parents');
  const groomIg = document.getElementById('groom-instagram');
  const groomIgHandle = document.getElementById('groom-ig-handle');

  if (groomFullname) groomFullname.textContent = CONFIG.groom.fullName || '';
  if (groomParents) groomParents.textContent = CONFIG.groom.parents || '';
  
  if (CONFIG.groom.instagram) {
    if (groomIg) groomIg.classList.remove('hidden');
    if (groomIg) groomIg.href = `https://instagram.com/${CONFIG.groom.instagram}`;
    if (groomIgHandle) groomIgHandle.textContent = `@${CONFIG.groom.instagram}`;
  }

  if (groomPhoto) {
    if (CONFIG.groom.photo) {
      groomPhoto.onload = () => {
        const initials = document.getElementById('groom-initials');
        if (initials) initials.style.display = 'none';
      };
      groomPhoto.onerror = () => {
        groomPhoto.style.display = 'none';
      };
      groomPhoto.src = CONFIG.groom.photo + '?v=1.0.2';
    } else {
      groomPhoto.style.display = 'none';
    }
  }

  const bridePhoto = document.getElementById('bride-photo');
  const brideFullname = document.getElementById('bride-fullname');
  const brideParents = document.getElementById('bride-parents');
  const brideIg = document.getElementById('bride-instagram');
  const brideIgHandle = document.getElementById('bride-ig-handle');

  if (brideFullname) brideFullname.textContent = CONFIG.bride.fullName || '';
  if (brideParents) brideParents.textContent = CONFIG.bride.parents || '';
  
  if (CONFIG.bride.instagram) {
    if (brideIg) brideIg.classList.remove('hidden');
    if (brideIg) brideIg.href = `https://instagram.com/${CONFIG.bride.instagram}`;
    if (brideIgHandle) brideIgHandle.textContent = `@${CONFIG.bride.instagram}`;
  }

  if (bridePhoto) {
    if (CONFIG.bride.photo) {
      bridePhoto.onload = () => {
        const initials = document.getElementById('bride-initials');
        if (initials) initials.style.display = 'none';
      };
      bridePhoto.onerror = () => {
        bridePhoto.style.display = 'none';
      };
      bridePhoto.src = CONFIG.bride.photo + '?v=1.0.2';
    } else {
      bridePhoto.style.display = 'none';
    }
  }
}

/**
 * Inisialisasi Section 4 (Countdown, Pembuatan Link Google Calendar, dan List Acara)
 */
/**
 * Failsafe regex-based ISO Date parser that works across all mobile browsers and WebViews.
 */
function parseISODate(dateStr) {
  if (!dateStr) return new Date();
  
  // Format: YYYY-MM-DDTHH:mm:ss[+HH:MM]
  const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:[.,]\d+)?(?:Z|([+-])(\d{2}):(\d{2}))?$/;
  const match = dateStr.match(regex);
  if (!match) {
    return new Date(dateStr); // Fallback to native parser
  }
  
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // 0-indexed month
  const day = parseInt(match[3], 10);
  const hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);
  const second = parseInt(match[6], 10);
  
  let utcTime = Date.UTC(year, month, day, hour, minute, second);
  
  if (match[7]) { // Timezone offset present, convert to UTC
    const sign = match[7] === '+' ? -1 : 1;
    const offsetHours = parseInt(match[8], 10);
    const offsetMins = parseInt(match[9], 10);
    const offsetMillis = (offsetHours * 60 + offsetMins) * 60 * 1000;
    utcTime += sign * offsetMillis;
  }
  
  return new Date(utcTime);
}

function initEventsAndCountdown() {
  // --- 1. Realtime Countdown ---
  const dateISO = CONFIG.couple.dateISO;
  if (dateISO) {
    const targetTime = parseISODate(dateISO).getTime();
    const cdTimer = document.getElementById('countdown-timer');
    const cdElapsed = document.getElementById('countdown-elapsed');
    
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!isNaN(targetTime)) {
      const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
          if (cdTimer) cdTimer.classList.add('hidden');
          if (cdElapsed) cdElapsed.classList.remove('hidden');
          clearInterval(intervalId);
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
      };

      updateTimer();
      const intervalId = setInterval(updateTimer, 1000);
    }
  }

  // --- 2. Google Calendar Event Link ---
  const btnCalendar = document.getElementById('btn-calendar');
  if (btnCalendar && dateISO) {
    try {
      const startDate = parseISODate(dateISO);
      if (!isNaN(startDate.getTime())) {
        const endDate = new Date(startDate.getTime() + (5 * 60 * 60 * 1000));

        const toUTCCompact = (d) => {
          return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const datesParam = `${toUTCCompact(startDate)}/${toUTCCompact(endDate)}`;
        const title = encodeURIComponent(`Pernikahan ${CONFIG.couple.shortName}`);
        
        let location = '';
        let details = '';

        if (CONFIG.events && CONFIG.events.length > 0) {
          location = encodeURIComponent(`${CONFIG.events[0].venue}, ${CONFIG.events[0].address}`);
          details = encodeURIComponent(`Menghadiri Acara Pernikahan ${CONFIG.couple.shortName}.\n\nLokasi: ${CONFIG.events[0].venue}\nAlamat: ${CONFIG.events[0].address}\nPeta: ${CONFIG.events[0].mapsUrl}`);
        }

        btnCalendar.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
      }
    } catch (e) {
      console.error('Gagal men-generate Google Calendar Link:', e);
    }
  }

  // --- 3. Loop Render Jadwal Acara ---
  const eventsList = document.getElementById('events-list');
  if (eventsList && CONFIG.events) {
    eventsList.innerHTML = '';

    CONFIG.events.forEach((evt, index) => {
      const card = document.createElement('div');
      card.className = 'event-card';

      // Small elegant line-art icon (Akad has a floral wreath leaf, Resepsi has a vintage crown scroll)
      const iconSvg = index === 0 
        ? `<svg class="event-icon-doodle" viewBox="0 0 100 30" fill="none" stroke="currentColor">
            <path d="M50 5 Q40 25, 30 15 T10 15 M50 5 Q60 25, 70 15 T90 15" stroke-width="0.8" stroke-dasharray="1.5 1"></path>
            <circle cx="50" cy="15" r="2.5" fill="currentColor"></circle>
           </svg>`
        : `<svg class="event-icon-doodle" viewBox="0 0 100 30" fill="none" stroke="currentColor">
            <path d="M50 25 C35 15, 25 10, 50 2 C75 10, 65 15, 50 25 Z" stroke-width="0.8"></path>
            <circle cx="50" cy="12" r="2" fill="currentColor"></circle>
           </svg>`;

      card.innerHTML = `
        ${iconSvg}
        <h3 class="event-card-header">${evt.name}</h3>
        <div class="event-details">
          <div class="event-detail-item date">${evt.dateDisplay}</div>
          <div class="event-detail-item time">${evt.time}</div>
          ${evt.illustration ? `<img class="venue-etching" src="${evt.illustration}" alt="Ilustrasi ${evt.venue}" loading="lazy" onerror="this.style.display='none'">` : ''}
          <div class="event-detail-item venue">${evt.venue}</div>
          <div class="event-detail-item address">${evt.address}</div>
        </div>
        <a href="${evt.mapsUrl}" class="btn btn-primary event-maps-btn" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Lihat Lokasi
        </a>
      `;

      eventsList.appendChild(card);
    });
  }
}

/**
 * Inisialisasi Section 5 (Kado Digital / Gifts & Modal Popup)
 */
function initGifts() {
  const giftsSec = document.getElementById('sec-gifts');
  if (!CONFIG.gifts || !CONFIG.gifts.enabled) {
    if (giftsSec) giftsSec.style.display = 'none';
    return;
  }

  const giftsNote = document.getElementById('gifts-note');
  if (giftsNote) giftsNote.textContent = CONFIG.gifts.note || '';

  const btnShowGifts = document.getElementById('btn-show-gifts');
  const btnCloseGifts = document.getElementById('btn-close-gifts');
  const giftModal = document.getElementById('gift-modal');

  if (btnShowGifts && giftModal) {
    btnShowGifts.addEventListener('click', () => {
      giftModal.classList.remove('hidden');
      document.body.classList.add('locked');
    });
  }

  if (btnCloseGifts && giftModal) {
    btnCloseGifts.addEventListener('click', () => {
      giftModal.classList.add('hidden');
      document.body.classList.remove('locked');
    });
  }

  if (giftModal) {
    giftModal.addEventListener('click', (e) => {
      if (e.target === giftModal) {
        giftModal.classList.add('hidden');
        document.body.classList.remove('locked');
      }
    });
  }

  const accountsList = document.getElementById('bank-accounts-list');
  if (accountsList && CONFIG.gifts.accounts) {
    accountsList.innerHTML = '';

    CONFIG.gifts.accounts.forEach((acc, index) => {
      const card = document.createElement('div');
      card.className = 'bank-account-card';

      const initials = acc.bank.substring(0, 3).toUpperCase();
      const hasLogo = acc.logo && acc.logo.trim() !== '';

      card.innerHTML = `
        <div class="bank-logo-box">
          ${hasLogo ? 
            `<img src="${acc.logo}" class="bank-logo-img" alt="Logo ${acc.bank}" id="bank-logo-${index}">` : 
            `<span class="bank-initials-fallback">${initials}</span>`
          }
        </div>
        <div class="bank-info-label">No. Rekening (${acc.bank})</div>
        <div class="bank-number" id="bank-num-${index}">${acc.number}</div>
        <div class="bank-holder">a.n. ${acc.holder}</div>
        <button class="btn btn-copy" data-target="bank-num-${index}" data-number="${acc.number}">Salin</button>
      `;

      accountsList.appendChild(card);

      if (hasLogo) {
        const logoImg = document.getElementById(`bank-logo-${index}`);
        if (logoImg) {
          logoImg.onerror = () => {
            const parent = logoImg.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="bank-initials-fallback">${initials}</span>`;
            }
          };
        }
      }
    });

    accountsList.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-copy')) {
        const button = e.target;
        const number = button.getAttribute('data-number');

        if (number) {
          navigator.clipboard.writeText(number)
            .then(() => {
              button.textContent = 'Tersalin!';
              button.classList.add('copied');
              setTimeout(() => {
                button.textContent = 'Salin';
                button.classList.remove('copied');
              }, 2000);
            })
            .catch(err => console.error('Gagal menyalin rekening:', err));
        }
      }
    });
  }

  const addressContainer = document.getElementById('shipping-address-container');
  const addressText = document.getElementById('shipping-text');
  const btnCopyAddress = document.getElementById('btn-copy-address');

  if (CONFIG.gifts.shippingAddress && CONFIG.gifts.shippingAddress.trim() !== '') {
    if (addressContainer) addressContainer.classList.remove('hidden');
    if (addressText) addressText.textContent = CONFIG.gifts.shippingAddress;

    if (btnCopyAddress) {
      btnCopyAddress.addEventListener('click', () => {
        navigator.clipboard.writeText(CONFIG.gifts.shippingAddress)
          .then(() => {
            btnCopyAddress.textContent = 'Tersalin!';
            btnCopyAddress.classList.add('copied');
            setTimeout(() => {
              btnCopyAddress.textContent = 'Salin Alamat';
              btnCopyAddress.classList.remove('copied');
            }, 2000);
          })
          .catch(err => console.error('Gagal menyalin alamat:', err));
      });
    }
  }

  const btnConfirm = document.getElementById('btn-confirm-gift');
  if (btnConfirm && CONFIG.gifts.confirmWa) {
    const textMsg = `Halo ${CONFIG.couple.shortName}, saya ingin konfirmasi bahwa saya telah mengirimkan tanda kasih untuk hari bahagia kalian.`;
    btnConfirm.href = `https://wa.me/${CONFIG.gifts.confirmWa}?text=${encodeURIComponent(textMsg)}`;
  }
}

/**
 * Inisialisasi Section 6 (RSVP Form, Validation & Counter Stats)
 */
function initRSVP() {
  const rsvpNama = document.getElementById('rsvp-nama');
  const rsvpJumlah = document.getElementById('rsvp-jumlah');
  const rsvpUcapan = document.getElementById('rsvp-ucapan');
  const btnSubmit = document.getElementById('btn-submit-rsvp');
  
  const errorMsg = document.getElementById('rsvp-name-error');
  const successMsg = document.getElementById('rsvp-success-msg');
  const failMsg = document.getElementById('rsvp-fail-msg');

  const hasUrl = CONFIG.rsvp && CONFIG.rsvp.appsScriptUrl && CONFIG.rsvp.appsScriptUrl.trim() !== '';
  if (!hasUrl) {
    const container = document.querySelector('.rsvp-form-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 25px 10px; color: var(--color-bronze);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 44px; height: 44px; margin-bottom: 12px; opacity: 0.85;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p style="font-family: var(--font-title); font-size: 1.25rem; font-weight: 600; margin-bottom: 6px;">RSVP Belum Aktif</p>
          <p style="font-family: var(--font-body); font-size: 0.92rem; opacity: 0.8; max-width: 250px; margin: 0 auto; line-height: 1.4;">Formulir konfirmasi kehadiran belum diaktifkan oleh penyelenggara.</p>
        </div>
      `;
    }
    return;
  }

  loadCounters();

  if (!btnSubmit) return;

  if (rsvpNama) {
    rsvpNama.addEventListener('input', () => {
      rsvpNama.classList.remove('error');
      if (errorMsg) errorMsg.classList.add('hidden');
    });
  }

  btnSubmit.addEventListener('click', () => {
    const namaVal = rsvpNama ? rsvpNama.value.trim() : '';
    
    if (namaVal === '') {
      if (rsvpNama) rsvpNama.classList.add('error');
      if (errorMsg) errorMsg.classList.remove('hidden');
      if (rsvpNama) rsvpNama.focus();
      return;
    }

    const jumlahVal = rsvpJumlah ? parseInt(rsvpJumlah.value) : 1;
    const statusRadio = document.querySelector('input[name="rsvp-status"]:checked');
    const statusVal = statusRadio ? statusRadio.value : 'Hadir';
    const ucapanVal = rsvpUcapan ? rsvpUcapan.value.trim() : '';

    const payload = {
      nama: namaVal,
      jumlah: jumlahVal,
      status: statusVal,
      ucapan: ucapanVal
    };

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Mengirim...';
    if (successMsg) successMsg.classList.add('hidden');
    if (failMsg) failMsg.classList.add('hidden');

    // Prefill WhatsApp text for the failsafe fallback
    const waNumber = CONFIG.rsvp.waNumber || '';
    const textMsg = `Halo ${CONFIG.couple.shortName},\n\nSaya ingin mengonfirmasi kehadiran saya pada acara pernikahan Anda:\n\n*Nama*: ${namaVal}\n*Jumlah Tamu*: ${jumlahVal} Orang\n*Status*: ${statusVal}\n*Ucapan*: ${ucapanVal || '-'}\n\nTerima kasih!`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(textMsg)}`;

    submitRSVP(payload)
      .then((res) => {
        if (res && res.result === 'success') {
          if (successMsg) successMsg.classList.remove('hidden');
          
          if (rsvpNama) rsvpNama.value = '';
          if (rsvpUcapan) rsvpUcapan.value = '';
          if (rsvpJumlah) rsvpJumlah.value = '1';
          
          const defaultRadio = document.querySelector('input[name="rsvp-status"][value="Hadir"]');
          if (defaultRadio) defaultRadio.checked = true;

          loadCounters();
        } else {
          throw new Error("Google Sheets returned invalid or non-authorized response format.");
        }
      })
      .catch((err) => {
        console.error('RSVP submit error:', err);
        if (failMsg) {
          failMsg.innerHTML = `Gagal mengirim otomatis (Server memerlukan masuk akun Google).<br>Mengarahkan Anda untuk konfirmasi via WhatsApp...<br><a href="${waUrl}" target="_blank" style="color: inherit; font-weight: bold; text-decoration: underline;">Ketuk di sini jika tidak teralihkan</a>.`;
          failMsg.classList.remove('hidden');
        }
        
        // Automatic redirect fallback to WhatsApp after 2 seconds
        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 2000);
      })
      .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Kirim Konfirmasi';
      });
  });
}

/**
 * Mengirim RSVP ke Google Apps Script Web App dengan proteksi preflight & no-cors fallback
 */
async function submitRSVP(data) {
  try {
    const res = await fetch(CONFIG.rsvp.appsScriptUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        nama: data.nama,
        jumlah: data.jumlah,
        status: data.status,
        ucapan: data.ucapan || ''
      })
    });
    
    const text = await res.text();
    // Check if the response is an HTML page (Google login redirect) instead of standard JSON
    if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<html')) {
      throw new Error("Google Apps Script returned HTML instead of JSON (likely require sign-in).");
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("CORS/Authorization POST failed, trying 'no-cors' silent write submission:", error);
    
    // Fallback: Send in 'no-cors' mode so the request successfully hits the sheet.
    // In this mode, Google updates the spreadsheet, but we bypass the browser's redirect block.
    await fetch(CONFIG.rsvp.appsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        nama: data.nama,
        jumlah: data.jumlah,
        status: data.status,
        ucapan: data.ucapan || ''
      })
    });
    
    // We assume success as no-cors always successfully fires to Google Servers
    return { result: 'success' };
  }
}

/**
 * Mengambil counter statistik kehadiran dari Google Apps Script Web App
 */
async function loadCounters() {
  try {
    const r = await fetch(CONFIG.rsvp.appsScriptUrl);
    const c = await r.json();
    
    const countHadir = document.getElementById('count-hadir');
    const countTidak = document.getElementById('count-tidak');
    const countRagu = document.getElementById('count-ragu');

    if (countHadir && c.hadir !== undefined) countHadir.textContent = String(c.hadir);
    if (countTidak && c.tidak !== undefined) countAgainstTidak(countTidak, c.tidak);
    if (countRagu && c.ragu !== undefined) countRagu.textContent = String(c.ragu);
  } catch (e) {
    console.warn('Gagal memuat statistik counter RSVP:', e);
  }
}

function countAgainstTidak(el, val) {
  el.textContent = String(val);
}

/**
 * Inisialisasi Section 7 (Penutup)
 */
function initClosing() {
  const closingNote = document.getElementById('closing-note');
  const closingName = document.getElementById('closing-couple-name');
  const madeBy = document.getElementById('made-by');
  const sigTitle = document.querySelector('.sig-title');

  if (closingNote) closingNote.textContent = CONFIG.footer.closingNote || '';
  if (sigTitle) sigTitle.textContent = CONFIG.footer.signatureTitle || 'Kami yang berbahagia';
  if (closingName) closingName.textContent = CONFIG.couple.shortName || '';
  if (madeBy) madeBy.textContent = CONFIG.footer.madeBy || 'Made with ♡';
}

/**
 * Setup IntersectionObserver untuk memberikan efek Scroll Reveal tenang & khidmat.
 */
function setupScrollReveal() {
  const sections = document.querySelectorAll('section, .section-divider');
  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('section-divider')) {
          entry.target.classList.add('reveal-active');
        } else {
          // Stagger reveal of section's children
          const items = entry.target.querySelectorAll('.reveal-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('reveal-active');
            }, index * 80);
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(sec => {
    observer.observe(sec);
  });
}

/**
 * Melakukan audit elemen visibilitas secara dinamis untuk menyembunyikan divider 
 * jika section terkait dinonaktifkan di CONFIG.
 */
function checkConditionalVisibility() {
  // Sembunyikan divider kado jika fitur kado dimatikan
  const dividerGifts = document.getElementById('div-gifts-rsvp');
  if (dividerGifts && (!CONFIG.gifts || !CONFIG.gifts.enabled)) {
    dividerGifts.style.display = 'none';
  }
}

/**
 * Mengatur event listener tombol "Buka Undangan" untuk membuka gate,
 * mengaktifkan musik latar (jika diaktifkan), dan mengizinkan scrolling halaman.
 */
function setupGateOpening() {
  const btnOpen = document.getElementById('btn-open');
  const gate = document.getElementById('gate');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const audioControl = document.getElementById('audio-control');
  const muteSlash = document.getElementById('mute-slash');

  if (!btnOpen) return;

  btnOpen.addEventListener('click', function() {
    // 1. Guard against double triggers
    this.disabled = true;

    // 2. Play background music (safely within user gesture context)
    if (CONFIG.music && CONFIG.music.enabled && CONFIG.music.src) {
      bgMusic.src = CONFIG.music.src + '?v=1.0.3';
      bgMusic.play()
        .then(() => {
          audioControl.classList.remove('hidden');
        })
        .catch((error) => {
          console.warn('Pemutaran musik otomatis diblokir browser:', error);
          audioControl.classList.remove('hidden');
          audioControl.classList.add('paused');
          if (muteSlash) muteSlash.classList.remove('hidden');
        });
    }

    // 3. Scroll to top instantly and unlock body
    window.scrollTo(0, 0);
    document.body.classList.remove('locked');

    // 4. Trigger curtain rise transition
    if (mainContent) {
      mainContent.classList.remove('hidden');
      void mainContent.offsetWidth; // Force layout calculation to ensure zero-state registers
      mainContent.classList.add('revealed');
    }

    if (gate) {
      gate.classList.add('gate--opening');

      const animationDuration = 1200; // Match 1.2s cubic-bezier in CSS

      const cleanupGate = () => {
        gate.style.display = 'none';
        
        // Fade in floating audio control after gate is fully open
        if (audioControl && !audioControl.classList.contains('hidden')) {
          audioControl.classList.add('revealed');
        }

        // Trigger immediate scroll-reveal of first section's items
        const firstSectionItems = document.querySelectorAll('#sec-opening .reveal-item');
        firstSectionItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('reveal-active');
          }, index * 80);
        });
      };

      let gateCleaned = false;
      const handleTransitionEnd = (e) => {
        if (e.target === gate && !gateCleaned) {
          gateCleaned = true;
          cleanupGate();
          gate.removeEventListener('transitionend', handleTransitionEnd);
        }
      };

      gate.addEventListener('transitionend', handleTransitionEnd);
      // Timeout fallback if transitionend doesn't fire
      setTimeout(() => {
        if (!gateCleaned) {
          gateCleaned = true;
          cleanupGate();
        }
      }, animationDuration + 50);
    } else {
      if (audioControl) audioControl.classList.add('revealed');
    }
  });

  if (audioControl && bgMusic) {
    audioControl.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play()
          .then(() => {
            audioControl.classList.remove('paused');
            if (muteSlash) muteSlash.classList.add('hidden');
          })
          .catch(err => console.error('Gagal memutar audio:', err));
      } else {
        bgMusic.pause();
        audioControl.classList.add('paused');
        if (muteSlash) muteSlash.classList.remove('hidden');
      }
    });
  }
}
