const fs = require('fs');
const path = require('path');



const privacyContent = `
  <section class="legal-section">
    <div class="legal-container">
      <div class="legal-header">
        <span class="section-tag">Compliance</span>
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last Updated: March 31, 2026</p>
      </div>

      <div class="legal-body">
        <h3>1. Introduction</h3>
        <p>Welcome to NokorPass. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our ticket booking service.</p>

        <h3>2. Information We Collect</h3>
        <p>To provide our services, we collect the following types of information via Firebase Authentication and Firestore:</p>
        <ul>
          <li><strong>Identity Data:</strong> Full name and email address provided during signup.</li>
          <li><strong>Authentication Data:</strong> Login credentials or Google profile information (if using Google Sign-In).</li>
          <li><strong>Transaction Data:</strong> Your movie booking history, seat selections, and ticket details.</li>
          <li><strong>Technical Data:</strong> Cookies and IP addresses used for session management.</li>
        </ul>

        <h3>3. How We Use Your Data</h3>
        <p>We use your information exclusively to:</p>
        <ul>
          <li>Create and manage your NokorPass account.</li>
          <li>Process movie ticket bookings and generate digital QR codes.</li>
          <li>Provide access to your personalized "My Tickets" dashboard.</li>
          <li>Verify your email for security purposes.</li>
        </ul>

        <h3>4. Data Storage & Security</h3>
        <p>Your data is stored securely using <strong>Google Firebase</strong>. We leverage Firebase's industry-standard security protocols to ensure your information is encrypted and protected from unauthorized access.</p>

        <h3>5. Third-Party Services</h3>
        <p>We use the following third-party providers:</p>
        <ul>
          <li><strong>Firebase Authentication:</strong> For secure login and identity verification.</li>
          <li><strong>Cloud Firestore:</strong> For real-time database storage of your tickets.</li>
          <li><strong>Google Services:</strong> For OAuth 2.0 authentication and analytics.</li>
        </ul>

        <h3 id="cookies-section">6. Cookies & Local Data</h3>
        <p>NokorPass uses essential cookies and local storage to securely maintain your login session via Firebase Authentication. These professional standards ensure you don't have to re-authenticate every time you visit. You can manage your preferences through our consent banner or browser settings.</p>

        <h3>7. Your Rights</h3>
        <p>You have the right to access, update, or request the deletion of your personal data. You can manage most of this directly through your account settings or by contacting our support team.</p>

        <h3>8. Contact Us</h3>
        <p>If you have questions about this policy, please contact us at <strong>privacy@nokorpass.com</strong>.</p>
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
    <title>Privacy Policy — NokorPass</title>
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/global.css" />
    <link rel="stylesheet" href="css/pages/legal.css" />
    <script type="module" src="js/auth-guard.js"></script>
    <script type="module" src="js/legals-init.js"></script>
    </head>
<body>
    <script src="js/global-layout.js"></script>
    ${privacyContent}
</body>
</html>`;

fs.writeFileSync(path.resolve(__dirname, '../../privacy.html'), html);
console.log('privacy.html built successfully!');
