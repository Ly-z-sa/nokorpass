const fs = require('fs');
const path = require('path');


const authGuard = `
<script>
  if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';
  }
</script>
`;

const css = `
    .snacks-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 20px;
    }

    .snacks-header {
      text-align: center;
      margin-bottom: 50px;
    }

    .snacks-header h1 {
      font-family: 'Syne', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--white);
      margin-bottom: 10px;
    }

    .snacks-header p {
      color: var(--muted);
      font-size: 1.1rem;
    }

    .snacks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 32px;
      margin-bottom: 60px;
    }

    .snack-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      transition: transform 0.3s ease, border-color 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .snack-card:hover {
      transform: translateY(-10px);
      border-color: var(--accent);
    }

    .snack-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-bottom: 1px solid var(--border);
    }

    .snack-info {
      padding: 24px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .snack-name {
      font-family: 'Syne', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 8px;
    }

    .snack-desc {
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 16px;
      flex-grow: 1;
    }

    .snack-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    .snack-price {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--accent);
    }

    .quantity-control {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.05);
      padding: 4px 8px;
      border-radius: 30px;
      border: 1px solid var(--border);
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: var(--white);
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .qty-btn:hover {
      background: var(--accent);
    }

    .qty-num {
      font-weight: 700;
      min-width: 20px;
      text-align: center;
    }

    /* Checkout Bar */
    .booking-footer {
      position: sticky;
      bottom: 0;
      background: rgba(0,0,0,0.95);
      backdrop-filter: blur(14px);
      border-top: 1px solid var(--border);
      padding: 24px 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000;
    }

    .booking-summary {
      display: flex;
      flex-direction: column;
    }

    .summary-label {
      color: var(--muted);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }

    .summary-total {
      font-family: 'Syne', sans-serif;
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--white);
    }

    .summary-total span {
      font-size: 1.1rem;
      color: var(--muted);
      font-weight: 500;
      margin-left: 8px;
    }

    .action-btns {
      display: flex;
      gap: 20px;
    }

    .btn-skip {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 14px 28px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-skip:hover {
      color: var(--white);
      border-color: var(--white);
    }

    .btn-confirm {
      background: var(--accent);
      color: var(--white);
      border: none;
      padding: 14px 40px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 20px rgba(232, 73, 15, 0.3);
    }

    .btn-confirm:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(232, 73, 15, 0.5);
    }

    @media (max-width: 768px) {
      .booking-footer {
        flex-direction: column;
        gap: 20px;
        padding: 24px 20px;
        text-align: center;
      }
      .action-btns {
        width: 100%;
        flex-direction: column-reverse;
      }
      .btn-skip, .btn-confirm {
        width: 100%;
      }
    }
`;

const js = `
    const snackData = [
      { id: 'set-a', name: 'Caramel Popcorn Set A', desc: 'Large Caramel Popcorn + 2 Medium Cokes', price: 7.50, img: 'assets/snack-popcorn.png' },
      { id: 'set-b', name: 'Sweet Popcorn Set B', desc: 'Large Sweet Popcorn + 2 Medium Cokes', price: 7.50, img: 'assets/snack-popcorn.png' },
      { id: 'set-c', name: 'Mixed Popcorn Set C', desc: 'Large Mixed Popcorn + 2 Large Cokes', price: 9.00, img: 'assets/snack-popcorn.png' },
      { id: 'set-d', name: 'Hot Dog Combo', desc: 'Premium Hot Dog + 1 Medium Coke', price: 5.00, img: 'assets/snack-hotdog.png' },
      { id: 'set-e', name: 'Nacho Fiesta', desc: 'Crispy Tortilla Chips + Cheese Sauce + 1 Medium Coke', price: 5.50, img: 'assets/snack-nachos.png' },
      { id: 'set-f', name: 'Double Refreshment', desc: '2 Large Drinks of your choice', price: 4.00, img: 'assets/snack-refreshment.png' },
      { id: 'set-g', name: 'Mega Bucket', desc: 'Extra Large Popcorn Bucket for the real movie lovers', price: 10.00, img: 'assets/snack-popcorn.png' }
    ];

    let queryParams = new URLSearchParams(window.location.search);
    let ticketTotal = parseFloat(queryParams.get('ticket_total')) || 0;
    let selectedSnacks = {}; // { snackId: quantity }

    function renderSnacks() {
      const grid = document.getElementById('snacksGrid');
      grid.innerHTML = snackData.map(snack => \`
        <div class="snack-card">
          <img src="\${snack.img}" alt="\${snack.name}" class="snack-image">
          <div class="snack-info">
            <h3 class="snack-name">\${snack.name}</h3>
            <p class="snack-desc">\${snack.desc}</p>
            <div class="snack-footer">
              <span class="snack-price">$\${snack.price.toFixed(2)}</span>
              <div class="quantity-control">
                <button class="qty-btn" onclick="updateQty('\${snack.id}', -1)">−</button>
                <span class="qty-num" id="qty-\${snack.id}">0</span>
                <button class="qty-btn" onclick="updateQty('\${snack.id}', 1)">+</button>
              </div>
            </div>
          </div>
        </div>
      \`).join('');
    }

    window.updateQty = function(id, delta) {
      if (!selectedSnacks[id]) selectedSnacks[id] = 0;
      selectedSnacks[id] = Math.max(0, selectedSnacks[id] + delta);
      document.getElementById(\`qty-\${id}\`).textContent = selectedSnacks[id];
      updateTotal();
    };

    function updateTotal() {
      let snackTotal = 0;
      snackData.forEach(s => {
        snackTotal += (selectedSnacks[s.id] || 0) * s.price;
      });
      
      const total = ticketTotal + snackTotal;
      document.getElementById('grandTotal').textContent = total.toFixed(2);
      
      if (snackTotal > 0) {
        document.getElementById('snackExtra').textContent = \` (Including $\${snackTotal.toFixed(2)} Snacks)\`;
      } else {
        document.getElementById('snackExtra').textContent = '';
      }
    }

    document.getElementById('btnSkip').addEventListener('click', () => {
      window.location.href = 'payment.html?' + queryParams.toString();
    });

    document.getElementById('btnConfirm').addEventListener('click', () => {
      // Append snacks to query
      const snackParams = Object.entries(selectedSnacks)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => \`\${id}:\${qty}\`)
        .join(',');
      
      if (snackParams) queryParams.set('snacks', snackParams);
      
      let finalTotal = ticketTotal;
      snackData.forEach(s => { finalTotal += (selectedSnacks[s.id] || 0) * s.price; });
      queryParams.set('final_total', finalTotal.toFixed(2));
      
      window.location.href = 'payment.html?' + queryParams.toString();
    });

    // Initialize
    document.getElementById('grandTotal').textContent = ticketTotal.toFixed(2);
    renderSnacks();
`;

const body = `
  <div class="snacks-container">
    <div class="snacks-header">
      <h1>Crave something more?</h1>
      <p>Pre-order your favorite snacks now and skip the queue at the cinema.</p>
    </div>

    <div class="snacks-grid" id="snacksGrid">
      <!-- Dynamic snacks -->
    </div>
  </div>

  <div class="booking-footer">
    <div class="booking-summary">
      <span class="summary-label">Estimated Total</span>
      <div class="summary-total">$<span id="grandTotal">0.00</span><span id="snackExtra"></span></div>
    </div>
    <div class="action-btns">
      <button class="btn-skip" id="btnSkip">Skip Add-ons</button>
      <button class="btn-confirm" id="btnConfirm">Continue to Payment</button>
    </div>
  </div>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snack Add-ons — NokorPass</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/global.css" />
    <link rel="stylesheet" href="css/pages/snacks.css" />
    <script type="module" src="js/auth-guard.js"></script>
    <script type="module" src="js/legals-init.js"></script>
    </head>
<body>
    <script src="js/global-layout.js"></script>
    ${body}

    <script>${js}</script>
</body>
</html>`;

fs.writeFileSync(path.resolve(__dirname, '../../snacks.html'), html);
console.log('snacks.html built successfully!');
