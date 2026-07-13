const fs = require('fs');
const path = require('path');

/* ─────────────────────────────────────────────
   CSS
   Includes page layout, miniature card ticket styling, and full modal retro ticket styling.
───────────────────────────────────────────── */
const css = `
  /* ── PAGE ── */
  .tickets-container { max-width: 1080px; margin: 60px auto; padding: 0 24px; min-height: 70vh; }
  .tickets-header { margin-bottom: 40px; }
  .tickets-header h1 { font-family: 'Syne', sans-serif; font-size: 2.5rem; font-weight: 800; color: var(--white); margin-bottom: 8px; }
  .tickets-header p { color: var(--muted); font-size: 1rem; }
  .tickets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 24px; }

  /* ── TICKET CARD (list) ── */
  .tkt-card {
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    position: relative;
    background: #fdfbf7;
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .tkt-card:hover { 
    transform: translateY(-8px) scale(1.01); 
    box-shadow: 0 24px 56px rgba(229, 9, 20, 0.2), 0 8px 24px rgba(0,0,0,0.45); 
  }

  /* Miniature Ticket Notches */
  .tkt-card__notch-l, .tkt-card__notch-r {
    position: absolute;
    width: 16px;
    height: 16px;
    background: #000000;
    border-radius: 50%;
    z-index: 5;
    bottom: 47px;
  }
  .tkt-card__notch-l { left: -8px; }
  .tkt-card__notch-r { right: -8px; }

  /* Red Header Strip */
  .tkt-card__top {
    background:
      repeating-linear-gradient(-55deg, transparent, transparent 10px, rgba(0,0,0,0.06) 10px, rgba(0,0,0,0.06) 20px),
      linear-gradient(120deg, #6e0000 0%, #b52020 45%, #e50914 100%);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    border-bottom: 2px dashed rgba(0, 0, 0, 0.15);
  }
  .tkt-card__top-brand {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.72rem;
    color: #fff; letter-spacing: 0.15em; text-transform: uppercase;
  }
  .tkt-card__top-brand::before {
    content: '';
    display: inline-block;
    width: 9px; height: 9px;
    border: 2px solid rgba(255,255,255,0.65);
    border-radius: 2px;
    flex-shrink: 0;
  }
  .tkt-card__top-id { font-family: monospace; font-size: 0.65rem; color: rgba(255,255,255,0.65); letter-spacing: 0.06em; }

  /* Cream Body */
  .tkt-card__body {
    background: #fdfbf7;
    padding: 20px 20px 16px;
    flex-grow: 1;
  }
  .tkt-card__movie {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem; font-weight: 800;
    color: #111; text-transform: uppercase;
    letter-spacing: 0.02em; line-height: 1.25;
    margin-bottom: 14px;
    border-left: 3px solid #e50914;
    padding-left: 10px;
  }
  .tkt-card__info {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px;
  }
  .tkt-card__info-item label {
    display: block; font-size: 0.58rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: #8c857b; font-weight: 700; margin-bottom: 2px;
  }
  .tkt-card__info-item span { font-size: 0.85rem; font-weight: 800; color: #1a1a1a; }

  /* Footer */
  .tkt-card__foot {
    background: #faf6ee;
    padding: 12px 20px;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1.5px dashed #cfc8bc;
  }
  .tkt-card__date { font-size: 0.75rem; color: #8a8377; font-weight: 700; }
  .tkt-card__btn {
    background: linear-gradient(120deg, #c0392b, #e50914);
    border: none; border-radius: 7px;
    color: #fff; font-size: 0.75rem; font-weight: 700;
    padding: 7px 14px; cursor: pointer;
    transition: opacity 0.2s;
    pointer-events: none; /* card handles click */
  }

  /* Empty State */
  .no-tickets {
    grid-column: 1/-1; padding: 80px 40px; text-align: center;
    background: var(--card); border-radius: 20px;
    border: 1px dashed var(--border); color: var(--muted);
  }

  /* ── MODAL OVERLAY ── */
  .tkt-modal {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.92);
    z-index: 3000;
    overflow-y: auto;
    padding: 60px 20px 40px;
    backdrop-filter: blur(16px);
  }
  .tkt-modal.open { display: block; }
  .tkt-modal__inner {
    max-width: 760px;
    margin: 0 auto;
    position: relative;
  }
  .tkt-modal__close {
    position: absolute; top: -45px; right: 0;
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: #fff; font-size: 1.1rem;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    z-index: 10;
  }
  .tkt-modal__close:hover { background: rgba(255,255,255,0.25); border-color: #fff; }

  /* ── PREMIUM RETRO TICKET ── */
  .ticket-outer {
    display: flex;
    flex-direction: row;
    background: #fdfbf7;
    color: #1a1a1a;
    border-radius: 24px;
    position: relative;
    width: 100%;
    max-width: 760px;
    margin: 0 auto 24px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.05);
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }

  /* Circular Corner Notches */
  .notch {
    position: absolute;
    width: 24px;
    height: 24px;
    background: #000000;
    border-radius: 50%;
    z-index: 10;
  }
  .notch-tl { top: -12px; left: -12px; }
  .notch-tr { top: -12px; right: -12px; }
  .notch-bl { bottom: -12px; left: -12px; }
  .notch-br { bottom: -12px; right: -12px; }

  .ticket-main {
    flex: 1.5;
    display: flex;
    flex-direction: column;
    background: #fdfbf7;
  }

  .ticket-main-header {
    background:
      repeating-linear-gradient(-55deg, transparent, transparent 12px, rgba(0,0,0,0.06) 12px, rgba(0,0,0,0.06) 24px),
      linear-gradient(135deg, #6e0000 0%, #a82020 40%, #e50914 100%);
    padding: 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    border-bottom: 2px dashed rgba(0, 0, 0, 0.15);
    position: relative;
  }
  .ticket-main-header .brand {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.9rem;
    letter-spacing: 0.15em;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand-icon-svg {
    flex-shrink: 0;
    opacity: 0.95;
  }
  .ticket-main-header .serial {
    font-family: monospace;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.08em;
    background: rgba(0,0,0,0.15);
    padding: 4px 8px;
    border-radius: 4px;
  }

  .ticket-main-body {
    padding: 28px;
    display: flex;
    flex-direction: column;
    position: relative;
    flex-grow: 1;
  }
  .ticket-watermark {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 130px;
    height: 130px;
    opacity: 0.06;
    pointer-events: none;
    color: #c0392b;
  }

  .ticket-title-row {
    margin-bottom: 24px;
    z-index: 1;
  }
  .ticket-admit-badge {
    display: inline-block;
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #9a6f0a;
    border: 1.5px solid rgba(154, 111, 10, 0.35);
    background: rgba(154, 111, 10, 0.07);
    padding: 4px 12px;
    border-radius: 5px;
    margin-bottom: 12px;
  }
  .ticket-movie-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1.12;
    text-transform: uppercase;
    color: #0d0d0d;
    letter-spacing: -0.02em;
  }

  .ticket-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 24px;
    margin-bottom: 20px;
    z-index: 1;
  }
  .ticket-info-item label {
    display: block;
    font-size: 0.65rem;
    text-transform: uppercase;
    color: #8c857b;
    font-weight: 700;
    margin-bottom: 4px;
    letter-spacing: 0.08em;
  }
  .ticket-info-item span {
    font-size: 0.95rem;
    font-weight: 800;
    color: #1a1a1a;
  }

  .ticket-snacks-section {
    border-top: 1px dashed rgba(0, 0, 0, 0.1);
    padding-top: 16px;
    margin-top: auto;
    z-index: 1;
  }
  .ticket-snacks-section label {
    display: block;
    font-size: 0.65rem;
    text-transform: uppercase;
    color: #8c857b;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: 0.08em;
  }
  .ticket-snacks-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .snack-tag {
    display: inline-block;
    background: rgba(229, 9, 20, 0.08);
    color: #c0392b;
    border: 1px solid rgba(229, 9, 20, 0.15);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 700;
  }

  /* Perforation Separator */
  .ticket-perforation {
    width: 24px;
    background: #fdfbf7;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .perf-line {
    height: 100%;
    width: 0;
    border-left: 2px dashed #cfc8bc;
    margin: 0;
  }
  .perf-circle-top,
  .perf-circle-bottom {
    position: absolute;
    width: 24px;
    height: 24px;
    background: #000000;
    border-radius: 50%;
    z-index: 5;
  }
  .perf-circle-top { top: -12px; }
  .perf-circle-bottom { bottom: -12px; }

  /* Stub */
  .ticket-stub {
    width: 230px;
    background: #faf6ee;
    display: flex;
    flex-direction: column;
    border-left: 1px solid rgba(0, 0, 0, 0.05);
  }
  .ticket-stub-header {
    background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    border-bottom: 2px dashed rgba(0, 0, 0, 0.1);
  }
  .ticket-stub-header .stub-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
  }
  .ticket-stub-header .price {
    font-family: 'Syne', sans-serif;
    font-weight: 850;
    font-size: 1rem;
  }
  .ticket-stub-body {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    gap: 16px;
    text-align: center;
  }
  .stub-movie-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #222;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .stub-qr-wrapper {
    padding: 10px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  .stub-scan-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    color: #8c857b;
    font-weight: 700;
    letter-spacing: 0.12em;
  }
  .stub-serial {
    font-family: monospace;
    font-size: 0.72rem;
    color: #8c857b;
    letter-spacing: 0.05em;
  }

  /* ── DOWNLOAD BTN ── */
  .btn-dl {
    display: block; width: 100%; padding: 16px;
    background: linear-gradient(120deg, #c0392b, #e50914);
    border: none; border-radius: 14px;
    color: #fff; font-family: 'Syne', sans-serif;
    font-size: 1rem; font-weight: 800;
    letter-spacing: 0.04em; cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    margin-top: 16px;
  }
  .btn-dl:hover { opacity: 0.9; transform: translateY(-2px); }

  /* ── RESPONSIVE TICKET FOR MOBILE ── */
  @media (max-width: 768px) {
    .ticket-outer {
      flex-direction: column;
      max-width: 350px;
    }
    .ticket-stub {
      width: 100%;
      border-left: none;
      border-top: 1.5px dashed rgba(0, 0, 0, 0.08);
    }
    .ticket-perforation {
      width: 100%;
      height: 24px;
      flex-direction: row;
    }
    .perf-line {
      width: 100%;
      height: 0;
      border-left: none;
      border-top: 2px dashed #cfc8bc;
    }
    .perf-circle-top {
      left: -12px;
      top: 0;
    }
    .perf-circle-bottom {
      right: -12px;
      bottom: 0;
      top: 0;
    }
    .stub-movie-title {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .tickets-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
`;

/* ─────────────────────────────────────────────
   JS (client-side interactive script)
───────────────────────────────────────────── */
const js = `
  import { auth, db } from './js/firebase-config.js';
  import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
  import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

  const ticketsGrid = document.getElementById('ticketsGrid');
  const tktModal    = document.getElementById('tktModal');
  const allTickets  = [];

  /* ── LOAD ── */
  onAuthStateChanged(auth, async (user) => {
    if (user && user.emailVerified) await loadTickets(user.uid);
  });

  async function loadTickets(uid) {
    try {
      const q  = query(collection(db, "tickets"), where("uid", "==", uid));
      const qs = await getDocs(q);
      let docs = qs.docs.map(d => ({ id: d.id, ...d.data() }));

      const todayStr = new Date().toISOString().split('T')[0];
      docs = docs.filter(t => !t.numericDate || t.numericDate >= todayStr);
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      allTickets.length = 0;
      allTickets.push(...docs);

      if (docs.length === 0) {
        ticketsGrid.innerHTML = \`
          <div class="no-tickets">
            <p>You haven't booked any tickets yet.</p>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
              <a href="movies.html" class="btn-primary" style="text-decoration:none;">Browse Movies</a>
              <a href="events.html" class="btn-primary" style="background:rgba(255,255,255,0.06);border:1px solid var(--border);text-decoration:none;">Browse Events</a>
            </div>
          </div>\`;
        return;
      }

      ticketsGrid.innerHTML = docs.map(t => \`
        <div class="tkt-card" data-id="\${t.id}">
          <div class="tkt-card__notch-l"></div>
          <div class="tkt-card__notch-r"></div>
          <div class="tkt-card__top">
            <span class="tkt-card__top-brand">NOKORPASS TICKET</span>
            <span class="tkt-card__top-id">\${t.orderId}</span>
          </div>
          <div class="tkt-card__body">
            <p class="tkt-card__movie">\${t.movieTitle}</p>
            <div class="tkt-card__info">
              <div class="tkt-card__info-item"><label>Cinema</label><span>\${t.cinema}</span></div>
              <div class="tkt-card__info-item"><label>Time</label><span>\${t.time}</span></div>
              <div class="tkt-card__info-item"><label>Hall</label><span>\${t.hall}</span></div>
              <div class="tkt-card__info-item"><label>Seats</label><span>\${t.seats}</span></div>
            </div>
          </div>
          <div class="tkt-card__foot">
            <span class="tkt-card__date">\${t.date}</span>
            <button class="tkt-card__btn" tabindex="-1">View Ticket →</button>
          </div>
        </div>\`).join('');

    } catch (err) { console.error("Error loading tickets:", err); }
  }

  /* ── EVENT DELEGATION ── */
  ticketsGrid.addEventListener('click', e => {
    const card = e.target.closest('.tkt-card');
    if (card) openModal(card.dataset.id);
  });

  /* ── OPEN MODAL ── */
  const snackNames = {
    'set-a':'Popcorn Set A','set-b':'Popcorn Set B','set-c':'Popcorn Set C',
    'set-d':'Hot Dog Combo','set-e':'Nacho Fiesta','set-f':'Double Refreshment','set-g':'Mega Bucket'
  };

  function openModal(docId) {
    const t = allTickets.find(x => x.id === docId);
    if (!t) return;

    document.getElementById('tMovie').textContent     = t.movieTitle;
    document.getElementById('tMovieStub').textContent = t.movieTitle;
    document.getElementById('tCinema').textContent    = t.cinema + ' (' + t.loc + ')';
    document.getElementById('tHall').textContent      = t.hall;
    document.getElementById('tFormat').textContent    = t.type || '2D';
    document.getElementById('tDateTime').textContent  = t.date + ' at ' + t.time;
    document.getElementById('tSeats').textContent     = t.seats;
    document.getElementById('tPrice').textContent     = '$' + t.total;
    document.getElementById('tOrderId').textContent   = t.orderId;
    document.getElementById('tOrderIdBottom').textContent = t.orderId;

    const snackBox = document.getElementById('tfSnacks');
    if (t.snackList && t.snackList.length > 0) {
      document.getElementById('tfSnackItems').innerHTML = t.snackList.map(s => {
        const [id, qty] = s.split(':');
        return \`<span class="snack-tag">\${qty}x \${snackNames[id] || id}</span>\`;
      }).join('');
      snackBox.style.display = 'block';
    } else {
      snackBox.style.display = 'none';
    }

    document.getElementById('qrcode').innerHTML = '';
    new QRCode(document.getElementById('qrcode'), {
      text: t.orderId, width: 140, height: 140,
      colorDark: '#000000', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });

    tktModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.__currentTicketId = t.orderId;
  }

  /* ── CLOSE ── */
  document.getElementById('tktCloseBtn').addEventListener('click', closeModal);
  tktModal.addEventListener('click', e => { if (e.target === tktModal) closeModal(); });

  function closeModal() {
    tktModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── DOWNLOAD ── */
  document.getElementById('tktDownloadBtn').addEventListener('click', () => {
    const ticket = document.getElementById('ticketExport');
    // Set scale to 3 for crisp exporting
    html2canvas(ticket, { backgroundColor: null, scale: 3, useCORS: true }).then(canvas => {
      const a = document.createElement('a');
      a.download = 'NokorPass-Ticket-' + (window.__currentTicketId || 'ticket') + '.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    });
  });
`;

/* ─────────────────────────────────────────────
   HTML BODY
───────────────────────────────────────────── */
const body = `
  <div class="tickets-container">
    <div class="tickets-header">
      <h1>My Tickets</h1>
      <p>All your bookings in one place. Click a ticket to view or download it.</p>
    </div>
    <div class="tickets-grid" id="ticketsGrid">
      <div style="text-align:center;padding:60px;color:var(--muted);">Loading your tickets…</div>
    </div>
  </div>

  <!-- MODAL -->
  <div id="tktModal" class="tkt-modal">
    <div class="tkt-modal__inner">
      <button id="tktCloseBtn" class="tkt-modal__close" aria-label="Close">&#x2715;</button>

      <div id="ticketExport" class="ticket-outer">
        <!-- Circular corner notches -->
        <div class="notch notch-tl"></div>
        <div class="notch notch-tr"></div>
        <div class="notch notch-bl"></div>
        <div class="notch notch-br"></div>

        <!-- Left Part: Main Ticket -->
        <div class="ticket-main">
          <div class="ticket-main-header">
            <span class="brand">
              <svg class="brand-icon-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
              NOKORPASS
            </span>
            <span class="serial" id="tOrderId">—</span>
          </div>
          <div class="ticket-main-body">
            <!-- Background watermark line art SVG -->
            <svg class="ticket-watermark" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <path d="M35,80 L25,40 L75,40 L65,80 Z" stroke-width="2" />
              <line x1="40" y1="40" x2="45" y2="80" stroke-width="1.5" />
              <line x1="50" y1="40" x2="50" y2="80" stroke-width="1.5" />
              <line x1="60" y1="40" x2="55" y2="80" stroke-width="1.5" />
              <circle cx="30" cy="35" r="6" stroke-width="2" />
              <circle cx="40" cy="30" r="7" stroke-width="2" />
              <circle cx="50" cy="33" r="6" stroke-width="2" />
              <circle cx="60" cy="28" r="8" stroke-width="2" />
              <circle cx="70" cy="36" r="6" stroke-width="2" />
              <rect x="12" y="10" width="22" height="16" rx="2" stroke-width="2" transform="rotate(-15 20 20)" />
              <line x1="12" y1="18" x2="34" y2="12" stroke-width="2" transform="rotate(-15 20 20)" />
            </svg>

            <div class="ticket-title-row">
              <span class="ticket-admit-badge">ADMIT ONE</span>
              <h2 id="tMovie" class="ticket-movie-title">Loading…</h2>
            </div>
            
            <div class="ticket-info-grid">
              <div class="ticket-info-item">
                <label>Cinema</label>
                <span id="tCinema">—</span>
              </div>
              <div class="ticket-info-item">
                <label>Hall</label>
                <span id="tHall">—</span>
              </div>
              <div class="ticket-info-item">
                <label>Date &amp; Time</label>
                <span id="tDateTime">—</span>
              </div>
              <div class="ticket-info-item">
                <label>Format</label>
                <span id="tFormat">—</span>
              </div>
              <div class="ticket-info-item" style="grid-column: span 2;">
                <label>Seats</label>
                <span id="tSeats">—</span>
              </div>
            </div>
            
            <div class="ticket-snacks-section" id="tfSnacks" style="display: none;">
              <label>Snacks &amp; Combo</label>
              <div id="tfSnackItems" class="ticket-snacks-list"></div>
            </div>
          </div>
        </div>

        <!-- Perforation Separator -->
        <div class="ticket-perforation">
          <div class="perf-circle-top"></div>
          <div class="perf-line"></div>
          <div class="perf-circle-bottom"></div>
        </div>

        <!-- Right Part: Stub -->
        <div class="ticket-stub">
          <div class="ticket-stub-header">
            <span class="stub-title">TICKET STUB</span>
            <span id="tPrice" class="price">$0.00</span>
          </div>
          <div class="ticket-stub-body">
            <div id="tMovieStub" class="stub-movie-title">Loading…</div>
            <div class="stub-qr-wrapper">
              <div id="qrcode"></div>
            </div>
            <span class="stub-scan-label">SCAN TO VERIFY</span>
            <span id="tOrderIdBottom" class="stub-serial">—</span>
          </div>
        </div>
      </div>

      <button id="tktDownloadBtn" class="btn-dl">&#8595;&ensp;Download Ticket</button>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
`;

/* ─────────────────────────────────────────────
   ASSEMBLE
───────────────────────────────────────────── */
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tickets — NokorPass</title>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/pages/tickets.css">
  <script type="module" src="js/auth-guard.js"></script>
  <script type="module" src="js/legals-init.js"></script>
</head>
<body>
  <script src="js/global-layout.js"></script>
  ${body}
  <script type="module">
    ${js}
  </script>
</body>
</html>`;

const root = path.resolve(__dirname, '../../');
const pagesDir = path.join(root, 'css', 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

fs.writeFileSync(path.join(root, 'tickets.html'), html, 'utf8');
fs.writeFileSync(path.join(pagesDir, 'tickets.css'), css, 'utf8');

console.log('tickets.html and css/pages/tickets.css built successfully!');
