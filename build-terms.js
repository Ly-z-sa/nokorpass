const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');

const navMatch = index.match(/<nav>[\s\S]*?<\/nav>/);
let nav = navMatch ? navMatch[0] : '';
nav = nav.replace('<li><a href="#">Account</a></li>', '<li><a href="account.html">Account</a></li>');
nav = nav.replace('class="active"', '');

const footerMatch = index.match(/<footer>[\s\S]*?<\/footer>/);
let footer = footerMatch ? footerMatch[0] : '';
footer = footer.replace('<li><a href="#">Privacy Policy</a></li>', '<li><a href="privacy.html">Privacy Policy</a></li>');
footer = footer.replace('<li><a href="#">Terms of Service</a></li>', '<li><a href="terms.html">Terms of Service</a></li>');
footer = footer.replace('<li><a href="#">Cookies</a></li>', '<li><a href="privacy.html#cookies-section">Cookies</a></li>');

const termsContent = `
  <section class="legal-section">
    <div class="legal-container">
      <div class="legal-header">
        <span class="section-tag">Agreement</span>
        <h1>Terms of Service</h1>
        <p class="last-updated">Last Updated: March 31, 2026</p>
      </div>

      <div class="legal-body">
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using Cinemart, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>

        <h3>2. Account Registration</h3>
        <p>To book tickets, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We use Firebase Authentication to secure your journey.</p>

        <h3>3. Booking & Payments</h3>
        <p>All bookings made through Cinemart are subject to availability. By completing a transaction, you agree that:</p>
        <ul>
          <li><strong>Finality:</strong> All ticket sales are final and non-refundable.</li>
          <li><strong>Accuracy:</strong> You will provide accurate payment and personal information.</li>
          <li><strong>Pricing:</strong> Prices include applicable taxes and service fees as displayed at checkout.</li>
        </ul>

        <h3>4. Digital Tickets & QR Codes</h3>
        <p>Upon successful payment, a digital ticket with a unique QR code will be generated in your "My Tickets" dashboard. This QR code is required for entry at the cinema. Each QR code is valid for a single scan only.</p>

        <h3>5. User Conduct</h3>
        <p>You agree not to:</p>
        <ul>
          <li>Use the service for any illegal or unauthorized purpose.</li>
          <li>Resell tickets at a higher price or engage in "scalping."</li>
          <li>Attempt to interfere with the security or integrity of our Firebase-powered database.</li>
          <li>Automate bookings using scripts or bots.</li>
        </ul>

        <h3>6. Limitation of Liability</h3>
        <p>Cinemart is a platform for movie ticket aggregation and booking. We are not responsible for cinema cancellations, theater conditions, or the quality of the movie presentation. These are the sole responsibility of the theater provider.</p>

        <h3>7. Service Availability</h3>
        <p>While we strive for 100% uptime, Cinemart may occasionally be unavailable for maintenance. We reserve the right to modify or discontinue any part of the service at any time.</p>

        <h3>8. Changes to Terms</h3>
        <p>We may update these terms from time to time. Your continued use of the service after such changes constitutes acceptance of the new terms.</p>

        <h3>9. Governing Law</h3>
        <p>These terms shall be governed by and construed in accordance with the laws of your jurisdiction.</p>
      </div>
    </div>
  </section>
`;

const css = `
  .legal-section { padding: 120px 60px; background: var(--black); min-height: 100vh; }
  .legal-container { max-width: 880px; margin: 0 auto; }
  .legal-header { border-bottom: 1px solid var(--border); padding-bottom: 48px; margin-bottom: 52px; }
  .legal-header h1 { font-family: 'Syne', sans-serif; font-size: 3.5rem; font-weight: 800; color: #fff; margin-bottom: 12px; }
  .last-updated { color: var(--muted); font-size: 0.9rem; }
  
  .legal-body { color: rgba(255,255,255,0.8); line-height: 1.8; }
  .legal-body h3 { font-family: 'Syne', sans-serif; color: #fff; font-size: 1.4rem; margin-top: 48px; margin-bottom: 20px; }
  .legal-body p { margin-bottom: 24px; font-size: 1.05rem; }
  .legal-body ul { margin-bottom: 24px; padding-left: 24px; }
  .legal-body li { margin-bottom: 12px; }
  .legal-body strong { color: var(--accent); }

  @media (max-width: 768px) {
    .legal-section { padding: 80px 24px; }
    .legal-header h1 { font-size: 2.5rem; }
  }
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service — Cinemart</title>
    <link rel="icon" type="image/png" href="favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
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
            --white: #ffffff;
        }
        html { -ms-overflow-style: none; scrollbar-width: none; }
        html::-webkit-scrollbar { display: none; }
        body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--text); line-height: 1.6; overflow-x: hidden; }
        nav { position: sticky; top: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 0 60px; height: 64px; background: rgba(0,0,0,0.95); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
        .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.35rem; color: var(--white); letter-spacing: -0.5px; display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo img { height: 28px; width: auto; }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a { text-decoration: none; color: var(--muted); font-size: 0.875rem; font-weight: 500; transition: color 0.2s; }
        .nav-links a:hover { color: #fff; }
        .btn-ghost { background: rgba(255, 255, 255, 0.08); color: var(--text); border: 1px solid var(--border); padding: 12px 28px; border-radius: 8px; cursor: pointer; font-size: 0.875rem; transition: all 0.2s; text-decoration: none; }
        
        footer { background: var(--dark); border-top: 1px solid var(--border); padding: 52px 60px 36px; margin-top: 0; }
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
        .footer-bottom a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .footer-bottom a:hover { color: var(--white); }
        
        .section-tag { display: inline-block; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); background: rgba(232, 73, 15, 0.15); border: 1px solid rgba(232, 73, 15, 0.3); padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; }

        ${css}
    </style>
</head>
<body>
    ${nav}
    ${termsContent}
    ${footer}
</body>
</html>`;

fs.writeFileSync('terms.html', html);
console.log('terms.html built successfully!');
