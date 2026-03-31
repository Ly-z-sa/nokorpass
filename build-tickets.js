const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');

const navMatch = index.match(/<nav>[\s\S]*?<\/nav>/);
let nav = navMatch ? navMatch[0] : '';
nav = nav.replace('<li><a href="#">Account</a></li>', '<li><a href="account.html">Account</a></li>');
nav = nav.replace('<li><a href="#">Tickets<\/a><\/li>', '<li><a href="tickets.html" class="active">Tickets<\/a><\/li>');

const footerMatch = index.match(/<footer>[\s\S]*?<\/footer>/);
let footer = footerMatch ? footerMatch[0] : '';
footer = footer.replace('<li><a href="#">Privacy Policy</a></li>', '<li><a href="privacy.html">Privacy Policy</a></li>');
footer = footer.replace('<li><a href="#">Terms of Service</a></li>', '<li><a href="terms.html">Terms of Service</a></li>');

const css = `
    .tickets-container { max-width: 1000px; margin: 60px auto; padding: 0 20px; min-height: 70vh; }
    .tickets-header { margin-bottom: 40px; }
    .tickets-header h1 { font-family: 'Syne', sans-serif; font-size: 2.5rem; font-weight: 800; color: var(--white); margin-bottom: 8px; }
    .tickets-header p { color: var(--muted); font-size: 1.1rem; }

    .tickets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
    
    .ticket-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s ease; }
    .ticket-card:hover { transform: translateY(-5px); border-color: var(--accent); }
    
    .ticket-card-header { padding: 20px; background: rgba(255,255,255,0.02); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
    .ticket-date { font-size: 0.8rem; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; }
    .ticket-id-sm { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--muted); }

    .ticket-card-body { padding: 24px; flex-grow: 1; }
    .ticket-card-title { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--white); margin-bottom: 12px; }
    .ticket-card-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.85rem; color: var(--muted); }
    .meta-val { color: var(--white); font-weight: 600; display: block; margin-top: 2px; }

    .ticket-card-footer { padding: 20px; background: rgba(255,255,255,0.02); border-top: 1px dashed var(--border); text-align: center; }
    .btn-view { display: block; width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 10px; color: var(--white); font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none;}
    .btn-view:hover { background: var(--accent); border-color: var(--accent); }

    .no-tickets { grid-column: 1 / -1; padding: 100px 40px; text-align: center; background: var(--card); border-radius: 24px; border: 1px dashed var(--border); }
    .no-tickets i { font-size: 4rem; color: var(--border); margin-bottom: 20px; display: block; }

    /* Modal for Full Ticket */
    .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 3000; padding: 40px 20px; overflow-y: auto; backdrop-filter: blur(8px); }
    .modal-content { max-width: 420px; margin: 0 auto; position: relative; }
    .modal-close { position: absolute; top: -50px; right: 0; font-size: 2rem; color: #fff; cursor: pointer; }

    /* Reuse ticket styles from payment */
    .ticket-outer { background: #fff; color: #000; width: 100%; border-radius: 24px; overflow: hidden; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.5); margin-bottom: 30px;}
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
    .snack-tag { display: inline-block; background: #f0f0f0; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin: 2px; }
`;

const js = `
    import { auth, db } from './firebase-config.js';
    import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
    import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

    const ticketsGrid = document.getElementById('ticketsGrid');
    const ticketModal = document.getElementById('ticketModal');

    onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        loadTickets(user.uid);
      }
    });

    async function loadTickets(uid) {
      try {
        const q = query(collection(db, "tickets"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        
        let docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // --- 🕒 AUTOMATED TICKET EXPIRY FILTER ---
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        
        // Only keep tickets that are today or in the future
        docs = docs.filter(t => {
          if (!t.numericDate) return true; // Keep old tickets without numericDate for now or remove if strictly cleaned
          return t.numericDate >= todayStr;
        });

        // Sort in JS to avoid needing a Composite Index
        docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        if (docs.length === 0) {
          ticketsGrid.innerHTML = \`
            <div class="no-tickets">
              <p>You haven't booked any tickets yet. Time for a movie?</p>
              <a href="movies.html" class="btn-primary" style="margin-top: 24px; display:inline-block; text-decoration:none;">Browse Movies</a>
            </div>
          \`;
          return;
        }

        let html = '';
        docs.forEach((t) => {
          html += \`
            <div class="ticket-card">
              <div class="ticket-card-header">
                <span class="ticket-date">\${t.date}</span>
                <span class="ticket-id-sm">\${t.orderId}</span>
              </div>
              <div class="ticket-card-body">
                <h3 class="ticket-card-title">\${t.movieTitle}</h3>
                <div class="ticket-card-meta">
                  <div><label style="font-size: 0.7rem; text-transform: uppercase;">Cinema</label><span class="meta-val">\${t.cinema}</span></div>
                  <div><label style="font-size: 0.7rem; text-transform: uppercase;">Time</label><span class="meta-val">\${t.time}</span></div>
                  <div><label style="font-size: 0.7rem; text-transform: uppercase;">Hall</label><span class="meta-val">\${t.hall}</span></div>
                  <div><label style="font-size: 0.7rem; text-transform: uppercase;">Seats</label><span class="meta-val">\${t.seats}</span></div>
                </div>
              </div>
              <div class="ticket-card-footer">
                <button class="btn-view" onclick="openTicketModal('\${t.id}')">View Full Ticket</button>
              </div>
            </div>
          \`;
        });
        ticketsGrid.innerHTML = html;
        window.allTickets = docs;
      } catch (err) {
        console.error("Error loading tickets:", err);
      }
    }

    const snackNames = {
      'set-a': 'Popcorn Set A', 'set-b': 'Popcorn Set B', 'set-c': 'Popcorn Set C',
      'set-d': 'Hot Dog Combo', 'set-e': 'Nacho Fiesta', 'set-f': 'Double Refreshment', 'set-g': 'Mega Bucket'
    };

    window.openTicketModal = (docId) => {
      const t = window.allTickets.find(x => x.id === docId);
      if (!t) return;

      document.getElementById('tMovie').textContent = t.movieTitle;
      document.getElementById('tCinema').textContent = t.cinema + " (" + t.loc + ")";
      document.getElementById('tHall').textContent = t.hall;
      document.getElementById('tFormat').textContent = t.type;
      document.getElementById('tDateTime').textContent = t.date + " at " + t.time;
      document.getElementById('tSeats').textContent = t.seats;
      document.getElementById('tPrice').textContent = "$" + t.total;
      document.getElementById('tID').textContent = "Order ID: " + t.orderId;

      const snackContainer = document.getElementById('tSnacks');
      if (t.snackList && t.snackList.length > 0) {
        snackContainer.innerHTML = t.snackList.map(s => {
          const [id, qty] = s.split(':');
          return \`<span class="snack-tag">\${qty}x \${snackNames[id] || id}</span>\`;
        }).join('');
        document.getElementById('snackInfoItem').style.display = 'block';
      } else {
        document.getElementById('snackInfoItem').style.display = 'none';
      }

      document.getElementById('qrcode').innerHTML = '';
      new QRCode(document.getElementById("qrcode"), {
        text: t.orderId, width: 140, height: 140, colorDark : "#000000", colorLight : "#ffffff", correctLevel : QRCode.CorrectLevel.H
      });

      ticketModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // Update download btn with current order ID
      window.currentTicketId = t.orderId;
    };

    window.closeModal = () => {
      ticketModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    };

    window.downloadTicket = () => {
      const ticket = document.getElementById('ticketExport');
      html2canvas(ticket, { backgroundColor: '#000', scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Cinemart-Ticket-' + window.currentTicketId + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
`;

const body = `
  <div class="tickets-container">
    <div class="tickets-header">
      <h1>My Tickets</h1>
      <p>Access all your bookings and digital tickets here.</p>
    </div>
    
    <div class="tickets-grid" id="ticketsGrid">
      <div class="loading" style="text-align: center; padding: 40px; color: var(--muted);">Loading your tickets...</div>
    </div>
  </div>

  <div id="ticketModal" class="modal">
    <div class="modal-content">
      <span class="modal-close" onclick="closeModal()">&times;</span>
      
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

      <div style="text-align:center;">
        <button onclick="downloadTicket()" class="btn-primary" style="width:100%; font-weight:700; padding:16px;">Download Ticket (PNG)</button>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Tickets — Cinemart</title>
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
        .nav-links a:hover, .nav-links a.active { color: var(--white); }
        .btn-primary { background: var(--accent); color: white; border: none; padding: 12px 28px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        
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
    ${body}
    ${footer}

    <script type="module">
      ${js}
    </script>
</body>
</html>`;

fs.writeFileSync('tickets.html', html);
console.log('tickets.html built successfully!');
