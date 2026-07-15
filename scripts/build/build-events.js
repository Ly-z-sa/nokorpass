const fs = require('fs');
const path = require('path');

const css = `
  .event-card {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
  }
  .event-card:hover {
    transform: translateY(-8px);
  }
`;

const js = `
  const eventsData = [
    {
      id: 101,
      title: "Coldplay: Music of the Spheres",
      category: "Concert",
      date: "2026-08-15",
      displayDate: "Sat, 15 Aug 2026",
      time: "08:00 PM",
      venue: "National Olympic Stadium",
      location: "Phnom Penh",
      priceFrom: 45.00,
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800",
      description: "Experience the record-breaking Music of the Spheres World Tour live in Phnom Penh. A spectacular night of music, lasers, and fireworks.",
      prices: { VIP: 120.00, Premium: 75.00, Standard: 45.00 }
    },
    {
      id: 102,
      title: "G-Devith: The Homecoming Concert",
      category: "Concert",
      date: "2026-09-05",
      displayDate: "Sat, 05 Sep 2026",
      time: "07:30 PM",
      venue: "Aeon Hall Sen Sok",
      location: "Phnom Penh",
      priceFrom: 35.00,
      image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800",
      description: "Khmer music icon G-Devith returns with an electrifying stadium-scale solo concert featuring his biggest hits and brand new album showcase.",
      prices: { VIP: 90.00, FanZone: 55.00, Standard: 35.00 }
    },
    {
      id: 103,
      title: "Sabay Fest 2026",
      category: "Festival",
      date: "2026-11-14",
      displayDate: "Sat, 14 Nov 2026",
      time: "02:00 PM",
      venue: "Koh Pich Theatre Ground",
      location: "Phnom Penh",
      priceFrom: 25.00,
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
      description: "Celebrate the ultimate fusion of contemporary art, food, and EDM music. A 12-hour continuous celebration of local and international DJ talents.",
      prices: { VIP: 60.00, Standard: 25.00 }
    },
    {
      id: 104,
      title: "Phnom Penh Crown vs Boeung Ket FC",
      category: "Sports",
      date: "2026-07-11",
      displayDate: "Sat, 11 Jul 2026",
      time: "06:00 PM",
      venue: "Smart RSN Stadium",
      location: "Phnom Penh",
      priceFrom: 5.00,
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
      description: "The classic Cambodian football derby! Experience the high-stakes passion as Phnom Penh Crown takes on arch-rivals Boeung Ket FC.",
      prices: { VIP: 15.00, Grandstand: 8.00, General: 5.00 }
    },
    {
      id: 105,
      title: "Khmer Standup Live: The Comedy Club",
      category: "Comedy",
      date: "2026-08-28",
      displayDate: "Fri, 28 Aug 2026",
      time: "08:30 PM",
      venue: "Major Cineplex Hall",
      location: "Phnom Penh",
      priceFrom: 12.00,
      image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=800",
      description: "A night of pure laughter! The finest stand-up comedians in Cambodia gather to deliver hilarious stories, social commentaries, and improvisations.",
      prices: { VIP: 25.00, Standard: 12.00 }
    }
  ];

  let selectedEvent = null;

  function renderEvents(eventsList) {
    const container = document.getElementById('eventsGrid');
    if (eventsList.length === 0) {
      container.innerHTML = \`
        <div class="col-span-full py-16 text-center border border-dashed border-border rounded-3xl bg-card">
          <p class="text-muted mb-4">No events found matching your search.</p>
          <button onclick="resetFilters()" class="btn-ghost">Clear Filters</button>
        </div>
      \`;
      return;
    }

    container.innerHTML = eventsList.map(event => \`
      <div class="event-card bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-accent">
        <div class="relative aspect-video bg-neutral-900 overflow-hidden">
          <img src="\${event.image}" alt="\${event.title}" class="w-full h-full object-cover">
          <span class="absolute top-4 left-4 bg-accent/90 text-white font-bold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
            \${event.category}
          </span>
        </div>
        
        <div class="p-6 flex-grow flex flex-col justify-between">
          <div>
            <span class="text-accent font-bold text-xs tracking-wider uppercase">\${event.displayDate}</span>
            <h3 class="font-display font-bold text-white text-xl mt-1 mb-2 line-clamp-1">\${event.title}</h3>
            <p class="text-muted text-sm line-clamp-2 mb-4">\${event.description}</p>
            
            <div class="space-y-2 mb-6">
              <div class="flex items-center gap-2 text-muted text-xs">
                <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>\${event.venue}</span>
              </div>
              <div class="flex items-center gap-2 text-muted text-xs">
                <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>\${event.time}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span class="text-muted text-[10px] block uppercase tracking-wider">Tickets From</span>
              <span class="text-white font-bold text-lg">$\${event.priceFrom.toFixed(2)}</span>
            </div>
            <button onclick="openBookingModal(\${event.id})" class="btn-primary py-2.5 px-6 rounded-lg text-sm font-semibold">Book Now</button>
          </div>
        </div>
      </div>
    \`).join('');
  }

  function filterEvents() {
    const searchVal = document.getElementById('eventSearch').value.toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active').dataset.category;

    const filtered = eventsData.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchVal) || event.venue.toLowerCase().includes(searchVal);
      const matchesCategory = activeTab === 'all' || event.category.toLowerCase() === activeTab;
      return matchesSearch && matchesCategory;
    });

    renderEvents(filtered);
  }

  function resetFilters() {
    document.getElementById('eventSearch').value = '';
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active', 'bg-accent', 'text-white', 'border-none');
      btn.classList.add('border-border', 'text-muted');
      if (btn.dataset.category === 'all') {
        btn.classList.add('active', 'bg-accent', 'text-white', 'border-none');
      }
    });
    renderEvents(eventsData);
  }

  window.openBookingModal = async (eventId) => {
    // Auth gate — require login before booking
    const { auth } = await import('./js/firebase-config.js');
    const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js');

    onAuthStateChanged(auth, (user) => {
      if (!user || !user.emailVerified) {
        window.location.href = 'auth.html?redirect=' + encodeURIComponent(window.location.href);
        return;
      }

      selectedEvent = eventsData.find(e => e.id === eventId);
      if (!selectedEvent) return;

      document.getElementById('modalTitle').textContent = selectedEvent.title;
      document.getElementById('modalDetails').textContent = \`\${selectedEvent.venue} — \${selectedEvent.displayDate} at \${selectedEvent.time}\`;

      const select = document.getElementById('ticketTier');
      select.innerHTML = Object.entries(selectedEvent.prices).map(([tier, price]) => \`
        <option value="\${tier}" data-price="\${price}">\${tier} Tier — $\${price.toFixed(2)}</option>
      \`).join('');

      document.getElementById('ticketQty').value = 1;
      updateModalPrice();

      const modal = document.getElementById('bookingModal');
      modal.style.display = 'flex';
      modal.style.pointerEvents = 'auto';
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 10);
    });
  };

  window.closeBookingModal = () => {
    const modal = document.getElementById('bookingModal');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    setTimeout(() => {
      modal.style.display = 'none';
      selectedEvent = null;
    }, 300);
  };

  window.updateModalPrice = () => {
    if (!selectedEvent) return;
    const select = document.getElementById('ticketTier');
    const selectedOption = select.options[select.selectedIndex];
    const price = parseFloat(selectedOption.getAttribute('data-price'));
    const qty = parseInt(document.getElementById('ticketQty').value) || 1;

    const total = price * qty;
    document.getElementById('modalTotal').textContent = total.toFixed(2);
  };

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (!selectedEvent) return;
    const select = document.getElementById('ticketTier');
    const selectedOption = select.options[select.selectedIndex];
    const tier = select.value;
    const price = parseFloat(selectedOption.getAttribute('data-price'));
    const qty = parseInt(document.getElementById('ticketQty').value) || 1;
    const total = price * qty;

    const params = new URLSearchParams();
    params.set('id', selectedEvent.id);
    params.set('movie_title', selectedEvent.title);
    params.set('cinema', selectedEvent.venue);
    params.set('location', selectedEvent.location);
    params.set('hall', 'Main Arena');
    params.set('type', tier + ' Class');
    params.set('time', selectedEvent.time);
    params.set('date', selectedEvent.displayDate);
    params.set('seats', tier + ' Zone (' + qty + ' Ticket' + (qty > 1 ? 's' : '') + ')');
    params.set('ticket_total', total.toFixed(2));

    window.location.href = 'payment.html?' + params.toString();
  });

  // Setup UI event listeners
  document.getElementById('eventSearch').addEventListener('input', filterEvents);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active', 'bg-accent', 'text-white', 'border-none');
        b.classList.add('border-border', 'text-muted');
      });
      btn.classList.add('active', 'bg-accent', 'text-white', 'border-none');
      filterEvents();
    });
  });

  // Init
  renderEvents(eventsData);
`;

const eventsContent = `
  <!-- HERO -->
  <section class="relative bg-gradient-to-br from-black via-neutral-900 to-black border-b border-border py-20 px-8 text-center flex flex-col items-center">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,73,15,0.08)_0%,transparent_60%)] pointer-events-none"></div>
    <span class="bg-accent/15 border border-accent/30 text-accent font-bold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
      Expanded Booking
    </span>
    <h1 class="font-display font-extrabold text-white text-4xl md:text-5xl tracking-tight mb-4">
      Live Events & Concerts
    </h1>
    <p class="text-muted text-base max-w-xl md:text-lg mb-0">
      Book official tickets instantly for concerts, local sports matches, comedy clubs, and festivals.
    </p>
  </section>

  <!-- FILTERS & SEARCH -->
  <section class="max-w-6xl mx-auto px-6 py-12">
    <div class="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
      <!-- Tabs -->
      <div class="flex flex-wrap gap-3" id="categoryTabs">
        <button class="tab-btn active bg-accent text-white px-5 py-2.5 rounded-xl border border-transparent font-semibold cursor-pointer text-sm transition-all" data-category="all">All Events</button>
        <button class="tab-btn text-muted border border-border px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm transition-all" data-category="concert">Concerts</button>
        <button class="tab-btn text-muted border border-border px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm transition-all" data-category="festival">Festivals</button>
        <button class="tab-btn text-muted border border-border px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm transition-all" data-category="sports">Sports</button>
        <button class="tab-btn text-muted border border-border px-5 py-2.5 rounded-xl font-semibold cursor-pointer text-sm transition-all" data-category="comedy">Comedy</button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:max-w-xs">
        <input type="text" id="eventSearch" placeholder="Search event or venue..." class="bg-neutral-900 border border-border rounded-xl px-5 py-3 w-full text-white placeholder-muted focus:border-accent outline-none text-sm transition-colors">
      </div>
    </div>

    <!-- EVENTS GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="eventsGrid">
      <div class="col-span-full text-center py-12 text-muted">Loading events...</div>
    </div>
  </section>

  <!-- BOOKING MODAL -->
  <div id="bookingModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 opacity-0" style="display: none; pointer-events: none;">
    <div class="bg-neutral-950 border border-border w-full max-w-lg rounded-3xl p-8 relative shadow-2xl flex flex-col gap-6">
      <button type="button" onclick="closeBookingModal()" class="absolute top-6 right-6 text-muted hover:text-white cursor-pointer transition-colors text-2xl" aria-label="Close modal">
        &times;
      </button>

      <div>
        <span class="text-accent text-xs font-bold uppercase tracking-wider">Book Tickets</span>
        <h2 id="modalTitle" class="font-display font-extrabold text-white text-2xl mt-1 mb-2">Event Title</h2>
        <p id="modalDetails" class="text-muted text-sm">Venue & Date Details</p>
      </div>

      <div class="space-y-4">
        <!-- Ticket Tier Select -->
        <div class="flex flex-col gap-2">
          <label class="text-muted text-xs font-bold uppercase">Select Category</label>
          <select id="ticketTier" onchange="updateModalPrice()" class="bg-neutral-900 border border-border rounded-xl px-4 py-3.5 text-white outline-none w-full text-sm focus:border-accent">
            <!-- Populated via JS -->
          </select>
        </div>

        <!-- Ticket Quantity -->
        <div class="flex flex-col gap-2">
          <label class="text-muted text-xs font-bold uppercase">Quantity</label>
          <input type="number" id="ticketQty" min="1" max="10" value="1" onchange="updateModalPrice()" oninput="updateModalPrice()" class="bg-neutral-900 border border-border rounded-xl px-4 py-3.5 text-white outline-none w-full text-sm focus:border-accent">
        </div>
      </div>

      <div class="flex items-center justify-between py-4 border-t border-border">
        <div>
          <span class="text-muted text-xs uppercase block tracking-wider">Total Price</span>
          <span class="text-white font-display font-extrabold text-3xl">$<span id="modalTotal">0.00</span></span>
        </div>
        <button id="checkoutBtn" class="btn-primary py-4 px-8 rounded-xl font-bold text-sm tracking-wide">Proceed to Checkout</button>
      </div>
    </div>
  </div>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Concerts & Events — NokorPass</title>
  <meta name="robots" content="index, follow" />
  <meta name="description" content="Book tickets for live music concerts, festivals, sports matches, and comedy standups in Cambodia. Safe booking and instant confirmation on NokorPass." />
  <meta name="keywords" content="live events Cambodia, concerts Phnom Penh, EDM festivals Cambodia, sports matches booking, NokorPass events" />
  <meta name="theme-color" content="#e8490f" />
  <link rel="canonical" href="https://nokorpass.store/events.html" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="Live Concerts & Events — NokorPass" />
  <meta property="og:description" content="Book tickets for live music concerts, festivals, sports matches, and comedy standups in Cambodia." />
  <meta property="og:image" content="https://nokorpass.store/assets/spiderman-brandnewday.jpg" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://nokorpass.store/events.html" />
  <meta property="og:site_name" content="NokorPass" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Live Concerts & Events — NokorPass" />
  <meta name="twitter:description" content="Book tickets for live music concerts, festivals, sports matches, and comedy standups in Cambodia." />
  <meta name="twitter:image" content="https://nokorpass.store/assets/spiderman-brandnewday.jpg" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Live Concerts & Events — NokorPass",
    "description": "Book tickets for live music concerts, festivals, sports matches, and comedy standups in Cambodia.",
    "url": "https://nokorpass.store/events.html",
    "isPartOf": { "@type": "WebSite", "name": "NokorPass", "url": "https://nokorpass.store/" }
  }
  </script>
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/global.css" />
  <link rel="stylesheet" href="css/pages/events.css" />
  <script type="module" src="js/legals-init.js"></script>
</head>
<body>
  <script src="js/global-layout.js"></script>

  ${eventsContent}

  <script type="module">
    ${js}
  </script>

  <!--Start of Tawk.to Script-->
  <style>
    .custom-chat-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: var(--accent, #e8490f);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(232, 73, 15, 0.4);
      cursor: pointer;
      z-index: 9999;
      transition: transform 0.2s, background 0.2s, opacity 0.2s;
    }
    .custom-chat-btn:hover {
      transform: scale(1.06);
      background: #f05a24;
    }
    .custom-chat-btn svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }
    .custom-chat-loading {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: custom-chat-spin 0.8s linear infinite;
    }
    @keyframes custom-chat-spin {
      to { transform: rotate(360deg); }
    }
  </style>

  <div id="custom-chat-button" class="custom-chat-btn" title="Chat with support">
    <svg viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
    </svg>
  </div>

  <script type="text/javascript">
    (function() {
      var currentUser = null;
      var tawkLoaded = false;
      var btn = document.getElementById('custom-chat-button');

      // Check auth state
      import('./js/firebase-config.js').then(function(mod) {
        import('https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js').then(function(authMod) {
          authMod.onAuthStateChanged(mod.auth, function(user) {
            currentUser = user;
          });
        });
      });

      function loadAndOpenTawk(user) {
        btn.style.opacity = '0.7';
        btn.innerHTML = '<div class="custom-chat-loading"></div>';

        window.Tawk_API = window.Tawk_API || {};

        if (tawkLoaded) {
          window.Tawk_API.setAttributes({
            name: user.displayName || user.email.split('@')[0],
            email: user.email
          }, function(err) { if (err) console.error('Tawk setAttributes:', err); });
          window.Tawk_API.showWidget();
          window.Tawk_API.maximize();
          btn.style.display = 'none';
          btn.style.opacity = '1';
          btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>';
          return;
        }

        window.Tawk_API.onLoad = function() {
          tawkLoaded = true;
          window.Tawk_API.setAttributes({
            name: user.displayName || user.email.split('@')[0],
            email: user.email
          }, function(err) { if (err) console.error('Tawk setAttributes:', err); });
          window.Tawk_API.maximize();
          btn.style.display = 'none';
          btn.style.opacity = '1';
          btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>';
        };

        window.Tawk_API.onChatMinimised = function() {
          window.Tawk_API.hideWidget();
          btn.style.display = 'flex';
        };

        // Inject script
        var s1 = document.createElement('script');
        var s0 = document.getElementsByTagName('script')[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/6a5512282431b01d5400219e/1jte4trta';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
      }

      btn.addEventListener('click', function() {
        if (!currentUser || !currentUser.emailVerified) {
          window.location.href = 'auth.html?redirect=' + encodeURIComponent(window.location.href);
        } else {
          loadAndOpenTawk(currentUser);
        }
      });
    })();
  </script>
  <!--End of Tawk.to Script-->
</body>
</html>`;

const root = path.resolve(__dirname, '../../');
const pagesDir = path.join(root, 'css', 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

fs.writeFileSync(path.join(root, 'events.html'), html, 'utf8');
fs.writeFileSync(path.join(pagesDir, 'events.css'), css, 'utf8');

console.log('events.html and css/pages/events.css generated successfully!');
