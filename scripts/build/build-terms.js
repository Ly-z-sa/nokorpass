const fs = require('fs');
const path = require('path');


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
        <p>By accessing or using NokorPass, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>

        <h3>2. Account Registration</h3>
        <p>To book tickets, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We use Firebase Authentication to secure your journey.</p>

        <h3>3. Booking & Payments</h3>
        <p>All bookings made through NokorPass are subject to availability. By completing a transaction, you agree that:</p>
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
        <p>NokorPass is a platform for movie ticket aggregation and booking. We are not responsible for cinema cancellations, theater conditions, or the quality of the movie presentation. These are the sole responsibility of the theater provider.</p>

        <h3>7. Service Availability</h3>
        <p>While we strive for 100% uptime, NokorPass may occasionally be unavailable for maintenance. We reserve the right to modify or discontinue any part of the service at any time.</p>

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
    <title>Terms of Service — NokorPass</title>
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/global.css" />
    <link rel="stylesheet" href="css/pages/legal.css" />
    <script type="module" src="js/auth-guard.js"></script>
    <script type="module" src="js/legals-init.js"></script>
    </head>
<body>
    <script src="js/global-layout.js"></script>
    ${termsContent}
</body>
</html>`;

fs.writeFileSync(path.resolve(__dirname, '../../terms.html'), html);
console.log('terms.html built successfully!');
