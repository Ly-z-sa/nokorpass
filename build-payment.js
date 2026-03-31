const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');

const navMatch = index.match(/<nav>[\s\S]*?<\/nav>/);
let nav = navMatch ? navMatch[0] : '';
nav = nav.replace('class="active"', '');
nav = nav.replace('<li><a href="#">Account</a></li>', '<li><a href="account.html">Account</a></li>');
nav = nav.replace('<li><a href="#">Tickets</a></li>', '<li><a href="tickets.html">Tickets</a></li>');

const footerMatch = index.match(/<footer>[\s\S]*?<\/footer>/);
let footer = footerMatch ? footerMatch[0] : '';
footer = footer.replace('<li><a href="#">Privacy Policy</a></li>', '<li><a href="privacy.html">Privacy Policy</a></li>');
footer = footer.replace('<li><a href="#">Terms of Service</a></li>', '<li><a href="terms.html">Terms of Service</a></li>');

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

    /* Success Ticket UI */
    .success-view { display: none; text-align: center; animation: fadeInUp 0.6s ease forwards; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    
    .ticket-outer { 
      background: #fff; color: #000; width: 100%; max-width: 420px; margin: 0 auto 40px; border-radius: 24px; overflow: hidden; position: relative; 
      box-shadow: 0 30px 60px rgba(0,0,0,0.5);
    }
    .ticket-header { background: #000; color: #fff; padding: 24px; text-align: left; display: flex; align-items: center; gap: 12px; }
    .ticket-header img { height: 24px; }
    .ticket-header span { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem; }
    
    .ticket-body { padding: 32px; text-align: left; position: relative; }
    .ticket-movie-title { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; margin-bottom: 20px; line-height: 1.2; text-transform: uppercase; }
    
    .ticket-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .info-item label { display: block; font-size: 0.7rem; text-transform: uppercase; color: #888; font-weight: 700; margin-bottom: 4px; letter-spacing: 0.05em; }
    .info-item span { display: block; font-size: 0.95rem; font-weight: 700; color: #000; }
    
    .ticket-divider { border-top: 2px dashed #ddd; margin: 24px 0; position: relative; }
    .ticket-divider::before, .ticket-divider::after { content: ''; position: absolute; top: -11px; width: 22px; height: 22px; background: var(--black); border-radius: 50%; }
    .ticket-divider::before { left: -43px; }
    .ticket-divider::after { right: -43px; }
    
    .ticket-qr-container { display: flex; flex-direction: column; align-items: center; padding-bottom: 10px; }
    #qrcode { padding: 12px; background: #fff; margin-bottom: 12px; }
    .ticket-id { font-family: 'DM Mono', monospace; font-size: 0.8rem; color: #999; }

    .download-section { display: flex; justify-content: center; gap: 16px; margin-top: 30px; }
    .btn-download { background: var(--accent); color: #fff; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: transform 0.2s; }
    .btn-download:hover { transform: scale(1.05); }
    .btn-home { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid var(--border); padding: 16px 32px; border-radius: 12px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.2s; }
    .btn-home:hover { background: rgba(255,255,255,0.2); }

    .snack-tag { display: inline-block; background: #f0f0f0; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin: 2px; }
`;

const js = `
    import { auth, db } from './firebase-config.js';
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
    
    const movieTitle = qparams.get('movie_title') || (movieLookup ? movieLookup.title : "Cinemart Movie");
    const cinema = qparams.get('cinema') || "SuperShow Cinema";
    const loc = qparams.get('location') || "TK";
    const hall = qparams.get('hall') || "Hall 1";
    const type = qparams.get('type') || "2D";
    const time = qparams.get('time') || "07:00 PM";
    const date = qparams.get('date') || "Today, 31 Mar"; 
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
      document.getElementById('tCinema').textContent = cinema + " (" + loc + ")";
      document.getElementById('tHall').textContent = hall;
      document.getElementById('tFormat').textContent = type;
      document.getElementById('tDateTime').textContent = date + " at " + time;
      document.getElementById('tSeats').textContent = seats;
      document.getElementById('tPrice').textContent = "$" + total;
      document.getElementById('tID').textContent = "Order ID: " + orderId;
      
      const snackContainer = document.getElementById('tSnacks');
      if (snackList.length > 0) {
        snackContainer.innerHTML = snackList.map(s => {
          const [id, qty] = s.split(':');
          return \`<span class="snack-tag">\${qty}x \${snackNames[id] || id}</span>\`;
        }).join('');
      } else {
        document.getElementById('snackInfoItem').style.display = 'none';
      }

      // Generate local QR
      new QRCode(document.getElementById("qrcode"), {
        text: orderId,
        width: 140,
        height: 140,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });

      const qDate = qparams.get('date') || "";
      let numericDate = qDate;
      if (!numericDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
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
`;

const body = `
  <div class="payment-container">
    
    <div id="paymentSelection">
      <div class="payment-title">Checkout for <span>Movie</span></div>
      
      <div class="payment-methods">
        <div class="method-card" data-name="ABA Bank">
          <img src="aba.png" class="method-logo" style="filter:none; opacity:1; border-radius: 8px;">
          <span class="method-name">ABA Pay</span>
        </div>
        <div class="method-card" data-name="KHQR">
          <img src="KHQR_Logo.png" class="method-logo" style="filter:none; opacity:1;">
          <span class="method-name">Bakong KHQR</span>
        </div>
        <div class="method-card" data-name="ACLEDA Pay">
          <img src="acleda.jpg" class="method-logo" style="filter:none; opacity:1; border-radius: 8px;">
          <span class="method-name">ACLEDA Pay</span>
        </div>
        <div class="method-card" data-name="Visa/Mastercard">
          <div style="display:flex; gap:10px; align-items: center;">
            <img src="visa.png" style="height:20px; border-radius: 4px;">
            <img src="mastercard_logo.webp" style="height:32px; border-radius: 4px;">
          </div>
          <span class="method-name" style="margin-top: 10px;">Credit / Debit Card</span>
        </div>
      </div>
      
      <div style="text-align:center; color: var(--muted);">
        Total Amount Due: <strong style="color:var(--white); font-size: 1.5rem;">$\${total_placeholder}</strong>
      </div>
    </div>

    <div id="successView" class="success-view">
      <h2 style="font-family: 'Syne', sans-serif; font-size: 2rem; color: #4ade80; margin-bottom: 30px;">Payment Successful!</h2>
      
      <div id="ticketExport" class="ticket-outer">
        <div class="ticket-header">
          <img src="favicon.png" alt="Cinemart">
          <span>CINEMART</span>
        </div>
        <div class="ticket-body">
          <h3 id="tMovie" class="ticket-movie-title">Loading...</h3>
          
          <div class="ticket-info-grid">
            <div class="info-item"><label>Cinema</label><span id="tCinema">-</span></div>
            <div class="info-item"><label>Hall</label><span id="tHall">-</span></div>
            <div class="info-item"><label>Date & Time</label><span id="tDateTime">-</span></div>
            <div class="info-item"><label>Format</label><span id="tFormat">-</span></div>
            <div class="info-item"><label>Seats</label><span id="tSeats">-</span></div>
            <div class="info-item"><label>Price</label><span id="tPrice">-</span></div>
          </div>
          
          <div id="snackInfoItem" class="info-item" style="margin-bottom: 24px;">
            <label>Snacks</label>
            <div id="tSnacks"></div>
          </div>
          
          <div class="ticket-divider"></div>
          
          <div class="ticket-qr-container">
            <div id="qrcode"></div>
            <span id="tID" class="ticket-id">-</span>
          </div>
        </div>
      </div>

      <div class="download-section">
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
`;

// Helper to inject the total into the body string (since it's dynamic but we need a placeholder first)
const finalBody = body.replace('${total_placeholder}', '<span id="headerTotal">0.00</span>');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Payment — Cinemart</title>
    <link rel="icon" type="image/png" href="favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <script type="module" src="auth-guard.js"></script>
    <script type="module" src="cookie-consent.js"></script>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
            --black: #000000;
            --dark: #0d0d0d;
            --card: #1a1a1a;
            --border: #2a2a2a;
            --text: #ffffff;
            --muted: #b0b0b8;
            --accent: #e8490f;
            --white: #ffffff;
        }
        html { -ms-overflow-style: none; scrollbar-width: none; }
        html::-webkit-scrollbar { display: none; }
        body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--text); line-height: 1.6; overflow-x: hidden; }
        nav { position: sticky; top: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 0 60px; height: 64px; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
        .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.35rem; color: var(--white); letter-spacing: -0.5px; display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo img { height: 28px; width: auto; }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a { text-decoration: none; color: var(--muted); font-size: 0.875rem; font-weight: 500; transition: color 0.2s; }
        
        footer { background: var(--dark); border-top: 1px solid var(--border); padding: 52px 60px 36px; margin-top: 80px; }
        .footer-grid { display: grid; grid-template-columns: 1.2fr 1.5fr auto; gap: 40px; margin-bottom: 48px; }
        .footer-payments h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--white); margin-bottom: 16px; }
        .payment-icons { display: flex; gap: 12px; flex-wrap: wrap; }
        .payment-icons img { height: 36px; width: auto; border-radius: 4px; transition: transform 0.2s; }
        .payment-icons img:hover { transform: translateY(-2px); }
        .footer-links-group { display: flex; gap: 60px; justify-content: flex-end; }
        .footer-brand .logo { font-size: 1.2rem; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
        .footer-brand p { font-size: 0.82rem; color: var(--muted); line-height: 1.65; max-width: 260px; margin-bottom: 20px; }
        .social-links { display: flex; gap: 12px; }
        .social-links a { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--muted); text-decoration: none; font-size: 0.9rem; transition: border-color 0.2s, color 0.2s; }
        .social-links a:hover { border-color: var(--accent); color: var(--accent); }
        .footer-col h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--white); margin-bottom: 16px; }
        .footer-col ul { list-style: none; }
        .footer-col ul li+li { margin-top: 10px; }
        .footer-col ul a { text-decoration: none; font-size: 0.82rem; color: var(--muted); transition: color 0.2s; }
        .footer-col ul a:hover { color: var(--text); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; border-top: 1px solid var(--border); font-size: 0.78rem; color: var(--muted); }
        ${css}
    </style>
</head>
<body>
    ${nav}
    ${finalBody}
    ${footer}

    <script type="module">${js}</script>
</body>
</html>`;

fs.writeFileSync('payment.html', html);
console.log('payment.html built successfully!');
