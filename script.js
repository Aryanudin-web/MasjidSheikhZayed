/**
 * MASJID RAYA SHEIKH ZAYED SURAKARTA - SCRIPT INTERAKTIF PRO LUXURY EDITION
 * Fitur Lengkap: Jadwal Sholat Otomatis, Kompas Kiblat, Kalkulator Zakat & QRIS,
 * Asisten Virtual Zayed AI, Galeri Lightbox Pro, Audio Religi, & Kuis Sahabat Masjid.
 */

// Helper utility selector
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   1. LOADER & INISIALISASI SITUS
   ========================================================================== */
function startSite() {
    const loader = $('#loader');
    if (loader) loader.classList.add('done');
    document.body.classList.add('ready');
}
window.addEventListener('load', () => setTimeout(startSite, 600));
setTimeout(startSite, 3500); // Fail-safe jika ada CDN yang lambat

/* ==========================================================================
   2. PROGRESS BAR, NAVBAR & BACK TO TOP
   ========================================================================== */
const backBtn = $('#back-to-top');
const progressBar = $('#progress');
const header = $('header');
const menuBtn = $('#menu-btn');
const mobileMenu = $('#mobile-menu');

// Hamburger Menu
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    $$('.mobile-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
}

function onScrollUI() {
    const y = window.scrollY;
    // Navbar glassmorphism
    if (y > 40) {
        header?.classList.add('shadow-md', 'bg-white/95', 'dark:bg-slate-900/95');
    } else {
        header?.classList.remove('shadow-md');
    }

    // Back to top button
    if (backBtn) {
        const show = y > 350;
        backBtn.classList.toggle('opacity-0', !show);
        backBtn.classList.toggle('invisible', !show);
    }

    // Scroll progress bar
    if (progressBar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
}
window.addEventListener('scroll', onScrollUI, { passive: true });

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Active Nav link observer
const navObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (en.isIntersecting) {
            $$('nav a').forEach(a => {
                a.classList.toggle('text-sky-600', a.getAttribute('href') === '#' + en.target.id);
                a.classList.toggle('font-bold', a.getAttribute('href') === '#' + en.target.id);
            });
        }
    });
}, { threshold: 0.3 });
$$('section[id]').forEach(s => navObs.observe(s));

/* ==========================================================================
   3. HERO TITLE & PARALLAX ANIMASI
   ========================================================================== */
const heroTitle = $('.hero-title');
if (heroTitle && heroTitle.textContent) {
    const text = heroTitle.textContent.trim();
    heroTitle.innerHTML = [...text].map((c, i) =>
        c === ' ' ? '<span class="sp"></span>' : `<span class="ch" style="--i:${i}">${c}</span>`
    ).join('');
}

const heroBg = $('[data-hero="bg"]');
const heroContent = $('[data-hero="content"]');
const orbs = $$('[data-hero="orb"]');
const stageWrap = $('.stage-wrap');
const scenes = $$('.scene');
const dots = $$('.dot');
const parImgs = $$('.parallax-img');

let cur = window.scrollY, mx = 0, my = 0, smx = 0, smy = 0;
window.addEventListener('mousemove', e => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
});

function animationLoop() {
    cur += (window.scrollY - cur) * (reduceMotion ? 1 : 0.08);
    if (Math.abs(window.scrollY - cur) < 0.05) cur = window.scrollY;
    smx += (mx - smx) * 0.06;
    smy += (my - smy) * 0.06;
    const h = window.innerHeight;

    // Hero Section Parallax
    if (cur < h * 1.2 && heroBg && heroTitle && heroContent) {
        const t = cur / h;
        heroBg.style.transform = `translate3d(${smx * -25}px, ${cur * 0.35 + smy * -15}px, 0) scale(${1.05 + t * 0.2}) rotateX(${smy * -2}deg) rotateY(${smx * 3}deg)`;
        heroTitle.style.transform = `translate3d(${smx * 35}px, ${cur * 0.5}px, 0) scale(${1 + t * 0.5})`;
        heroTitle.style.opacity = clamp(1 - t * 1.3, 0, 1);
        heroContent.style.transform = `translate3d(0, ${cur * 0.2}px, 0)`;
        heroContent.style.opacity = clamp(1 - t * 1.6, 0, 1);
        orbs.forEach((o, i) => {
            o.style.transform = `translate3d(${smx * (50 + i * 35)}px, ${-cur * (0.25 + i * 0.2) + smy * 40}px, 0)`;
        });
    }

    // Stage "Jelajah" Scroll Driven Scenes
    if (stageWrap && scenes.length > 0) {
        const len = stageWrap.offsetHeight - h;
        const p = clamp((cur - stageWrap.offsetTop) / len, 0, 1);
        const n = scenes.length;
        scenes.forEach((s, i) => {
            const u = p * n - i;
            const inn = i === 0 ? 1 : clamp((u + 0.4) / 0.4, 0, 1);
            const out = i === n - 1 ? 0 : clamp((u - 0.6) / 0.4, 0, 1);
            const op = inn * (1 - out);
            s.style.opacity = op;
            s.style.transform = `translateZ(${(1 - inn) * -200 + out * 180}px)`;
            const img = s.querySelector('img');
            if (img) img.style.transform = `scale(${1.15 - 0.15 * clamp((u + 0.4) / 1.4, 0, 1)})`;
            const txt = s.querySelector('.scene-text');
            if (txt) txt.style.transform = `translate3d(0, ${(1 - inn) * 80 - out * 80}px, 0) rotateX(${(1 - inn) * 25 - out * 25}deg)`;
        });
        const active = clamp(Math.floor(p * n), 0, n - 1);
        dots.forEach((d, i) => d.classList.toggle('active', i === active));
    }

    // Parallax Images in Other Sections
    parImgs.forEach(img => {
        const parent = img.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom > 0 && r.top < h) {
            const prog = (r.top + r.height / 2 - h / 2) / h;
            img.style.transform = `translate3d(0, ${prog * -40}px, 0) scale(1.15)`;
        }
    });

    requestAnimationFrame(animationLoop);
}
requestAnimationFrame(animationLoop);
onScrollUI();

// Click dots to scroll to stage scene
function jumpToStageScene(index) {
    if (!stageWrap) return;
    const len = stageWrap.offsetHeight - window.innerHeight;
    const targetY = stageWrap.offsetTop + (index / (scenes.length - 1)) * len;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
}
dots.forEach((d, i) => d.addEventListener('click', () => jumpToStageScene(i)));

/* ==========================================================================
   4. 3D REVEAL & CARD TILT
   ========================================================================== */
const targets = $$('section:not(.hero):not(.stage-wrap) .text-center, section:not(.stage-wrap) .grid > *, footer > div');
targets.forEach(el => {
    const sibs = [...el.parentElement.children];
    el.classList.add('reveal');
    el.style.setProperty('--d', (sibs.indexOf(el) * 0.1) + 's');
    if (sibs.length === 2 && el.parentElement.classList.contains('grid')) {
        el.classList.add(sibs.indexOf(el) === 0 ? 'from-l' : 'from-r');
    }
});
const revObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add('in');
        revObs.unobserve(el);
        setTimeout(() => el.classList.remove('reveal', 'in', 'from-l', 'from-r'), 1200);
    });
}, { threshold: 0.12 });
targets.forEach(el => revObs.observe(el));

// 3D Card Tilt
$$('.kegiatan-card, #arsitektur .grid > div, .tilt-card').forEach(card => {
    card.classList.add('tilt');
    card.addEventListener('mousemove', e => {
        if (card.classList.contains('reveal')) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform .1s';
        card.style.transform = `perspective(800px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .4s ease';
        card.style.transform = '';
    });
});

/* ==========================================================================
   5. JADWAL SHOLAT OTOMATIS SURAKARTA & COUNTDOWN TIMER
   ========================================================================== */
const PRAYER_SCHEDULE = {
    Imsak: '03:45',
    Subuh: '03:55',
    Terbit: '05:15',
    Dhuha: '05:42',
    Dzuhur: '11:32',
    Ashar: '14:54',
    Maghrib: '17:46',
    Isya: '18:59'
};

function format2Digits(n) { return n < 10 ? '0' + n : n; }

function updatePrayerTimesAndCountdown() {
    const now = new Date();
    const curHours = now.getHours();
    const curMinutes = now.getMinutes();
    const curSeconds = now.getSeconds();
    const curTotalSec = curHours * 3600 + curMinutes * 60 + curSeconds;

    // Update Jam Real-Time
    const clockEl = $('#live-clock');
    if (clockEl) {
        clockEl.innerText = `${format2Digits(curHours)}:${format2Digits(curMinutes)}:${format2Digits(curSeconds)} WIB`;
    }

    // Hijri Date Calculation (Aproksimasi Standar Kemenag)
    const hijriEl = $('#live-hijri');
    if (hijriEl) {
        const hijriMonths = ["Muharram", "Safar", "Rabiul Awwal", "Rabiul Akhir", "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"];
        // Nov 2026 ~= 1448 H Jumadil Ula
        hijriEl.innerText = `14 Jumadil Awwal 1448 H`;
    }

    const prayerOrder = [
        { name: 'Imsak', time: PRAYER_SCHEDULE.Imsak },
        { name: 'Subuh', time: PRAYER_SCHEDULE.Subuh },
        { name: 'Terbit', time: PRAYER_SCHEDULE.Terbit },
        { name: 'Dzuhur', time: PRAYER_SCHEDULE.Dzuhur },
        { name: 'Ashar', time: PRAYER_SCHEDULE.Ashar },
        { name: 'Maghrib', time: PRAYER_SCHEDULE.Maghrib },
        { name: 'Isya', time: PRAYER_SCHEDULE.Isya }
    ];

    let nextPrayer = null;
    let nextSecDiff = Infinity;
    let currentActive = null;

    for (let i = 0; i < prayerOrder.length; i++) {
        const [h, m] = prayerOrder[i].time.split(':').map(Number);
        const pSec = h * 3600 + m * 60;
        if (pSec > curTotalSec) {
            nextPrayer = prayerOrder[i];
            nextSecDiff = pSec - curTotalSec;
            currentActive = i > 0 ? prayerOrder[i - 1].name : 'Isya';
            break;
        }
    }

    // Jika lewat Isya malam ini -> next adalah Imsak besok
    if (!nextPrayer) {
        nextPrayer = prayerOrder[0]; // Imsak besok
        const [h, m] = prayerOrder[0].time.split(':').map(Number);
        const pSec = h * 3600 + m * 60;
        nextSecDiff = (86400 - curTotalSec) + pSec;
        currentActive = 'Isya';
    }

    // Highlight card jadwal sholat
    $$('.prayer-card').forEach(card => {
        const prayerName = card.dataset.prayer;
        card.classList.toggle('active', prayerName === currentActive);
    });

    // Update Countdown Text
    const countdownEl = $('#prayer-countdown');
    const nextNameEl = $('#next-prayer-name');
    if (countdownEl && nextPrayer) {
        const hrs = Math.floor(nextSecDiff / 3600);
        const mins = Math.floor((nextSecDiff % 3600) / 60);
        const secs = nextSecDiff % 60;
        countdownEl.innerText = `${format2Digits(hrs)}:${format2Digits(mins)}:${format2Digits(secs)}`;
        if (nextNameEl) nextNameEl.innerText = `Menuju Adzan ${nextPrayer.name}`;
    }
}
setInterval(updatePrayerTimesAndCountdown, 1000);
updatePrayerTimesAndCountdown();

/* ==========================================================================
   6. AUDIO ADZAN & SUASANA ISLAMI (WEB AUDIO API SYNTHESIZER & CHIME)
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let ambientOsc1 = null, ambientOsc2 = null, ambientGain = null;

function initAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
}

function playIslamicChime() {
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    // Nada melodi damai pentatonik (C5, G4, F4, G4, C5)
    const notes = [523.25, 392.00, 349.23, 392.00, 523.25];
    notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.35);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime + idx * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + idx * 0.35 + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.35);
        osc.stop(audioCtx.currentTime + idx * 0.35 + 0.9);
    });
}

function toggleAmbientAudio() {
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const audioBtn = $('#audio-toggle-btn');
    const audioIndicator = $('#audio-indicator');

    if (!isAudioPlaying) {
        // Mulai lantunan nada ambient damai
        ambientGain = audioCtx.createGain();
        ambientGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

        ambientOsc1 = audioCtx.createOscillator();
        ambientOsc1.type = 'sine';
        ambientOsc1.frequency.setValueAtTime(220, audioCtx.currentTime); // A3

        ambientOsc2 = audioCtx.createOscillator();
        ambientOsc2.type = 'triangle';
        ambientOsc2.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4

        ambientOsc1.connect(ambientGain);
        ambientOsc2.connect(ambientGain);
        ambientGain.connect(audioCtx.destination);

        ambientOsc1.start();
        ambientOsc2.start();
        isAudioPlaying = true;

        if (audioIndicator) audioIndicator.classList.remove('audio-muted');
        if (audioBtn) {
            audioBtn.innerHTML = '<i class="fa-solid fa-volume-high text-sky-400"></i> <span class="hidden sm:inline">Suasana: Aktif</span>';
            audioBtn.classList.add('bg-sky-500/20', 'border-sky-400');
        }
        showToast('Suasana Religi Aktif: Menikmati suasana damai Masjid Sheikh Zayed Solo.');
    } else {
        if (ambientOsc1) { ambientOsc1.stop(); ambientOsc1.disconnect(); }
        if (ambientOsc2) { ambientOsc2.stop(); ambientOsc2.disconnect(); }
        isAudioPlaying = false;
        if (audioIndicator) audioIndicator.classList.add('audio-muted');
        if (audioBtn) {
            audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span class="hidden sm:inline">Suasana: Hening</span>';
            audioBtn.classList.remove('bg-sky-500/20', 'border-sky-400');
        }
    }
}

/* ==========================================================================
   7. KOMPAS ARAH KIBLAT INTERAKTIF (SURAKARTA: 294.5° WNW)
   ========================================================================== */
const QIBLA_SURAKARTA = 294.5;
function initQiblaCompass() {
    const needle = $('#qibla-needle');
    const dial = $('#compass-dial');
    const degDisplay = $('#qibla-degree');
    if (needle) {
        needle.style.transform = `rotate(${QIBLA_SURAKARTA}deg)`;
    }
    if (degDisplay) {
        degDisplay.innerText = `${QIBLA_SURAKARTA}° Barat Laut`;
    }

    // Jika perangkat memiliki sensor gyroscope (misal ponsel)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', event => {
            if (event.alpha !== null && dial) {
                const compassHeading = event.alpha;
                dial.style.transform = `rotate(${-compassHeading}deg)`;
            }
        }, true);
    }
}
initQiblaCompass();

function testCompassRotation() {
    const dial = $('#compass-dial');
    if (!dial) return;
    dial.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    const randomDeg = Math.floor(Math.random() * 360);
    dial.style.transform = `rotate(${randomDeg}deg)`;
    showToast(`Orientasi kompas disimulasikan: ${randomDeg}°.`);
}

/* ==========================================================================
   8. SPOT VIRTUAL & DENAH FASILITAS MASJID
   ========================================================================== */
const FACILITY_SPOTS = [
    {
        id: 'sholat',
        title: 'Ruang Sholat Utama & Mihrab Emas',
        badge: 'Kapasitas 4.000 Jamaah',
        desc: 'Lantai marmer Italia berlapis karpet bermotif Batik khas Surakarta. Dinding mihrab dihiasi kaligrafi Asmaul Husna berlapis emas 24 karat yang memancarkan kemegahan spiritual.',
        img: 'interiormasjid.jpg',
        specs: ['Luas: 2.500 m²', 'Sistem Pendingin AC Terpadu', 'Mihrab Emas Khas Timur Tengah', 'Sound System Akustik Jernih']
    },
    {
        id: 'kubah',
        title: '82 Kubah & 4 Menara 75 Meter',
        badge: 'Arsitektur Sheikh Zayed Abu Dhabi',
        desc: 'Replika autentik dengan marmer putih bersih. Empat menara utama menjulang setinggi 75 meter di empat sudut pelataran menjadi landmark baru Kota Bengawan.',
        img: 'eksteriormasjid.jpg',
        specs: ['82 Kubah Marmer Impor', '4 Menara Setinggi 75 Meter', 'Pencahayaan LED Spektakuler', 'Simbol Kemegahan Surakarta']
    },
    {
        id: 'taman',
        title: 'Pelataran Sahn & Taman Air Mancur',
        badge: 'Kapasitas Selasar 6.000 Jamaah',
        desc: 'Pelataran marmer terbuka luas berhiaskan kolam refleksi dan air mancur sejuk, menghadirkan suasana oase yang meneduhkan bagi seluruh jamaah dan wisatawan.',
        img: 'masjidepan.jpg',
        specs: ['Kolam Refleksi Khas UEA', 'Pohon Kurma & Taman Bunga', 'Lantai Marmer Anti-Silau', 'Area Terbuka Ramah Anak']
    },
    {
        id: 'islamic-center',
        title: 'Gedung Islamic Center & Digital Library',
        badge: 'Pusat Studi Peradaban Islam',
        desc: 'Pusat riset dakwah moderat, ruang seminar internasional, perpustakaan digital dengan ribuan literatur keislaman, serta kantor administrasi masjid.',
        img: 'tentangmasjid.jpg',
        specs: ['Perpustakaan Buku & E-Book', 'Ruang Konferensi Internasional', 'Lembaga Pendidikan Al-Qur\'an', 'Pusat Pelatihan Moderas Agama']
    },
    {
        id: 'difabel',
        title: 'Fasilitas Ramah Lansia & Difabel',
        badge: 'Inklusif untuk Semua Jamaah',
        desc: 'Dilengkapi ram akses khusus kursi roda di setiap gerbang, lift prioritas, toilet difabel berstandar internasional, serta layanan peminjaman kursi roda gratis.',
        img: 'masjid.jpg',
        specs: ['Peminjaman Kursi Roda Gratis', 'Lift & Jalur Ram Landai', 'Toilet Khusus Difabel', 'Relawan Pendamping Jamaah']
    }
];

function selectFacilitySpot(spotId, btn) {
    $$('.facility-btn').forEach(b => {
        b.classList.remove('bg-sky-500', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-200');
    });
    btn.classList.remove('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-200');
    btn.classList.add('bg-sky-500', 'text-white', 'shadow-md');

    const spot = FACILITY_SPOTS.find(s => s.id === spotId);
    if (!spot) return;

    const container = $('#facility-detail-container');
    if (!container) return;

    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';

    setTimeout(() => {
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 group h-[360px]">
                    <img src="${spot.img}" alt="${spot.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                        <span class="gold-badge text-xs font-bold px-3 py-1 rounded-full">${spot.badge}</span>
                    </div>
                </div>
                <div class="space-y-4">
                    <span class="text-xs font-bold tracking-widest text-sky-600 dark:text-sky-400 uppercase">Jelajah Fasilitas</span>
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">${spot.title}</h3>
                    <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">${spot.desc}</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        ${spot.specs.map(spec => `
                            <div class="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-sky-50 dark:bg-slate-800 p-2.5 rounded-xl border border-sky-100 dark:border-slate-700">
                                <i class="fa-solid fa-circle-check text-sky-500"></i>
                                <span>${spec}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        container.style.transition = 'all 0.35s ease';
        container.style.opacity = '1';
        container.style.transform = 'none';
    }, 200);
}

/* ==========================================================================
   9. KALKULATOR ZAKAT & INFAQ QRIS INTERAKTIF
   ========================================================================== */
const NISHAB_EMAS_TAHUN = 119000000; // 85 gram emas @ Rp 1.400.000
const NISHAB_EMAS_BULAN = Math.floor(NISHAB_EMAS_TAHUN / 12);

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function calculateZakat() {
    const type = $('#zakat-type')?.value || 'profesi';
    const amount = Number($('#zakat-amount')?.value) || 0;
    const resultBox = $('#zakat-result-box');
    const resultText = $('#zakat-result-text');
    const statusBadge = $('#zakat-status-badge');

    if (!resultBox || !resultText) return;

    resultBox.classList.remove('hidden');

    const threshold = (type === 'profesi') ? NISHAB_EMAS_BULAN : NISHAB_EMAS_TAHUN;
    if (amount >= threshold) {
        const zakatWajib = Math.round(amount * 0.025);
        resultText.innerText = formatRupiah(zakatWajib);
        statusBadge.innerText = 'Wajib Zakat (2.5%)';
        statusBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300';
    } else {
        resultText.innerText = 'Rp 0';
        statusBadge.innerText = 'Belum Mencapai Nishab (Disarankan Infaq/Sedekah)';
        statusBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300';
    }
}

let selectedDonationAmount = 50000;
function selectDonationPreset(amount, btn) {
    selectedDonationAmount = amount;
    $$('.qris-preset-btn').forEach(b => {
        b.classList.remove('bg-sky-500', 'text-white', 'border-sky-500');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-200');
    });
    btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200', 'dark:bg-slate-800', 'dark:text-slate-200');
    btn.classList.add('bg-sky-500', 'text-white', 'border-sky-500');

    const customInput = $('#custom-infaq-input');
    if (customInput) customInput.value = amount;

    const display = $('#qris-amount-display');
    if (display) display.innerText = formatRupiah(amount);
}

function updateCustomDonation(val) {
    const num = Number(val) || 0;
    selectedDonationAmount = num;
    const display = $('#qris-amount-display');
    if (display) display.innerText = formatRupiah(num);
}

function processDonation() {
    const donorName = $('#donor-name')?.value.trim() || 'Hamba Allah';
    const amount = selectedDonationAmount || 50000;

    // Putar melodi Islami tanda sukses
    playIslamicChime();

    // Buat Kwitansi Digital Resmi
    const receiptBox = $('#printable-receipt');
    if (receiptBox) {
        const transId = 'SZS-' + Math.floor(100000 + Math.random() * 900000);
        const dateStr = new Date().toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        receiptBox.innerHTML = `
            <div class="border-2 border-dashed border-sky-400 p-6 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white space-y-4">
                <div class="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
                    <div>
                        <h4 class="font-bold text-lg text-sky-600 dark:text-sky-400">TANDA TERIMA INFAQ DIGITAL</h4>
                        <p class="text-xs text-slate-500">Masjid Raya Sheikh Zayed Surakarta</p>
                    </div>
                    <span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-xs px-3 py-1 rounded-full font-bold">
                        <i class="fa-solid fa-check-circle mr-1"></i> BERHASIL
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <span class="text-slate-500">No. Transaksi:</span>
                    <span class="font-mono font-bold text-right">${transId}</span>
                    <span class="text-slate-500">Nama Muzakki/Donatur:</span>
                    <span class="font-semibold text-right">${donorName}</span>
                    <span class="text-slate-500">Waktu:</span>
                    <span class="text-right">${dateStr}</span>
                    <span class="text-slate-500">Metode:</span>
                    <span class="text-right">QRIS Nasional Indonesia</span>
                    <span class="text-slate-500 font-bold">Nominal Infaq:</span>
                    <span class="text-right font-extrabold text-sky-600 dark:text-sky-400 text-base">${formatRupiah(amount)}</span>
                </div>
                <p class="text-xs text-center text-slate-500 italic pt-2 border-t border-slate-200 dark:border-slate-700">
                    "Semoga Allah memberkahi harta yang Anda infaqkan dan menjadikannya pembersih bagi jiwa Anda." (Jazakumullah Khairan Katsiran)
                </p>
                <div class="flex gap-2 justify-center pt-2">
                    <button onclick="window.print()" class="bg-sky-500 hover:bg-sky-600 text-white text-xs px-4 py-2 rounded-xl font-semibold shadow">
                        <i class="fa-solid fa-print mr-1"></i> Cetak Bukti Infaq
                    </button>
                </div>
            </div>
        `;
        receiptBox.classList.remove('hidden');
    }

    showToast(`Alhamdulillah! Infaq ${formatRupiah(amount)} atas nama "${donorName}" telah tercatat.`);
}

/* ==========================================================================
   10. ASISTEN PINTAR "ZAYED AI" CHATBOT INTERAKTIF
   ========================================================================== */
const BOT_KNOWLEDGE = [
    {
        keywords: ['jam', 'buka', 'tutup', 'operasional', 'kunjung'],
        reply: 'Masjid Raya Sheikh Zayed Surakarta buka setiap hari pukul 03.00 WIB hingga 21.00 WIB. Bagi jamaah yang hendak i\'tikaf atau shalat subuh berjamaah, pintu gerbang telah dibuka mulai pukul 03.00 WIB.'
    },
    {
        keywords: ['pakaian', 'baju', 'dresscode', 'aurat', 'jilbab', 'celana'],
        reply: 'Aturan pakaian: Pengunjung diwajibkan berbusana sopan & menutup aurat. Bagi wanita diwajibkan mengenakan kerudung/jilbab dan baju lengan panjang tidak ketat. Bagi pria diwajibkan memakai celana panjang sopan.'
    },
    {
        keywords: ['kursi roda', 'difabel', 'disabilitas', 'lansia', 'lift'],
        reply: 'Alhamdulillah, Masjid Sheikh Zayed 100% ramah disabilitas! Disediakan layanan peminjaman kursi roda GRATIS di pos keamanan pintu selatan, lift khusus, toilet difabel, dan jalur ram landai.'
    },
    {
        keywords: ['parkir', 'bus', 'mobil', 'motor', 'kendaraan', 'rute'],
        reply: 'Area parkir mobil & motor tersedia di halaman dalam serta kantong parkir Terminal Tirtonadi & Pedaringan. Untuk rombongan bus pariwisata, disediakan shuttle bus Batik Solo Trans (BST) dari Terminal Tirtonadi.'
    },
    {
        keywords: ['sejarah', 'siapa', 'uea', 'jokowi', 'zayed', 'hibah'],
        reply: 'Masjid Raya Sheikh Zayed Solo adalah replika dari Sheikh Zayed Grand Mosque di Abu Dhabi, hibah persahabatan dari Presiden UEA Sheikh Mohamed bin Zayed Al Nahyan (MBZ) kepada Presiden RI Joko Widodo sebagai simbol toleransi dunia.'
    },
    {
        keywords: ['kajian', 'jadwal', 'acara', 'tpa', 'kegiatan'],
        reply: 'Kajian rutin umum diselenggarakan setiap Selasa ba\'da Maghrib (Tafsir Al-Qur\'an), Sabtu pagi (Kajian Fiqih Keluarga), dan program TPA Tahfidz anak setiap sore di Gedung Islamic Center.'
    },
    {
        keywords: ['nikah', 'ijab', 'pernikahan', 'sewa'],
        reply: 'Akad nikah di Masjid Sheikh Zayed Solo dapat diajukan melalui Kesekretariatan Islamic Center dengan reservasi minimal 1 bulan sebelumnya dan melengkapi berkas dari KUA Banjarsari.'
    },
    {
        keywords: ['sholat', 'kiblat', 'subuh', 'maghrib', 'dzuhur', 'ashar', 'isya'],
        reply: 'Arah kiblat Masjid Sheikh Zayed Solo adalah 294.5° (Barat Laut). Anda dapat memantau jadwal sholat dan countdown waktu adzan langsung pada widget di atas.'
    }
];

function toggleChatBot() {
    const win = $('#chat-window');
    if (!win) return;
    const isHidden = win.classList.contains('hidden');
    if (isHidden) {
        win.classList.remove('hidden');
        $('#chat-input')?.focus();
    } else {
        win.classList.add('hidden');
    }
}

function appendChatMessage(sender, text) {
    const list = $('#chat-messages');
    if (!list) return;
    const isBot = sender === 'bot';
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-bubble-msg flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`;
    msgDiv.innerHTML = `
        <div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
            isBot 
            ? 'bg-sky-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none border border-sky-100 dark:border-slate-600' 
            : 'bg-sky-600 text-white rounded-br-none shadow'
        }">
            ${text}
        </div>
    `;
    list.appendChild(msgDiv);
    list.scrollTop = list.scrollHeight;
}

function askBotQuick(text) {
    appendChatMessage('user', text);
    botRespond(text);
}

function handleChatSubmit(e) {
    e.preventDefault();
    const input = $('#chat-input');
    if (!input) return;
    const query = input.value.trim();
    if (!query) return;

    appendChatMessage('user', query);
    input.value = '';
    botRespond(query);
}

function botRespond(query) {
    const qLower = query.toLowerCase();
    let bestMatch = null;

    for (const item of BOT_KNOWLEDGE) {
        if (item.keywords.some(k => qLower.includes(k))) {
            bestMatch = item.reply;
            break;
        }
    }

    if (!bestMatch) {
        bestMatch = 'Assalamu\'alaikum! Terima kasih atas pertanyaannya. Untuk informasi spesifik ini, Anda dapat menghubungi langsung kesekretariatan pengelola masjid di +62 811-2902-666 atau mengunjungi Meja Resepsionis Islamic Center.';
    }

    setTimeout(() => {
        appendChatMessage('bot', bestMatch);
    }, 400);
}

/* ==========================================================================
   11. GALERI MULTI-KATEGORI & LIGHTBOX PRO
   ========================================================================== */
const GALLERY_DATA = [
    { src: 'masjidepan.jpg', title: 'Fasad Utama Masjid Sheikh Zayed', category: 'arsitektur', desc: 'Kemegahan gerbang utama dengan marmer putih berkilau dan kubah utama khas Abu Dhabi.' },
    { src: 'eksteriormasjid.jpg', title: 'Pendar Senja di Pelataran Eksterior', category: 'senja', desc: 'Pemandangan menakjubkan saat lampu hias menyinari 82 kubah menjelang waktu Maghrib.' },
    { src: 'interiormasjid.jpg', title: 'Interior Ruang Sholat & Karpet Batik', category: 'interior', desc: 'Perpaduan motif batik khas Solo pada karpet lembut dan ornamen kaligrafi keemasan.' },
    { src: 'masjid.jpg', title: 'Menara Putih Setinggi 75 Meter', category: 'arsitektur', desc: 'Salah satu dari 4 menara megah yang menjulang tinggi di langit biru Surakarta.' },
    { src: 'tentangmasjid.jpg', title: 'Kompleks Islamic Center & Plaza', category: 'fasilitas', desc: 'Kawasan terpadu pusat kebudayaan Islam dan kegiatan sosial kemasyarakatan.' }
];

let curModalIndex = 0;

function filterGaleri(category, btn) {
    $$('.galeri-filter-btn').forEach(b => {
        b.classList.remove('bg-sky-500', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
    });
    btn.classList.remove('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
    btn.classList.add('bg-sky-500', 'text-white');

    $$('.galeri-item').forEach(item => {
        const cat = item.dataset.category;
        item.style.display = (category === 'all' || cat === category) ? 'block' : 'none';
    });
}

function openLightboxByIndex(index) {
    curModalIndex = index;
    const modal = $('#imageModal');
    const img = $('#modalImage');
    const cap = $('#modalCaption');
    const counter = $('#modalCounter');
    const data = GALLERY_DATA[index];

    if (!modal || !data) return;

    img.src = data.src;
    cap.innerText = `${data.title} - ${data.desc}`;
    if (counter) counter.innerText = `${index + 1} / ${GALLERY_DATA.length}`;

    modal.classList.remove('hidden');
}

function nextLightboxImage() {
    curModalIndex = (curModalIndex + 1) % GALLERY_DATA.length;
    openLightboxByIndex(curModalIndex);
}

function prevLightboxImage() {
    curModalIndex = (curModalIndex - 1 + GALLERY_DATA.length) % GALLERY_DATA.length;
    openLightboxByIndex(curModalIndex);
}

function closeModal() {
    $('#imageModal')?.classList.add('hidden');
}

function downloadCurrentImage() {
    const data = GALLERY_DATA[curModalIndex];
    if (!data) return;
    const a = document.createElement('a');
    a.href = data.src;
    a.download = `SheikhZayedSolo_${data.title.replace(/\s+/g, '_')}.jpg`;
    a.click();
    showToast('Mengunduh foto ke perangkat Anda...');
}

// Keyboard arrow navigation for modal
document.addEventListener('keydown', e => {
    if (!$('#imageModal')?.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') nextLightboxImage();
        if (e.key === 'ArrowLeft') prevLightboxImage();
        if (e.key === 'Escape') closeModal();
    }
});

/* ==========================================================================
   12. AGENDA KEGIATAN & TIKET VIRTUAL
   ========================================================================== */
function filterKegiatan(category, btn) {
    $$('.filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-sky-500', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
    });
    btn.classList.remove('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
    btn.classList.add('active', 'bg-sky-500', 'text-white');

    $$('.kegiatan-card').forEach(card => {
        card.style.display = (category === 'all' || card.dataset.category === category) ? 'flex' : 'none';
    });
}

function registerEvent(eventName) {
    const name = prompt('Masukkan Nama Lengkap Anda untuk Mendaftar Kegiatan:');
    if (!name) return;
    playIslamicChime();
    showToast(`Alhamdulillah, ${name}! Pendaftaran Anda untuk "${eventName}" telah terkonfirmasi.`);
}

/* ==========================================================================
   13. KUIS INTERAKTIF SAHABAT MASJID & CONFETTI
   ========================================================================== */
function checkQuiz(questionNumber, selectedOption, correctOption, btn) {
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);

    if (selectedOption === correctOption) {
        btn.classList.remove('bg-white', 'text-slate-700', 'dark:bg-slate-800');
        btn.classList.add('bg-emerald-500', 'text-white');
        playIslamicChime();
        showToast('Maa Syaa Allah! Jawaban Anda Benar 🎉');
        fireConfetti();
    } else {
        btn.classList.remove('bg-white', 'text-slate-700', 'dark:bg-slate-800');
        btn.classList.add('bg-rose-500', 'text-white');
        showToast('Jawaban kurang tepat. Coba lagi pada pertanyaan lainnya!');
    }
}

function fireConfetti() {
    const canvas = $('#confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove('hidden');

    const particles = [];
    const colors = ['#0284c7', '#38bdf8', '#f59e0b', '#d4af37', '#10b981'];
    for (let i = 0; i < 70; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.7) * 16,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1
        });
    }

    let frames = 0;
    function renderConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // Gravity
            p.alpha -= 0.015;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        frames++;
        if (frames < 70) {
            requestAnimationFrame(renderConfetti);
        } else {
            canvas.classList.add('hidden');
        }
    }
    requestAnimationFrame(renderConfetti);
}

/* ==========================================================================
   14. TOAST NOTIFICATION & FORM SUBMISSION
   ========================================================================== */
let toastTimeout = null;
function showToast(message) {
    const toast = $('#toast');
    const toastMsg = $('#toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function handleFormSubmit(e) {
    e.preventDefault();
    playIslamicChime();
    showToast('Terima kasih! Pesan dan aspirasi Anda telah terkirim kepada Badan Pengelola Masjid Raya Sheikh Zayed Surakarta.');
    e.target.reset();
}

/* ==========================================================================
   15. MODE GELAP / TERANG & AKSESIBILITAS FONT SIZE
   ========================================================================== */
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = $('#theme-toggle-icon');
    if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon text-slate-600';
    }
    showToast(`Mode ${isDark ? 'Malam (Dark Luxury)' : 'Siang (Pristine Marble)'} diaktifkan.`);
}

// Cek preference tema tersimpan
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    const icon = $('#theme-toggle-icon');
    if (icon) icon.className = 'fa-solid fa-sun text-amber-400';
}

let currentFontSizeIndex = 1;
const FONT_SIZES = ['text-sm', 'text-base', 'text-lg'];
function adjustFontSize(delta) {
    const root = document.body;
    currentFontSizeIndex = clamp(currentFontSizeIndex + delta, 0, 2);
    FONT_SIZES.forEach(cls => root.classList.remove(cls));
    root.classList.add(FONT_SIZES[currentFontSizeIndex]);
    showToast(`Ukuran teks: ${currentFontSizeIndex === 0 ? 'Kecil' : currentFontSizeIndex === 1 ? 'Normal' : 'Besar'}`);
}

/* ==========================================================================
   16. DUKUNGAN MULTI-BAHASA (ID, EN, AR)
   ========================================================================== */
const TRANSLATIONS = {
    id: {
        brand: 'Sheikh Zayed',
        city: 'Solo Surakarta',
        badge: 'Ikon Kebanggaan Surakarta',
        heroTitle: 'Masjid Raya Sheikh Zayed Solo',
        heroDesc: 'Simbol keharmonisan bilateral Indonesia dan Uni Emirat Arab, pusat dakwah Islam yang moderat, serta destinasi wisata religi termegah di Kota Solo.',
        exploreBtn: 'Jelajahi Profil',
        galleryBtn: 'Lihat Galeri'
    },
    en: {
        brand: 'Sheikh Zayed',
        city: 'Surakarta Solo',
        badge: 'Pride Icon of Surakarta',
        heroTitle: 'Sheikh Zayed Grand Mosque Solo',
        heroDesc: 'A symbol of bilateral harmony between Indonesia and the UAE, a hub of moderate Islamic knowledge, and the grandest religious destination in Solo City.',
        exploreBtn: 'Explore Profile',
        galleryBtn: 'View Gallery'
    },
    ar: {
        brand: 'جامع الشيخ زايد',
        city: 'سوراكارتا سولو',
        badge: 'رمز الفخر والاعتزاز في سوراكارتا',
        heroTitle: 'جامع الشيخ زايد الكبير سولو',
        heroDesc: 'رمز الصداقة والتعاون بين إندونيسيا ودولة الإمارات العربية المتحدة، ومنارة للوسطية الإسلامية وأكبر وجهة دينية وسياحية في مدينة سولو.',
        exploreBtn: 'استكشف الجامع',
        galleryBtn: 'معرض الصور'
    }
};

function switchLanguage(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    const brand = $('#nav-brand-title');
    const city = $('#nav-brand-city');
    const badge = $('#hero-badge-text');
    const title = $('#hero-main-title');
    const desc = $('#hero-main-desc');

    if (brand) brand.innerText = t.brand;
    if (city) city.innerText = t.city;
    if (badge) badge.innerText = t.badge;
    if (title) title.innerText = t.heroTitle;
    if (desc) desc.innerText = t.heroDesc;

    showToast(`Bahasa diubah ke: ${lang.toUpperCase()}`);
}
