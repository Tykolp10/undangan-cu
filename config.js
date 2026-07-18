/* =========================================================================
   CONFIG UNDANGAN DIGITAL — Fajar & Rizka
   -------------------------------------------------------------------------
   File ini SATU-SATUNYA yang perlu diedit per event.
   Ubah nilainya saja (sisi kanan), jangan ubah nama variabel (sisi kiri).
   ========================================================================= */

/* =========================================================================
   >>> DESIGN BRIEF UNTUK ANTIGRAVITY (baca dulu sebelum bangun template) <<<

   MOOD       : Khidmat, tenang, serius. Engraving / etched vintage sebagai
                bahasa visual UTAMA. Nuansa folk-rock yang earthy & jujur
                (vibe ala Iwan Fals: hangat, membumi, tulus — BUKAN glamor,
                BUKAN ramai). Sisi "lucu" mempelai wanita masuk HEMAT lewat
                aksen kecil, bukan mengubah keseluruhan tone.

   PALETTE    : - Ink / charcoal      #1A1A1A  (teks utama, garis engraving)
                - Kertas tua / cream   #F3ECE0  (background)
                - Bronze / copper      #8A6D3B  (aksen, ornamen, divider)
                - Dusty rose (lembut)  #E0A89A  (HANYA untuk aksen "lucu",
                                                  pakai sangat sedikit)

   TIPOGRAFI  : - Judul  : serif display berkarakter (Cormorant Garamond /
                           Playfair Display). Boleh blackletter-lite tipis
                           untuk satu headline demi sentuhan "rock".
                - Body   : serif bersih, terbaca enak di HP.

   TEKSTUR    : Grain kertas halus, garis engraving tipis sebagai divider,
                frame ornamental botanical line-art di tepi section penting.

   AKSEN LUCU : 1-2 doodle line-art (mis. kucing kecil / bunga / hati) yang
                digambar bergaya ETCHING — supaya tetap menyatu dengan engraving.
                Prinsip: "cute but engraved." Jangan emoji, jangan kartun bulat.

   HINDARI    : Warna neon, layout ramai, animasi berlebihan, gradient mencolok.
                Tetap clean, tenang, dan elegan.

   FLOW (7 section, urut): Cover -> Pembuka+Ayat -> Mempelai -> Acara+Countdown
                            -> Hadiah -> RSVP -> Penutup
   ========================================================================= */

const CONFIG = {

  /* --- META (tab browser & preview saat link di-share) ------------------ */
  meta: {
    title: "The Wedding of Fajar & Rizka",
    description: "Undangan Pernikahan Fajar & Rizka — 22 Agustus 2026",
    ogImage: "assets/img/og-image.webp", // gambar yang muncul saat link dishare di WA/IG
    favicon: "assets/img/favicon.png",
    themeColor: "#8A6D3B",
  },

  /* --- DATA INTI PASANGAN ----------------------------------------------- */
  couple: {
    shortName: "Fajar & Rizka",
    // GANTI dengan tanggal acara ASLI. Format ISO + offset WIB (+07:00).
    // Ini yang dipakai countdown & link kalender. WAJIB akurat & valid.
    dateISO: "2026-08-22T12:00:00+07:00",
    dateDisplay: "22 Agustus 2026",    // versi yang ditampilkan ke tamu
  },

  /* --- MUSIK LATAR (opsional) ------------------------------------------- */
  // Diputar saat tamu klik "Buka Undangan" (memenuhi aturan autoplay browser).
  // Pilih lagu bertema khidmat/akustik agar selaras dengan mood.
  music: {
    enabled: true,
    src: "assets/audio/song.m4a",       // taruh file lagu pilihanmu di sini
  },

  /* --- 1. COVER / GATE -------------------------------------------------- */
  cover: {
    basmallah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    openingLine: "Atas Berkat Rochmat Alloh Yang Maha Kuasa",
    greeting: "Kami mengundang anda dalam PERNIKAHAN KAMI",
    monogram: "C & U",
    defaultGuest: "Tamu Undangan",      // dipakai kalau URL tidak ada ?to=
    bgImage: "assets/img/cover.webp",
    buttonText: "Buka Undangan",
  },

  /* --- 2. PEMBUKA + AYAT ------------------------------------------------ */
  quote: {
    arabic: "يٰٓاَيُّهَا النَّاسُ اِنَّا خَلَقْنٰكُمْ مِّنْ ذَكَرٍ وَّاُنْثٰى وَجَعَلْنٰكُمْ شُعُوْبًا وَّقَبَآىِٕلَ لِتَعَارَفُوْا ۚ اِنَّ اَكْرَمَكُمْ عِنْدَ اللّٰهِ اَتْقٰىكُمْ ۗاِنَّ اللّٰهَ عَلِيْمٌ خَبِيْرٌ",
    text: "Wahai manusia, sesungguhnya Kami telah menciptakan kamu dari seorang laki-laki dan perempuan. Kemudian, Kami menjadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal. Sesungguhnya yang paling mulia di antara kamu di sisi Allah adalah orang yang paling bertakwa. Sesungguhnya Allah Maha Mengetahui lagi Mahateliti.",
    source: "QS. Al-Hujurot ayat 13",
  },

  /* --- 3. MEMPELAI (ringkas) -------------------------------------------- */
  groom: {
    name: "Fajar",
    fullName: "Fajar Ikhsanuddin",
    parents: "Putra Alm. Bapak Sukamto & Ibu Musrifah",
    photo: "assets/img/groom.webp",
    instagram: "lazy_08",
  },
  bride: {
    name: "Rizka",
    fullName: "Rizka Noor Laila",
    parents: "Putri Alm. Bapak H. Sunaryo & Ibu Sri Purwati",
    photo: "assets/img/bride.webp",
    instagram: "cikasuna",
  },

  /* --- 4. ACARA + COUNTDOWN --------------------------------------------- */
  // Countdown otomatis mengarah ke couple.dateISO di atas.
  events: [
    {
      name: "Resepsi",
      dateDisplay: "Sabtu Legi, 8 Robi'ul Awwal 1448 H / 22 Agustus 2026 M.",
      time: "12.00 – 17.00 WIB",
      venue: "Gedung Orshid",
      illustration: "assets/img/illust/venue-etching.webp",
      address: "Pesantren Majmaal Bachroin Chubbul Wathon Minal Iman – Shiddiqiyyah, Losari, Ploso, Jombang",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=-7.4513297,112.2210737&query_place_id=ChIJM0m5vPo9eC4RcqOMmy4EXBg",
    },
  ],

  /* --- 5. HADIAH -------------------------------------------------------- */
  gifts: {
    enabled: false,
    note: "Bagi tamu yang ingin mengirimkan tanda kasih, dapat melalui:",
    accounts: [
      { bank: "BCA", logo: "assets/img/bank/bca.png", number: "14002938102", holder: "Fajar Ikhsanuddin" },
      { bank: "Mandiri", logo: "assets/img/bank/mandiri.png", number: "1420019284721", holder: "Rizka Noor Laila" }
    ],
    shippingAddress: "Perumahan Indah Asri Blok C-12, Jambangan, Surabaya",
    confirmWa: "6281234567890",
  },

  /* --- 6. RSVP ---------------------------------------------------------- */
  rsvp: {
    method: "appsscript",
    waNumber: "6281234567890",
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbz4R4kAllEg7gENyQh8Sze6FZ8-mc9p0qH81aQBDGu_ZvZMGBtsuarYPQfl1QTbZ5j3/exec",
  },

  /* --- 7. PENUTUP ------------------------------------------------------- */
  footer: {
    closingNote: "Terimakasih",
    signatureTitle: "Atas nama keluarga",
    madeBy: "Dibuat dengan \u2661",
  },

};
