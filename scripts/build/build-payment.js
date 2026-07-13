const fs = require('fs');
const path = require('path');

const css = `
    .payment-container { max-width: 800px; margin: 0 auto; padding: 60px 20px; min-height: 70vh; }
    .payment-title { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; text-align: center; margin-bottom: 40px; color: var(--white); }
    
    /* Payment Methods */
    .payment-methods { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-bottom: 40px; }
    .method-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
    .method-card:hover { border-color: var(--accent); background: rgba(232, 73, 15, 0.05); transform: translateY(-5px); }
    .method-card i { font-size: 2.5rem; color: var(--muted); }
    .method-card:hover i { color: var(--accent); }
    .method-name { font-weight: 700; color: var(--white); font-size: 1.1rem; }
    .method-logo { height: 40px; width: auto; filter: grayscale(1) invert(1); opacity: 0.7; transition: all 0.3s; }
    .method-card:hover .method-logo { filter: none; opacity: 1; }

    /* Processing UI */
    .processing-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 2000; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
    .spinner { width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 24px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .processing-text { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--white); }

    /* Success view */
    .success-view { display: none; text-align: center; animation: fadeInUp 0.6s ease forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    .download-section { display: flex; flex-direction: column; gap: 12px; align-items: center; max-width: 420px; margin: 30px auto 0; }
    .btn-download { width: 100%; background: linear-gradient(135deg, #e50914, #b20710); color: #fff; border: none; padding: 16px 32px; border-radius: 14px; font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; cursor: pointer; transition: opacity 0.2s, transform 0.2s; letter-spacing: 0.04em; }
    .btn-download:hover { opacity: 0.9; transform: translateY(-2px); }
    .btn-home { width: 100%; background: rgba(255,255,255,0.08); color: #fff; border: 1px solid var(--border); padding: 14px 32px; border-radius: 14px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.2s; text-align: center; box-sizing: border-box; }
    .btn-home:hover { background: rgba(255,255,255,0.15); }

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
      margin: 0 auto;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
      text-align: left; /* reset page alignment */
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
      
      .download-section {
        flex-direction: column;
        align-items: stretch;
      }
      .btn-download, .btn-home {
        width: 100%;
        justify-content: center;
        text-align: center;
      }
    }
`;

const js = `
    import { auth, db } from './js/firebase-config.js';
    import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

    const qparams = new URLSearchParams(window.location.search);
    
    // Movie Data for lookup if title is missing
    const moviesData = [
      { id: 1, title: "Avatar: Fire and Ash" },
      { id: 2, title: "Zootopia 2" },
      { id: 3, title: "Project Hail Mary" },
      { id: 4, title: "Hoppers" },
      { id: 5, title: "GOAT" },
      { id: 6, title: "Crime 101" },
      { id: 7, title: "Peaky Blinders: The Immortal Man" },
      { id: 8, title: "Scream 7" }
    ];

    const movieId = parseInt(qparams.get('id'));
    const movieLookup = moviesData.find(m => m.id === movieId);
    
    const movieTitle = qparams.get('movie_title') || (movieLookup ? movieLookup.title : "NokorPass Movie");
    const cinema = qparams.get('cinema') || "SuperShow Cinema";
    const loc = qparams.get('location') || "TK";
    const hall = qparams.get('hall') || "Hall 1";
    const type = qparams.get('type') || "2D";
    const time = qparams.get('time') || "07:00 PM";
    const rawDate = qparams.get('date') || '';
    const date = (rawDate && !rawDate.startsWith('Today')) ? rawDate : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const seats = qparams.get('seats') || "E1, E2";
    const total = qparams.get('final_total') || qparams.get('ticket_total') || "0.00";
    const snacksRaw = qparams.get('snacks') || "";
    const snackList = snacksRaw ? snacksRaw.split(',') : [];

    const orderId = "TKT-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const snackNames = {
      'set-a': 'Popcorn Set A', 'set-b': 'Popcorn Set B', 'set-c': 'Popcorn Set C',
      'set-d': 'Hot Dog Combo', 'set-e': 'Nacho Fiesta', 'set-f': 'Double Refreshment', 'set-g': 'Mega Bucket'
    };

    window.startPayment = (method) => {
      document.getElementById('processingOverlay').style.display = 'flex';
      const pText = document.querySelector('.processing-text');
      pText.textContent = "Connecting to " + method + "...";
      
      setTimeout(() => {
        pText.textContent = "Verifying Payment...";
        setTimeout(() => {
          showSuccess();
        }, 1500);
      }, 1000);
    }

    async function showSuccess() {
      document.getElementById('processingOverlay').style.display = 'none';
      document.getElementById('paymentSelection').style.display = 'none';
      document.getElementById('successView').style.display = 'block';
      
      // Populate Ticket UI
      document.getElementById('tMovie').textContent = movieTitle;
      document.getElementById('tMovieStub').textContent = movieTitle;
      document.getElementById('tCinema').textContent = cinema + " (" + loc + ")";
      document.getElementById('tHall').textContent = hall;
      document.getElementById('tFormat').textContent = type;
      document.getElementById('tDateTime').textContent = date + " at " + time;
      document.getElementById('tSeats').textContent = seats;
      document.getElementById('tPrice').textContent = "$" + total;
      document.getElementById('tOrderId').textContent = orderId;
      document.getElementById('tOrderIdBottom').textContent = orderId;
      
      const snackContainer = document.getElementById('tSnacks');
      const snackBox = document.getElementById('tfSnacks');
      if (snackList.length > 0) {
        snackContainer.innerHTML = snackList.map(s => {
          const [id, qty] = s.split(':');
          return \`<span class="snack-tag">\${qty}x \${snackNames[id] || id}</span>\`;
        }).join('');
        snackBox.style.display = 'block';
      } else {
        snackBox.style.display = 'none';
      }

      // Generate local QR
      new QRCode(document.getElementById("qrcode"), {
        text: orderId, width: 140, height: 140,
        colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H
      });

      window.currentOrderId = orderId;

      const qDate = qparams.get('date') || "";
      let numericDate = qDate;
      const parts = numericDate.split('-');
      if (parts.length !== 3 || parts[0].length !== 4 || isNaN(Number(parts[0])) || isNaN(Number(parts[1])) || isNaN(Number(parts[2]))) {
        numericDate = new Date().toISOString().split('T')[0];
      }

      // 🔥 SAVE TO FIRESTORE 🔥
      try {
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, "tickets"), {
            uid: user.uid,
            orderId, movieTitle, cinema, loc, hall, type, time, date, numericDate, seats, total, snackList,
            createdAt: serverTimestamp()
          });
          console.log("Ticket saved to Firestore!");
        }
      } catch (e) {
        console.error("Error saving ticket: ", e);
      }
    }

    // Header total injection logic for module
    const headerTotal = new URLSearchParams(window.location.search).get('final_total') || '0.00';
    if(document.getElementById('headerTotal')) document.getElementById('headerTotal').textContent = headerTotal;

    // Attach listeners
    document.querySelectorAll('.method-card').forEach(card => {
      card.addEventListener('click', () => startPayment(card.getAttribute('data-name')));
    });

    window.downloadTicket = () => {
      const ticket = document.getElementById('ticketExport');
      html2canvas(ticket, { backgroundColor: null, scale: 3, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'NokorPass-Ticket-' + (window.currentOrderId || 'ticket') + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    };
`;

const body = `
  <div class="payment-container">
    
    <div id="paymentSelection">
      <div class="payment-title">Checkout for <span>Movie</span></div>
      
      <div class="payment-methods">
        <div class="method-card" data-name="ABA Bank">
          <img src="assets/aba.png" class="method-logo" style="filter:none; opacity:1; border-radius: 8px;">
          <span class="method-name">ABA Pay</span>
        </div>
        <div class="method-card" data-name="KHQR">
          <img src="assets/KHQR_Logo.png" class="method-logo" style="filter:none; opacity:1;">
          <span class="method-name">Bakong KHQR</span>
        </div>
        <div class="method-card" data-name="ACLEDA Pay">
          <img src="assets/acleda.jpg" class="method-logo" style="filter:none; opacity:1; border-radius: 8px;">
          <span class="method-name">ACLEDA Pay</span>
        </div>
        <div class="method-card" data-name="Visa/Mastercard">
          <div style="display:flex; gap:10px; align-items: center;">
            <img src="assets/visa.png" style="height:20px; border-radius: 4px;">
            <img src="assets/mastercard_logo.webp" style="height:32px; border-radius: 4px;">
          </div>
          <span class="method-name" style="margin-top: 10px;">Credit / Debit Card</span>
        </div>
      </div>
      
      <div style="text-align:center; color: var(--muted);">
        Total Amount Due: <strong style="color:var(--white); font-size: 1.5rem;">\${total_placeholder}</strong>
      </div>
    </div>

    <div id="successView" class="success-view">
      <h2 style="font-family: 'Syne', sans-serif; font-size: 2rem; color: #4ade80; margin-bottom: 30px;">Payment Successful!</h2>
      
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
              <div id="tSnacks" class="ticket-snacks-list"></div>
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

      <div class="download-section">
        <button onclick="downloadTicket()" class="btn-download">&#8595;&nbsp; Download Ticket</button>
        <a href="index.html" class="btn-home">Return Home</a>
      </div>
    </div>

  </div>

  <div id="processingOverlay" class="processing-overlay">
    <div class="spinner"></div>
    <div class="processing-text">Processing Payment...</div>
  </div>

  <!-- Libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
`;

const finalBody = body.replace('${total_placeholder}', '<span id="headerTotal">0.00</span>');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Payment — NokorPass</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/global.css" />
    <link rel="stylesheet" href="css/pages/payment.css" />
    <script type="module" src="js/auth-guard.js"></script>
    <script type="module" src="js/legals-init.js"></script>
    </head>
<body>
    <script src="js/global-layout.js"></script>
    ${finalBody}

    <script type="module">${js}</script>
</body>
</html>`;

const root = path.resolve(__dirname, '../../');
const pagesDir = path.join(root, 'css', 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

fs.writeFileSync(path.join(root, 'payment.html'), html, 'utf8');
fs.writeFileSync(path.join(pagesDir, 'payment.css'), css, 'utf8');

console.log('payment.html and css/pages/payment.css built successfully!');
