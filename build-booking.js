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
    .screen-indicator { text-align: center; margin-bottom: 80px; position: relative; }
    .screen-curve { height: 48px; width: 100%; max-width: 600px; margin: 0 auto; border-top: 4px solid rgba(220, 38, 38, 0.8); border-radius: 50% 50% 0 0 / 100% 100% 0 0; box-shadow: 0 -15px 40px -10px rgba(220, 38, 38, 0.5); margin-bottom: 20px; }
    .screen-text { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; letter-spacing: 0.1em; color: var(--white); }

    .seat-map { display: flex; flex-direction: column; gap: 20px; align-items: center; max-width: 1000px; margin: 0 auto; }
    
    .seat-row { display: flex; align-items: center; gap: 40px; }
    .seat-row.standard { gap: 24px; }
    .seat-group { display: flex; gap: 12px; }
    .seat-group.standard { gap: 8px; }

    .row-label { width: 24px; text-align: center; font-weight: 600; color: var(--white); font-size: 0.95rem; }

    /* Base Seat Graphics */
    .seat { position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 700; transition: transform 0.2s, background-color 0.2s; }
    .seat:not(.taken):not(.legend-seat):hover { transform: scale(1.08); }

    /* Premium Seat Size */
    .seat.premium { width: 44px; height: 48px; font-size: 0.85rem; }
    .seat.premium .seat-number { margin-top: -6px; }

    /* Standard Seat Size */
    .seat.standard { width: 34px; height: 38px; font-size: 0.75rem; }
    .seat.standard .seat-number { margin-top: -4px; }

    .seat-back { position: absolute; top: 0; left: 10%; width: 80%; height: 65%; border: 2px solid var(--seat-color, #555); border-bottom: none; border-radius: 8px 8px 0 0; box-sizing: border-box; transition: all 0.2s; }
    .seat-base { position: absolute; bottom: 12%; left: 0; width: 100%; height: 35%; border: 2px solid var(--seat-color, #555); border-radius: 4px 4px 8px 8px; box-sizing: border-box; transition: all 0.2s; }
    .seat-number { position: relative; z-index: 10; color: var(--seat-color, #555); transition: color 0.2s; }

    /* Modifiers */
    .seat.gold { --seat-color: #f5a623; }
    .seat.gold.selected .seat-back, .seat.gold.selected .seat-base { background-color: rgba(245, 166, 35, 0.4); }

    .seat.blue { --seat-color: #3b82f6; }
    .seat.blue.selected .seat-back, .seat.blue.selected .seat-base { background-color: rgba(59, 130, 246, 0.4); }

    /* TAKEN SEAT UI OVERHAUL */
    .seat.taken {
      --seat-color: #222;
      cursor: not-allowed;
      opacity: 0.8;
    }
    .seat.taken .seat-back, .seat.taken .seat-base {
      background-color: #222;
      border-color: #333;
    }
    .seat.taken .seat-number {
      display: none;
    }
    .seat.taken::after {
      content: '✕';
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #777;
      font-size: 1.1rem;
      font-weight: 900;
      z-index: 20;
    }
    .seat.standard.taken::after { font-size: 0.9rem; }

    .checkout-btn:not([disabled]):hover { background: #d43a00; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(232, 73, 15, 0.4); }
`;

const js = `
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

    let basePrice = 8.00;
    let formatType = 'premium'; // premium or standard
    let selectedSeats = [];

    function generateSeatMap() {
      const container = document.getElementById('seatMap');
      const legendContainer = document.getElementById('seatLegend');
      let html = '';

      if (formatType === 'premium') {
        const rows = ['E', 'D', 'C', 'B', 'A']; 
        rows.forEach(row => {
          html += \`<div class="seat-row premium">\`;
          html += \`<div class="row-label">\${row}</div>\`; 
          
          // Left (2)
          html += \`<div class="seat-group premium">\`;
          for(let i=1; i<=2; i++) {
            const taken = Math.random() < 0.2 ? 'taken' : '';
            html += \`<div class="seat premium gold \${taken}" data-id="\${row}\${i}">
              <div class="seat-back"></div><div class="seat-base"></div><span class="seat-number">\${i}</span>
            </div>\`;
          }
          html += \`</div>\`;
          // Middle (2)
          html += \`<div class="seat-group premium">\`;
          for(let i=3; i<=4; i++) {
            const taken = Math.random() < 0.2 ? 'taken' : '';
            html += \`<div class="seat premium gold \${taken}" data-id="\${row}\${i}">
              <div class="seat-back"></div><div class="seat-base"></div><span class="seat-number">\${i}</span>
            </div>\`;
          }
          html += \`</div>\`;
          // Right (2)
          html += \`<div class="seat-group premium">\`;
          for(let i=5; i<=6; i++) {
            const taken = Math.random() < 0.2 ? 'taken' : '';
            html += \`<div class="seat premium gold \${taken}" data-id="\${row}\${i}">
              <div class="seat-back"></div><div class="seat-base"></div><span class="seat-number">\${i}</span>
            </div>\`;
          }
          html += \`</div>\`;
          
          html += \`<div class="row-label">\${row}</div></div>\`;
        });
        
        // Premium Legend
        legendContainer.innerHTML = \`<div class="legend-item" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
           <div class="seat premium gold legend-seat"><div class="seat-back"></div><div class="seat-base"></div></div>
           <span style="color: var(--muted); font-size: 0.85rem;">Premium Class<br><strong style="color: var(--white); font-size: 1.1rem;">$\${basePrice.toFixed(2)}</strong></span>
         </div>\`;

      } else {
        const rows = ['J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']; 
        rows.forEach(row => {
          html += \`<div class="seat-row standard">\`;
          html += \`<div class="row-label">\${row}</div>\`; 
          
          // Left (3)
          html += \`<div class="seat-group standard">\`;
          for(let i=1; i<=3; i++) {
            const taken = Math.random() < 0.25 ? 'taken' : '';
            html += \`<div class="seat standard blue \${taken}" data-id="\${row}\${i}">
              <div class="seat-back"></div><div class="seat-base"></div><span class="seat-number">\${i}</span>
            </div>\`;
          }
          html += \`</div>\`;
          // Middle (4)
          html += \`<div class="seat-group standard">\`;
          for(let i=4; i<=7; i++) {
            const taken = Math.random() < 0.25 ? 'taken' : '';
            html += \`<div class="seat standard blue \${taken}" data-id="\${row}\${i}">
              <div class="seat-back"></div><div class="seat-base"></div><span class="seat-number">\${i}</span>
            </div>\`;
          }
          html += \`</div>\`;
          // Right (3)
          html += \`<div class="seat-group standard">\`;
          for(let i=8; i<=10; i++) {
            const taken = Math.random() < 0.25 ? 'taken' : '';
            html += \`<div class="seat standard blue \${taken}" data-id="\${row}\${i}">
              <div class="seat-back"></div><div class="seat-base"></div><span class="seat-number">\${i}</span>
            </div>\`;
          }
          html += \`</div>\`;
          
          html += \`<div class="row-label">\${row}</div></div>\`;
        });

        // Standard Legend
        legendContainer.innerHTML = \`<div class="legend-item" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
           <div class="seat standard blue legend-seat"><div class="seat-back"></div><div class="seat-base"></div></div>
           <span style="color: var(--muted); font-size: 0.85rem;">Standard Class<br><strong style="color: var(--white); font-size: 1.1rem;">$\${basePrice.toFixed(2)}</strong></span>
         </div>\`;
      }

      container.innerHTML = html;

      // Add click listeners
      document.querySelectorAll('.seat:not(.taken):not(.legend-seat)').forEach(seat => {
        seat.addEventListener('click', function() {
          this.classList.toggle('selected');
          const id = this.getAttribute('data-id');
          if (this.classList.contains('selected')) {
            selectedSeats.push(id);
          } else {
            selectedSeats = selectedSeats.filter(s => s !== id);
          }
          updateTotal();
        });
      });
    }

    function updateTotal() {
      const priceElement = document.getElementById('totalPrice');
      const checkoutBtn = document.getElementById('checkoutBtn');
      const total = selectedSeats.length * basePrice;
      priceElement.textContent = total.toFixed(2);
      
      if (selectedSeats.length > 0) {
        checkoutBtn.removeAttribute('disabled');
        checkoutBtn.style.opacity = '1';
        checkoutBtn.textContent = \`Checkout (\${selectedSeats.length} Tickets)\`;
      } else {
        checkoutBtn.setAttribute('disabled', 'true');
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.textContent = \`Checkout Ticket\`;
      }
    }

    function initBooking() {
      const params = new URLSearchParams(window.location.search);
      const movieId = parseInt(params.get('id')) || 1;
      const cinema = params.get('cinema') || 'SuperShow Cinema';
      const loc = params.get('location') || 'TK';
      const type = params.get('type') || '2D';
      const hall = params.get('hall') || '';
      const time = params.get('time') || '07:00 PM';
      const date = params.get('date') || 'Today, 31 Mar';

      // Setup prices
      if (type === '2D' || type === '3D') {
        basePrice = 4.50;
        formatType = 'standard';
      } else {
        basePrice = 8.00;
        formatType = 'premium';
      }

      const movie = moviesData.find(m => m.id === movieId);
      if (movie) {
        document.getElementById('bTitle').textContent = movie.title;
        document.getElementById('bMeta').textContent = \`\${cinema} — \${loc} Branch \${hall ? '| ' + hall : ''}\`;
        document.getElementById('bDetails').textContent = \`\${type} Format | \${date} at \${time}\`;
      } else {
        const title = params.get('movie_title') || "Movie Selection";
        document.getElementById('bTitle').textContent = title;
        document.getElementById('bMeta').textContent = \`\${cinema} — \${loc} Branch \${hall ? '| ' + hall : ''}\`;
        document.getElementById('bDetails').textContent = \`\${type} Format | \${date} at \${time}\`;
      }

      generateSeatMap();
    }

    document.getElementById('checkoutBtn').addEventListener('click', function() {
      const params = new URLSearchParams(window.location.search);
      const movieTitle = document.getElementById('bTitle').textContent;
      const movieDate = params.get('date') || 'Today, 31 Mar';
      
      params.set('movie_title', movieTitle);
      params.set('date', movieDate);
      params.set('seats', selectedSeats.join(','));
      params.set('ticket_total', (selectedSeats.length * basePrice).toFixed(2));
      window.location.href = 'snacks.html?' + params.toString();
    });

    initBooking();
`;

const body = `
  <!-- BOOKING HEADER -->
  <section class="booking-header" style="background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%); padding: 40px 60px; border-bottom: 1px solid var(--border);">
    <div id="bookingInfo" style="max-width: 800px; margin: 0 auto; text-align: center;">
      <h1 id="bTitle" style="font-family: 'Syne', sans-serif; font-size: 2.2rem; color: var(--white); margin-bottom: 8px;">Loading...</h1>
      <p id="bMeta" style="color: var(--accent); font-weight: 600; font-size: 1.1rem; letter-spacing: 0.05em;"></p>
      <p id="bDetails" style="color: var(--muted); margin-top: 8px;"></p>
    </div>
  </section>

  <!-- SEAT MAP -->
  <section class="seat-selection-container" style="padding: 60px; background: radial-gradient(circle at top center, rgba(30,30,30,1) 0%, var(--black) 60%);">
    
    <div class="screen-indicator">
      <div class="screen-curve"></div>
      <span class="screen-text">SCREEN</span>
    </div>

    <div class="seat-map" id="seatMap"></div>
    
    <div class="seat-legend" id="seatLegend" style="margin-top: 60px; display: flex; justify-content: center; text-align: center;"></div>
  </section>

  <!-- CHECKOUT BAR -->
  <section class="booking-footer" style="position: sticky; bottom: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--border); padding: 24px 60px; display: flex; justify-content: space-between; align-items: center; z-index: 100;">
    <div class="booking-total" style="font-family: 'Syne', sans-serif; font-size: 1.5rem; color: var(--white); font-weight: 800;">
      Total: $<span id="totalPrice">0.00</span>
    </div>
    <button class="btn-primary checkout-btn" id="checkoutBtn" disabled style="padding: 16px 40px; font-size: 1.1rem; opacity: 0.5;">Checkout Ticket</button>
  </section>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Seat Selection — Cinemart</title>
  <link rel="icon" type="image/png" href="favicon.png" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
  <script type="module" src="auth-guard.js"></script>
  <script type="module" src="legals-init.js"></script>
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
      --accent2: #f5a623;
      --white: #ffffff;
    }
    html { scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none; }
    ::-webkit-scrollbar { display: none; }
    body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--text); line-height: 1.6; overflow-x: hidden; }
    
    /* Nav */
    nav { position: sticky; top: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 0 60px; height: 64px; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
    .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.35rem; color: var(--white); letter-spacing: -0.5px; display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo img { height: 28px; width: auto; }
    .nav-links { display: flex; gap: 36px; list-style: none; }
    .nav-links a { text-decoration: none; color: var(--muted); font-size: 0.875rem; font-weight: 500; letter-spacing: 0.02em; transition: color 0.2s; }
    .nav-links a:hover, .nav-links a.active { color: var(--white); }
    
    .btn-primary { background: var(--accent); color: white; border: none; padding: 12px 28px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s; }
    
    /* Footer */
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

  <script>
    ${js}
  </script>
</body>
</html>`;

fs.writeFileSync('booking.html', html);
console.log('booking.html updated with dynamic layouts!');
